-- Run once in the Supabase SQL editor before deploying drag and drop ordering

-- Manual order within a user's list, lower comes first
ALTER TABLE todos
    ADD COLUMN IF NOT EXISTS position DOUBLE PRECISION DEFAULT 0 NOT NULL;

-- Keep the current order: newest first for each user
UPDATE todos
SET position = ranked.row_number
FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS row_number
    FROM todos
) AS ranked
WHERE todos.id = ranked.id;

-- Create an index on position for ordering
CREATE INDEX IF NOT EXISTS todos_user_id_position_idx ON todos(user_id, position);

// Starred first, then by manual position
export const sortTodos = (todos) =>
    [...todos].sort(
        (a, b) => b.favorite - a.favorite || a.position - b.position
    );

// Position that puts a todo above everything else
export const topPosition = (todos) =>
    todos.length ? Math.min(...todos.map((todo) => todo.position)) - 1 : 0;

// Position for a todo dropped between two neighbours, either may be missing
export const positionBetween = (prev, next) => {
    if (prev && next) return (prev.position + next.position) / 2;
    if (prev) return prev.position + 1;
    if (next) return next.position - 1;
    return 0;
};

// Older saved todos have no id or position, the array was oldest first
export const withIdAndPosition = (todos) =>
    todos.map((todo, index) => ({
        ...todo,
        id: todo.id ?? crypto.randomUUID(),
        position: todo.position ?? -index,
    }));

import { useState } from 'react';

export default function TodoCard(props) {
    const { 
        todo, 
        handleDeleteTodo, 
        handleCompleteTodo, 
        todoIndex,
        editingIndex,
        handleEditTodo,
        handleStartEdit,
        handleCancelEdit
    } = props;
    
    const [editInput, setEditInput] = useState(todo.input);
    const isEditing = editingIndex === todoIndex;

    const handleSave = () => {
        if (editInput.trim()) {
            handleEditTodo(todoIndex, editInput.trim());
        }
    };

    const handleCancel = () => {
        setEditInput(todo.input);
        handleCancelEdit();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div className="card todo-item">
            {isEditing ? (
                <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                />
            ) : (
                <p 
                    onClick={() => !todo.complete && handleStartEdit(todoIndex)}
                    style={{ cursor: !todo.complete ? 'pointer' : 'default' }}
                >
                    {todo.input}
                </p>
            )}
            
            <div className="todo-buttons">
                {isEditing ? (
                    <>
                        <button onClick={handleSave}>
                            <h6>Save</h6>
                        </button>
                        <button onClick={handleCancel}>
                            <h6>Cancel</h6>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => handleCompleteTodo(todoIndex)}
                            disabled={todo.complete}
                        >
                            <h6>Done</h6>
                        </button>
                        <button onClick={() => handleDeleteTodo(todoIndex)}>
                            <h6>Delete</h6>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

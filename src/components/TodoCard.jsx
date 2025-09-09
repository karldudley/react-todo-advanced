import { useState, useEffect } from 'react';

export default function TodoCard(props) {
    const { 
        todo, 
        handleDeleteTodo, 
        handleCompleteTodo, 
        todoIndex,
        editingIndex,
        handleEditTodo,
        handleStartEdit,
        handleCancelEdit,
        handleToggleFavorite
    } = props;
    
    const [editInput, setEditInput] = useState(todo.input);
    const isEditing = editingIndex === todoIndex;

    useEffect(() => {
        if (isEditing) {
            setEditInput(todo.input);
        }
    }, [isEditing, todo.input]);

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
        <div className={`todo-item ${todo.complete ? 'todo-complete' : ''} ${todo.favorite ? 'todo-favorite' : ''}`}>
            <div className="todo-content">
                {isEditing ? (
                    <input
                        type="text"
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="todo-text"
                    />
                ) : (
                    <div 
                        onClick={() => !todo.complete && handleStartEdit(todoIndex)}
                        className={`todo-text ${!todo.complete ? 'editable' : ''}`}
                        title={!todo.complete ? 'Click to edit' : ''}
                    >
                        {todo.input}
                        {!todo.complete && <span className="edit-indicator">✏️</span>}
                    </div>
                )}
            </div>
            
            <div className="todo-actions">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="btn-complete">
                            ✓ Save
                        </button>
                        <button onClick={handleCancel} className="btn-delete">
                            ✕ Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => handleToggleFavorite(todoIndex)}
                            className={`btn-star ${todo.favorite ? 'starred' : ''}`}
                            title={todo.favorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            ★
                        </button>
                        <button
                            onClick={() => handleCompleteTodo(todoIndex)}
                            disabled={todo.complete}
                            className="btn-complete"
                            title="Mark as complete"
                        >
                            ✓ Done
                        </button>
                        <button 
                            onClick={() => handleDeleteTodo(todoIndex)} 
                            className="btn-delete"
                            title="Delete todo"
                        >
                            ✕ Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

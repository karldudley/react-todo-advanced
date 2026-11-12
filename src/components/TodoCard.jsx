import { useState, useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TodoCard(props) {
    const {
        todo,
        handleDeleteTodo,
        handleCompleteTodo,
        editingId,
        handleEditTodo,
        handleStartEdit,
        handleCancelEdit,
        handleToggleFavorite
    } = props;

    const [editInput, setEditInput] = useState(todo.input);
    const isEditing = editingId === todo.id;
    const editRef = useRef(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: todo.id, disabled: isEditing });

    // Lock movement to the vertical axis
    const style = {
        transform: CSS.Translate.toString(transform && { ...transform, x: 0 }),
        transition,
    };

    useEffect(() => {
        if (isEditing) {
            setEditInput(todo.input);
        }
    }, [isEditing, todo.input]);

    // Grow the edit box to fit its text
    useEffect(() => {
        const editBox = editRef.current;
        if (!editBox) return;
        const borderHeight = editBox.offsetHeight - editBox.clientHeight;
        editBox.style.height = 'auto';
        editBox.style.height = `${editBox.scrollHeight + borderHeight}px`;
    }, [isEditing, editInput]);

    const handleSave = () => {
        if (editInput.trim()) {
            handleEditTodo(todo.id, editInput.trim());
        }
    };

    const handleCancel = () => {
        setEditInput(todo.input);
        handleCancelEdit();
    };

    const handleKeyPress = (e) => {
        // Shift+Enter adds a new line
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`todo-item ${todo.complete ? 'todo-complete' : ''} ${todo.favorite ? 'todo-favorite' : ''} ${isDragging ? 'todo-dragging' : ''}`}
        >
            <button
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className="drag-handle"
                title="Drag to reorder"
                aria-label={`Reorder ${todo.input}`}
            >
                <i className="fa-solid fa-grip-vertical" aria-hidden="true"></i>
            </button>

            <button
                onClick={() => handleCompleteTodo(todo.id)}
                className="todo-check"
                title={todo.complete ? "Mark as incomplete" : "Mark as complete"}
                aria-label={todo.complete ? "Mark as incomplete" : "Mark as complete"}
                aria-pressed={todo.complete}
            >
                <span className="check-circle">
                    <i className="fa-solid fa-check" aria-hidden="true"></i>
                </span>
            </button>

            <div className="todo-content">
                {isEditing ? (
                    <textarea
                        ref={editRef}
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onFocus={(e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
                        rows={1}
                        autoFocus
                        aria-label="Edit task"
                        className="todo-text"
                    />
                ) : (
                    <div
                        onClick={() => !todo.complete && handleStartEdit(todo.id)}
                        className={`todo-text ${!todo.complete ? 'editable' : ''}`}
                        title={!todo.complete ? 'Click to edit' : ''}
                    >
                        {todo.input}
                        {!todo.complete && (
                            <i className="fa-solid fa-pen edit-indicator" aria-hidden="true"></i>
                        )}
                    </div>
                )}
            </div>

            <div className="todo-actions">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="btn-icon btn-save"
                            title="Save"
                            aria-label="Save"
                        >
                            <i className="fa-solid fa-check" aria-hidden="true"></i>
                        </button>
                        <button
                            onClick={handleCancel}
                            className="btn-icon btn-cancel"
                            title="Cancel"
                            aria-label="Cancel"
                        >
                            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => handleToggleFavorite(todo.id)}
                            className={`btn-icon btn-star ${todo.favorite ? 'starred' : ''}`}
                            title={todo.favorite ? 'Remove from favorites' : 'Add to favorites'}
                            aria-label={todo.favorite ? 'Remove from favorites' : 'Add to favorites'}
                            aria-pressed={todo.favorite}
                        >
                            <i className={`${todo.favorite ? 'fa-solid' : 'fa-regular'} fa-star`} aria-hidden="true"></i>
                        </button>
                        <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="btn-icon btn-delete"
                            title="Delete todo"
                            aria-label="Delete todo"
                        >
                            <i className="fa-solid fa-trash" aria-hidden="true"></i>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

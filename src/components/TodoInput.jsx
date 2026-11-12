import { useState } from 'react';

export default function TodoInput(props) {
    const { handleAddTodo } = props;
    const [inputValue, setInputValue] = useState('');
    const [isStarred, setIsStarred] = useState(false);

    const addTodo = (starred) => {
        if (!inputValue.trim()) return; // Prevent adding empty tasks
        handleAddTodo(inputValue.trim(), starred);
        setInputValue('');
        setIsStarred(false);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        addTodo(isStarred);
    };

    // Handle key press for shift+enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault(); // Prevent form submission
            addTodo(true);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="input-container">
            <button
                type="button"
                onClick={() => setIsStarred(!isStarred)}
                className={`btn-icon btn-star ${isStarred ? 'starred' : ''}`}
                title="Star this task (Shift+Enter)"
                aria-label="Star this task"
                aria-pressed={isStarred}
            >
                <i className={`${isStarred ? 'fa-solid' : 'fa-regular'} fa-star`} aria-hidden="true"></i>
            </button>
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Add a new task..."
                aria-label="New task"
                className="todo-input"
                autoComplete="off"
            />
            <button type="submit" className="btn-add" title="Add new task" aria-label="Add new task">
                <i className="fa-solid fa-plus" aria-hidden="true"></i>
            </button>
        </form>
    );
}

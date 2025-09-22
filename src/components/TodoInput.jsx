import { useState } from 'react';

export default function TodoInput(props) {
    const { handleAddTodo } = props;
    const [inputValue, setInputValue] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        if (!inputValue.trim()) return; // Prevent adding empty tasks
        handleAddTodo(inputValue.trim());
        setInputValue('');
    };

    // Handle key press for shift+enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault(); // Prevent form submission
            if (!inputValue.trim()) return; // Prevent adding empty tasks
            handleAddTodo(inputValue.trim(), true); // Pass true to indicate starred
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="input-container">
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Add a new task... (Shift+Enter to star)"
                className="todo-input"
                autoComplete="off"
            />
            <button type="submit" className="btn-add" title="Add new task">
                + Add Task
            </button>
        </form>
    );
}

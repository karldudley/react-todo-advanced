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

    return (
        <form onSubmit={handleSubmit} className="input-container">
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a new task..."
                className="todo-input"
                autoComplete="off"
            />
            <button type="submit" className="btn-add" title="Add new task">
                + Add Task
            </button>
        </form>
    );
}

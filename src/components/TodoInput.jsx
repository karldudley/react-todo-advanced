import { useState } from 'react';

export default function TodoInput(props) {
    const { handleAddTodo } = props;
    const [inputValue, setInputValue] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        if (!inputValue.trim()) return; // Prevent adding empty tasks
        handleAddTodo(inputValue);
        setInputValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="input-container">
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add task"
            />
            <button type="submit">
                <i className="fa-solid fa-plus"></i>
            </button>
        </form>
    );
}

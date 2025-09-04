import React, { useState, useEffect } from 'react';

export default function Header(props) {
    const { todos } = props;
    const todosLength = todos.filter(todo => !todo.complete).length;
    const taskOrTasks = todosLength === 1 ? 'task' : 'tasks';

    const [isDark, setIsDark] = useState(
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    const toggleTheme = () => setIsDark(!isDark);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="text-gradient">
                You have {todosLength} open {taskOrTasks}
            </h1>
            <button onClick={toggleTheme}>
                {isDark ? '☀️' : '🌙'}
            </button>
        </header>
    );
}

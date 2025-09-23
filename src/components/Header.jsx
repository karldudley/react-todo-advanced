import React, { useState, useEffect } from 'react';

export default function Header(props) {
    const { todos, showGame, onToggleGame } = props;
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
        <header>
            <h1>
                You have {todosLength} open {taskOrTasks}
            </h1>
            <div className="header-toggles">
                <button onClick={onToggleGame} className="theme-toggle" title={showGame ? 'Hide game' : 'Show game'}>
                    🎮
                </button>
                <button onClick={toggleTheme} className="theme-toggle" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                    {isDark ? '☀️' : '🌙'}
                </button>
            </div>
        </header>
    );
}

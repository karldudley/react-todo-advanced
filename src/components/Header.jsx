import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Header(props) {
    const { todos, showGame, onToggleGame, onShowAuth } = props;
    const { user, signOut } = useAuth();
    const todosLength = todos.filter(todo => !todo.complete).length;
    const completedLength = todos.length - todosLength;
    const percentDone = todos.length ? Math.round((completedLength / todos.length) * 100) : 0;
    const taskOrTasks = todosLength === 1 ? 'task' : 'tasks';

    const [isDark, setIsDark] = useState(
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    const toggleTheme = () => setIsDark(!isDark);

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            // Clear localStorage and reload
            localStorage.removeItem('todo-app');
            window.location.href = window.location.origin;
        }
    };

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    return (
        <header>
            <div className="header-top">
                <h1>
                    You have <span className="count">{todosLength}</span> open {taskOrTasks}
                </h1>
                <div className="header-toggles">
                    {user ? (
                        <button onClick={handleSignOut} className="sign-out-btn" title="Sign out">
                            Sign Out
                        </button>
                    ) : (
                        <button onClick={onShowAuth} className="create-account-btn" title="Sync todos across devices!">
                            Create Account
                        </button>
                    )}
                    <button
                        onClick={onToggleGame}
                        className={`theme-toggle ${showGame ? 'active' : ''}`}
                        title={showGame ? 'Hide game' : 'Show game'}
                        aria-label={showGame ? 'Hide game' : 'Show game'}
                    >
                        <i className="fa-solid fa-gamepad" aria-hidden="true"></i>
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            {todos.length > 0 && (
                <div className="progress">
                    <div className="progress-meta">
                        <span>{completedLength} of {todos.length} done</span>
                        <span>{percentDone}%</span>
                    </div>
                    <div
                        className="progress-track"
                        role="progressbar"
                        aria-label="Tasks completed"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentDone}
                    >
                        <div className="progress-fill" style={{ width: `${percentDone}%` }}></div>
                    </div>
                </div>
            )}
        </header>
    );
}

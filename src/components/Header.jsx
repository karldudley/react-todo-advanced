import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Header(props) {
    const { todos, showGame, onToggleGame, onShowAuth } = props;
    const { user, signOut } = useAuth();
    const todosLength = todos.filter(todo => !todo.complete).length;
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
            <h1>
                You have {todosLength} open {taskOrTasks}
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

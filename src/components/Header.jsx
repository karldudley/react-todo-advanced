import React from 'react';

export default function Header(props) {
    const { todos } = props;
    const todosLength = todos.filter(todo => !todo.complete).length;
    const taskOrTasks = todosLength === 1 ? 'task' : 'tasks';

    return (
        <header>
            <h1 className="text-gradient">
                You have {todosLength} open {taskOrTasks}
            </h1>
        </header>
    );
}

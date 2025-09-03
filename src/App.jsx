import { useState, useEffect } from 'react';

import Header from './components/Header';
import Tabs from './components/Tabs';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

function App() {
    const [todos, setTodos] = useState([]);

    const [selectedTab, setSelectedTab] = useState('Open');
    const [editingIndex, setEditingIndex] = useState(null);

    function handleAddTodo(newTodo) {
        const newTodoList = [...todos, { input: newTodo, complete: false, favorite: false }];
        setTodos(newTodoList);
        handleSaveDate(newTodoList);
    }

    function handleCompleteTodo(index) {
        // edit/modify/update
        let newTodoList = [...todos];
        let completedTodo = todos[index];
        completedTodo['complete'] = true;
        newTodoList[index] = completedTodo;
        setTodos(newTodoList);
        handleSaveDate(newTodoList);
    }

    function handleDeleteTodo(index) {
        let newTodoList = todos.filter((val, valIndex) => {
            return valIndex !== index;
        });
        setTodos(newTodoList);
        handleSaveDate(newTodoList);
    }

    function handleEditTodo(index, newInput) {
        let newTodoList = [...todos];
        newTodoList[index] = { ...newTodoList[index], input: newInput };
        setTodos(newTodoList);
        setEditingIndex(null);
        handleSaveDate(newTodoList);
    }

    function handleStartEdit(index) {
        setEditingIndex(index);
    }

    function handleCancelEdit() {
        setEditingIndex(null);
    }

    function handleToggleFavorite(index) {
        let newTodoList = [...todos];
        newTodoList[index] = { ...newTodoList[index], favorite: !newTodoList[index].favorite };
        setTodos(newTodoList);
        handleSaveDate(newTodoList);
    }

    function handleSaveDate(currTodos) {
        localStorage.setItem('todo-app', JSON.stringify({ todos: currTodos }));
    }

    useEffect(() => {
        if (!localStorage || !localStorage.getItem('todo-app')) return;
        let db = JSON.parse(localStorage.getItem('todo-app'));
        setTodos(db.todos);
    }, []);

    return (
        <>
            <Header todos={todos} />
            <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                todos={todos}
            />
            <TodoList
                todos={todos}
                selectedTab={selectedTab}
                handleDeleteTodo={handleDeleteTodo}
                handleCompleteTodo={handleCompleteTodo}
                editingIndex={editingIndex}
                handleEditTodo={handleEditTodo}
                handleStartEdit={handleStartEdit}
                handleCancelEdit={handleCancelEdit}
                handleToggleFavorite={handleToggleFavorite}
            />
            <TodoInput handleAddTodo={handleAddTodo} />
        </>
    );
}

export default App;

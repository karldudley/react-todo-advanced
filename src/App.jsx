import { useState, useEffect } from 'react';

import Header from './components/Header';
import Tabs from './components/Tabs';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import ConfirmationModal from './components/ConfirmationModal';
import RewardGame from './components/RewardGame';
import Auth from './components/Auth';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

function App() {
    const { user, loading } = useAuth();
    const [guestMode, setGuestMode] = useState(false);
    const [todos, setTodos] = useState([]);

    const [selectedTab, setSelectedTab] = useState('Open');
    const [editingIndex, setEditingIndex] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);
    const [showGame, setShowGame] = useState(false);

    const handleSkipAuth = () => {
        setGuestMode(true);
    };

    // Fetch todos from Supabase or localStorage
    useEffect(() => {
        if (user) {
            // Migrate localStorage todos if they exist, then fetch from Supabase
            migrateLocalStorageToSupabase();
        } else if (guestMode) {
            // Load from localStorage for guest users
            if (!localStorage || !localStorage.getItem('todo-app')) return;
            let db = JSON.parse(localStorage.getItem('todo-app'));
            setTodos(db.todos || []);
        }
    }, [user, guestMode]);

    async function migrateLocalStorageToSupabase() {
        // Check if there are todos in localStorage
        const localData = localStorage.getItem('todo-app');

        if (localData) {
            try {
                const parsedData = JSON.parse(localData);
                const localTodos = parsedData.todos || [];

                if (localTodos.length > 0) {
                    console.log(`Migrating ${localTodos.length} todos from localStorage to Supabase...`);

                    // Transform localStorage todos to Supabase format
                    const todosToInsert = localTodos.map(todo => ({
                        user_id: user.id,
                        input: todo.input,
                        complete: todo.complete || false,
                        favorite: todo.favorite || false,
                    }));

                    // Insert all todos into Supabase
                    const { error } = await supabase
                        .from('todos')
                        .insert(todosToInsert);

                    if (error) {
                        console.error('Error migrating todos:', error);
                    } else {
                        console.log('Migration successful! Clearing localStorage...');
                        // Clear localStorage after successful migration
                        localStorage.removeItem('todo-app');
                    }
                }
            } catch (error) {
                console.error('Error parsing localStorage data:', error);
            }
        }

        // Fetch todos from Supabase (including newly migrated ones)
        fetchTodosFromSupabase();
    }

    async function fetchTodosFromSupabase() {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching todos:', error);
        } else {
            setTodos(data || []);
        }
    }

    async function handleAddTodo(newTodo, isStarred = false) {
        if (user) {
            // Add to Supabase
            const { data, error } = await supabase
                .from('todos')
                .insert([
                    {
                        user_id: user.id,
                        input: newTodo,
                        complete: false,
                        favorite: isStarred,
                    },
                ])
                .select();

            if (error) {
                console.error('Error adding todo:', error);
            } else {
                setTodos([data[0], ...todos]);
            }
        } else {
            // Add to localStorage
            const newTodoList = [
                ...todos,
                { input: newTodo, complete: false, favorite: isStarred },
            ];
            setTodos(newTodoList);
            handleSaveToLocalStorage(newTodoList);
        }
    }

    async function handleCompleteTodo(index) {
        const todo = todos[index];

        if (user) {
            // Update in Supabase
            const { error } = await supabase
                .from('todos')
                .update({ complete: !todo.complete })
                .eq('id', todo.id);

            if (error) {
                console.error('Error updating todo:', error);
            } else {
                let newTodoList = [...todos];
                newTodoList[index] = { ...todo, complete: !todo.complete };
                setTodos(newTodoList);
            }
        } else {
            // Update in localStorage
            let newTodoList = [...todos];
            newTodoList[index] = { ...todo, complete: !todo.complete };
            setTodos(newTodoList);
            handleSaveToLocalStorage(newTodoList);
        }
    }

    function handleDeleteTodo(index) {
        setTodoToDelete({ index, text: todos[index].input });
        setShowDeleteModal(true);
    }

    async function confirmDeleteTodo() {
        if (todoToDelete) {
            const todo = todos[todoToDelete.index];

            if (user) {
                // Delete from Supabase
                const { error } = await supabase
                    .from('todos')
                    .delete()
                    .eq('id', todo.id);

                if (error) {
                    console.error('Error deleting todo:', error);
                } else {
                    let newTodoList = todos.filter(
                        (val, valIndex) => valIndex !== todoToDelete.index
                    );
                    setTodos(newTodoList);
                }
            } else {
                // Delete from localStorage
                let newTodoList = todos.filter(
                    (val, valIndex) => valIndex !== todoToDelete.index
                );
                setTodos(newTodoList);
                handleSaveToLocalStorage(newTodoList);
            }
        }
        setShowDeleteModal(false);
        setTodoToDelete(null);
    }

    function cancelDeleteTodo() {
        setShowDeleteModal(false);
        setTodoToDelete(null);
    }

    async function handleEditTodo(index, newInput) {
        const todo = todos[index];

        if (user) {
            // Update in Supabase
            const { error } = await supabase
                .from('todos')
                .update({ input: newInput })
                .eq('id', todo.id);

            if (error) {
                console.error('Error updating todo:', error);
            } else {
                let newTodoList = [...todos];
                newTodoList[index] = { ...todo, input: newInput };
                setTodos(newTodoList);
                setEditingIndex(null);
            }
        } else {
            // Update in localStorage
            let newTodoList = [...todos];
            newTodoList[index] = { ...todo, input: newInput };
            setTodos(newTodoList);
            setEditingIndex(null);
            handleSaveToLocalStorage(newTodoList);
        }
    }

    function handleStartEdit(index) {
        setEditingIndex(index);
    }

    function handleCancelEdit() {
        setEditingIndex(null);
    }

    async function handleToggleFavorite(index) {
        const todo = todos[index];

        if (user) {
            // Update in Supabase
            const { error } = await supabase
                .from('todos')
                .update({ favorite: !todo.favorite })
                .eq('id', todo.id);

            if (error) {
                console.error('Error updating todo:', error);
            } else {
                let newTodoList = [...todos];
                newTodoList[index] = { ...todo, favorite: !todo.favorite };
                setTodos(newTodoList);
            }
        } else {
            // Update in localStorage
            let newTodoList = [...todos];
            newTodoList[index] = { ...todo, favorite: !todo.favorite };
            setTodos(newTodoList);
            handleSaveToLocalStorage(newTodoList);
        }
    }

    function handleToggleGame() {
        setShowGame(!showGame);
    }

    function handleSaveToLocalStorage(currTodos) {
        const existingData = localStorage.getItem('todo-app');
        let data = existingData ? JSON.parse(existingData) : {};
        data.todos = currTodos;
        localStorage.setItem('todo-app', JSON.stringify(data));
    }

    const allTasksComplete =
        todos.length > 0 && todos.every((todo) => todo.complete);
    const shouldShowGame = showGame || allTasksComplete;

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: 'var(--text-secondary)'
            }}>
                Loading...
            </div>
        );
    }

    // Show Auth screen if not logged in and not in guest mode
    if (!user && !guestMode) {
        return <Auth onSkip={handleSkipAuth} />;
    }

    // Show main app if logged in or in guest mode
    return (
        <>
            <Header
                todos={todos}
                showGame={showGame}
                onToggleGame={handleToggleGame}
            />
            <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                todos={todos}
            />
            <TodoInput handleAddTodo={handleAddTodo} />
            {shouldShowGame && <RewardGame />}
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
            <ConfirmationModal
                isOpen={showDeleteModal}
                todoText={todoToDelete?.text || ''}
                onConfirm={confirmDeleteTodo}
                onCancel={cancelDeleteTodo}
            />
        </>
    );
}

export default App;

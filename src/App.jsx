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
import { topPosition, withIdAndPosition } from './lib/todos';

function App() {
    const { user, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [todos, setTodos] = useState([]);

    const [selectedTab, setSelectedTab] = useState('Open');
    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [todoToDelete, setTodoToDelete] = useState(null);
    const [showGame, setShowGame] = useState(false);

    const handleShowAuth = () => {
        setShowAuthModal(true);
    };

    const handleCloseAuth = () => {
        setShowAuthModal(false);
    };

    // Fetch todos from Supabase or localStorage
    useEffect(() => {
        if (user) {
            // Migrate localStorage todos if they exist, then fetch from Supabase
            migrateLocalStorageToSupabase();
        } else {
            // Load from localStorage for non-authenticated users
            if (!localStorage || !localStorage.getItem('todo-app')) return;
            let db = JSON.parse(localStorage.getItem('todo-app'));
            const localTodos = withIdAndPosition(db.todos || []);
            setTodos(localTodos);
            handleSaveToLocalStorage(localTodos);
        }
    }, [user]);

    async function migrateLocalStorageToSupabase() {
        // Check if there are todos in localStorage
        const localData = localStorage.getItem('todo-app');

        if (localData) {
            try {
                const parsedData = JSON.parse(localData);
                const localTodos = withIdAndPosition(parsedData.todos || []);

                if (localTodos.length > 0) {
                    console.log(`Migrating ${localTodos.length} todos from localStorage to Supabase...`);

                    // Transform localStorage todos to Supabase format
                    const todosToInsert = localTodos.map(todo => ({
                        user_id: user.id,
                        input: todo.input,
                        complete: todo.complete || false,
                        favorite: todo.favorite || false,
                        position: todo.position,
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
            .order('position', { ascending: true });

        if (error) {
            console.error('Error fetching todos:', error);
        } else {
            setTodos(data || []);
        }
    }

    async function handleAddTodo(newTodo, isStarred = false) {
        const position = topPosition(todos);

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
                        position,
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
                {
                    id: crypto.randomUUID(),
                    input: newTodo,
                    complete: false,
                    favorite: isStarred,
                    position,
                },
            ];
            setTodos(newTodoList);
            handleSaveToLocalStorage(newTodoList);
        }
    }

    // Apply changes straight away, undo them if Supabase rejects the update
    async function updateTodo(id, changes) {
        const previousTodos = todos;
        const newTodoList = todos.map((todo) =>
            todo.id === id ? { ...todo, ...changes } : todo
        );
        setTodos(newTodoList);

        if (!user) {
            handleSaveToLocalStorage(newTodoList);
            return;
        }

        const { error } = await supabase
            .from('todos')
            .update(changes)
            .eq('id', id);

        if (error) {
            console.error('Error updating todo:', error);
            setTodos(previousTodos);
        }
    }

    function handleCompleteTodo(id) {
        const todo = todos.find((val) => val.id === id);
        updateTodo(id, { complete: !todo.complete });
    }

    function handleDeleteTodo(id) {
        const todo = todos.find((val) => val.id === id);
        setTodoToDelete({ id, text: todo.input });
        setShowDeleteModal(true);
    }

    async function confirmDeleteTodo() {
        if (todoToDelete) {
            const newTodoList = todos.filter(
                (val) => val.id !== todoToDelete.id
            );

            if (user) {
                // Delete from Supabase
                const { error } = await supabase
                    .from('todos')
                    .delete()
                    .eq('id', todoToDelete.id);

                if (error) {
                    console.error('Error deleting todo:', error);
                } else {
                    setTodos(newTodoList);
                }
            } else {
                // Delete from localStorage
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

    function handleEditTodo(id, newInput) {
        updateTodo(id, { input: newInput });
        setEditingId(null);
    }

    function handleStartEdit(id) {
        setEditingId(id);
    }

    function handleCancelEdit() {
        setEditingId(null);
    }

    function handleToggleFavorite(id) {
        const todo = todos.find((val) => val.id === id);
        // Joins the top of the group it moves into
        updateTodo(id, {
            favorite: !todo.favorite,
            position: topPosition(todos),
        });
    }

    function handleReorderTodo(id, position) {
        updateTodo(id, { position });
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
            <div className="app-loading">
                Loading...
            </div>
        );
    }

    // Always show main app
    return (
        <>
            <Header
                todos={todos}
                showGame={showGame}
                onToggleGame={handleToggleGame}
                onShowAuth={handleShowAuth}
            />
            <Tabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                todos={todos}
            />
            <TodoInput handleAddTodo={handleAddTodo} />
            {shouldShowGame && <RewardGame allDone={allTasksComplete} />}
            <TodoList
                todos={todos}
                selectedTab={selectedTab}
                handleDeleteTodo={handleDeleteTodo}
                handleCompleteTodo={handleCompleteTodo}
                editingId={editingId}
                handleEditTodo={handleEditTodo}
                handleStartEdit={handleStartEdit}
                handleCancelEdit={handleCancelEdit}
                handleToggleFavorite={handleToggleFavorite}
                handleReorderTodo={handleReorderTodo}
            />
            <ConfirmationModal
                isOpen={showDeleteModal}
                todoText={todoToDelete?.text || ''}
                onConfirm={confirmDeleteTodo}
                onCancel={cancelDeleteTodo}
            />
            {showAuthModal && (
                <Auth onClose={handleCloseAuth} />
            )}
        </>
    );
}

export default App;

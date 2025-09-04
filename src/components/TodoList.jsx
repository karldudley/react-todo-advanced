import TodoCard from './TodoCard';

export default function TodoList(props) {
    const { todos, selectedTab } = props;
    const filterTodoList =
        selectedTab === 'All'
            ? todos
            : selectedTab === 'Completed'
            ? todos.filter((val) => val.complete)
            : todos.filter((val) => !val.complete);
    
    // Sort filtered todos with favorites at the top
    const sortedTodoList = filterTodoList.sort((a, b) => {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
        return 0;
    });
    
    return (
        <div className="todo-list">
            {sortedTodoList.map((todo, todoIndex) => {
                return (
                    <TodoCard
                        key={todoIndex}
                        {...props}
                        todoIndex={todos.findIndex((val) => val === todo)}
                        todo={todo}
                    />
                );
            })}
        </div>
    );
}

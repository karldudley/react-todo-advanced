import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TodoCard from './TodoCard';
import EmptyState from './EmptyState';
import { sortTodos, positionBetween } from '../lib/todos';

export default function TodoList(props) {
    const { todos, selectedTab, handleReorderTodo } = props;
    const filterTodoList =
        selectedTab === 'All'
            ? todos
            : selectedTab === 'Completed'
            ? todos.filter((val) => val.complete)
            : todos.filter((val) => !val.complete);

    const sortedTodoList = sortTodos(filterTodoList);

    // Starred todos stay on top, each group is reordered on its own
    const groups = [
        {
            label: 'Starred',
            icon: 'fa-star',
            items: sortedTodoList.filter((val) => val.favorite),
        },
        {
            label: 'Tasks',
            icon: 'fa-list-ul',
            items: sortedTodoList.filter((val) => !val.favorite),
        },
    ].filter((group) => group.items.length > 0);

    const sensors = useSensors(
        // Small threshold so a click on the handle is not treated as a drag
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        const group = groups.find(({ items }) =>
            items.some((val) => val.id === active.id)
        );
        const oldIndex = group.items.findIndex((val) => val.id === active.id);
        const newIndex = group.items.findIndex((val) => val.id === over.id);

        // Dropped on the other group
        if (newIndex === -1) return;

        const moved = arrayMove(group.items, oldIndex, newIndex);
        handleReorderTodo(
            active.id,
            positionBetween(moved[newIndex - 1], moved[newIndex + 1])
        );
    };

    if (sortedTodoList.length === 0) {
        return <EmptyState selectedTab={selectedTab} hasTodos={todos.length > 0} />;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="todo-list">
                {groups.map(({ label, icon, items }) => (
                    <SortableContext
                        key={label}
                        items={items.map((val) => val.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {groups.length > 1 && (
                            <h2 className="todo-group-label">
                                <i className={`fa-solid ${icon}`} aria-hidden="true"></i>
                                {label}
                            </h2>
                        )}
                        {items.map((todo) => (
                            <TodoCard key={todo.id} {...props} todo={todo} />
                        ))}
                    </SortableContext>
                ))}
            </div>
        </DndContext>
    );
}

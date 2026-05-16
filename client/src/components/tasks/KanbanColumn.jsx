import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const COLUMN_STYLES = {
  todo: { header: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400', label: 'Todo' },
  'in-progress': { header: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', label: 'In Progress' },
  done: { header: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Done' },
};

const KanbanColumn = ({ status, tasks, onEdit, onDelete, isAdmin }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const style = COLUMN_STYLES[status];

  return (
    <div className="flex flex-col min-w-72 w-72 flex-shrink-0">
      {/* Column header */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${style.header}`}>
        <div className={`w-2 h-2 rounded-full ${style.dot}`} aria-hidden="true" />
        <h2 className="text-sm font-semibold">{style.label}</h2>
        <span className="ml-auto text-xs font-medium opacity-70">{tasks.length}</span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-32 rounded-lg p-2 space-y-2 transition-colors ${isOver ? 'bg-indigo-50 border-2 border-dashed border-indigo-300' : 'bg-gray-50'}`}
        aria-label={`${style.label} column, ${tasks.length} tasks`}
      >
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
              isDraggable={isAdmin}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PriorityBadge } from '../common/Badge';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, isAdmin, isDraggable }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border border-gray-100 p-3.5 shadow-sm ${isDragging ? 'shadow-lg' : 'hover:shadow-md'} transition-shadow`}
    >
      {/* Drag handle (admin only) */}
      {isDraggable && (
        <div {...attributes} {...listeners} className="flex items-center mb-2 cursor-grab active:cursor-grabbing" aria-label="Drag to reorder">
          <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
        </div>
      )}

      <h3 className="text-sm font-medium text-slate-900 mb-2 leading-snug">{task.title}</h3>

      {task.description && (
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <PriorityBadge priority={task.priority} />
        {isOverdue && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
            Overdue
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {task.assignedTo && (
            <div
              className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
              title={task.assignedTo.name}
              aria-label={`Assigned to ${task.assignedTo.name}`}
            >
              {task.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
          )}
          {task.dueDate && (
            <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
              {format(new Date(task.dueDate), 'dd MMM')}
            </span>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-gray-400 hover:text-indigo-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`Edit task ${task.title}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="p-1 text-gray-400 hover:text-red-600 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Delete task ${task.title}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

const priorityStyles = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

const statusStyles = {
  todo: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

const statusLabels = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
};

export const PriorityBadge = ({ priority }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${priorityStyles[priority] || 'bg-gray-100 text-gray-600'}`}>
    {priority}
  </span>
);

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>
    {statusLabels[status] || status}
  </span>
);

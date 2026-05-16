import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TaskForm = ({ initial, projectId, onSave, onClose }) => {
  const { user } = useAuth();

  const [form, setForm] = useState(
    initial
      ? { title: initial.title, description: initial.description || '', dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : '', priority: initial.priority, status: initial.status, assignedTo: initial.assignedTo?._id || '' }
      // Standard users are auto-assigned to themselves; admins leave it unassigned by default
      : { title: '', description: '', dueDate: '', priority: 'medium', status: 'todo', assignedTo: user?.role !== 'admin' ? (user?._id || '') : '' }
  );
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/users').then(({ data }) => setUsers(data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    setError('');
    try {
      await onSave({ ...form, project: projectId, assignedTo: form.assignedTo || null });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}
      <div className="mb-4">
        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
        <input id="task-title" type="text" required value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Task title" />
      </div>
      <div className="mb-4">
        <label htmlFor="task-desc" className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <textarea id="task-desc" rows={3} value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          placeholder="Optional details..." />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
          <select id="task-priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select id="task-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="task-due" className="block text-sm font-medium text-gray-700 mb-1.5">Due date</label>
          <input id="task-due" type="date" value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign to</label>
          {user?.role === 'admin' ? (
            <select id="task-assign" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Unassigned</option>
              {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
          ) : (
            <div className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700">
              {user?.name} (you)
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {loading ? 'Saving…' : initial ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { formatDistanceToNow } from 'date-fns';

const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, p] = await Promise.all([api.get('/tasks'), api.get('/projects')]);
        setTasks(t.data);
        setProjects(p.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const highPriority = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length;
  const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  const recent = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Here's what's happening across your projects.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Tasks" value={total} color="text-slate-900" />
        <StatCard label="Done" value={done} color="text-green-600" />
        <StatCard label="In Progress" value={inProgress} color="text-blue-600" />
        <StatCard label="High Priority" value={highPriority} color="text-red-600" />
        <StatCard label="Overdue" value={overdue} color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <section aria-labelledby="recent-tasks-heading">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 id="recent-tasks-heading" className="text-base font-semibold text-slate-900">Recent Tasks</h2>
            </div>
            {recent.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No tasks yet.</p>
            ) : (
              <ul>
                {recent.map((task) => (
                  <li key={task._id} className="px-5 py-3 border-b border-gray-50 last:border-0 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {task.project?.name} · {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Projects */}
        <section aria-labelledby="projects-heading">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 id="projects-heading" className="text-base font-semibold text-slate-900">Projects</h2>
              <Link to="/projects" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                View all
              </Link>
            </div>
            {projects.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No projects yet.</p>
            ) : (
              <ul>
                {projects.slice(0, 5).map((p) => {
                  const count = tasks.filter((t) => t.project?._id === p._id || t.project === p._id).length;
                  return (
                    <li key={p._id}>
                      <Link
                        to={`/projects/${p._id}`}
                        className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: p.color }}
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-slate-900 flex-1 truncate">{p.name}</span>
                        <span className="text-xs text-gray-400">{count} tasks</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

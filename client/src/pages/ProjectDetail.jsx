import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import KanbanColumn from '../components/tasks/KanbanColumn';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const STATUSES = ['todo', 'in-progress', 'done'];

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const isAdmin = user?.role === 'admin';

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const loadData = useCallback(async () => {
    try {
      const [proj, taskList] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
      ]);
      setProject(proj.data);
      setTasks(taskList.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  // Socket.io real-time
  useEffect(() => {
    if (!socket) return;
    socket.joinProject(id);

    const offCreated = socket.on('task:created', (task) => {
      const projectId = String(task.project?._id || task.project);
      if (projectId !== String(id)) return;
      setTasks((prev) => {
        if (prev.some((t) => t._id === task._id)) return prev;
        return [task, ...prev];
      });
    });
    const offUpdated = socket.on('task:updated', (task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    });
    const offStatus = socket.on('task:statusChanged', (task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    });
    const offDeleted = socket.on('task:deleted', ({ _id }) => {
      setTasks((prev) => prev.filter((t) => t._id !== _id));
    });

    return () => {
      socket.leaveProject(id);
      offCreated?.();
      offUpdated?.();
      offStatus?.();
      offDeleted?.();
    };
  }, [socket, id]);

  // DO NOT add to state here — the socket task:created event is the single
  // source of truth. The server emits before it sends the HTTP response, so
  // the socket always wins the race. Calling setTasks here too would duplicate.
  const handleCreate = async (form) => {
    await api.post('/tasks', { ...form, project: id });
    toast.success('Task created');
  };

  const handleUpdate = async (form) => {
    const { data } = await api.put(`/tasks/${editingTask._id}`, form);
    setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    setEditingTask(null);
    toast.success('Task updated');
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${taskId}`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    toast.success('Task deleted');
  };

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find((t) => t._id === active.id) || null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const task = tasks.find((t) => t._id === active.id);
    const newStatus = STATUSES.includes(over.id) ? over.id : tasks.find((t) => t._id === over.id)?.status;
    if (!task || !newStatus || task.status === newStatus) return;
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)));
    try {
      await api.patch(`/tasks/${task._id}/status`, { status: newStatus });
    } catch {
      toast.error('Failed to update status');
      setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: task.status } : t)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Project not found.</p>
        <Link to="/projects" className="text-indigo-600 hover:underline text-sm mt-2 inline-block">Back to projects</Link>
      </div>
    );
  }

  const tasksByStatus = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/projects" className="text-sm text-gray-400 hover:text-gray-600">Projects</Link>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: project.color }} aria-hidden="true" />
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
          </div>
          {project.description && <p className="text-sm text-gray-500 mt-1">{project.description}</p>}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          aria-label="Add new task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4" role="region" aria-label="Kanban board">
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} isAdmin={false} isDraggable={false} />
          )}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Task">
        <TaskForm projectId={id} onSave={handleCreate} onClose={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task">
        <TaskForm initial={editingTask} projectId={id} onSave={handleUpdate} onClose={() => setEditingTask(null)} />
      </Modal>
    </div>
  );
};

export default ProjectDetail;

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/tasks/TaskCard';

// dnd-kit needs a DndContext to work; for unit tests we mock useSortable
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => '' } },
}));

const baseTask = {
  _id: 'task-001',
  title: 'Fix login bug',
  description: 'The login page throws a 401',
  priority: 'high',
  status: 'in-progress',
  dueDate: null,
  assignedTo: { _id: 'user-001', name: 'Azhar Javed' },
};

const renderCard = (props = {}) =>
  render(
    <TaskCard
      task={baseTask}
      onEdit={() => {}}
      onDelete={() => {}}
      isAdmin={false}
      isDraggable={false}
      {...props}
    />
  );

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('TaskCard — rendering', () => {
  it('displays the task title', () => {
    renderCard();
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('displays the task description', () => {
    renderCard();
    expect(screen.getByText('The login page throws a 401')).toBeInTheDocument();
  });

  it('renders the priority badge', () => {
    renderCard();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('shows the assignee initial avatar', () => {
    renderCard();
    expect(screen.getByLabelText('Assigned to Azhar Javed')).toBeInTheDocument();
  });

  it('shows an Overdue badge when dueDate is in the past and status is not done', () => {
    const overdueTask = { ...baseTask, dueDate: '2020-01-01' };
    render(<TaskCard task={overdueTask} onEdit={() => {}} onDelete={() => {}} isAdmin={false} isDraggable={false} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('does NOT show Overdue badge for a completed task even if past due', () => {
    const doneTask = { ...baseTask, dueDate: '2020-01-01', status: 'done' };
    render(<TaskCard task={doneTask} onEdit={() => {}} onDelete={() => {}} isAdmin={false} isDraggable={false} />);
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Role-based button visibility
// ---------------------------------------------------------------------------
describe('TaskCard — admin controls', () => {
  it('shows Edit and Delete buttons for admin', () => {
    renderCard({ isAdmin: true });
    expect(screen.getByLabelText('Edit task Fix login bug')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete task Fix login bug')).toBeInTheDocument();
  });

  it('hides Edit and Delete buttons for standard user', () => {
    renderCard({ isAdmin: false });
    expect(screen.queryByLabelText('Edit task Fix login bug')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete task Fix login bug')).not.toBeInTheDocument();
  });

  it('calls onEdit with the task when Edit is clicked', () => {
    const onEdit = vi.fn();
    renderCard({ isAdmin: true, onEdit });
    fireEvent.click(screen.getByLabelText('Edit task Fix login bug'));
    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledWith(baseTask);
  });

  it('calls onDelete with the task id when Delete is clicked', () => {
    const onDelete = vi.fn();
    renderCard({ isAdmin: true, onDelete });
    fireEvent.click(screen.getByLabelText('Delete task Fix login bug'));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith('task-001');
  });
});

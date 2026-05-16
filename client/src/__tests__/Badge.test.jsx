import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';

// ---------------------------------------------------------------------------
// PriorityBadge
// ---------------------------------------------------------------------------
describe('PriorityBadge', () => {
  it('renders the "high" label', () => {
    render(<PriorityBadge priority="high" />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('applies red styling for high priority', () => {
    render(<PriorityBadge priority="high" />);
    expect(screen.getByText('high')).toHaveClass('text-red-700');
  });

  it('renders the "medium" label', () => {
    render(<PriorityBadge priority="medium" />);
    expect(screen.getByText('medium')).toBeInTheDocument();
  });

  it('applies amber styling for medium priority', () => {
    render(<PriorityBadge priority="medium" />);
    expect(screen.getByText('medium')).toHaveClass('text-amber-700');
  });

  it('renders the "low" label', () => {
    render(<PriorityBadge priority="low" />);
    expect(screen.getByText('low')).toBeInTheDocument();
  });

  it('applies green styling for low priority', () => {
    render(<PriorityBadge priority="low" />);
    expect(screen.getByText('low')).toHaveClass('text-green-700');
  });
});

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------
describe('StatusBadge', () => {
  it('renders "Todo" for todo status', () => {
    render(<StatusBadge status="todo" />);
    expect(screen.getByText('Todo')).toBeInTheDocument();
  });

  it('renders "In Progress" for in-progress status', () => {
    render(<StatusBadge status="in-progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders "Done" for done status', () => {
    render(<StatusBadge status="done" />);
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('applies blue styling for in-progress', () => {
    render(<StatusBadge status="in-progress" />);
    expect(screen.getByText('In Progress')).toHaveClass('text-blue-700');
  });

  it('applies green styling for done', () => {
    render(<StatusBadge status="done" />);
    expect(screen.getByText('Done')).toHaveClass('text-green-700');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Hoisted mock — vi.mock is moved to the top of the file by the transformer
const mockLogin = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

// useNavigate is provided automatically by MemoryRouter
const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

beforeEach(() => {
  mockLogin.mockReset();
  mockLogin.mockResolvedValue({});
});

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
describe('Login page — rendering', () => {
  it('renders the email input', () => {
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('renders the password input', () => {
    renderLogin();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it('renders the Sign in button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders a link to the Register page', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders a link back to Home', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Password visibility toggle
// ---------------------------------------------------------------------------
describe('Login page — password toggle', () => {
  it('password field is hidden by default', () => {
    renderLogin();
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('type', 'password');
  });

  it('clicking the toggle reveals the password', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('type', 'text');
  });

  it('clicking the toggle again hides the password', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /show password/i }));
    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('type', 'password');
  });
});

// ---------------------------------------------------------------------------
// Form behaviour
// ---------------------------------------------------------------------------
describe('Login page — form behaviour', () => {
  it('calls login with the entered credentials on submit', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'azhar@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'mypassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledOnce();
      expect(mockLogin).toHaveBeenCalledWith('azhar@test.com', 'mypassword');
    });
  });

  it('shows an error alert when login rejects', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: 'Invalid email or password' } },
    });

    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'bad@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
    });
  });

  it('disables the submit button while loading', async () => {
    // Never resolves so loading state stays
    mockLogin.mockReturnValue(new Promise(() => {}));

    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'azhar@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'pass1234' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });
  });
});

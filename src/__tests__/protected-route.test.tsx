import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProtectedRoute } from '@/components/protected-route';

const mockAuth = vi.hoisted(() => vi.fn());

vi.mock('@/context/auth-context', () => ({
  useAuth: () => mockAuth(),
}));

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route
          path="/private"
          element={
            <ProtectedRoute roles={['administrator']}>
              <div>Protected content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/auth/login" element={<div>Login redirect</div>} />
        <Route path="/dashboard/student" element={<div>Student dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockAuth.mockReset();
  });

  it('redirects unauthenticated users to login', () => {
    mockAuth.mockReturnValue({ user: null, isLoading: false });

    renderProtectedRoute();

    expect(screen.getByText('Login redirect')).toBeInTheDocument();
  });

  it('redirects authenticated users away from routes for other roles', () => {
    mockAuth.mockReturnValue({
      isLoading: false,
      user: {
        _id: 'student-1',
        firstName: 'Student',
        lastName: 'User',
        email: 'student@example.com',
        role: 'student',
        isActive: true,
      },
    });

    renderProtectedRoute();

    expect(screen.getByText('Student dashboard')).toBeInTheDocument();
  });

  it('renders children for allowed roles', () => {
    mockAuth.mockReturnValue({
      isLoading: false,
      user: {
        _id: 'admin-1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'administrator',
        isActive: true,
      },
    });

    renderProtectedRoute();

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});

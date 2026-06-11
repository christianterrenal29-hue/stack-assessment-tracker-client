import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Sidebar } from '@/components/sidebar';

const mockLogout = vi.hoisted(() => vi.fn());

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

function renderSidebar(role: 'administrator' | 'instructor' | 'assessor' | 'student') {
  return render(
    <MemoryRouter initialEntries={[`/dashboard/${role === 'administrator' ? 'admin' : role}`]}>
      <Routes>
        <Route path="*" element={<Sidebar role={role} />} />
        <Route path="/auth/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Dashboard logout', () => {
  beforeEach(() => {
    mockLogout.mockReset();
    mockLogout.mockResolvedValue(undefined);
  });

  it.each(['administrator', 'instructor', 'assessor', 'student'] as const)(
    'renders logout in the %s sidebar',
    (role) => {
      renderSidebar(role);

      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    }
  );

  it('calls auth logout and redirects to login', async () => {
    const user = userEvent.setup();
    renderSidebar('administrator');

    await user.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => expect(mockLogout).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });
});

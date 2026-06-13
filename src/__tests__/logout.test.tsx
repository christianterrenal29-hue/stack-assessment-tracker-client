import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/header';

const mockLogout = vi.hoisted(() => vi.fn());

vi.mock('@/context/auth-context', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

function renderHeader() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/admin']}>
      <Routes>
        <Route path="*" element={<Header userName="Admin User" />} />
        <Route path="/auth/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Header logout', () => {
  beforeEach(() => {
    mockLogout.mockReset();
    mockLogout.mockResolvedValue(undefined);
  });

  it('renders logout in the header user dropdown', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: /admin user/i }));

    expect(screen.getByRole('menuitem', { name: /logout/i })).toBeInTheDocument();
  });

  it('calls auth logout and redirects to login', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: /admin user/i }));
    await user.click(screen.getByRole('menuitem', { name: /logout/i }));

    await waitFor(() => expect(mockLogout).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });
});

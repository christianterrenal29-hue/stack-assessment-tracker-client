import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AdminDashboard from '@/app/dashboard/admin/page';

describe('AdminDashboard', () => {
  it('renders administrator dashboard actions', () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /administrator dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage users/i })).toHaveAttribute('href', '/dashboard/admin/users');
    expect(screen.getByRole('link', { name: /compliance report/i })).toHaveAttribute('href', '/dashboard/admin/compliance');
    expect(screen.getByRole('link', { name: /view analytics/i })).toHaveAttribute('href', '/dashboard/admin/analytics');
  });
});

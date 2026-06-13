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
    expect(screen.getByRole('link', { name: /manage assessment schedules/i })).toHaveAttribute('href', '/instructor/assessments');
    expect(screen.getByRole('link', { name: /manage users and roles/i })).toHaveAttribute('href', '/admin/users');
    expect(screen.getByRole('link', { name: /generate tesda reports/i })).toHaveAttribute('href', '/reports');
  });
});

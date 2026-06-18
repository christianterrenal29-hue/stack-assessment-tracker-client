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

    expect(screen.getByRole('heading', { name: /assessment operations dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /manage assessment schedules/i })).toHaveAttribute('href', '/instructor/assessments');
    expect(screen.getByRole('link', { name: /review candidate results/i })).toHaveAttribute('href', '/candidate-results');
    expect(screen.getByRole('link', { name: /generate tesda reports/i })).toHaveAttribute('href', '/reports');
  });
});

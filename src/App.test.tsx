import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('Recruiter journeys', () => {
  it('opens navigation and closes it when a destination is selected', async () => {
    const user = userEvent.setup();
    render(<App />);
    const menu = screen.getByRole('button', { name: 'Menu' });
    await user.click(menu);
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('link', { name: 'Experience' }));
    expect(menu).toHaveAttribute('aria-expanded', 'false');
  });
  it('provides working contact and repository-aware resume destinations', () => {
    render(<App base="/a-different-repo/" />);
    expect(screen.getByRole('link', { name: 'grace.m.arnold@outlook.com' })).toHaveAttribute(
      'href',
      'mailto:grace.m.arnold@outlook.com',
    );
    expect(screen.getByRole('link', { name: /Download résumé/ })).toHaveAttribute(
      'href',
      '/a-different-repo/grace-arnold-resume.pdf',
    );
    expect(screen.getByRole('link', { name: /Download résumé/ })).toHaveAttribute('download');
  });
  it('keeps the documented creative project scope available to technical readers', () => {
    render(<App />);
    expect(
      screen.getByText(/the repository documents that the fix is incomplete/),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Play Star Baker on itch.io' })).toHaveAttribute(
      'href',
      'https://grachay.itch.io/star-baker',
    );
    expect(screen.getByText('Jun 2023 — Sep 2026')).toBeInTheDocument();
  });
});

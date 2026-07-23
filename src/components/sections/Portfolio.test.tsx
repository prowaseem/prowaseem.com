import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Portfolio } from './Portfolio';

describe('Portfolio', () => {
  it('shows all projects by default', () => {
    render(<Portfolio />);
    expect(screen.getByText('Agentic Chat Workflow')).toBeInTheDocument();
    expect(screen.getByText('Airline Itinerary Portal')).toBeInTheDocument();
  });

  it('filters projects when a category is selected', async () => {
    render(<Portfolio />);
    await userEvent.click(screen.getByRole('button', { name: 'AI/Agents' }));

    // AnimatePresence keeps the exiting card mounted until its exit
    // animation completes, so its removal from the DOM is asynchronous.
    await waitFor(() => {
      expect(screen.getByText('Agentic Chat Workflow')).toBeInTheDocument();
      expect(screen.queryByText('Airline Itinerary Portal')).not.toBeInTheDocument();
    });
  });
});

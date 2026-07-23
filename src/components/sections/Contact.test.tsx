import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Contact } from './Contact';
import { submitContactForm } from '../../lib/submitContactForm';

vi.mock('../../lib/submitContactForm', () => ({
  submitContactForm: vi.fn(),
}));

describe('Contact', () => {
  beforeEach(() => {
    vi.mocked(submitContactForm).mockReset();
  });

  it('shows a validation error when required fields are empty', async () => {
    render(<Contact />);
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));
    // State updates are asynchronous, so we need to wait for the error to appear
    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
    });
  });

  it('submits successfully with valid input', async () => {
    vi.mocked(submitContactForm).mockResolvedValue(undefined);

    render(<Contact />);
    await userEvent.type(screen.getByLabelText('Name'), 'Jane Doe');
    await userEvent.type(screen.getByLabelText('Message'), 'Hello, I would love to collaborate.');
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    // State updates are asynchronous, so we wait for the success message
    await waitFor(() => {
      expect(screen.getByText(/thanks for reaching out/i)).toBeInTheDocument();
    });
  });
});

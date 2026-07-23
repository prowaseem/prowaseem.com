import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders a link for every profile contact link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:theprowaseem@gmail.com');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/prowaseem');
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://linkedin.com/in/prowaseem');
    expect(screen.getByRole('link', { name: 'Website' })).toHaveAttribute('href', 'https://prowaseem.com');
  });

  it('renders a back-to-top button', () => {
    render(<Footer />);
    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });
});

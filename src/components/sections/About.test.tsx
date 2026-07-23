import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';

describe('About', () => {
  it('renders the section heading, bio, and stat labels', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /a decade of shipping frontend products/i })).toBeInTheDocument();
    expect(screen.getByText(/experienced software engineer with 11 years/i)).toBeInTheDocument();
    expect(screen.getByText('Years of experience')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
  });
});

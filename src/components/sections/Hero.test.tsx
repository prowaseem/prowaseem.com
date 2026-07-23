import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the name, title, and both CTAs', () => {
    render(<Hero />);
    expect(screen.getByText('Muhammad Waseem Irshad')).toBeInTheDocument();
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Work' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get in Touch' })).toBeInTheDocument();
  });
});

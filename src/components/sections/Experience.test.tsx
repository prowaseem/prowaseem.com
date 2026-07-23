import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Experience } from './Experience';

describe('Experience', () => {
  it('renders every employer with role and date range', () => {
    render(<Experience />);
    expect(screen.getByText(/Senior Frontend Engineer · Access Development/)).toBeInTheDocument();
    expect(screen.getByText(/Senior Frontend Engineer · Beam AI/)).toBeInTheDocument();
    expect(screen.getByText(/Lead Software Engineer · Venturedive/)).toBeInTheDocument();
    expect(screen.getByText('January 2026 — Present')).toBeInTheDocument();
  });
});

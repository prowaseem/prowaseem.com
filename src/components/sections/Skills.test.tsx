import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skills } from './Skills';

describe('Skills', () => {
  it('renders every skill category and a sample skill from each', () => {
    render(<Skills />);
    expect(screen.getByText('AI-Assisted Engineering')).toBeInTheDocument();
    expect(screen.getByText('Claude Code')).toBeInTheDocument();
    expect(screen.getByText('Frontend & Frameworks')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});

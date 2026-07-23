import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { Badge } from './Badge';
import { SectionHeading } from './SectionHeading';

describe('UI primitives', () => {
  it('Button renders its children and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('Button renders as a link when href is provided', () => {
    render(<Button href="https://example.com">Visit</Button>);
    expect(screen.getByRole('link', { name: 'Visit' })).toHaveAttribute('href', 'https://example.com');
  });

  it('Badge renders its label', () => {
    render(<Badge>React</Badge>);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('SectionHeading renders eyebrow, title, and description', () => {
    render(<SectionHeading eyebrow="About" title="Who I am" description="A short bio" />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Who I am' })).toBeInTheDocument();
    expect(screen.getByText('A short bio')).toBeInTheDocument();
  });
});

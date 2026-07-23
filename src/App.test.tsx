import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
});

describe('App', () => {
  it('renders every top-level section', () => {
    render(<App />);
    expect(screen.getAllByText('Muhammad Waseem Irshad').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /technologies i work with/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /where i've worked/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /selected work/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /let's build something together/i })).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('Header', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
    document.body.innerHTML =
      '<div id="hero"></div><div id="about"></div><div id="skills"></div>' +
      '<div id="experience"></div><div id="portfolio"></div><div id="contact"></div>';

    // Mock IntersectionObserver
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders all navigation links', () => {
    render(<Header />);
    ['About', 'Skills', 'Experience', 'Portfolio', 'Contact'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('scrolls to the target section when a nav link is clicked', async () => {
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'Skills' }));
    expect(document.getElementById('skills')?.scrollIntoView).toHaveBeenCalled();
  });
});

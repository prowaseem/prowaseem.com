import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useScrollSpy } from './useScrollSpy';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: ObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];

  constructor(callback: ObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }
}

describe('useScrollSpy', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    document.body.innerHTML = '<section id="hero"></section><section id="about"></section>';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the first section id before anything intersects', () => {
    const { result } = renderHook(() => useScrollSpy(['hero', 'about']));
    expect(result.current).toBe('hero');
  });

  it('updates to the section reported as intersecting', () => {
    const { result } = renderHook(() => useScrollSpy(['hero', 'about']));
    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer.callback([
        { isIntersecting: true, intersectionRatio: 0.8, target: document.getElementById('about') as Element },
      ]);
    });

    expect(result.current).toBe('about');
  });
});

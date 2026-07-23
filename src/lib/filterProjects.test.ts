import { describe, expect, it } from 'vitest';
import { filterProjects } from './filterProjects';
import type { Project } from '../data/types';

const sample: Project[] = [
  { title: 'A', company: 'X', category: 'AI/Agents', tags: [], description: '' },
  { title: 'B', company: 'Y', category: 'Full-Stack', tags: [], description: '' },
];

describe('filterProjects', () => {
  it('returns all projects when filter is "All"', () => {
    expect(filterProjects(sample, 'All')).toHaveLength(2);
  });

  it('returns only projects matching the category', () => {
    expect(filterProjects(sample, 'AI/Agents')).toEqual([sample[0]]);
  });
});

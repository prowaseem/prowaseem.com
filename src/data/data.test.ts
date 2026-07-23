import { describe, expect, it } from 'vitest';
import { profile } from './profile';
import { skillGroups } from './skills';
import { employmentHistory } from './employment';
import { projects } from './projects';
import { education } from './education';

describe('portfolio data', () => {
  it('has a complete profile', () => {
    expect(profile.fullName).toBe('Muhammad Waseem Irshad');
    expect(profile.links.length).toBeGreaterThan(0);
  });

  it('has skill groups that each contain skills', () => {
    expect(skillGroups.length).toBeGreaterThan(0);
    skillGroups.forEach((group) => expect(group.skills.length).toBeGreaterThan(0));
  });

  it('marks exactly one current employment entry', () => {
    const currentRoles = employmentHistory.filter((entry) => entry.current);
    expect(currentRoles).toHaveLength(1);
    expect(currentRoles[0].company).toBe('Access Development');
  });

  it('has projects in every filter category', () => {
    const categories = new Set(projects.map((project) => project.category));
    expect(categories).toEqual(new Set(['AI/Agents', 'Full-Stack', 'Enterprise']));
  });

  it('has education entries', () => {
    expect(education.length).toBeGreaterThan(0);
  });
});

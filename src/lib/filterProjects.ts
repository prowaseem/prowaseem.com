import type { Project, ProjectCategory } from '../data/types';

export type FilterOption = 'All' | ProjectCategory;

export function filterProjects(projects: Project[], filter: FilterOption): Project[] {
  if (filter === 'All') return projects;
  return projects.filter((project) => project.category === filter);
}

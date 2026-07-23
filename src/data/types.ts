export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: 'mail' | 'github' | 'linkedin';
}

export interface Profile {
  fullName: string;
  title: string;
  bio: string;
  location: string;
  links: ContactLink[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface EmploymentDetail {
  description: string;
  skills: string[];
}

export interface EmploymentEntry {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  details: EmploymentDetail[];
}

export type ProjectCategory = 'AI/Agents' | 'Full-Stack' | 'Enterprise';

export interface Project {
  title: string;
  company: string;
  category: ProjectCategory;
  tags: string[];
  description: string;
}

export interface EducationEntry {
  institution: string;
  credential: string;
}

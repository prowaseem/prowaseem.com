import type { EmploymentEntry } from './types';

export const employmentHistory: EmploymentEntry[] = [
  {
    company: 'Access Development',
    role: 'Senior Frontend Engineer',
    location: 'Salt Lake City, Utah, United States',
    startDate: 'January 2026',
    endDate: 'Present',
    current: true,
    details: [
      {
        description:
          'Adding new features to a US-based white-labeling platform using Spec-Driven Development with AI-assisted tools.',
        skills: ['MCP', 'Skills', 'Subagents'],
      },
    ],
  },
  {
    company: 'Beam AI',
    role: 'Senior Frontend Engineer',
    location: 'Berlin, Germany',
    startDate: 'March 2025',
    endDate: 'January 2026',
    details: [
      { description: 'Built an Agentic Chat workflow for automatic AI workflow creation.', skills: ['React', 'TypeScript'] },
      { description: 'Integrated third-party tools such as Gmail and Slack into AI workflows.', skills: ['APIs', 'OAuth'] },
      { description: 'Built an automated end-to-end feature evaluation suite.', skills: ['Playwright', 'MCP'] },
      { description: 'Optimized platform performance and reduced tech debt and backlog.', skills: ['Performance', 'Refactoring'] },
    ],
  },
  {
    company: 'Venturedive',
    role: 'Lead Software Engineer',
    location: 'Karachi, Pakistan',
    startDate: 'June 2017',
    endDate: 'December 2025',
    details: [
      {
        description:
          'Contributed to a multi-user, multi-platform waste management and collection system on a serverless architecture.',
        skills: ['React', 'Node.js', 'AWS Lambda', 'AWS Cognito', 'AWS Amplify'],
      },
      { description: 'Developed and maintained web portals for a mobile financial application.', skills: ['Angular', 'HTML', 'CSS'] },
      { description: 'Resolved bugs and integrated new features in a renowned airline itinerary front-end portal.', skills: ['React', 'Redux'] },
      { description: 'Led a team building an HR survey web application with automated deployments and unit testing.', skills: ['Node.js', 'React', 'CI/CD'] },
    ],
  },
  {
    company: 'Invision Solutions',
    role: 'Senior Web Application Developer',
    location: 'Karachi, Pakistan',
    startDate: 'October 2016',
    endDate: 'June 2017',
    details: [
      { description: 'Built and maintained RESTful APIs on Laravel for web portals and mobile applications.', skills: ['Laravel', 'REST APIs'] },
      { description: 'Designed an enterprise web application using AngularJS and Laravel.', skills: ['AngularJS', 'Laravel'] },
      { description: 'Managed EC2 instances and coordinated backend activities across multiple projects.', skills: ['AWS EC2'] },
    ],
  },
  {
    company: 'Invision Solutions',
    role: 'Junior Software Engineer',
    location: 'Lahore, Pakistan',
    startDate: 'March 2016',
    endDate: 'October 2016',
    details: [
      {
        description:
          'Developed plugins for PrestaShop and WordPress, plus a Laravel API for ecommerce and blog integrations.',
        skills: ['PrestaShop', 'WordPress', 'Laravel'],
      },
    ],
  },
  {
    company: 'Nimble Web Solutions',
    role: 'PHP Developer',
    location: 'Faisalabad, Pakistan',
    startDate: 'June 2015',
    endDate: 'March 2016',
    details: [
      { description: 'Contributed to open-source tools, web portals, and plugins for WordPress.', skills: ['WordPress', 'PHP'] },
    ],
  },
];

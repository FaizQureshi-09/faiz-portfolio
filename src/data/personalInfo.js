/**
 * Core identity and contact details sourced from the resume header.
 * The phone number is intentionally omitted from the public site.
 */
export const personalInfo = {
  fullName: 'Mohd Faiz Qureshi',
  title: 'Backend & DevOps Engineer',
  totalExperience: '3 Years 2 Months',
  location: 'Indore, India',
  email: 'mdfaizqureshi09@gmail.com',
  linkedInUrl: 'https://www.linkedin.com/in/mohd-faiz-qureshi-441242207/',
  githubUrl: 'https://github.com/faiz-009?tab=repositories',
  resumeTagline:
    'Building resilient backends and automating the cloud, one pipeline at a time.',
};

/**
 * Social/profile links rendered wherever brand icons are needed
 * (navbar, footer, hero section).
 */
export const socialLinks = [
  {
    id: 'email',
    label: 'Email',
    href: `mailto:${personalInfo.email}`,
    iconKey: 'email',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: personalInfo.linkedInUrl,
    iconKey: 'linkedin',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: personalInfo.githubUrl,
    iconKey: 'github',
  },
];

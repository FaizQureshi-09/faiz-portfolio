/**
 * Core identity and contact details sourced from the resume header.
 * The phone number is intentionally omitted from the public site.
 */
export const personalInfo = {
  fullName: 'Mohd Faiz Qureshi',
  title: 'Backend & DevOps Engineer',
  totalExperience: '3 Years 2 Months',
  location: 'Indore',
  countryFlag: '🇮🇳',
  email: 'mdfaizqureshi09@gmail.com',
  linkedInUrl: 'https://www.linkedin.com/in/mohd-faiz-qureshi-441242207/',
  githubUrl: 'https://github.com/FaizQureshi-09',
  resumeTagline:
    'Building resilient backends and automating the cloud, one pipeline at a time.',
};

/**
 * Social/profile links rendered wherever brand icons are needed
 * (navbar, footer, hero section).
 *
 * The email address is intentionally not linked here — visitors are
 * directed to the Contact section's form instead of emailing directly.
 */
export const socialLinks = [
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

/**
 * Core identity and contact details sourced from the resume header.
 * The phone number is intentionally omitted from the public site.
 */
export const personalInfo = {
  fullName: 'Mohd Faiz Qureshi',
  title: 'Software Engineer',
  location: 'Indore',
  countryFlag: '🇮🇳',
  email: 'mohdfaizqureshi.official+portfolio@gmail.com',
  linkedInUrl: 'https://www.linkedin.com/in/mohd-faiz-qureshi-441242207/',
  githubUrl: 'https://github.com/FaizQureshi-09',
  resumeTagline:
    'Building Java and Python backend systems, automating AWS infrastructure, and shipping GenAI-powered tooling.',
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

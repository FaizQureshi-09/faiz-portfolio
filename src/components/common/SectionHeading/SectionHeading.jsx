import { AnimatedSection } from '../AnimatedSection/AnimatedSection';
import './SectionHeading.css';

/**
 * Standardized heading used at the top of every page section: a small
 * uppercase eyebrow label, the section title, and an optional supporting
 * subtitle. Keeps heading typography and spacing consistent site-wide.
 *
 * @param {object} props
 * @param {string} props.eyebrow - short uppercase label above the title
 * @param {string} props.title - main section heading text
 * @param {string} [props.subtitle] - optional supporting description
 */
export function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <AnimatedSection className="section-heading">
      <span className="section-heading__eyebrow">{eyebrow}</span>
      <h2 className="section-heading__title">{title}</h2>
      {subtitle ? <p className="section-heading__subtitle">{subtitle}</p> : null}
    </AnimatedSection>
  );
}

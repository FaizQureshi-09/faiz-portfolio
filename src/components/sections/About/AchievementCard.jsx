import { resolveIcon } from '../../../utils/iconMap';
import { AnimatedSection } from '../../common/AnimatedSection/AnimatedSection';

/**
 * Card summarizing a single key achievement with an icon badge,
 * title and short description.
 *
 * @param {object} props
 * @param {string} props.iconKey - key resolved to an icon component
 * @param {string} props.title - achievement title
 * @param {string} props.description - short supporting description
 * @param {number} props.delay - stagger delay in seconds for scroll-reveal
 */
export function AchievementCard({ iconKey, title, description, delay }) {
  const Icon = resolveIcon(iconKey);

  return (
    <AnimatedSection className="achievement-card" delay={delay}>
      <div className="achievement-card__icon">
        <Icon aria-hidden="true" />
      </div>
      <h3 className="achievement-card__title">{title}</h3>
      <p className="achievement-card__description">{description}</p>
    </AnimatedSection>
  );
}

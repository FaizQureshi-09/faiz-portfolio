import { resolveIcon } from '../../../utils/iconMap';
import { AnimatedSection } from '../../common/AnimatedSection/AnimatedSection';

/**
 * Card describing a single leadership/additional responsibility role
 * with an icon badge, title and bullet list of duties.
 *
 * @param {object} props
 * @param {string} props.iconKey - key resolved to an icon component
 * @param {string} props.title - role title
 * @param {string[]} props.bullets - responsibilities under this role
 * @param {'left'|'right'} props.direction - scroll-reveal slide direction
 */
export function LeadershipCard({ iconKey, title, bullets, direction }) {
  const Icon = resolveIcon(iconKey);

  return (
    <AnimatedSection className="leadership-card" direction={direction}>
      <div className="leadership-card__icon">
        <Icon aria-hidden="true" />
      </div>
      <h3 className="leadership-card__title">{title}</h3>
      <ul className="leadership-card__bullets">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </AnimatedSection>
  );
}

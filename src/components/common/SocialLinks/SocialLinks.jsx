import { resolveIcon } from '../../../utils/iconMap';
import './SocialLinks.css';

/**
 * Renders a row of social/profile icon links (email, LinkedIn, GitHub).
 * Shared between the Hero section, navbar and footer so brand icons
 * stay visually consistent wherever they appear.
 *
 * @param {object} props
 * @param {Array<{id: string, label: string, href: string, iconKey: string}>} props.links
 * @param {'sm'|'md'|'lg'} [props.size] - icon button size variant
 */
export function SocialLinks({ links, size = 'md' }) {
  return (
    <ul className={`social-links social-links--${size}`}>
      {links.map((link) => {
        const Icon = resolveIcon(link.iconKey);
        return (
          <li key={link.id}>
            <a
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer noopener"
              aria-label={link.label}
              className="social-links__item"
              title={link.label}
            >
              <Icon aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

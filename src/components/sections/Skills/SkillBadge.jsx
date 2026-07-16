import { resolveIcon } from '../../../utils/iconMap';

/**
 * Small pill badge displaying a single technology's icon and name.
 *
 * @param {object} props
 * @param {string} props.name - technology display name
 * @param {string} props.iconKey - key resolved to an icon component
 */
export function SkillBadge({ name, iconKey }) {
  const Icon = resolveIcon(iconKey);

  return (
    <li className="skill-badge">
      <Icon aria-hidden="true" className="skill-badge__icon" />
      <span>{name}</span>
    </li>
  );
}

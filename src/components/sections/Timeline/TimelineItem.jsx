import { motion } from 'framer-motion';
import { timelineTypeMeta } from './timelineTypeMeta';

/**
 * Single card in the vertical career timeline: duration badge, title,
 * organization, description, responsibility bullets and a tech-stack
 * chip row. Slides in from alternating sides as it scrolls into view.
 *
 * @param {object} props
 * @param {object} props.entry - one item from `timelineData.js`
 * @param {'left'|'right'} props.side - which side of the spine this card sits on
 */
export function TimelineItem({ entry, side }) {
  const { icon: TypeIcon, modifierClass, label } = timelineTypeMeta[entry.type];
  const slideOffset = side === 'left' ? -48 : 48;

  return (
    <motion.li
      className={`timeline-item ${modifierClass} timeline-item--${side}`}
      initial={{ opacity: 0, x: slideOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="timeline-item__node">
        <TypeIcon aria-hidden="true" />
      </span>

      <div className="timeline-item__card">
        <span className="timeline-item__type-label">{label}</span>
        <span className="timeline-item__duration">{entry.duration}</span>
        <h3 className="timeline-item__title">{entry.title}</h3>
        <p className="timeline-item__organization">{entry.organization}</p>
        <p className="timeline-item__description">{entry.description}</p>

        {entry.bullets.length > 0 ? (
          <ul className="timeline-item__bullets">
            {entry.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}

        {entry.techStack.length > 0 ? (
          <ul className="timeline-item__tech-stack">
            {entry.techStack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </motion.li>
  );
}

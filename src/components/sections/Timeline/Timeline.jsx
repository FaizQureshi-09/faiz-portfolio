import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { timelineEntries } from '../../../data/timelineData';
import { SectionHeading } from '../../common/SectionHeading/SectionHeading';
import { TimelineItem } from './TimelineItem';
import './Timeline.css';

/**
 * Chronological "journey" section rendering education, the umbrella
 * professional role, and every project as an alternating vertical
 * timeline. A central spine fills in progressively as the user scrolls,
 * tied to scroll progress via Framer Motion's `useScroll`.
 */
export function Timeline() {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.8', 'end 0.6'],
  });

  return (
    <section id="journey" className="section section-alt timeline-section">
      <div className="container">
        <SectionHeading
          eyebrow="My journey"
          title="Experience & Projects Timeline"
          subtitle="From university to production AI agents — every stop along the way."
        />

        <div className="timeline" ref={timelineRef}>
          <div className="timeline__spine">
            <motion.div className="timeline__spine-fill" style={{ scaleY: scrollYProgress }} />
          </div>

          <ul className="timeline__list">
            {timelineEntries.map((entry, index) => (
              <TimelineItem key={entry.id} entry={entry} side={index % 2 === 0 ? 'left' : 'right'} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { leadershipRoles } from '../../../data/leadershipData';
import { SectionHeading } from '../../common/SectionHeading/SectionHeading';
import { LeadershipCard } from './LeadershipCard';
import './Leadership.css';

/**
 * Leadership & additional responsibilities section, covering people
 * management duties and POSH committee membership from the resume.
 */
export function Leadership() {
  return (
    <section id="leadership" className="section section-alt leadership">
      <div className="container">
        <SectionHeading
          eyebrow="Beyond the code"
          title="Leadership & Responsibilities"
          subtitle="Where I contribute outside of day-to-day engineering delivery."
        />

        <div className="leadership__grid">
          {leadershipRoles.map((role, index) => (
            <LeadershipCard
              key={role.id}
              iconKey={role.iconKey}
              title={role.title}
              bullets={role.bullets}
              direction={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

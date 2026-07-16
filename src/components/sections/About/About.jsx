import { keyAchievements } from '../../../data/achievementsData';
import { highlightStats, professionalSummary } from '../../../data/summaryData';
import { SectionHeading } from '../../common/SectionHeading/SectionHeading';
import { AnimatedSection } from '../../common/AnimatedSection/AnimatedSection';
import { AchievementCard } from './AchievementCard';
import { StatCard } from './StatCard';
import './About.css';

/**
 * About section combining the resume's professional summary, headline
 * statistics, and key achievements into a single scroll-revealed block.
 */
export function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <SectionHeading
          eyebrow="Get to know me"
          title="About Me"
          subtitle="A quick snapshot of who I am and what I've delivered so far."
        />

        <AnimatedSection as="p" className="about__summary">
          {professionalSummary}
        </AnimatedSection>

        <div className="about__stats">
          {highlightStats.map((stat) => (
            <StatCard key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>

        <h3 className="about__achievements-title">Key Achievements</h3>
        <div className="about__achievements-grid">
          {keyAchievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              iconKey={achievement.iconKey}
              title={achievement.title}
              description={achievement.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

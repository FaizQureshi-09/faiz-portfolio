import { AnimatedSection } from '../../common/AnimatedSection/AnimatedSection';
import { SkillBadge } from './SkillBadge';

/**
 * Renders one skill category (e.g. "Cloud & DevOps") as a titled card
 * containing a wrapped row of `SkillBadge` pills.
 *
 * @param {object} props
 * @param {string} props.title - category heading
 * @param {Array<{name: string, iconKey: string}>} props.skills - skills in this category
 * @param {number} props.delay - stagger delay in seconds for scroll-reveal
 */
export function SkillCategoryGroup({ title, skills, delay }) {
  return (
    <AnimatedSection className="skill-category" delay={delay}>
      <h3 className="skill-category__title">{title}</h3>
      <ul className="skill-category__list">
        {skills.map((skill) => (
          <SkillBadge key={skill.name} name={skill.name} iconKey={skill.iconKey} />
        ))}
      </ul>
    </AnimatedSection>
  );
}

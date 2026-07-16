import { skillCategories } from '../../../data/skillsData';
import { SectionHeading } from '../../common/SectionHeading/SectionHeading';
import { SkillCategoryGroup } from './SkillCategoryGroup';
import './Skills.css';

/**
 * Technologies section rendering every skill category from the resume
 * as a grid of titled badge groups.
 */
export function Skills() {
  return (
    <section id="skills" className="section skills">
      <div className="container">
        <SectionHeading
          eyebrow="What I work with"
          title="Skills & Technologies"
          subtitle="Languages, frameworks and cloud tooling I use to ship production systems."
        />

        <div className="skills__grid">
          {skillCategories.map((category, index) => (
            <SkillCategoryGroup
              key={category.id}
              title={category.title}
              skills={category.skills}
              delay={index * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

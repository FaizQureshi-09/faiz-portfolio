import { FaBriefcase, FaCode, FaGraduationCap } from 'react-icons/fa';

/**
 * Presentation metadata (icon + accent modifier class) keyed by
 * timeline entry `type`. Kept separate from the timeline data itself
 * so the data file stays free of UI concerns.
 */
export const timelineTypeMeta = {
  education: { icon: FaGraduationCap, modifierClass: 'timeline-item--education', label: 'Education' },
  experience: { icon: FaBriefcase, modifierClass: 'timeline-item--experience', label: 'Experience' },
  project: { icon: FaCode, modifierClass: 'timeline-item--project', label: 'Project' },
};

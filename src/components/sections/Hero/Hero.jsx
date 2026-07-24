import { motion } from 'framer-motion';
import { FaArrowDown, FaMapMarkerAlt } from 'react-icons/fa';
import profilePhoto from '../../../assets/images/profile-photo.jpeg';
import { personalInfo, socialLinks } from '../../../data/personalInfo';
import { useTypewriter } from '../../../hooks/useTypewriter';
import { SocialLinks } from '../../common/SocialLinks/SocialLinks';
import './Hero.css';

/** Rotating role phrases typed out beneath the name in the hero banner. */
const ROLE_PHRASES = [
  'Backend & DevOps Engineer',
  'Cloud Automation Specialist',
  'Microservices Architect',
  'GenAI Workflow Builder',
];

/**
 * Landing/introduction section: profile photo, animated role typewriter,
 * location, social links and calls-to-action. Renders first, above the fold.
 */
export function Hero() {
  const typedRole = useTypewriter(ROLE_PHRASES);

  return (
    <section id="home" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <motion.div
          className="hero__photo-wrapper"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__photo-ring">
            <img
              src={profilePhoto}
              alt={`Portrait of ${personalInfo.fullName}`}
              className="hero__photo"
            />
          </div>
        </motion.div>

        <motion.p
          className="hero__greeting"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Hi, my name is
        </motion.p>

        <motion.h1
          className="hero__name"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <span className="gradient-text">{personalInfo.fullName}</span>
        </motion.h1>

        <motion.h2
          className="hero__role"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {typedRole}
          <span className="hero__cursor" aria-hidden="true" />
        </motion.h2>

        <motion.p
          className="hero__tagline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          {personalInfo.resumeTagline}
        </motion.p>

        <motion.p
          className="hero__location"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <FaMapMarkerAlt aria-hidden="true" />
          <span>
            {personalInfo.location},{' '}
            <span className="location-flag" role="img" aria-label="India">
              {personalInfo.countryFlag}
            </span>
          </span>{' '}
          &middot;{' '}
          {personalInfo.totalExperience} experience
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <SocialLinks links={socialLinks} size="lg" />
        </motion.div>

        <motion.a
          href="#about"
          className="hero__scroll-indicator"
          aria-label="Scroll to About section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <FaArrowDown />
        </motion.a>
      </div>
    </section>
  );
}

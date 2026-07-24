import { FaMapMarkerAlt } from 'react-icons/fa';
import { personalInfo, socialLinks } from '../../../data/personalInfo';
import { SectionHeading } from '../../common/SectionHeading/SectionHeading';
import { AnimatedSection } from '../../common/AnimatedSection/AnimatedSection';
import { SocialLinks } from '../../common/SocialLinks/SocialLinks';
import { ContactForm } from './ContactForm';
import './Contact.css';

/**
 * Contact section: a short call-to-action, direct contact details and
 * social links on one side, and the contact form on the other.
 */
export function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <SectionHeading
          eyebrow="Let's connect"
          title="Get In Touch"
          subtitle="Have an opportunity, question, or just want to say hi? My inbox is open."
        />

        <div className="contact__grid">
          <AnimatedSection className="contact__info" direction="left">
            <p className="contact__info-text">
              I&apos;m always happy to talk about backend systems, cloud architecture, or
              interesting DevOps problems. Reach out directly or drop a message using the form.
            </p>

            <ul className="contact__info-list">
              <li>
                <FaMapMarkerAlt aria-hidden="true" />
                <span>
                  {personalInfo.location},{' '}
                  <span className="location-flag" role="img" aria-label="India">
                    {personalInfo.countryFlag}
                  </span>
                </span>
              </li>
            </ul>

            <SocialLinks links={socialLinks} size="md" />
          </AnimatedSection>

          <AnimatedSection className="contact__form-wrapper" direction="right">
            <ContactForm />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

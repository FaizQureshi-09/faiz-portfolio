import { personalInfo, socialLinks } from '../../../data/personalInfo';
import { SocialLinks } from '../../common/SocialLinks/SocialLinks';
import './Footer.css';

/**
 * Site footer with brand recap, social links, and a dynamically
 * generated copyright year.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__brand">{personalInfo.fullName}</p>
        <SocialLinks links={socialLinks} size="sm" />
        <p className="footer__copyright">
          &copy; {currentYear} {personalInfo.fullName}. Built with React &amp; a lot of coffee.
        </p>
      </div>
    </footer>
  );
}

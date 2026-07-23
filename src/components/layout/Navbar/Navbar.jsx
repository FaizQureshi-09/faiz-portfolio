import { useState } from 'react';
import { FaBars, FaMoon, FaSun, FaTimes } from 'react-icons/fa';
import { navigationLinks } from '../../../data/navigationData';
import { useActiveSection } from '../../../hooks/useActiveSection';
import { useScrollPosition } from '../../../hooks/useScrollPosition';
import { useTheme } from '../../../hooks/useTheme';
import './Navbar.css';

/**
 * Fixed top navigation bar with scroll-spy active-link highlighting,
 * a condensed/blurred background once the page scrolls past the hero,
 * and a slide-in mobile menu for small viewports.
 */
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollPosition(40);
  const activeSectionId = useActiveSection(navigationLinks.map((link) => link.id));
  const { theme, toggleTheme } = useTheme();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#home" className="navbar__brand" onClick={closeMobileMenu}>
          <span className="navbar__brand-mark">FQ</span>
          <span className="navbar__brand-text">Faiz Qureshi</span>
        </a>

        <nav
          className={`navbar__nav ${isMobileMenuOpen ? 'navbar__nav--open' : ''}`}
          aria-label="Primary"
        >
          <ul className="navbar__links">
            {navigationLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`navbar__link ${
                    activeSectionId === link.id ? 'navbar__link--active' : ''
                  }`}
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>

          <button
            type="button"
            className="navbar__toggle"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((previous) => !previous)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
}

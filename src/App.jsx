import { Navbar } from './components/layout/Navbar/Navbar';
import { Footer } from './components/layout/Footer/Footer';
import { Hero } from './components/sections/Hero/Hero';
import { About } from './components/sections/About/About';
import { Timeline } from './components/sections/Timeline/Timeline';
import { Skills } from './components/sections/Skills/Skills';
import { Leadership } from './components/sections/Leadership/Leadership';
import { Contact } from './components/sections/Contact/Contact';

/**
 * Application root: composes the fixed navbar, every page section in
 * resume order, and the footer into the single-page portfolio layout.
 */
function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Skills />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;

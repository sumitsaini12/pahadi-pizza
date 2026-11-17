import Header from '../components/Header';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import About from '../components/About';
import Menu from '../components/Menu';
import Chef from '../components/Chef';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import GoogleReviews from '../components/GoogleReviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import StickyCTA from '../components/StickyCTA';
import MotionProvider from '../components/motion/MotionProvider';

export default function Home() {
  return (
    <MotionProvider>
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-cream focus:text-ink focus:px-4 focus:py-2 focus:rounded-lg"
      >
        Skip to menu
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Menu />
        <Chef />
        <Gallery />
        <Reviews />
        <GoogleReviews />
        <Contact />
      </main>
      <Footer />
      <StickyCTA />
    </MotionProvider>
  );
}

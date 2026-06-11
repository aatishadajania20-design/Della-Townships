import SmoothScroll from '../components/motion/SmoothScroll';
import ExperienceLayer from '../components/ExperienceLayer';
import ShockMoment from '../components/motion/ShockMoment';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import Statement from '../components/Statement';
import AudienceSplit from '../components/AudienceSplit';
import ThemesGrid from '../components/ThemesGrid';
import FounderBlock from '../components/FounderBlock';
import ProofStrip from '../components/ProofStrip';
import PressLogos from '../components/PressLogos';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <SmoothScroll>
      <ExperienceLayer />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Statement />
        <AudienceSplit />
        <ShockMoment />
        <ThemesGrid />
        <FounderBlock />
        <ProofStrip />
        <PressLogos />
      </main>
      <Footer />
    </SmoothScroll>
  );
}

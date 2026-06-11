import { Composition } from 'remotion';
import FutureTimeline, { TIMELINE_FRAMES } from './compositions/FutureTimeline';
import HeroSequence from './compositions/HeroSequence';
import FounderSequence from './compositions/FounderSequence';
import ProofTransition from './compositions/ProofTransition';
import ThemeTransition from './compositions/ThemeTransition';

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="FutureTimeline"
        component={FutureTimeline}
        durationInFrames={TIMELINE_FRAMES}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="HeroSequence"
        component={HeroSequence}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FounderSequence"
        component={FounderSequence}
        durationInFrames={360}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ProofTransition"
        component={ProofTransition}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ThemeTransition"
        component={ThemeTransition}
        durationInFrames={420}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
}

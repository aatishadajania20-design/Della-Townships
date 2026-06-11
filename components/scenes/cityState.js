// Shared mutable state for the persistent city scene.
// Written by scroll triggers, read every frame by the 3D scene — no React re-renders.
const cityState = {
  hero: 0, // hero pinned sequence progress
  draw: 0, // statement: survey lines become roads
  districts: 0, // audience: district grid fills in
  rise: 0, // shock moment: the city rises
  complete: 0, // proof: city solidifies
  final: 0, // footer: full vision, beacon
  journey: 0, // overall page progress, drives the camera
  px: 0, // pointer x in [-1, 1]
  py: 0, // pointer y in [-1, 1]
};

export default cityState;

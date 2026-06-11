# DELLA TOWNSHIPS — PROJECT CONTEXT (V2 — CINEMATIC FLAGSHIP)

## Project Goal

A flagship luxury digital experience for Della Townships.
Reference bar: Aman, Apple, Active Theory, Tesla launch pages, Awwwards SOTD.
Architecture must scale into a complete website.

## Build Mode

Ship working code. No explanations, progress logs, TODOs, placeholders, or partial implementations.
Read files only when required. Never scan the project. Never reread loaded files.
Edit in place. Never regenerate working components. Prefer targeted edits.

## Stack (Non-Negotiable)

Next.js 15 (App Router) · React 19 · GSAP + ScrollTrigger · Lenis · React Three Fiber · Three.js · Remotion · CSS Modules.
No Tailwind, no UI frameworks, no component libraries.

## Architecture

app/            → layout.jsx (metadata, fonts, JSON-LD), page.jsx, globals.css, icon.svg
components/     → Navbar, Hero, Ticker, Statement, AudienceSplit, ThemesGrid, FounderBlock, ProofStrip, PressLogos, Footer (+ .module.css each)
components/scenes/ → TownshipScene (canvas root), CameraRig, GoldLandscape (terrain ring), RoadNetwork (self-drawing masterplan), CityBlocks (rising towers + beacon), AtmosphereLayer, HeroParticles, cityState.js (shared mutable scroll state)
components/motion/ → SmoothScroll (Lenis provider + useScrollTo), Reveal, SectionTransition (data-depth parallax), ScrollSequence (pinned scrub, --seq CSS var), ShockMoment (full-screen city-rise beat)
components/ExperienceLayer.jsx → persistent fixed z-0 canvas behind the whole site + scroll triggers writing cityState + pointer vars (--px/--py)
remotion/       → index.jsx, Root.jsx, compositions/{HeroSequence, FounderSequence, ProofTransition, ThemeTransition}
public/         → static assets; rendered Remotion videos go to public/video/

## Conventions

- All animated components are 'use client'. gsap.registerPlugin guarded by typeof window.
- 3D and Remotion Player load via next/dynamic ssr:false, mounted only when in view (IntersectionObserver), wrapped in Suspense.
- Section depth layers use data-depth attributes consumed by SectionTransition.
- Pinned sequences expose progress via --seq CSS var (0→1) and onProgress callback.
- Respect prefers-reduced-motion: animations no-op to visible state.
- Images: next/image, Unsplash remote pattern, descriptive alt text.

## Brand

bg #0A0A0A · dark section #111111 · gold #C9A84C · gold light #E8D5A3 · white #F5F5F0
Display: Cormorant Garamond (next/font). Body: Inter (next/font).
Hero: clamp(64px,6vw,96px). Section titles: clamp(40px,4vw,64px).

## Design Direction

Luxury through restraint. Premium through space. Motion through storytelling.
2.5D: every section has foreground/midground/background layers — perspective, depth blur, atmosphere, floating planes, subtle parallax.
No SaaS/startup/dashboard aesthetics. No card-heavy layouts. No spinning logos, no gaming scenes, no excessive particles.

## Scroll Narrative — "The Birth of a City"

ONE persistent 3D city behind the entire site, constructed by scroll (cityState keys):
hero → survey lines · statement (draw) → roads draw themselves · audience (districts) → district grid · ShockMoment (rise, pinned between Audience and Themes) → skyline erupts full-screen · proof (complete) → city solidifies · footer (final) → beacon, finished vision.
CameraRig flies a keyframed path over the whole journey (cityState.journey) with pointer drift.
Sections sit at z-1 with translucent backgrounds so the city reads through.
Founder is pinned 130%: scroll scrubs the Remotion FutureTimeline (2025→2050) via Player.seekTo — the user controls the future. Quote lines scrub in.
Themes cards are 3D-tilt architectural exhibits (plot frames, cursor spotlight, District labels).
Proof: GSAP count-ups, readable in under 2 seconds.

## Copy (Locked)

Hero: "We Don't Build Cities. We Design How India Lives." / Sub: "Asset-light. Theme-based. Longevity-led."
Statement: "The world's great cities didn't happen by accident. Neither do ours."
Founder quote: "I don't follow the future. I design it." — Jimmy Mistry, Founder & CMD, Della Group.
Tagline: "Redefining How India Lives, Works & Dreams."
CTAs: Landowner "Partner With Us" · Member "Become a Member" · Investor "View Investment Thesis" · Hero "Explore Townships" (scrolls to Audience Split).

## Proof Numbers

4,288 Acres · ₹46,480 Cr GDV · 12 Projects · 10 Cities. Existing proof: Della Resorts, Lonavala.

## CRO

One primary CTA per section. No competing CTAs. Proof numbers immediately scannable.

## SEO

Server-rendered metadata in app/layout.jsx: title, description, Open Graph, Twitter Cards, canonical.
JSON-LD: Organization + WebPage. Descriptive alt text everywhere.

## Performance

Target 90+ Lighthouse. Lazy-load heavy experiences (dynamic imports, Suspense, in-view mounting).
Canvas dpr capped at 1.6. Optimized Unsplash URLs through next/image. Avoid unnecessary re-renders.

## Success Test

Would a luxury hospitality CMO assume screenshots cost ₹50L+? If not: improve typography, depth, motion, composition, storytelling before shipping.

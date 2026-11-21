---
inclusion: always
---

# For Racheal — Project Steering

## Identity
Cinematic, scroll-driven 3D birthday website. A personal gift from Abubakar to Racheal on 21 November 2026. Tone: premium, intimate, handcrafted — like a short film, never like a template.

## Design Tokens
| Token | Value |
|-------|-------|
| Background from | `#0B0814` (midnight indigo) |
| Background to | `#1A1030` (plum) |
| Primary accent (gold) | `#E8C987` (champagne gold) |
| Secondary accent (rose) | `#F2B8C6` (soft rose) |
| Text | `#FBF4E9` (warm ivory) |
| Display font | Fraunces (or Cormorant Garamond) |
| Body/UI font | Manrope |
| Handwritten accent | Caveat — ONLY for "padi" and tiny annotations |

## Atmosphere
- Candlelit and golden
- Subtle film grain overlay
- Soft vignette on all full-screen sections
- Gentle bloom on 3D canvas (disable on mobile/low-power)

## Motion Rules
- Easing: ease-out, slow and weighty — never bouncy
- Respect `prefers-reduced-motion`: calm, static-but-beautiful fallback
- Lenis smooth scroll + GSAP ScrollTrigger throughout
- Camera: slow orbit, mouse-parallax on desktop, device-tilt on mobile

## Quality Rules
- Mobile-first: design at 390px, then 768, 1024, 1440+
- Use `100dvh` and `env(safe-area-inset-*)` for insets
- Touch targets ≥ 44px
- WCAG AA contrast on all text
- Semantic HTML (`<main>`, `<section>`, `<h1>`–`<h3>`, `aria-label`)
- Visible focus states (gold outline)
- Keyboard navigation throughout
- Key copy as real DOM text (not baked into canvas)
- Error boundary around every `<Canvas>`
- WebGL-unavailable fallback: rich CSS gradient version of the story
- Clamp DPR to [1, 2]; reduce particles and disable postprocessing on mobile/low-power
- `<meta name="robots" content="noindex, nofollow">`
- Page title: "For Racheal 🎂"
- Favicon: gold candle inline SVG

## Content Rule
ALL copy lives in `src/content.ts`. Never hardcode strings inside components.

## No External Assets Rule
No external 3D model downloads. All 3D is procedural: Three.js geometry, shaders, particle systems.

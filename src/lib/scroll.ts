import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.innerWidth < 768;

export function initScroll(): Lenis {
  const mobile = isMobileDevice();

  lenis = new Lenis({
    // Shorter duration on mobile so scroll feels snappy, not sluggish
    duration: mobile ? 0.8 : 1.3,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: !mobile, // native scroll on mobile is faster
  });

  // Wire Lenis into GSAP ticker
  const ticker = (time: number) => { lenis?.raf(time * 1000); };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  // Sync ScrollTrigger with Lenis
  lenis.on("scroll", ScrollTrigger.update);

  return lenis;
}

export function destroyScroll() {
  lenis?.destroy();
  lenis = null;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export { ScrollTrigger, gsap };

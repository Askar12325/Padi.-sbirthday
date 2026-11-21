// Ambient declarations for packages without bundled TypeScript types

declare module "gsap" {
  export interface TweenVars {
    [key: string]: unknown;
    duration?: number;
    delay?: number;
    ease?: string;
    onUpdate?: () => void;
    onComplete?: () => void;
    scrollTrigger?: Record<string, unknown>;
    opacity?: number;
    y?: number;
    x?: number;
    scaleX?: number;
    scaleY?: number;
  }

  export interface GSAPTween {
    kill(): void;
    pause(): this;
    play(): this;
  }

  export interface GSAPTickerCallback {
    (time: number, deltaTime: number, frame: number): void;
  }

  export interface GSAP {
    to(target: unknown, vars: TweenVars): GSAPTween;
    from(target: unknown, vars: TweenVars): GSAPTween;
    fromTo(target: unknown, fromVars: TweenVars, toVars: TweenVars): GSAPTween;
    set(target: unknown, vars: TweenVars): void;
    registerPlugin(...args: unknown[]): void;
    ticker: {
      add(callback: GSAPTickerCallback): void;
      remove(callback: GSAPTickerCallback): void;
      lagSmoothing(threshold: number, adjustedLag?: number): void;
    };
  }

  const gsap: GSAP;
  export { gsap };
  export default gsap;
}

declare module "gsap/ScrollTrigger" {
  export interface ScrollTriggerInstance {
    kill(): void;
    vars: { trigger?: Element | string | null };
    progress: number;
    direction: number;
  }

  export interface ScrollTriggerVars {
    trigger?: Element | string | null;
    start?: string | number;
    end?: string | number;
    scrub?: boolean | number;
    pin?: boolean | string | Element;
    toggleActions?: string;
    onUpdate?: (self: ScrollTriggerInstance) => void;
    onEnter?: (self: ScrollTriggerInstance) => void;
    markers?: boolean;
    [key: string]: unknown;
  }

  export interface ScrollTriggerStatic {
    create(vars: ScrollTriggerVars): ScrollTriggerInstance;
    update(): void;
    getAll(): ScrollTriggerInstance[];
    refresh(): void;
  }

  export const ScrollTrigger: ScrollTriggerStatic;
  export default ScrollTrigger;
}

declare module "lenis" {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: "vertical" | "horizontal";
    smoothWheel?: boolean;
    wrapper?: HTMLElement | Window;
    content?: HTMLElement;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
    off(event: string, callback: (...args: unknown[]) => void): void;
    destroy(): void;
    scroll: number;
    limit: number;
    isScrolling: boolean;
  }
}

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export function Counter({ value, suffix = "", label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced || !ref.current || !numRef.current) {
      setDisplayed(value);
      return;
    }

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => setDisplayed(Math.round(obj.val)),
      scrollTrigger: {
        trigger: ref.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    return () => { tween.kill(); };
  }, [value, reduced]);

  return (
    <div
      ref={ref}
      className="glass-card gold-border p-6 flex flex-col gap-2 text-center"
      aria-label={`${value}${suffix} ${label}`}
    >
      <span
        ref={numRef}
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem, 6vw, 4rem)",
          fontWeight: 300,
          color: "var(--gold)",
          lineHeight: 1,
        }}
      >
        {displayed.toLocaleString()}
        {suffix}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.85rem",
          color: "var(--ivory)",
          opacity: 0.65,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

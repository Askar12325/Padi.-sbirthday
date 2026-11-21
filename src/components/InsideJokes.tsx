import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { insideJokes } from "../content";
import { Reveal } from "./Reveal";
import { useReducedMotion } from "../hooks/useReducedMotion";

// ── Single flip card ───────────────────────────────────────────
function FlipCard({ phrase, explanation, active, onActivate, index }: {
  phrase: string;
  explanation: string;
  active: boolean;
  onActivate: () => void;
  index: number;
}) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const flipped = reduced ? active : (active || hovered);

  const cardStyle: CSSProperties = {
    width: "clamp(220px, 72vw, 320px)",
    height: "clamp(260px, 50vw, 380px)",
    flexShrink: 0,
    perspective: "900px",
    cursor: "pointer",
    scrollSnapAlign: "center",
  };

  const innerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    transition: reduced ? "none" : "transform 0.65s cubic-bezier(0.16,1,0.3,1)",
    borderRadius: "16px",
  };

  const faceBase: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "16px",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(1.25rem, 4vw, 2rem)",
    gap: "1rem",
    overflow: "hidden",
  };

  const frontStyle: CSSProperties = {
    ...faceBase,
    background: "linear-gradient(145deg, #1a1030 0%, #130c24 60%, #1a1030 100%)",
    border: "1px solid rgba(232,201,135,0.25)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,201,135,0.08) inset",
  };

  const backStyle: CSSProperties = {
    ...faceBase,
    background: "linear-gradient(145deg, #130c24 0%, #1f1540 60%, #130c24 100%)",
    border: "1px solid rgba(242,184,198,0.3)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
    transform: "rotateY(180deg)",
  };

  return (
    <div
      style={cardStyle}
      onClick={onActivate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(); }}}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={`${phrase} — tap to reveal`}
    >
      <div style={innerStyle}>
        {/* Front */}
        <div style={frontStyle}>
          {/* Gold ornament */}
          <span aria-hidden="true" style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            color: "var(--gold)",
            opacity: 0.5,
            letterSpacing: "0.3em",
          }}>
            ✦ ✦ ✦
          </span>

          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
            color: "var(--ivory)",
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}>
            {phrase}
          </p>

          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.65rem",
            color: "var(--gold)",
            opacity: 0.4,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginTop: "0.5rem",
          }}>
            {reduced ? "press to reveal" : "hover · tap"}
          </span>

          {/* Decorative arc */}
          <div aria-hidden="true" style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "50%",
            background: "radial-gradient(ellipse at 50% 100%, rgba(232,201,135,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* Back */}
        <div style={backStyle}>
          <span aria-hidden="true" style={{
            fontSize: "1.6rem",
            filter: "drop-shadow(0 0 8px rgba(242,184,198,0.4))",
          }}>
            🌸
          </span>
          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(0.95rem, 2.5vw, 1.15rem)",
            color: "var(--ivory)",
            textAlign: "center",
            lineHeight: 1.65,
            opacity: 0.9,
          }}>
            {explanation}
          </p>
          <div aria-hidden="true" style={{
            width: "40px", height: "1px",
            background: "linear-gradient(90deg, transparent, var(--rose), transparent)",
            marginTop: "0.5rem",
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export function InsideJokes() {
  const [active, setActive] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef(0);
  const reduced = useReducedMotion();
  const total = insideJokes.cards.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  // Scroll carousel to current
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[current] as HTMLElement | undefined;
    if (!card) return;
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const scrollTarget = track.scrollLeft + (cardRect.left - trackRect.left) - (trackRect.width - cardRect.width) / 2;
    track.scrollTo({ left: scrollTarget, behavior: reduced ? "auto" : "smooth" });
  }, [current, reduced]);

  const onTouchStart = (e: React.TouchEvent) => { dragStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - dragStart.current;
    if (Math.abs(delta) > 44) { delta < 0 ? next() : prev(); }
  };

  // Keyboard navigation when section is in view
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const section = document.getElementById("jokes");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  const toggleActive = (i: number) => {
    setActive((a) => (a === i ? null : i));
    setCurrent(i);
  };

  return (
    <section
      id="jokes"
      aria-label="Things only we understand"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #0b0814 0%, #130c24 50%, #0b0814 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(3rem, 8vh, 6rem) 0 clamp(3rem, 6vh, 5rem)",
        overflow: "hidden",
      }}
    >
      {/* Heading */}
      <div style={{ padding: "0 clamp(1.5rem, 6vw, 5rem)", marginBottom: "clamp(2rem, 5vh, 4rem)", textAlign: "center" }}>
        <Reveal>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1.6rem, 4vw, 3.2rem)", color: "var(--ivory)",
            letterSpacing: "-0.02em",
          }}>
            {insideJokes.heading}
          </h2>
        </Reveal>
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          display: "flex",
          gap: "clamp(0.75rem, 2vw, 1.25rem)",
          padding: "1.5rem clamp(1.5rem, 10vw, 6rem)",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          width: "100%",
          alignItems: "center",
          cursor: "grab",
        } as CSSProperties}
      >
        {insideJokes.cards.map((card, i) => (
          <FlipCard
            key={i}
            phrase={card.phrase}
            explanation={card.explanation}
            active={active === i}
            onActivate={() => toggleActive(i)}
            index={i}
          />
        ))}
        {/* Spacer to allow last card to center */}
        <div style={{ flexShrink: 0, width: "1px" }} />
      </div>

      {/* Nav row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "1.5rem" }}>
        <button
          onClick={prev}
          aria-label="Previous card"
          style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: "rgba(11,8,20,0.5)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(232,201,135,0.2)",
            color: "var(--gold)", fontSize: "1.4rem",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >‹</button>

        {/* Progress dots */}
        <div role="tablist" aria-label="Card navigation" style={{ display: "flex", gap: "0.4rem" }}>
          {insideJokes.cards.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Card ${i + 1}`}
              onClick={() => { setCurrent(i); setActive(null); }}
              style={{
                width: i === current ? "20px" : "7px",
                height: "7px",
                borderRadius: "4px",
                background: i === current ? "var(--gold)" : "rgba(232,201,135,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.4s var(--ease-out-expo), background 0.3s",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          aria-label="Next card"
          style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: "rgba(11,8,20,0.5)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(232,201,135,0.2)",
            color: "var(--gold)", fontSize: "1.4rem",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >›</button>
      </div>
    </section>
  );
}

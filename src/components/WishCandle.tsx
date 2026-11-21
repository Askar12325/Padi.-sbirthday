import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wish } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Reveal } from "./Reveal";

// ── Confetti particle ──────────────────────────────────────────
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  shape: "rect" | "circle";
}

const COLORS = ["#e8c987", "#f2b8c6", "#fbf4e9", "#c9a96e", "#f0d090"];

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 10,
    y: 55,
    vx: (Math.random() - 0.5) * 14,
    vy: -12 - Math.random() * 12,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 4 + Math.random() * 7,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 10,
    opacity: 1,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));
}

// ── Lantern ────────────────────────────────────────────────────
function Lantern({ x, delay }: { x: string; delay: number }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ y: "50%", opacity: 0, scale: 0.6 }}
      animate={{ y: "-120%", opacity: [0, 0.9, 0.9, 0], scale: [0.6, 1, 1, 0.8] }}
      transition={{ duration: 4 + Math.random() * 2, delay, ease: "easeOut" }}
      style={{
        position: "absolute",
        bottom: "40%",
        left: x,
        width: "clamp(28px, 5vw, 44px)",
        height: "clamp(36px, 6.5vw, 56px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2px",
        pointerEvents: "none",
      }}
    >
      {/* Lantern body */}
      <div style={{
        width: "100%",
        flex: 1,
        borderRadius: "4px 4px 8px 8px",
        background: "radial-gradient(ellipse at 40% 40%, rgba(255,220,80,0.9), rgba(232,160,40,0.7))",
        boxShadow: "0 0 20px rgba(255,200,50,0.6), 0 0 40px rgba(255,160,30,0.3)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "15%", right: "15%", bottom: "15%",
          borderRadius: "2px",
          background: "rgba(255,240,160,0.4)",
        }} />
      </div>
      {/* String */}
      <div style={{ width: "1px", height: "8px", background: "rgba(232,201,135,0.5)" }} />
    </motion.div>
  );
}

// ── Candle flame SVG ───────────────────────────────────────────
function Flame({ lit, onClick, onKeyDown, reduced }: {
  lit: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  reduced: boolean;
}) {
  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label={lit ? "Blow out the candle" : "Candle blown out"}
      aria-pressed={!lit}
      style={{
        background: "none", border: "none", cursor: lit ? "pointer" : "default",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 0, padding: "1rem",
      }}
    >
      {/* Candle */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Flame */}
        <AnimatePresence>
          {lit && (
            <motion.div
              key="flame"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1, scale: reduced ? 1 : [1, 1.08, 0.95, 1.05, 1],
                x: reduced ? 0 : [0, 1.5, -1, 2, 0],
              }}
              exit={{ opacity: 0, scale: 0.1, y: -10, transition: { duration: 0.4 } }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ marginBottom: "-4px", zIndex: 2 }}
            >
              <svg width="36" height="56" viewBox="0 0 36 56" fill="none" aria-hidden="true">
                <ellipse cx="18" cy="52" rx="6" ry="3" fill="rgba(255,180,50,0.3)" />
                <path d="M18 2 C18 2, 32 18, 30 34 C28 46, 22 54, 18 54 C14 54, 8 46, 6 34 C4 18, 18 2, 18 2Z"
                  fill="url(#flameGrad)" />
                <path d="M18 16 C18 16, 25 26, 24 36 C23 42, 20 48, 18 48 C16 48, 13 42, 12 36 C11 26, 18 16, 18 16Z"
                  fill="rgba(255,255,200,0.6)" />
                <defs>
                  <radialGradient id="flameGrad" cx="40%" cy="70%">
                    <stop offset="0%" stopColor="#ffe066" />
                    <stop offset="50%" stopColor="#ff9900" />
                    <stop offset="100%" stopColor="#ff4400" stopOpacity="0.8" />
                  </radialGradient>
                </defs>
              </svg>
              {/* Glow */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: "60px", height: "60px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,200,50,0.3) 0%, transparent 70%)",
                animation: reduced ? "none" : "flameGlow 1.5s ease-in-out infinite alternate",
                pointerEvents: "none",
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smoke */}
        <AnimatePresence>
          {!lit && (
            <motion.div
              key="smoke"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.6, 0.6, 0], y: [0, -30, -60, -90], scaleX: [1, 1.5, 2, 2.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                bottom: "100%",
                width: "3px", height: "40px",
                background: "linear-gradient(to top, rgba(200,200,200,0.5), transparent)",
                borderRadius: "2px",
                transformOrigin: "bottom",
              }}
            />
          )}
        </AnimatePresence>

        {/* Wick */}
        <div style={{
          width: "2px", height: "12px",
          background: lit ? "#3a2010" : "#555",
          borderRadius: "1px",
          zIndex: 1,
        }} />

        {/* Candle body */}
        <div style={{
          width: "clamp(32px, 6vw, 48px)",
          height: "clamp(80px, 14vw, 120px)",
          borderRadius: "4px 4px 6px 6px",
          background: "linear-gradient(to bottom, #f5e6d0, #ecdcc4)",
          boxShadow: lit
            ? "0 0 30px rgba(255,180,50,0.3), 2px 0 8px rgba(0,0,0,0.3)"
            : "2px 0 8px rgba(0,0,0,0.3)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Wax drip */}
          <div style={{
            position: "absolute", top: 0, left: "30%",
            width: "6px", height: "clamp(10px, 3vw, 18px)",
            background: "rgba(255,255,255,0.4)",
            borderRadius: "0 0 4px 4px",
          }} />
          {/* Warm glow on body when lit */}
          {lit && (
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "40%",
              background: "linear-gradient(to bottom, rgba(255,180,50,0.15), transparent)",
              pointerEvents: "none",
            }} />
          )}
        </div>

        {/* Candle plate */}
        <div style={{
          width: "clamp(60px, 10vw, 80px)",
          height: "clamp(8px, 1.5vw, 12px)",
          borderRadius: "50%",
          background: "linear-gradient(to bottom, #e8dcc8, #d4c8b0)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          marginTop: "2px",
        }} />
      </div>

      {/* Keyboard hint */}
      {lit && (
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "0.65rem",
          color: "var(--gold)", opacity: 0.4,
          letterSpacing: "0.1em", marginTop: "1rem",
          display: "none", // shown via media query below
        }} className="keyboard-hint">
          {wish.keyboardHint}
        </p>
      )}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────
export function WishCandle() {
  const [lit, setLit]       = useState(true);
  const [blown, setBlown]   = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lanterns, setLanterns]   = useState(false);
  const animRef = useRef<number>(0);
  const reduced = useReducedMotion();

  const blowOut = useCallback(() => {
    if (!lit) return;
    setLit(false);

    // Haptics
    if ("vibrate" in navigator) navigator.vibrate([40, 30, 60]);

    setTimeout(() => {
      setBlown(true);
      setLanterns(true);
      if (!reduced) {
        const pts = makeParticles(60);
        setParticles(pts);
      }
    }, 600);
  }, [lit, reduced]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blowOut(); }
  }, [blowOut]);

  // Animate confetti
  useEffect(() => {
    if (particles.length === 0) return;
    let frame = 0;
    const animate = () => {
      frame++;
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.06,
            y: p.y + p.vy * 0.06 + frame * 0.012,
            vy: p.vy + 0.18,
            rotation: p.rotation + p.rotSpeed,
            opacity: Math.max(0, p.opacity - 0.008),
          }))
          .filter((p) => p.opacity > 0.02)
      );
      if (frame < 220) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [particles.length > 0]);

  return (
    <section
      id="wish"
      aria-label="Make a wish"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #060410 0%, #0b0814 40%, #060410 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(3rem, 8vh, 6rem) clamp(1.5rem, 6vw, 5rem)",
      }}
    >
      {/* Stars bg */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 20%, rgba(232,201,135,0.04) 0%, transparent 60%)",
      }} />

      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 6vh, 4rem)", position: "relative", zIndex: 2 }}>
        <Reveal>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1.6rem, 4vw, 3.2rem)", color: "var(--ivory)",
            letterSpacing: "-0.02em", marginBottom: "0.75rem",
          }}>
            {wish.heading}
          </h2>
        </Reveal>
        {lit && (
          <Reveal delay={0.15}>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "0.8rem",
              color: "var(--gold)", opacity: 0.55, letterSpacing: "0.1em",
            }}>
              {wish.hint}
            </p>
          </Reveal>
        )}
      </div>

      {/* Candle */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Flame lit={lit} onClick={blowOut} onKeyDown={handleKeyDown} reduced={reduced} />
      </div>

      {/* After-text */}
      <AnimatePresence>
        {blown && (
          <motion.p
            key="aftertext"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1rem, 2.8vw, 1.5rem)",
              color: "var(--gold)",
              textAlign: "center",
              maxWidth: "480px",
              lineHeight: 1.5,
              marginTop: "2rem",
              position: "relative",
              zIndex: 2,
            }}
          >
            {wish.afterText}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Confetti canvas */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}>
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.shape === "rect" ? `${p.size}px` : `${p.size * 0.8}px`,
              height: p.shape === "rect" ? `${p.size * 0.5}px` : `${p.size * 0.8}px`,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              background: p.color,
              opacity: p.opacity,
              transform: `rotate(${p.rotation}deg)`,
              boxShadow: `0 0 4px ${p.color}`,
            }}
          />
        ))}
      </div>

      {/* Lanterns */}
      <AnimatePresence>
        {lanterns && (
          <>
            {["18%", "32%", "50%", "65%", "78%"].map((x, i) => (
              <Lantern key={i} x={x} delay={i * 0.3} />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Flame glow keyframe */}
      <style>{`
        @keyframes flameGlow {
          0%   { opacity: 0.6; transform: translate(-50%,-50%) scale(0.9); }
          100% { opacity: 1;   transform: translate(-50%,-50%) scale(1.15); }
        }
        @media (hover: none) {
          .keyboard-hint { display: none !important; }
        }
        @media (hover: hover) {
          .keyboard-hint { display: block !important; }
        }
      `}</style>
    </section>
  );
}

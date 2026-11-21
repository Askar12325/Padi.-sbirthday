import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gate } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface GateProps {
  onBegin: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  muted: boolean;
  onToggleMute: () => void;
}

export function Gate({ onBegin, audioRef, muted, onToggleMute }: GateProps) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Simulate elegant loader (1.8s)
    const t1 = setTimeout(() => setLoading(false), 1800);
    const t2 = setTimeout(() => setVisible(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (visible) btnRef.current?.focus();
  }, [visible]);

  const handleBegin = useCallback(() => {
    // Try to start audio (muted by default — user chose to begin)
    if (audioRef.current && !muted) {
      audioRef.current.play().catch(() => {/* fail silently */});
    }
    onBegin();
  }, [onBegin, audioRef, muted]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome gate"
      className="full-screen vignette flex flex-col items-center justify-center safe-top safe-bottom"
      style={{
        background: "linear-gradient(160deg, #0b0814 0%, #1a1030 60%, #0d0618 100%)",
        zIndex: 100,
        position: "fixed",
        inset: 0,
      }}
    >
      {/* Mute toggle — always visible */}
      <button
        onClick={onToggleMute}
        aria-label={gate.audioLabel}
        style={{
          position: "absolute",
          top: "max(1.5rem, env(safe-area-inset-top, 1.5rem))",
          right: "1.5rem",
          background: "none",
          border: "1px solid rgba(232,201,135,0.25)",
          borderRadius: "50%",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--gold)",
          fontSize: "1.1rem",
          transition: "border-color 0.3s",
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <LoaderFlame />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main gate content */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="content"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-10 px-6"
          >
            {/* Candle decoration */}
            <div aria-hidden="true" style={{ fontSize: "2.5rem", lineHeight: 1 }}>🕯️</div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(2rem, 7vw, 4.5rem)",
                color: "var(--ivory)",
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              {gate.intro}
            </h1>

            {/* Hairline divider */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "clamp(60px, 20vw, 160px)",
                height: "1px",
                background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
                transformOrigin: "center",
              }}
            />

            {/* Begin button */}
            <button
              ref={btnRef}
              onClick={handleBegin}
              aria-label="Begin the birthday experience"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.85rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--bg-from)",
                background: "var(--gold)",
                border: "none",
                borderRadius: "100px",
                padding: "0.9rem 3rem",
                minWidth: "160px",
                minHeight: "52px",
                cursor: "pointer",
                transition: "transform 0.3s var(--ease-out-quart), box-shadow 0.3s",
                boxShadow: "0 0 30px rgba(232,201,135,0.25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.04)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 50px rgba(232,201,135,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(232,201,135,0.25)";
              }}
            >
              {gate.cta}
            </button>

            {/* Subtle note */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--ivory)",
                opacity: 0.3,
                letterSpacing: "0.1em",
              }}
            >
              21 · 11 · 2026
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoaderFlame() {
  return (
    <div aria-label="Loading…" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <div
        style={{
          width: "2px",
          height: "40px",
          background: "linear-gradient(to top, var(--gold), transparent)",
          animation: "flicker 1s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes flicker {
          0%   { opacity: 0.4; transform: scaleX(1) scaleY(1); }
          100% { opacity: 1;   transform: scaleX(1.3) scaleY(1.05); }
        }
      `}</style>
      <span style={{ fontFamily: "var(--font-hand)", color: "var(--gold)", fontSize: "1.1rem", opacity: 0.6 }}>
        a moment…
      </span>
    </div>
  );
}

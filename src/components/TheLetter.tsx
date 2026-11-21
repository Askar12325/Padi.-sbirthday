import { useState, useEffect, useRef, useCallback, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { letter, footer } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";

// ── Typewriter hook ────────────────────────────────────────────
function useTypewriter(text: string, active: boolean, speed = 28): string {
  const [displayed, setDisplayed] = useState("");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) { setDisplayed(""); return; }
    if (reduced) { setDisplayed(text); return; }
    setDisplayed("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed, reduced]);

  return displayed;
}

// ── Wax seal ───────────────────────────────────────────────────
function WaxSeal({ onOpen, opened }: { onOpen: () => void; opened: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      onClick={onOpen}
      aria-label={letter.sealLabel}
      disabled={opened}
      whileHover={opened ? {} : { scale: 1.06 }}
      whileTap={opened ? {} : { scale: 0.95 }}
      style={{
        background: "none",
        border: "none",
        cursor: opened ? "default" : "pointer",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <svg
        width="clamp(72px,14vw,100px)"
        height="clamp(72px,14vw,100px)"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="44" fill="#8b1a1a" />
        <circle cx="50" cy="50" r="44" fill="url(#sealGrad)" opacity="0.6" />
        {/* Decorative stamp lines */}
        <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,220,180,0.3)" strokeWidth="1" />
        {/* Monogram */}
        <text
          x="50" y="57"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="22"
          fontStyle="italic"
          fill="rgba(255,230,180,0.9)"
        >
          R
        </text>
        {/* Petal details */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <ellipse
            key={deg}
            cx={50 + Math.cos((deg * Math.PI) / 180) * 38}
            cy={50 + Math.sin((deg * Math.PI) / 180) * 38}
            rx="4" ry="2.5"
            transform={`rotate(${deg} ${50 + Math.cos((deg * Math.PI) / 180) * 38} ${50 + Math.sin((deg * Math.PI) / 180) * 38})`}
            fill="rgba(200,100,100,0.7)"
          />
        ))}
        <defs>
          <radialGradient id="sealGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="rgba(255,160,120,0.6)" />
            <stop offset="100%" stopColor="rgba(80,0,0,0)" />
          </radialGradient>
        </defs>
      </svg>
      {!opened && (
        <span style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.7rem",
          color: "var(--gold)",
          opacity: 0.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}>
          tap to open
        </span>
      )}
    </motion.button>
  );
}

// ── Paper letter ───────────────────────────────────────────────
function PaperLetter({ visible }: { visible: boolean }) {
  const [currentPara, setCurrentPara] = useState(0);
  const [done, setDone]               = useState(false);
  const reduced = useReducedMotion();

  // Advance to next paragraph when typewriter finishes
  const advanceParagraph = useCallback((index: number) => {
    if (index < letter.paragraphs.length - 1) {
      setTimeout(() => setCurrentPara(index + 1), 400);
    } else {
      setDone(true);
    }
  }, []);

  // For reduced motion — show all at once
  useEffect(() => {
    if (visible && reduced) {
      setCurrentPara(letter.paragraphs.length - 1);
      setDone(true);
    }
  }, [visible, reduced]);

  return (
    <motion.div
      initial={{ opacity: 0, rotateX: -90, transformOrigin: "top center" }}
      animate={visible ? { opacity: 1, rotateX: 0 } : {}}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: "min(680px, 90vw)",
        background: "linear-gradient(160deg, #fdf6e8 0%, #f8edd4 40%, #f5e8cc 100%)",
        borderRadius: "4px",
        padding: "clamp(2rem, 6vw, 4rem) clamp(1.75rem, 5vw, 3.5rem)",
        boxShadow: "0 20px 80px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)",
        position: "relative",
        transformStyle: "preserve-3d",
        // Paper texture lines
        backgroundImage: `
          linear-gradient(160deg, #fdf6e8 0%, #f8edd4 40%, #f5e8cc 100%),
          repeating-linear-gradient(transparent, transparent 27px, rgba(180,160,120,0.12) 27px, rgba(180,160,120,0.12) 28px)
        `,
        backgroundBlendMode: "normal",
      }}
    >
      {/* Fold shadow line at top */}
      <div style={{
        position: "absolute",
        top: 0, left: "10%", right: "10%",
        height: "2px",
        background: "rgba(180,150,100,0.15)",
        borderRadius: "1px",
      }} />

      {/* Letter content */}
      <div style={{
        fontFamily: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
        fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)",
        lineHeight: 1.9,
        color: "#2a1f0e",
        display: "flex",
        flexDirection: "column",
        gap: "1.1em",
      }}>
        {letter.paragraphs.map((para, i) => (
          <ParagraphLine
            key={i}
            text={para}
            active={visible && i <= currentPara}
            onComplete={() => advanceParagraph(i)}
            index={i}
            isLast={i === letter.paragraphs.length - 1}
            isSignature={i >= letter.paragraphs.length - 2}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ParagraphLine({ text, active, onComplete, index, isLast, isSignature }: {
  text: string;
  active: boolean;
  onComplete: () => void;
  index: number;
  isLast: boolean;
  isSignature: boolean;
}) {
  const reduced = useReducedMotion();
  const displayed = useTypewriter(text, active, isSignature ? 50 : 22);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!doneRef.current && displayed === text && text.length > 0) {
      doneRef.current = true;
      onComplete();
    }
  }, [displayed, text, onComplete]);

  if (!active && !reduced) return null;

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{
        margin: 0,
        fontStyle: index === 0 || isSignature ? "normal" : "normal",
        fontWeight: index === 0 ? 600 : index === 1 ? 500 : 400,
        color: index === 0 ? "#1a0f04" : isLast ? "#8b1a1a" : "#2a1f0e",
        marginTop: index === 0 ? 0 : index === 1 ? "0.5em" : 0,
        marginBottom: (index === 0 || index === letter.paragraphs.length - 3) ? "0.5em" : 0,
        fontFamily: isSignature
          ? "'Caveat', cursive"
          : "'Fraunces', 'Cormorant Garamond', Georgia, serif",
        fontSize: isSignature
          ? "clamp(1.2rem, 3vw, 1.5rem)"
          : index === 0
            ? "clamp(1.1rem, 2.5vw, 1.3rem)"
            : index === 1
              ? "clamp(1.05rem, 2.3vw, 1.2rem)"
              : "clamp(0.9rem, 2vw, 1.05rem)",
        lineHeight: isSignature ? 1.4 : 1.9,
      }}
    >
      {displayed}
      {/* Blinking cursor while typing */}
      {active && displayed.length > 0 && displayed.length < text.length && (
        <span aria-hidden="true" style={{
          display: "inline-block",
          width: "2px", height: "1.1em",
          background: "#2a1f0e",
          marginLeft: "2px",
          verticalAlign: "text-bottom",
          animation: "blink 0.7s step-end infinite",
        }} />
      )}
    </motion.p>
  );
}

// ── Footer ─────────────────────────────────────────────────────
function Footer() {
  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{
      width: "100%",
      padding: "clamp(3rem, 8vh, 6rem) clamp(1.5rem, 6vw, 5rem) clamp(2rem, 6vh, 4rem)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1.5rem",
      borderTop: "1px solid rgba(232,201,135,0.1)",
    }}>
      {/* Gold ornament */}
      <div aria-hidden="true" style={{
        width: "60px", height: "1px",
        background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
      }} />

      <p style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.8rem",
        color: "var(--ivory)",
        opacity: 0.4,
        letterSpacing: "0.08em",
        textAlign: "center",
      }}>
        {footer.credit} · {footer.date}
      </p>

      <button
        onClick={handleReplay}
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: "0.8rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--gold)",
          background: "transparent",
          border: "1px solid rgba(232,201,135,0.3)",
          borderRadius: "100px",
          padding: "0.75rem 2rem",
          minHeight: "44px",
          cursor: "pointer",
          transition: "border-color 0.3s, background 0.3s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(232,201,135,0.08)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(232,201,135,0.6)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(232,201,135,0.3)";
        }}
      >
        {footer.replay}
      </button>

      {/* Heart */}
      <p aria-hidden="true" style={{ fontSize: "1.2rem", opacity: 0.5 }}>❤️</p>
    </footer>
  );
}

// ── Main component ─────────────────────────────────────────────
export function TheLetter() {
  const [opened, setOpened]       = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const handleOpen = useCallback(() => {
    if (opened) return;
    setOpened(true);
    if ("vibrate" in navigator) navigator.vibrate(30);
    setTimeout(() => setLetterVisible(true), reduced ? 0 : 500);
  }, [opened, reduced]);

  // Trigger when section enters view (also allow keyboard)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          // Auto-hint focus — do NOT auto-open
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="letter"
      aria-label="A letter for Racheal"
      ref={sectionRef}
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #060410 0%, #0b0814 30%, #0d0918 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "clamp(4rem, 10vh, 8rem) clamp(1.5rem, 6vw, 5rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 30%, rgba(232,201,135,0.04) 0%, transparent 60%)",
      }} />

      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 6vh, 4rem)", position: "relative", zIndex: 2 }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            color: "var(--gold)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "1rem",
            opacity: 0.6,
          }}
        >
          ✦ a letter ✦
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.6rem, 4vw, 3.2rem)",
            color: "var(--ivory)",
            letterSpacing: "-0.02em",
          }}
        >
          For you, Racheal.
        </motion.h2>
      </div>

      {/* Seal or letter */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <AnimatePresence>
          {!opened && (
            <motion.div
              key="seal"
              exit={{ opacity: 0, scale: 0.5, y: -20, transition: { duration: 0.5 } }}
            >
              <WaxSeal onOpen={handleOpen} opened={opened} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {letterVisible && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <PaperLetter visible={letterVisible} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ width: "100%", marginTop: "clamp(3rem, 8vh, 6rem)" }}>
        <Footer />
      </div>

      {/* Blink keyframe */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { initScroll } from "./lib/scroll";
import { useWebGL } from "./hooks/useWebGL";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { Gate } from "./components/Gate";
import { NoWebGLFallback } from "./components/NoWebGLFallback";
import "./styles/globals.css";

// Lazy-load heavy 3D sections so the gate loads fast
const HeroSection    = lazy(() => import("./components/HeroSection").then((m) => ({ default: m.HeroSection })));
const StarsSection   = lazy(() => import("./components/StarsSection").then((m) => ({ default: m.StarsSection })));
const NumbersSection = lazy(() => import("./components/NumbersSection").then((m) => ({ default: m.NumbersSection })));
const BakerSection   = lazy(() => import("./components/BakerSection").then((m) => ({ default: m.BakerSection })));
const VideoGallery   = lazy(() => import("./components/VideoGallery").then((m) => ({ default: m.VideoGallery })));
const PhotoMoment    = lazy(() => import("./components/PhotoMoment").then((m) => ({ default: m.PhotoMoment })));
const InsideJokes    = lazy(() => import("./components/InsideJokes").then((m) => ({ default: m.InsideJokes })));
const WishCandle     = lazy(() => import("./components/WishCandle").then((m) => ({ default: m.WishCandle })));
const TheLetter      = lazy(() => import("./components/TheLetter").then((m) => ({ default: m.TheLetter })));

function SectionFallback() {
  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0b0814",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        width: "2px", height: "40px",
        background: "linear-gradient(to top, var(--gold), transparent)",
        animation: "loadPulse 1.2s ease-in-out infinite alternate",
      }} />
    </div>
  );
}

export default function App() {
  const [begun, setBegun]     = useState(false);
  const [muted, setMuted]     = useState(true);
  const audioRef              = useRef<HTMLAudioElement | null>(null);
  const webGL                 = useWebGL();

  // Init Lenis once the experience begins
  useEffect(() => {
    if (!begun) return;
    const lenis = initScroll();
    return () => { lenis.destroy(); };
  }, [begun]);

  // Audio setup — fail silently if file missing
  useEffect(() => {
    const audio = new Audio();
    audio.src = "/audio/theme.mp3";
    audio.loop = true;
    audio.volume = 0.35;
    audio.muted = true;
    audio.preload = "none"; // only load on user action
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const handleToggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
        if (!next && begun) {
          audioRef.current.play().catch(() => {});
        } else {
          audioRef.current.pause();
        }
      }
      return next;
    });
  };

  const handleBegin = () => {
    setBegun(true);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  return (
    <>
      {/* Gate overlay */}
      <AnimatePresence>
        {!begun && (
          <motion.div
            key="gate"
            exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }}
            style={{ position: "fixed", inset: 0, zIndex: 200 }}
          >
            <Gate
              onBegin={handleBegin}
              audioRef={audioRef}
              muted={muted}
              onToggleMute={handleToggleMute}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main experience */}
      {begun && (
        <>
          {/* Persistent mute toggle */}
          <button
            onClick={handleToggleMute}
            aria-label={muted ? "Unmute ambient music" : "Mute ambient music"}
            style={{
              position: "fixed",
              top: "max(1rem, env(safe-area-inset-top, 1rem))",
              right: "max(1rem, env(safe-area-inset-right, 1rem))",
              zIndex: 50,
              background: "rgba(11,8,20,0.65)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(232,201,135,0.2)",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--gold)",
              fontSize: "1rem",
              transition: "border-color 0.3s",
              touchAction: "manipulation",
            }}
          >
            {muted ? "🔇" : "🔊"}
          </button>

          {/* Skip to content */}
          <a
            href="#hero"
            style={{
              position: "fixed",
              top: "1rem",
              left: "1rem",
              zIndex: 100,
              padding: "0.5rem 1rem",
              background: "var(--gold)",
              color: "#0b0814",
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              borderRadius: "4px",
              textDecoration: "none",
              opacity: 0,
              pointerEvents: "none",
            }}
            onFocus={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.pointerEvents = "auto"; }}
            onBlur={(e)  => { e.currentTarget.style.opacity = "0"; e.currentTarget.style.pointerEvents = "none"; }}
          >
            Skip to content
          </a>

          <main id="main" tabIndex={-1}>
            <Suspense fallback={<SectionFallback />}>
              {webGL ? (
                <>
                  <HeroSection />
                  <StarsSection />
                  <NumbersSection />
                  <BakerSection />
                  <VideoGallery />
                  <PhotoMoment />
                  <InsideJokes />
                  <WishCandle />
                  <TheLetter />
                </>
              ) : (
                <>
                  <NoWebGLFallback />
                  <VideoGallery />
                  <PhotoMoment />
                  <InsideJokes />
                  <WishCandle />
                  <TheLetter />
                </>
              )}
            </Suspense>
          </main>
        </>
      )}

      <style>{`
        @keyframes loadPulse {
          0%   { opacity: 0.3; transform: scaleY(0.8); }
          100% { opacity: 1;   transform: scaleY(1.2); }
        }
      `}</style>
    </>
  );
}

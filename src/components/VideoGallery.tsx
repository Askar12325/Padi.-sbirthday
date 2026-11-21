import {
  useRef, useState, useEffect, useCallback, type CSSProperties,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { videos as videosContent } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Reveal } from "./Reveal";

// ── types ──────────────────────────────────────────────────────
interface VideoItem { src: string; caption: string; }

// ── helpers ────────────────────────────────────────────────────
function isMobile() {
  return window.innerWidth < 768;
}

// preload policy: active + next get "auto"; rest stay "metadata"
function preloadFor(index: number, active: number): "auto" | "metadata" {
  return index === active || index === (active + 1) % videosContent.items.length
    ? "auto" : "metadata";
}

// ── single video card ──────────────────────────────────────────
interface CardProps {
  item: VideoItem;
  index: number;
  active: number;
  total: number;
  onActivate: (i: number) => void;
  isMobileLayout: boolean;
  globalMuted: boolean;
  onUnmuteRequest: (i: number) => void;
  soundIndex: number | null;
}

function VideoCard({
  item, index, active, total, onActivate,
  isMobileLayout, globalMuted, onUnmuteRequest, soundIndex,
}: CardProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [ready, setReady]       = useState(false);
  const [blocked, setBlocked]   = useState(false);
  const [missing, setMissing]   = useState(false);
  const isActive  = index === active;
  const hasSoundOn = soundIndex === index;

  // IntersectionObserver — play/pause by visibility
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isActive) {
          el.play().catch(() => setBlocked(true));
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isActive]);

  // Play/pause when active state changes
  useEffect(() => {
    const el = videoRef.current;
    if (!el || missing) return;
    if (isActive) {
      el.play().catch(() => setBlocked(true));
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isActive, missing]);

  // Mute control — only the requested index has sound
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !(hasSoundOn && !globalMuted);
    }
  }, [hasSoundOn, globalMuted]);

  const handleSoundToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onUnmuteRequest(hasSoundOn ? -1 : index);
  };

  const handleError = useCallback(() => {
    setMissing(true);
  }, []);

  // ── 3-D arc transform for desktop ─────────────────────────────
  const offset = index - active;
  const absOffset = Math.abs(offset);

  const desktopStyle: CSSProperties = isMobileLayout ? {} : {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [
      `translateX(-50%)`,
      `translateY(-50%)`,
      `translateX(${offset * 260}px)`,
      `translateZ(${isActive ? 0 : -100 - absOffset * 35}px)`,
      `rotateY(${offset * -16}deg)`,
      `scale(${isActive ? 1 : Math.max(0.55, 0.78 - absOffset * 0.08)})`,
    ].join(" "),
    opacity: isActive ? 1 : absOffset >= 3 ? 0 : Math.max(0, 0.55 - absOffset * 0.18),
    transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.75s cubic-bezier(0.16,1,0.3,1)",
    zIndex: total - absOffset,
    cursor: isActive ? "default" : "pointer",
    pointerEvents: absOffset > 1 ? "none" : "auto",
    visibility: absOffset >= 3 ? "hidden" : "visible",
  };

  const cardInner: CSSProperties = {
    position: "relative",
    width: isMobileLayout ? "100%" : "clamp(220px, 22vw, 320px)",
    borderRadius: "16px",
    overflow: "hidden",
    border: `1px solid rgba(232,201,135,${isActive ? 0.45 : 0.18})`,
    boxShadow: isActive
      ? "0 0 60px rgba(232,201,135,0.18), 0 30px 80px rgba(0,0,0,0.6)"
      : "0 8px 30px rgba(0,0,0,0.4)",
    background: "#0d0920",
    transition: "border-color 0.6s, box-shadow 0.6s",
  };

  return (
    <div
      style={desktopStyle}
      onClick={() => !isActive && onActivate(index)}
      role={isActive ? undefined : "button"}
      aria-label={isActive ? undefined : `View ${item.caption}`}
      tabIndex={isActive ? -1 : 0}
      onKeyDown={(e) => { if (!isActive && (e.key === "Enter" || e.key === " ")) onActivate(index); }}
    >
      <div style={cardInner}>
        {/* Gold shimmer placeholder */}
        {!ready && !missing && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(135deg, #1a1030 0%, #2a1f40 40%, #1a1030 100%)",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(232,201,135,0.08) 50%, transparent 100%)",
              animation: "shimmer 1.8s ease-in-out infinite",
            }} />
          </div>
        )}

        {/* Missing file fallback */}
        {missing ? (
          <div style={{
            aspectRatio: "9/16",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "0.75rem", padding: "2rem",
            background: "linear-gradient(160deg, #130c24, #0d0618)",
          }}>
            <span style={{ fontSize: "2rem", opacity: 0.4 }}>🎬</span>
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "0.8rem",
              color: "var(--ivory)", opacity: 0.4, textAlign: "center",
            }}>
              Video coming soon
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={item.src}
            preload={preloadFor(index, active)}
            playsInline
            loop
            muted
            autoPlay={false}
            onCanPlay={() => setReady(true)}
            onError={handleError}
            style={{
              display: "block",
              width: "100%",
              aspectRatio: "9/16",
              objectFit: "cover",
              opacity: ready ? 1 : 0,
              transition: "opacity 0.6s",
            }}
          />
        )}

        {/* Vignette overlay */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* Letterbox bars */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "10%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
          pointerEvents: "none", zIndex: 2,
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "36%",
          background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* Autoplay-blocked overlay */}
        {blocked && !missing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              videoRef.current?.play().then(() => setBlocked(false)).catch(() => {});
            }}
            aria-label="Play video"
            style={{
              position: "absolute", inset: 0, zIndex: 4,
              background: "rgba(0,0,0,0.3)", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: "rgba(232,201,135,0.15)",
              border: "1px solid rgba(232,201,135,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "var(--gold)", fontSize: "1.2rem", marginLeft: "3px" }}>▶</span>
            </div>
          </button>
        )}

        {/* Caption + sound toggle — bottom of card */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "1rem 1rem 1.25rem",
          zIndex: 3, display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: "0.5rem",
        }}>
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
            color: "var(--ivory)", lineHeight: 1.4,
            textShadow: "0 1px 8px rgba(0,0,0,0.8)",
            flex: 1,
          }}>
            {item.caption}
          </p>
          {!missing && (
            <button
              onClick={handleSoundToggle}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleSoundToggle(e); }}
              aria-label={hasSoundOn ? "Mute video" : "Unmute video"}
              style={{
                flexShrink: 0,
                width: "36px", height: "36px", borderRadius: "50%",
                background: "rgba(11,8,20,0.6)",
                border: `1px solid rgba(232,201,135,${hasSoundOn ? 0.6 : 0.2})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: "0.85rem",
                color: hasSoundOn ? "var(--gold)" : "var(--ivory)",
                transition: "border-color 0.3s, color 0.3s",
              }}
            >
              {hasSoundOn && !globalMuted ? "🔊" : "🔇"}
            </button>
          )}
        </div>
      </div>

      {/* Faint reflection underneath (desktop only) */}
      {!isMobileLayout && isActive && (
        <div aria-hidden="true" style={{
          position: "absolute",
          top: "100%", left: 0, right: 0, height: "60px",
          background: "linear-gradient(to bottom, rgba(232,201,135,0.06), transparent)",
          transform: "scaleY(-0.4)",
          transformOrigin: "top",
          borderRadius: "0 0 16px 16px",
          filter: "blur(4px)",
          pointerEvents: "none",
        }} />
      )}
    </div>
  );
}

// ── main gallery component ─────────────────────────────────────
export function VideoGallery() {
  const [active, setActive]         = useState(0);
  const [soundIndex, setSoundIndex] = useState<number | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(isMobile);
  const containerRef  = useRef<HTMLDivElement>(null);
  const dragStart     = useRef(0);
  const reduced       = useReducedMotion();
  const total         = videosContent.items.length;

  // Responsive layout detection
  useEffect(() => {
    const ro = new ResizeObserver(() => setIsMobileLayout(isMobile()));
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const section = document.getElementById("videos");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Touch/drag for mobile
  const onTouchStart = (e: React.TouchEvent) => { dragStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - dragStart.current;
    if (Math.abs(delta) > 44) { delta < 0 ? next() : prev(); }
  };
  const onMouseDown  = (e: React.MouseEvent) => { dragStart.current = e.clientX; };
  const onMouseUp    = (e: React.MouseEvent) => {
    const delta = e.clientX - dragStart.current;
    if (!isMobileLayout && Math.abs(delta) > 44) { delta < 0 ? next() : prev(); }
  };

  const handleUnmuteRequest = (i: number) => {
    setSoundIndex(i === -1 ? null : i);
  };

  return (
    <section
      id="videos"
      aria-label="Racheal in motion — video gallery"
      style={{
        position: "relative",
        minHeight: "100dvh",
        background: "linear-gradient(180deg, #0b0814 0%, #0f0a20 50%, #0b0814 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        paddingBottom: "clamp(3rem, 8vh, 6rem)",
      }}
    >
      {/* Heading */}
      <div style={{
        position: "relative", zIndex: 5,
        padding: "clamp(3rem, 8vh, 6rem) clamp(1.5rem, 6vw, 5rem) clamp(1.5rem, 4vh, 3rem)",
        textAlign: "center", pointerEvents: "none",
      }}>
        <Reveal>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1.6rem, 4vw, 3.2rem)", color: "var(--ivory)",
            letterSpacing: "-0.02em", marginBottom: "0.6rem",
          }}>
            {videosContent.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(0.85rem, 2vw, 1rem)",
            color: "var(--ivory)", opacity: 0.45, letterSpacing: "0.06em",
          }}>
            {videosContent.subheading}
          </p>
        </Reveal>
      </div>

      {/* Gallery stage */}
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        style={{
          position: "relative",
          width: "100%",
          flex: "1 1 auto",
          display: "flex",
          justifyContent: "center",
          perspective: isMobileLayout ? "none" : "1200px",
          perspectiveOrigin: "50% 50%",
          ...(isMobileLayout ? {
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: reduced ? "auto" : "smooth",
            WebkitOverflowScrolling: "touch",
            gap: "1rem",
            padding: "0 clamp(1rem, 5vw, 2rem)",
            alignItems: "stretch",
          } : {
            alignItems: "center",
            height: "clamp(360px, 70vh, 580px)",
          }),
        }}
      >
        {isMobileLayout ? (
          // ── MOBILE: snap carousel ──────────────────────────────
          videosContent.items.map((item, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: "min(80vw, 320px)",
                scrollSnapAlign: "center",
              }}
            >
              <VideoCard
                item={item} index={i} active={active} total={total}
                onActivate={setActive}
                isMobileLayout
                globalMuted={soundIndex !== i}
                onUnmuteRequest={handleUnmuteRequest}
                soundIndex={soundIndex}
              />
            </div>
          ))
        ) : (
          // ── DESKTOP: 3-D arc ─────────────────────────────────
          videosContent.items.map((item, i) => (
            <VideoCard
              key={i}
              item={item} index={i} active={active} total={total}
              onActivate={setActive}
              isMobileLayout={false}
              globalMuted={soundIndex !== i}
              onUnmuteRequest={handleUnmuteRequest}
              soundIndex={soundIndex}
            />
          ))
        )}
      </div>

      {/* Prev / Next buttons */}
      {!isMobileLayout && (
        <div style={{
          position: "absolute",
          top: "50%", left: 0, right: 0,
          transform: "translateY(-50%)",
          display: "flex", justifyContent: "space-between",
          padding: "0 clamp(0.75rem, 2vw, 2rem)",
          pointerEvents: "none", zIndex: 10,
        }}>
          {[{ label: "Previous", fn: prev, char: "‹" }, { label: "Next", fn: next, char: "›" }].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.fn}
              aria-label={btn.label}
              style={{
                pointerEvents: "auto",
                width: "48px", height: "48px", borderRadius: "50%",
                background: "rgba(11,8,20,0.6)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(232,201,135,0.25)",
                color: "var(--gold)", fontSize: "1.6rem", lineHeight: 1,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color 0.3s, background 0.3s",
              }}
            >
              {btn.char}
            </button>
          ))}
        </div>
      )}

      {/* Progress dots */}
      <div
        role="tablist"
        aria-label="Video gallery navigation"
        style={{
          display: "flex", gap: "0.5rem", paddingTop: "1.5rem", zIndex: 5,
        }}
      >
        {videosContent.items.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to video ${i + 1}`}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === active ? "var(--gold)" : "rgba(232,201,135,0.25)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.4s var(--ease-out-expo), background 0.3s",
            }}
          />
        ))}
      </div>

      {/* Keyboard hint */}
      <p style={{
        fontFamily: "var(--font-body)", fontSize: "0.7rem",
        color: "var(--ivory)", opacity: 0.25,
        letterSpacing: "0.1em", paddingTop: "0.75rem", zIndex: 5,
      }}>
        {isMobileLayout ? "swipe to explore" : "← → arrow keys · click to focus"}
      </p>

      {/* CSS for shimmer */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}

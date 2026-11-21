import {
  useRef, useState, useEffect, useCallback, type CSSProperties,
} from "react";
import { videos as videosContent } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Reveal } from "./Reveal";

interface VideoItem { src: string; caption: string; }

function isMobileWidth() {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function preloadFor(index: number, active: number, total: number): "auto" | "metadata" {
  const next = (active + 1) % total;
  return index === active || index === next ? "auto" : "metadata";
}

// ── Single video card ──────────────────────────────────────────
interface CardProps {
  item: VideoItem;
  index: number;
  active: number;
  total: number;
  onActivate: (i: number) => void;
  isMobileLayout: boolean;
  soundIndex: number | null;
  onUnmuteRequest: (i: number) => void;
}

function VideoCard({ item, index, active, total, onActivate, isMobileLayout, soundIndex, onUnmuteRequest }: CardProps) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [ready, setReady]     = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [missing, setMissing] = useState(false);
  const isActive   = index === active;
  const hasSoundOn = soundIndex === index;

  // Update preload attribute reactively
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.preload = preloadFor(index, active, total);
    }
  }, [index, active, total]);

  // Play / pause
  useEffect(() => {
    const el = videoRef.current;
    if (!el || missing) return;
    if (isActive) {
      const p = el.play();
      if (p) p.catch(() => setBlocked(true));
    } else {
      el.pause();
    }
  }, [isActive, missing]);

  // Mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !(hasSoundOn);
    }
  }, [hasSoundOn]);

  const handleSoundToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    onUnmuteRequest(hasSoundOn ? -1 : index);
  };

  // Desktop arc transform
  const offset    = index - active;
  const absOffset = Math.abs(offset);

  const desktopStyle: CSSProperties = isMobileLayout ? {} : {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [
      "translateX(-50%)",
      "translateY(-50%)",
      `translateX(${offset * 260}px)`,
      `translateZ(${isActive ? 0 : -100 - absOffset * 35}px)`,
      `rotateY(${offset * -16}deg)`,
      `scale(${isActive ? 1 : Math.max(0.55, 0.78 - absOffset * 0.08)})`,
    ].join(" "),
    opacity: absOffset >= 3 ? 0 : isActive ? 1 : Math.max(0, 0.55 - absOffset * 0.18),
    visibility: absOffset >= 3 ? "hidden" : "visible",
    transition: "transform 0.75s cubic-bezier(0.16,1,0.3,1), opacity 0.75s cubic-bezier(0.16,1,0.3,1)",
    zIndex: total - absOffset,
    cursor: isActive ? "default" : "pointer",
    pointerEvents: absOffset > 1 ? "none" : "auto",
  };

  const cardWidth = isMobileLayout
    ? "min(72vw, 300px)"
    : "clamp(200px, 20vw, 300px)";

  return (
    <div
      style={desktopStyle}
      onClick={() => !isActive && !isMobileLayout && onActivate(index)}
    >
      <div style={{
        position: "relative",
        width: cardWidth,
        borderRadius: "14px",
        overflow: "hidden",
        border: `1px solid rgba(232,201,135,${isActive ? 0.45 : 0.18})`,
        boxShadow: isActive
          ? "0 0 50px rgba(232,201,135,0.15), 0 20px 60px rgba(0,0,0,0.6)"
          : "0 8px 30px rgba(0,0,0,0.4)",
        background: "#0d0920",
        transition: "border-color 0.5s, box-shadow 0.5s",
        flexShrink: 0,
      }}>
        {/* Shimmer placeholder */}
        {!ready && !missing && (
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(135deg, #1a1030 0%, #2a1f40 40%, #1a1030 100%)",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg, transparent 0%, rgba(232,201,135,0.08) 50%, transparent 100%)",
              animation: "shimmer 1.8s ease-in-out infinite",
            }} />
          </div>
        )}

        {missing ? (
          <div style={{
            aspectRatio: "9/16", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "0.75rem", padding: "2rem",
            background: "linear-gradient(160deg, #130c24, #0d0618)",
          }}>
            <span style={{ fontSize: "2rem", opacity: 0.35 }}>🎬</span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--ivory)", opacity: 0.35, textAlign: "center" }}>
              Video coming soon
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={item.src}
            preload={preloadFor(index, active, total)}
            playsInline
            loop
            muted
            autoPlay={false}
            onCanPlay={() => setReady(true)}
            onError={() => setMissing(true)}
            style={{
              display: "block", width: "100%",
              aspectRatio: "9/16", objectFit: "cover",
              opacity: ready ? 1 : 0, transition: "opacity 0.6s",
            }}
          />
        )}

        {/* Vignette */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none", zIndex: 2,
        }} />
        {/* Bottom fade */}
        <div aria-hidden="true" style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          pointerEvents: "none", zIndex: 2,
        }} />

        {/* Autoplay blocked */}
        {blocked && !missing && (
          <button
            onClick={(e) => { e.stopPropagation(); videoRef.current?.play().then(() => setBlocked(false)).catch(() => {}); }}
            aria-label="Play video"
            style={{
              position: "absolute", inset: 0, zIndex: 4,
              background: "rgba(0,0,0,0.25)", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <div style={{
              width: "50px", height: "50px", borderRadius: "50%",
              background: "rgba(232,201,135,0.15)",
              border: "1px solid rgba(232,201,135,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "var(--gold)", fontSize: "1.1rem", marginLeft: "3px" }}>▶</span>
            </div>
          </button>
        )}

        {/* Caption + sound */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0.9rem 0.9rem 1.1rem",
          zIndex: 3, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "0.5rem",
        }}>
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(0.78rem, 2vw, 0.9rem)", color: "var(--ivory)",
            lineHeight: 1.35, flex: 1, textShadow: "0 1px 6px rgba(0,0,0,0.9)",
          }}>
            {item.caption}
          </p>
          {!missing && (
            <button
              onClick={handleSoundToggle}
              aria-label={hasSoundOn ? "Mute" : "Unmute"}
              style={{
                flexShrink: 0, width: "36px", height: "36px", borderRadius: "50%",
                background: "rgba(11,8,20,0.65)",
                border: `1px solid rgba(232,201,135,${hasSoundOn ? 0.6 : 0.2})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: "0.8rem", color: hasSoundOn ? "var(--gold)" : "var(--ivory)",
              }}
            >
              {hasSoundOn ? "🔊" : "🔇"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main gallery ───────────────────────────────────────────────
export function VideoGallery() {
  const [active, setActive]         = useState(0);
  const [soundIndex, setSoundIndex] = useState<number | null>(null);
  const [isMobileLayout, setIsMobileLayout] = useState(isMobileWidth);
  const trackRef  = useRef<HTMLDivElement>(null);
  const reduced   = useReducedMotion();
  const total     = videosContent.items.length;

  // Track mobile/desktop
  useEffect(() => {
    const ro = new ResizeObserver(() => setIsMobileLayout(isMobileWidth()));
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const section = document.getElementById("videos");
      if (!section) return;
      const { top, bottom } = section.getBoundingClientRect();
      if (top > window.innerHeight || bottom < 0) return;
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Mobile: scroll track to active card
  useEffect(() => {
    if (!isMobileLayout || !trackRef.current) return;
    const track = trackRef.current;
    const card  = track.children[active] as HTMLElement | undefined;
    if (!card) return;
    const trackRect = track.getBoundingClientRect();
    const cardRect  = card.getBoundingClientRect();
    const offset    = track.scrollLeft + cardRect.left - trackRect.left - (trackRect.width - cardRect.width) / 2;
    track.scrollTo({ left: offset, behavior: reduced ? "auto" : "smooth" });
  }, [active, isMobileLayout, reduced]);

  // Mobile swipe detection (touch)
  const touchStart = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 50) { delta < 0 ? next() : prev(); }
  };

  const handleUnmute = (i: number) => setSoundIndex(i === -1 ? null : i);

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
        paddingBottom: "clamp(2.5rem, 6vh, 5rem)",
      }}
    >
      {/* Heading */}
      <div style={{
        position: "relative", zIndex: 5, textAlign: "center",
        padding: "clamp(2.5rem, 7vh, 5rem) clamp(1.5rem, 6vw, 5rem) clamp(1rem, 3vh, 2rem)",
        pointerEvents: "none",
      }}>
        <Reveal>
          <h2 style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(1.6rem, 4vw, 3.2rem)", color: "var(--ivory)",
            letterSpacing: "-0.02em", marginBottom: "0.5rem",
          }}>
            {videosContent.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(0.82rem, 2vw, 0.95rem)",
            color: "var(--ivory)", opacity: 0.42, letterSpacing: "0.06em",
          }}>
            {videosContent.subheading}
          </p>
        </Reveal>
      </div>

      {/* Stage */}
      {isMobileLayout ? (
        // ── MOBILE: controlled snap carousel ──────────────────
        <div
          ref={trackRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            display: "flex",
            gap: "clamp(0.75rem, 3vw, 1rem)",
            padding: "0.5rem clamp(10vw, 15vw, 20vw)",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            width: "100%",
            alignItems: "center",
          } as CSSProperties}
        >
          {videosContent.items.map((item, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                scrollSnapAlign: "center",
                flexShrink: 0,
                transition: "transform 0.4s ease, opacity 0.4s ease",
                transform: i === active ? "scale(1)" : "scale(0.88)",
                opacity: i === active ? 1 : 0.55,
                cursor: i === active ? "default" : "pointer",
              }}
            >
              <VideoCard
                item={item} index={i} active={active} total={total}
                onActivate={setActive}
                isMobileLayout
                soundIndex={soundIndex}
                onUnmuteRequest={handleUnmute}
              />
            </div>
          ))}
        </div>
      ) : (
        // ── DESKTOP: 3-D arc ──────────────────────────────────
        <div style={{
          position: "relative",
          width: "100%",
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          height: "clamp(380px, 68vh, 560px)",
          overflow: "hidden",
        }}>
          {videosContent.items.map((item, i) => (
            <VideoCard
              key={i}
              item={item} index={i} active={active} total={total}
              onActivate={setActive}
              isMobileLayout={false}
              soundIndex={soundIndex}
              onUnmuteRequest={handleUnmute}
            />
          ))}
        </div>
      )}

      {/* Prev / Next — both layouts */}
      <div style={{
        display: "flex", alignItems: "center", gap: "1rem",
        paddingTop: "1.25rem", zIndex: 5,
      }}>
        <button
          onClick={prev} aria-label="Previous video"
          style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: "rgba(11,8,20,0.6)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(232,201,135,0.25)",
            color: "var(--gold)", fontSize: "1.4rem",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >‹</button>

        {/* Progress dots */}
        <div role="tablist" aria-label="Video navigation" style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {videosContent.items.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Video ${i + 1}`}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "20px" : "7px",
                height: "7px",
                borderRadius: "4px",
                background: i === active ? "var(--gold)" : "rgba(232,201,135,0.25)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s",
                minWidth: "7px",
              }}
            />
          ))}
        </div>

        <button
          onClick={next} aria-label="Next video"
          style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: "rgba(11,8,20,0.6)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(232,201,135,0.25)",
            color: "var(--gold)", fontSize: "1.4rem",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >›</button>
      </div>

      <p style={{
        fontFamily: "var(--font-body)", fontSize: "0.68rem",
        color: "var(--ivory)", opacity: 0.22,
        letterSpacing: "0.1em", paddingTop: "0.6rem", zIndex: 5,
      }}>
        {isMobileLayout ? "swipe or tap" : "← → · click to focus"}
      </p>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

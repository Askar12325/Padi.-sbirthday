import { useState, useEffect } from "react";
import { CakeScene } from "../scenes/CakeScene";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { hero, photos } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";

/** Small circular portrait — only shown when photo loads successfully */
function HeroPortrait() {
  const photo  = photos[1];   // racheal-2 — used only in hero circle
  const [src, setSrc] = useState(photo.placeholder);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = photo.src;
    img.onload  = () => { setSrc(photo.src); setReady(true); };
    img.onerror = () => {
      if (photo.srcFallback) {
        const fb = new Image();
        fb.src = photo.srcFallback;
        fb.onload  = () => { setSrc(photo.srcFallback!); setReady(true); };
        fb.onerror = () => setFailed(true);
      } else {
        setFailed(true);
      }
    };
  }, [photo.src, photo.srcFallback, photo.placeholder]);

  if (failed) return null; // hide entirely if missing

  return (
    <div
      aria-hidden="true"  // decorative — alt is on the full image in baker section
      style={{
        width:  "clamp(44px, 10vw, 68px)",
        height: "clamp(44px, 10vw, 68px)",
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid rgba(232,201,135,0.6)",
        boxShadow: "0 0 20px rgba(232,201,135,0.25), 0 0 0 4px rgba(232,201,135,0.08)",
        flexShrink: 0,
        position: "relative",
        background: "#130c24",
        transition: "box-shadow 0.4s",
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: photo.focalPoint,
          display: "block",
          filter: ready ? "none" : "blur(8px) saturate(0.5)",
          transform: ready ? "scale(1)" : "scale(1.1)",
          transition: "filter 0.6s ease, transform 0.6s ease",
        }}
      />
    </div>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <Section
      id="hero"
      ariaLabel="Happy Birthday Racheal"
      className="overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0d0920 0%, #1a1030 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {/* 3D Cake — fills whole section, stays the star */}
      <CakeScene />

      {/* Text overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          padding: "0 clamp(1.5rem, 6vw, 5rem) clamp(2.5rem, 7vh, 5rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <Reveal y={30}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(2rem, 5.5vw, 5.5rem)",
              letterSpacing: "-0.02em",
              color: "var(--ivory)",
              textShadow: "0 2px 40px rgba(11,8,20,0.8)",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
            }}
          >
            {hero.headline}
          </h1>
        </Reveal>

        {/* "my padi" + small portrait side by side */}
        <Reveal delay={0.15} y={20}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}>
            <p
              style={{
                fontFamily: "var(--font-hand)",
                fontSize: "clamp(1.1rem, 3vw, 1.7rem)",
                color: "var(--rose)",
                lineHeight: 1,
              }}
            >
              {hero.padi}
            </p>
            {/* Portrait — tiny, never crowds the cake */}
            <HeroPortrait />
          </div>
        </Reveal>

        <Reveal delay={0.25} y={16}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.78rem, 1.8vw, 0.95rem)",
              color: "var(--ivory)",
              opacity: 0.5,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "2.5rem",
            }}
          >
            {hero.subline}
          </p>
        </Reveal>

        {/* Scroll cue */}
        <Reveal delay={0.5} y={8}>
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--gold)",
              opacity: 0.6,
            }}>
              {hero.scrollCue}
            </span>
            <div style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, var(--gold), transparent)",
              animation: reduced ? "none" : "scrollPulse 1.8s ease-in-out infinite",
            }} />
          </div>
        </Reveal>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50%       { opacity: 0.9; transform: scaleY(1.1); }
        }
      `}</style>
    </Section>
  );
}

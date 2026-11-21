import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { BakerScene } from "../scenes/BakerScene";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { baker, photos } from "../content";
import { CinematicImage } from "./CinematicImage";
import { useReducedMotion } from "../hooks/useReducedMotion";

// ── Bakery sign ────────────────────────────────────────────────
function BakerySign() {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "inline-flex", flexDirection: "column", alignItems: "center",
        gap: "0.4rem",
        padding: "clamp(1rem, 3vw, 1.75rem) clamp(1.5rem, 5vw, 3rem)",
        background: "rgba(232,201,135,0.05)",
        borderRadius: "14px", position: "relative",
      }}
    >
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, borderRadius: "14px",
        border: "1px solid rgba(232,201,135,0.35)",
        boxShadow: inView ? "0 0 30px rgba(232,201,135,0.12), 0 0 80px rgba(232,201,135,0.06)" : "none",
        transition: "box-shadow 1.5s ease", pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{ width: "60%", height: "1px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)", marginBottom: "0.5rem" }} />
      <p style={{
        fontFamily: "var(--font-display)", fontWeight: 300,
        fontSize: "clamp(1.3rem, 3.5vw, 2.2rem)", color: "var(--gold)",
        letterSpacing: "0.06em",
        textShadow: inView ? "0 0 25px rgba(232,201,135,0.4)" : "none",
        transition: "text-shadow 1.5s ease",
      }}>{baker.shopSign}</p>
      <p style={{
        fontFamily: "var(--font-body)", fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)",
        color: "var(--ivory)", opacity: 0.45, letterSpacing: "0.14em", textTransform: "uppercase",
      }}>{baker.shopSignSub}</p>
      <div aria-hidden="true" style={{ width: "40%", height: "1px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)", marginTop: "0.5rem" }} />
    </motion.div>
  );
}

// ── Photo frame with mouse tilt + parallax particles ──────────
function BakerPhoto() {
  const photo   = photos[0];
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // Mouse-tilt state — desktop only
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const ro = new ResizeObserver(() => setIsMobile(window.innerWidth < 768));
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || isMobile) return;
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / rect.height) * -8;
      const ry   = ((e.clientX - cx) / rect.width)  *  8;
      setTilt({ rx, ry });
    };
    const onLeave = () => setTilt({ rx: 0, ry: 0 });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, isMobile]);

  // Scroll parallax for the frame — desktop only
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], reduced || isMobile ? [0, 0] : [-20, 20]);

  const particles = Array.from({ length: isMobile ? 6 : 12 }, (_, i) => ({
    id: i,
    left:  `${10 + (i * 7.3) % 80}%`,
    top:   `${5 + (i * 11.7) % 90}%`,
    size:  3 + (i % 4),
    delay: i * 0.4,
    color: i % 3 === 0 ? "var(--rose)" : "var(--gold)",
  }));

  // On mobile: no 3D transform at all — just a clean framed image
  const frameStyle: React.CSSProperties = isMobile ? {
    position: "relative",
    borderRadius: "16px",
    padding: "5px",
    background: "linear-gradient(145deg, rgba(232,201,135,0.4), rgba(232,201,135,0.1), rgba(242,184,198,0.2))",
    boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(232,201,135,0.08)",
  } : {
    position: "relative",
    borderRadius: "16px",
    padding: "6px",
    background: "linear-gradient(145deg, rgba(232,201,135,0.4), rgba(232,201,135,0.1), rgba(242,184,198,0.2))",
    boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(232,201,135,0.1)",
    transform: (reduced || isMobile)
      ? "none"
      : `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
    transition: "transform 0.15s ease-out",
  };

  return (
    <motion.div
      ref={ref}
      style={{ y: parallaxY, position: "relative", width: "100%" }}
      initial={{ opacity: 0, y: isMobile ? 20 : 0, x: isMobile ? 0 : -30 }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Floating particles — behind frame */}
      {!isMobile && particles.map((p) => (
        <div
          key={p.id}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: p.left, top: p.top,
            width: `${p.size}px`, height: `${p.size}px`,
            borderRadius: "50%",
            background: p.color,
            opacity: 0.4,
            pointerEvents: "none",
            zIndex: 0,
            animation: reduced ? "none" : `floatDust ${3 + (p.id % 3)}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Frame */}
      <div style={frameStyle}>
        {/* Inner gold border */}
        <div style={{
          position: "absolute", inset: "5px",
          border: "1px solid rgba(232,201,135,0.3)",
          borderRadius: "12px",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        {/* Photo */}
        <div style={{
          borderRadius: "12px",
          overflow: "hidden",
          width: "100%",
          maxWidth: isMobile ? "100%" : "clamp(240px, 38vw, 420px)",
        }}>
          <CinematicImage
            src={photo.src}
            placeholder={photo.placeholder}
            srcFallback={photo.srcFallback}
            alt={photo.alt}
            focalPoint={photo.focalPoint}
            aspectRatio="4/5"
            eager={false}
          />
        </div>

        {/* Soft glow */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, borderRadius: "12px",
          background: "radial-gradient(ellipse at 30% 20%, rgba(232,201,135,0.08) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Caption */}
      <p style={{
        fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
        fontSize: "clamp(0.78rem, 1.8vw, 0.9rem)", color: "var(--ivory)",
        opacity: 0.5, textAlign: "center", marginTop: "0.75rem", letterSpacing: "0.04em",
      }}>
        {photo.caption}
      </p>

      <style>{`
        @keyframes floatDust {
          0%   { transform: translateY(0) scale(1); opacity: 0.4; }
          100% { transform: translateY(-12px) scale(1.3); opacity: 0.15; }
        }
      `}</style>
    </motion.div>
  );
}

// ── Main section ──────────────────────────────────────────────
export function BakerSection() {
  return (
    <Section
      id="baker"
      ariaLabel="Racheal the baker"
      style={{
        background: "linear-gradient(180deg, #0b0814 0%, #150d2a 50%, #0d0618 100%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      } as React.CSSProperties}
    >
      {/* 3D scene top */}
      <div style={{ position: "relative", flex: "1 1 50%", minHeight: "45dvh" }}>
        <BakerScene />
      </div>

      {/* Content row: photo + text side by side (desktop), stacked (mobile) */}
      <div style={{
        position: "relative",
        zIndex: 2,
        display: "grid",
        // Single col on mobile, 2-col on ≥768px
        gridTemplateColumns: "1fr",
        gap: "clamp(2rem, 5vw, 4rem)",
        padding: "clamp(2.5rem, 6vh, 5rem) clamp(1.5rem, 6vw, 5rem)",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        alignItems: "start",
      }}>

        {/* Mobile: photo above text; Desktop: photo left, text right */}
        <style>{`
          @media (min-width: 768px) {
            #baker-inner { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>

        <div
          id="baker-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "start",
            width: "100%",
          }}
        >
          {/* Photo */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <BakerPhoto />
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.25rem, 3vh, 2rem)", justifyContent: "center" }}>
            <Reveal>
              <h2 style={{
                fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
                fontSize: "clamp(1.6rem, 4.5vw, 3.5rem)", color: "var(--ivory)",
                letterSpacing: "-0.02em",
              }}>
                {baker.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.95rem, 2.2vw, 1.15rem)",
                color: "var(--ivory)", opacity: 0.65, lineHeight: 1.85,
              }}>
                {baker.body}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <blockquote style={{
                fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
                fontSize: "clamp(1rem, 2.5vw, 1.35rem)", color: "var(--gold)",
                borderLeft: "2px solid var(--gold)", paddingLeft: "1.25rem",
                opacity: 0.9, lineHeight: 1.65,
              }}>
                {baker.highlight}
              </blockquote>
            </Reveal>

            <Reveal delay={0.35}>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <BakerySign />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

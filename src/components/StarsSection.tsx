import { useRef } from "react";
import { ConstellationScene } from "../scenes/ConstellationScene";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { stars } from "../content";

export function StarsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <Section
      id="stars"
      ariaLabel="Our year in stars"
      className="overflow-hidden"
      ref={sectionRef}
      style={{ background: "linear-gradient(180deg, #0d0920 0%, #110828 50%, #0b0814 100%)" }}
    >
      {/* 3D Canvas */}
      <ConstellationScene sectionRef={sectionRef} />

      {/* Heading overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(3rem, 8vh, 6rem) clamp(1.5rem, 6vw, 5rem) 0",
          pointerEvents: "none",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1.6rem, 4vw, 3.2rem)",
              color: "var(--ivory)",
              textAlign: "center",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 30px rgba(11,8,20,0.9)",
            }}
          >
            {stars.heading}
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p
            style={{
              textAlign: "center",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "var(--ivory)",
              opacity: 0.35,
              letterSpacing: "0.12em",
              marginTop: "1rem",
            }}
          >
            hover or tap a star
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

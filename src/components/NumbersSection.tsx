import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";
import { numbers } from "../content";

export function NumbersSection() {
  return (
    <Section
      id="numbers"
      ariaLabel="Us by the numbers"
      style={{
        background: "linear-gradient(180deg, #0b0814 0%, #130c24 50%, #0b0814 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(4rem, 12vh, 8rem) clamp(1.5rem, 6vw, 5rem)",
      } as React.CSSProperties}
    >
      <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
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
              marginBottom: "clamp(2.5rem, 6vh, 5rem)",
            }}
          >
            {numbers.heading}
          </h2>
        </Reveal>

        {/* Stats grid: 1 col mobile, 2 tablet, 3 desktop */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
            gap: "clamp(0.75rem, 2vw, 1.25rem)",
            marginBottom: "clamp(2.5rem, 6vh, 4rem)",
          }}
        >
          {numbers.stats.map((stat, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <Counter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
              color: "var(--gold)",
              textAlign: "center",
              opacity: 0.85,
            }}
          >
            {numbers.closing}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

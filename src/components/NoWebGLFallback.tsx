import { hero, stars, numbers, baker } from "../content";
import { Reveal } from "./Reveal";
import { Counter } from "./Counter";

/**
 * Rich CSS-only fallback shown when WebGL is not available.
 * Preserves all copy and atmosphere using gradients + CSS animations.
 */
export function NoWebGLFallback() {
  return (
    <main
      style={{
        background: "linear-gradient(160deg, #0b0814 0%, #1a1030 40%, #0d0618 100%)",
        minHeight: "100dvh",
        color: "var(--ivory)",
        fontFamily: "var(--font-body)",
      }}
      aria-label="For Racheal birthday experience"
    >
      {/* Hero */}
      <section
        aria-label="Hero"
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(2rem, 8vw, 6rem) clamp(1.5rem, 6vw, 4rem)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient cake glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "clamp(200px, 50vw, 500px)",
            height: "clamp(200px, 50vw, 500px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,201,135,0.12) 0%, rgba(242,184,198,0.06) 50%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Reveal>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", position: "relative", zIndex: 1 }}>
            <span aria-hidden="true" style={{ fontSize: "clamp(4rem, 15vw, 8rem)", lineHeight: 1, filter: "drop-shadow(0 0 30px rgba(232,201,135,0.4))" }}>🎂</span>
            <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(2.2rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}>
              {hero.headline}
            </h1>
            <p style={{ fontFamily: "var(--font-hand)", fontSize: "clamp(1.2rem, 3vw, 1.8rem)", color: "var(--rose)" }}>
              {hero.padi}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.85rem, 2vw, 1rem)", opacity: 0.55, letterSpacing: "0.08em" }}>
              {hero.subline}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Stars chapter */}
      <section
        aria-label="Our year in stars"
        style={{ padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 4rem)", textAlign: "center" }}
      >
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.6rem, 4vw, 3rem)", marginBottom: "3rem" }}>
            {stars.heading}
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "1rem", maxWidth: "900px", margin: "0 auto" }}>
          {stars.months.map((s, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div className="glass-card gold-border" style={{ padding: "1.25rem", textAlign: "left" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  ✦ {s.month}
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.85 }}>
                  {s.caption}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Numbers chapter */}
      <section
        aria-label="Us, by the numbers"
        style={{ padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 4rem)", textAlign: "center" }}
      >
        <Reveal>
          <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.6rem, 4vw, 3rem)", marginBottom: "3rem" }}>
            {numbers.heading}
          </h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))", gap: "1rem", maxWidth: "800px", margin: "0 auto 2.5rem" }}>
          {numbers.stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Counter value={s.value} suffix={s.suffix} label={s.label} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1rem, 2.5vw, 1.4rem)", color: "var(--gold)", opacity: 0.85 }}>
            {numbers.closing}
          </p>
        </Reveal>
      </section>

      {/* Baker chapter */}
      <section
        aria-label="The Baker"
        style={{ padding: "clamp(4rem, 10vw, 8rem) clamp(1.5rem, 6vw, 4rem)", textAlign: "center", position: "relative" }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Reveal>
            <span aria-hidden="true" style={{ fontSize: "clamp(3rem, 10vw, 6rem)", lineHeight: 1 }}>🧁</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.7rem, 4.5vw, 3.2rem)" }}>
              {baker.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem, 2.5vw, 1.2rem)", lineHeight: 1.8, opacity: 0.75 }}>
              {baker.body}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.1rem, 2.8vw, 1.5rem)", color: "var(--gold)", borderLeft: "2px solid var(--gold)", paddingLeft: "1.25rem", textAlign: "left" }}>
              {baker.highlight}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem 2.5rem",
                background: "rgba(232,201,135,0.06)",
                border: "1px solid rgba(232,201,135,0.3)",
                borderRadius: "12px",
                display: "inline-block",
                boxShadow: "0 0 40px rgba(232,201,135,0.1), inset 0 0 40px rgba(232,201,135,0.03)",
              }}
            >
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(1.3rem, 3.5vw, 2rem)", color: "var(--gold)", letterSpacing: "0.04em" }}>
                {baker.shopSign}
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ivory)", opacity: 0.5, letterSpacing: "0.12em", marginTop: "0.3rem" }}>
                {baker.shopSignSub}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

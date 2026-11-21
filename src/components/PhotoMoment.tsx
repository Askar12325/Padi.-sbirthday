/**
 * PhotoMoment — Chapter between videos and wish candle.
 * Photo 2 fades in from darkness with Ken Burns zoom + vignette.
 * Caption "Happy birthday, Racheal." in display font beneath.
 */
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { photos } from "../content";
import { CinematicImage } from "./CinematicImage";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function PhotoMoment() {
  const photo   = photos[2];            // racheal-3 — cinematic full-screen moment
  const ref     = useRef<HTMLElement>(null);
  const inView  = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();

  return (
    <section
      ref={ref}
      id="photo-moment"
      aria-label="A quiet moment — Racheal"
      style={{
        position: "relative",
        minHeight: "100dvh",
        background: "#050308",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed photo with Ken Burns */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: reduced ? 0.1 : 2.2, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={inView && !reduced ? { scale: 1.06 } : { scale: 1 }}
          transition={{ duration: 12, ease: "linear" }}
          style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        >
          <CinematicImage
            src={photo.src}
            placeholder={photo.placeholder}
            srcFallback={photo.srcFallback}
            alt={photo.alt}
            focalPoint={photo.focalPoint}
            aspectRatio="auto"
            eager={false}
            style={{
              position: "absolute",
              inset: 0,
              aspectRatio: "unset",
              height: "100%",
              width: "100%",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Deep vignette overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: [
            "radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(5,3,8,0.75) 100%)",
            "linear-gradient(to top, rgba(5,3,8,0.9) 0%, transparent 35%)",
            "linear-gradient(to bottom, rgba(5,3,8,0.6) 0%, transparent 20%)",
          ].join(", "),
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduced ? 0.1 : 1.6, delay: reduced ? 0 : 1.0, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 clamp(1.5rem, 6vw, 5rem)",
          marginTop: "auto",
          paddingBottom: "clamp(3rem, 8vh, 6rem)",
          paddingTop: "clamp(3rem, 8vh, 6rem)",
        }}
      >
        {/* Hairline */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.0, delay: reduced ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "clamp(40px, 12vw, 80px)",
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
            margin: "0 auto 1.5rem",
            transformOrigin: "center",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.5rem, 4.5vw, 3.5rem)",
            color: "var(--ivory)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            textShadow: "0 2px 30px rgba(0,0,0,0.9)",
          }}
        >
          {photo.caption}
        </p>

        {/* Alt caption from content */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.7rem, 1.6vw, 0.85rem)",
            color: "var(--gold)",
            opacity: 0.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: "1rem",
          }}
        >
          21 · 11 · 2026
        </p>
      </motion.div>
    </section>
  );
}

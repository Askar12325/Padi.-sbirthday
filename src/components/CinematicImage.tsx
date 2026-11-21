/**
 * CinematicImage
 * - Fades from blurred LQIP placeholder into the sharp WebP
 * - Graceful gold placeholder if the image is missing
 * - Respects prefers-reduced-motion
 * - Zero layout shift: always has explicit aspect-ratio or height
 */
import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface CinematicImageProps {
  src: string;
  placeholder: string;
  srcFallback?: string;
  alt: string;
  focalPoint?: string;    // CSS object-position, e.g. "50% 20%"
  aspectRatio?: string;   // e.g. "3/4" or "16/9"
  style?: CSSProperties;
  className?: string;
  eager?: boolean;        // true = eager load (hero), false = lazy (default)
}

export function CinematicImage({
  src,
  placeholder,
  srcFallback,
  alt,
  focalPoint = "50% 20%",
  aspectRatio = "3/4",
  style,
  className,
  eager = false,
}: CinematicImageProps) {
  const [phase, setPhase]   = useState<"blur" | "sharp" | "error">("blur");
  const imgRef              = useRef<HTMLImageElement>(null);
  const reduced             = useReducedMotion();

  // Preload the sharp image
  useEffect(() => {
    const img   = new Image();
    img.src     = src;
    img.onload  = () => setPhase("sharp");
    img.onerror = () => {
      // Try fallback JPEG
      if (srcFallback) {
        const fb       = new Image();
        fb.src         = srcFallback;
        fb.onload      = () => setPhase("sharp");
        fb.onerror     = () => setPhase("error");
      } else {
        setPhase("error");
      }
    };
    return () => { img.onload = null; img.onerror = null; };
  }, [src, srcFallback]);

  const realSrc = phase === "sharp"
    ? src
    : phase === "blur"
      ? placeholder
      : "";

  const containerStyle: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    aspectRatio,
    width: "100%",
    background: "#130c24",
    ...style,
  };

  const imgStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: focalPoint,
    display: "block",
    filter: phase === "blur" ? "blur(12px) saturate(0.6)" : "none",
    transform: phase === "blur" ? "scale(1.08)" : "scale(1)",
    transition: reduced ? "none" : "filter 0.8s ease, transform 0.8s ease, opacity 0.6s ease",
  };

  // Gold gradient fallback
  const fallbackStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(145deg, #1a1030 0%, #2a1f40 50%, #1a1030 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={containerStyle} className={className}>
      {phase === "error" ? (
        <div style={fallbackStyle} aria-label={alt}>
          <span aria-hidden="true" style={{ fontSize: "2rem", opacity: 0.25 }}>✦</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={realSrc}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          style={imgStyle}
          draggable={false}
        />
      )}
    </div>
  );
}

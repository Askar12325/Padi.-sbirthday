import { forwardRef, type ReactNode, type CSSProperties } from "react";

interface SectionProps {
  id?: string;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  fullScreen?: boolean;
  vignette?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      id,
      ariaLabel,
      className = "",
      style,
      children,
      fullScreen = true,
      vignette = true,
    },
    ref
  ) => {
    return (
      <section
        id={id}
        aria-label={ariaLabel}
        ref={ref}
        className={[
          "relative",
          fullScreen ? "full-screen" : "",
          vignette ? "vignette" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={style}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

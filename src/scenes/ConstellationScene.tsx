import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger, type ScrollTriggerInstance } from "gsap/ScrollTrigger";
import { stars as starsContent } from "../content";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useIsLowPower } from "../hooks/useIsLowPower";

gsap.registerPlugin(ScrollTrigger);

// Star positions in 3D space (hand-tuned to look like a constellation)
const STAR_POSITIONS: [number, number, number][] = [
  [-3.5,  1.0, -1.0],
  [-2.4,  2.2, -0.5],
  [-1.0,  2.8,  0.2],
  [ 0.3,  2.4,  0.8],
  [ 1.4,  3.0, -0.3],
  [ 2.5,  2.1,  0.5],
  [ 3.2,  1.2, -0.7],
  [ 2.8, -0.2,  0.4],
  [ 1.5, -1.0,  0.9],
  [ 0.0, -0.5,  1.2],
  [-1.5, -1.2,  0.3],
];

// Edges between stars
const EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,0],[3,8],[2,9],
];

function StarField({ count }: { count: number }) {
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 14;
      p[i * 3 + 2] = -5 - Math.random() * 8;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#fbf4e9" size={0.04} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function ConstellationLines({ progress }: { progress: number }) {
  const ref = useRef<THREE.LineSegments>(null);

  const { positions, counts } = useMemo(() => {
    const positions = new Float32Array(EDGES.length * 6);
    const counts = EDGES.length;
    for (let i = 0; i < EDGES.length; i++) {
      const [a, b] = EDGES[i];
      const pa = STAR_POSITIONS[a];
      const pb = STAR_POSITIONS[b];
      positions[i * 6]     = pa[0]; positions[i * 6 + 1] = pa[1]; positions[i * 6 + 2] = pa[2];
      positions[i * 6 + 3] = pb[0]; positions[i * 6 + 4] = pb[1]; positions[i * 6 + 5] = pb[2];
    }
    return { positions, counts };
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.LineBasicMaterial;
    mat.opacity = progress * 0.5;
  }, [progress]);

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#e8c987" transparent opacity={0} depthWrite={false} />
    </lineSegments>
  );
}

interface StarMeshProps {
  position: [number, number, number];
  index: number;
  activeIndex: number | null;
  onHover: (i: number | null) => void;
  scrollProgress: number;
}

function StarMesh({ position, index, activeIndex, onHover, scrollProgress }: StarMeshProps) {
  const ref = useRef<THREE.Mesh>(null);
  const isActive = activeIndex === index;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2 + index) * 0.08;
    const appear = Math.min(1, Math.max(0, (scrollProgress * 11 - index) / 1));
    ref.current.scale.setScalar(pulse * appear * (isActive ? 1.5 : 1));
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      isActive ? 1.2 : 0.4 + Math.sin(clock.elapsedTime + index) * 0.1;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerEnter={() => onHover(index)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onHover(isActive ? null : index)}
    >
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial
        color="#e8c987"
        emissive="#e8c987"
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}

function CameraFloat({ reduced }: { reduced: boolean }) {
  useFrame(({ clock, camera }) => {
    if (reduced) return;
    camera.position.x = Math.sin(clock.elapsedTime * 0.05) * 0.3;
    camera.position.y = Math.cos(clock.elapsedTime * 0.04) * 0.2 + 0.5;
  });
  return null;
}

function ConstellationCanvas({
  scrollProgress,
  activeIndex,
  onHover,
  reduced,
  lowPower,
}: {
  scrollProgress: number;
  activeIndex: number | null;
  onHover: (i: number | null) => void;
  reduced: boolean;
  lowPower: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 2, 3]} intensity={0.5} color="#e8c987" />
      <CameraFloat reduced={reduced} />
      <StarField count={lowPower ? 120 : 300} />
      <ConstellationLines progress={scrollProgress} />
      {STAR_POSITIONS.map((pos, i) => (
        <StarMesh
          key={i}
          position={pos}
          index={i}
          activeIndex={activeIndex}
          onHover={onHover}
          scrollProgress={scrollProgress}
        />
      ))}
      <fog attach="fog" args={["#0b0814", 10, 22]} />
    </>
  );
}

interface ConstellationSceneProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

export function ConstellationScene({ sectionRef }: ConstellationSceneProps) {
  const reduced    = useReducedMotion();
  const lowPower   = useIsLowPower();
  const [progress, setProgress]     = useState(0);
  const [activeIdx, setActiveIdx]   = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; i: number } | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self: ScrollTriggerInstance) => setProgress(self.progress),
    });
    return () => trigger.kill();
  }, [sectionRef]);

  const handleHover = (i: number | null) => {
    setActiveIdx(i);
    if (i !== null) {
      setTooltipData({ x: 50, y: 50, i });
    } else {
      setTooltipData(null);
    }
  };

  return (
    <ErrorBoundary>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 7], fov: 55 }}
        gl={{ antialias: !lowPower, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
        aria-label="Star constellation showing our year together"
        role="img"
      >
        <ConstellationCanvas
          scrollProgress={progress}
          activeIndex={activeIdx}
          onHover={handleHover}
          reduced={reduced}
          lowPower={lowPower}
        />
      </Canvas>

      {/* Tooltip cards — DOM, not canvas */}
      {activeIdx !== null && tooltipData && (
        <div
          role="tooltip"
          aria-live="polite"
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "min(360px, 85vw)",
            padding: "1.25rem 1.5rem",
            background: "rgba(11,8,20,0.88)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(232,201,135,0.25)",
            borderRadius: "12px",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
            {starsContent.months[activeIdx].month}
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", color: "var(--ivory)", lineHeight: 1.5 }}>
            {starsContent.months[activeIdx].caption}
          </p>
        </div>
      )}

      {/* Touch targets for mobile — invisible tappable dots */}
      {starsContent.months.map((m, i) => (
        <button
          key={i}
          aria-label={`${m.month}: ${m.caption}`}
          onClick={() => handleHover(activeIdx === i ? null : i)}
          style={{
            position: "absolute",
            top: `${20 + ((i % 3) * 20)}%`,
            left: `${10 + (i * 7.5) % 80}%`,
            width: "44px",
            height: "44px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 5,
          }}
        />
      ))}
    </ErrorBoundary>
  );
}

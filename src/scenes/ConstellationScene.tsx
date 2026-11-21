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

// ── Star positions scaled to fit mobile (±2.2 X range) ────────
const STAR_POSITIONS: [number, number, number][] = [
  [-2.2,  0.6, -0.5],
  [-1.5,  1.4, -0.3],
  [-0.6,  1.8,  0.1],
  [ 0.2,  1.5,  0.5],
  [ 0.9,  1.9, -0.2],
  [ 1.6,  1.3,  0.3],
  [ 2.1,  0.7, -0.4],
  [ 1.8, -0.1,  0.3],
  [ 0.9, -0.7,  0.5],
  [ 0.0, -0.3,  0.8],
  [-0.9, -0.8,  0.2],
];

const EDGES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,0],[3,8],[2,9],
];

function StarField({ count }: { count: number }) {
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 14;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = -4 - Math.random() * 6;
    }
    return p;
  }, [count]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points geometry={geo}>
      <pointsMaterial color="#fbf4e9" size={0.04} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function ConstellationLines({ progress }: { progress: number }) {
  const ref = useRef<THREE.LineSegments>(null);

  const geo = useMemo(() => {
    const positions = new Float32Array(EDGES.length * 6);
    for (let i = 0; i < EDGES.length; i++) {
      const [a, b] = EDGES[i];
      const pa = STAR_POSITIONS[a];
      const pb = STAR_POSITIONS[b];
      positions[i * 6]     = pa[0]; positions[i * 6 + 1] = pa[1]; positions[i * 6 + 2] = pa[2];
      positions[i * 6 + 3] = pb[0]; positions[i * 6 + 4] = pb[1]; positions[i * 6 + 5] = pb[2];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.LineBasicMaterial;
    mat.opacity = progress * 0.5;
  }, [progress]);

  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color="#e8c987" transparent opacity={0} depthWrite={false} />
    </lineSegments>
  );
}

interface StarMeshProps {
  position: [number, number, number];
  index: number;
  activeIndex: number | null;
  onActivate: (i: number | null) => void;
  scrollProgress: number;
}

function StarMesh({ position, index, activeIndex, onActivate, scrollProgress }: StarMeshProps) {
  const ref = useRef<THREE.Mesh>(null);
  const isActive = activeIndex === index;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const pulse  = 1 + Math.sin(clock.elapsedTime * 2 + index) * 0.08;
    const appear = Math.min(1, Math.max(0, scrollProgress * 11 - index));
    ref.current.scale.setScalar(pulse * appear * (isActive ? 1.6 : 1));
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      isActive ? 1.4 : 0.4 + Math.sin(clock.elapsedTime + index) * 0.1;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerEnter={() => onActivate(index)}
      onPointerLeave={() => onActivate(null)}
      onClick={() => onActivate(isActive ? null : index)}
    >
      <sphereGeometry args={[0.1, 10, 10]} />
      <meshStandardMaterial color="#e8c987" emissive="#e8c987" emissiveIntensity={0.4} roughness={0.2} metalness={0.5} />
    </mesh>
  );
}

// Adaptive camera — zooms out on narrow screens
function AdaptiveCamera({ reduced }: { reduced: boolean }) {
  const { camera, size } = useThree();

  useFrame(({ clock }) => {
    // Zoom: fit all stars (±2.2 X) on any width
    const fov = 55;
    const aspect = size.width / size.height;
    const neededZ = aspect < 0.8 ? 7.5 : aspect < 1.2 ? 6.5 : 5.5;
    (camera as THREE.PerspectiveCamera).fov = fov;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    if (reduced) {
      camera.position.set(0, 0.5, neededZ);
      camera.lookAt(0, 0.5, 0);
      return;
    }
    const t = clock.elapsedTime;
    const tx = Math.sin(t * 0.05) * 0.3;
    const ty = Math.cos(t * 0.04) * 0.2 + 0.5;
    camera.position.lerp(new THREE.Vector3(tx, ty, neededZ), 0.03);
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

interface ConstellationSceneProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

export function ConstellationScene({ sectionRef }: ConstellationSceneProps) {
  const reduced    = useReducedMotion();
  const lowPower   = useIsLowPower();
  const [progress, setProgress]   = useState(0);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

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

  return (
    <ErrorBoundary>
      <Canvas
        dpr={[1, lowPower ? 1 : 2]}
        camera={{ position: [0, 0.5, 6.5], fov: 55 }}
        gl={{ antialias: !lowPower, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
        aria-label="Star constellation — our year together"
        role="img"
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 2, 3]} intensity={0.5} color="#e8c987" />
        <AdaptiveCamera reduced={reduced} />
        <StarField count={lowPower ? 80 : 220} />
        <ConstellationLines progress={progress} />
        {STAR_POSITIONS.map((pos, i) => (
          <StarMesh
            key={i}
            position={pos}
            index={i}
            activeIndex={activeIdx}
            onActivate={setActiveIdx}
            scrollProgress={progress}
          />
        ))}
        <fog attach="fog" args={["#0b0814", 10, 20]} />
      </Canvas>

      {/* Tooltip card */}
      {activeIdx !== null && (
        <div
          role="tooltip"
          aria-live="polite"
          style={{
            position: "absolute",
            bottom: "clamp(4rem, 12%, 8rem)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(340px, 86vw)",
            padding: "1.1rem 1.4rem",
            background: "rgba(11,8,20,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(232,201,135,0.25)",
            borderRadius: "12px",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--gold)",
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.4rem",
          }}>
            {starsContent.months[activeIdx].month}
          </p>
          <p style={{
            fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)", color: "var(--ivory)", lineHeight: 1.55,
          }}>
            {starsContent.months[activeIdx].caption}
          </p>
        </div>
      )}

      {/* Mobile tap targets — grid layout so they cover the actual star positions */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, zIndex: 5,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          pointerEvents: "none",
        }}
      >
        {starsContent.months.map((m, i) => (
          <button
            key={i}
            aria-label={`${m.month}: ${m.caption}`}
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
            style={{
              pointerEvents: "auto",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              minWidth: "44px",
              minHeight: "44px",
            }}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
}

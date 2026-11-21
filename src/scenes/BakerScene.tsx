import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useIsLowPower } from "../hooks/useIsLowPower";

function Whisk({ position }: { position: [number, number, number] }) {
  const angles = useMemo(() => [0, 60, 120, 180, 240, 300], []);
  return (
    <group position={position} rotation={[0.3, 0.5, 0.2]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#c8a96e" metalness={0.4} roughness={0.5} />
      </mesh>
      {angles.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.06, -0.08, Math.sin(a) * 0.06]} rotation={[0, a, 0.3]}>
            <torusGeometry args={[0.08, 0.006, 6, 24, Math.PI]} />
            <meshStandardMaterial color="#d4b896" metalness={0.6} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

function RollingPin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0.2, -0.4, 0.5]}>
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.8, 16]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.6} />
      </mesh>
      {([-0.45, 0.45] as const).map((x, i) => (
        <mesh key={i} position={[0, x, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.14, 8]} />
          <meshStandardMaterial color="#c4a882" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function WheatStalk({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.008, 0.008, 0.9, 6]} />
        <meshStandardMaterial color="#c8a850" roughness={0.8} />
      </mesh>
      {([0.3, 0.45, 0.6] as const).map((y, i) => (
        <mesh
          key={i}
          position={[0.045 * (i % 2 === 0 ? 1 : -1), y, 0]}
          rotation={[0, 0, i % 2 === 0 ? 0.4 : -0.4]}
          scale={[0.5, 0.18, 0.08]}
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#d4a830" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Cupcake({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.12, 0.09, 0.2, 16]} />
        <meshStandardMaterial color="#c87a3a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.13, 0.12, 0.18, 16]} />
        <meshStandardMaterial color="#e8c090" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.12, 0.22, 16]} />
        <meshStandardMaterial color="#f8f0e3" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.36, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#c0392b" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0.015, 0.405, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.004, 0.004, 0.06, 4]} />
        <meshStandardMaterial color="#2d6a1f" roughness={0.8} />
      </mesh>
    </group>
  );
}

function CakeSlice({ position }: { position: [number, number, number] }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.3, 0);
    s.absarc(0, 0, 0.3, 0, Math.PI / 2.2, false);
    s.lineTo(0, 0);
    return s;
  }, []);

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0.3]}>
      <mesh>
        <extrudeGeometry args={[shape, { depth: 0.22, bevelEnabled: false }]} />
        <meshStandardMaterial color="#e8c090" roughness={0.5} />
      </mesh>
    </group>
  );
}

function FlourDust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      speeds[i] = 0.015 + Math.random() * 0.025;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geo, speeds };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      p[i * 3]     += Math.sin(t * 0.3 + i) * 0.001;
      p[i * 3 + 1] -= speeds[i] * 0.5;
      if (p[i * 3 + 1] < -2.5) p[i * 3 + 1] = 2.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#f8f4ee" size={0.025} transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function DecoStar({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.elapsedTime * 0.5;
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.07, 0]} />
      <meshStandardMaterial color="#e8c987" metalness={0.7} roughness={0.2} emissive="#e8c987" emissiveIntensity={0.3} />
    </mesh>
  );
}

function BakerStillLife({ reduced }: { reduced: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} color="#ffe8c0" />
      <directionalLight position={[3, 4, 2]} intensity={1.1} color="#fff4dc" castShadow />
      <pointLight position={[-3, 2, 1]} intensity={0.5} color="#f2b8c6" />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#e8c987" />

      <Float speed={reduced ? 0 : 0.5} floatIntensity={0.1} rotationIntensity={0.04}>
        <group>
          <Whisk       position={[-1.3,  0.3,  0.2]} />
          <RollingPin  position={[ 0.4, -0.1, -0.3]} />
          <WheatStalk  position={[ 1.4, -0.4,  0.1]} rotation={[0.1,  0.3, -0.3]} />
          <WheatStalk  position={[ 1.7, -0.4,  0.3]} rotation={[0.1,  0.1,  0.1]} />
          <Cupcake     position={[-0.3,  0.2,  0.5]} />
          <CakeSlice   position={[ 0.9,  0.5,  0.4]} />
          <DecoStar    position={[-1.0,  1.1,  0.0]} />
          <DecoStar    position={[ 0.0,  1.3,  0.3]} />
          <DecoStar    position={[ 1.5,  0.9, -0.2]} />
        </group>
      </Float>

      <FlourDust count={80} />
      <fog attach="fog" args={["#0b0814", 7, 16]} />
    </>
  );
}

export function BakerScene() {
  const reduced  = useReducedMotion();
  const lowPower = useIsLowPower();

  return (
    <ErrorBoundary>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 4.5], fov: 50 }}
        shadows
        gl={{ antialias: !lowPower, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
        aria-label="Floating baker still life"
        role="img"
      >
        <BakerStillLife reduced={reduced} />
      </Canvas>
    </ErrorBoundary>
  );
}

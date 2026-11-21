import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useIsLowPower } from "../hooks/useIsLowPower";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { ErrorBoundary } from "../components/ErrorBoundary";

// ── Flame shader ───────────────────────────────────────────────
const flameVert = `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float flicker = sin(uTime * 8.0 + position.y * 4.0) * 0.04;
    pos.x += flicker;
    pos.y += abs(sin(uTime * 6.0)) * 0.02;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const flameFrag = `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    float d = distance(vUv, vec2(0.5, 0.0));
    float alpha = smoothstep(0.5, 0.0, d) * smoothstep(0.0, 0.3, vUv.y);
    alpha *= (0.85 + 0.15 * sin(uTime * 10.0));
    vec3 col = mix(vec3(1.0, 0.85, 0.2), vec3(1.0, 0.4, 0.05), 1.0 - vUv.y);
    col = mix(col, vec3(1.0, 1.0, 0.95), pow(vUv.y, 2.0) * 0.5);
    gl_FragColor = vec4(col, alpha);
  }
`;

function Candle({ position }: { position: [number, number, number] }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.24, 8]} />
        <meshStandardMaterial color="#f5e6d0" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.05, 6]} />
        <meshStandardMaterial color="#2a1a0a" />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <coneGeometry args={[0.025, 0.1, 8, 1, true]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={flameVert}
          fragmentShader={flameFrag}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <pointLight color="#ff9933" intensity={0.6} distance={1.2} decay={2} position={[0, 0.36, 0]} />
    </group>
  );
}

function CakeTier({ y, radius, height, color, drip = false }: {
  y: number; radius: number; height: number; color: string; drip?: boolean;
}) {
  const dripCount = Math.floor(radius * 14);
  const dripAngles = useMemo(
    () => Array.from({ length: dripCount }, (_, i) => (i / dripCount) * Math.PI * 2),
    [dripCount]
  );

  return (
    <group position={[0, y, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.95, radius, height, 48]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius * 0.95, radius * 0.95, 0.04, 48]} />
        <meshStandardMaterial color="#f8f0e3" roughness={0.25} />
      </mesh>
      {drip && dripAngles.map((angle, i) => {
        const len = 0.055 + (i % 5) * 0.012;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius * 0.97, height / 2 - len / 2, Math.sin(angle) * radius * 0.97]}>
            <cylinderGeometry args={[0.012, 0.008, len, 6]} />
            <meshStandardMaterial color="#f2b8c6" roughness={0.4} transparent opacity={0.9} />
          </mesh>
        );
      })}
      <mesh position={[0, height / 2 + 0.02, 0]}>
        <torusGeometry args={[radius * 0.94, 0.012, 8, 64]} />
        <meshStandardMaterial color="#e8c987" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -height / 2 + 0.012, 0]}>
        <torusGeometry args={[radius * 0.99, 0.01, 8, 64]} />
        <meshStandardMaterial color="#e8c987" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function SugarFlower({ position }: { position: [number, number, number] }) {
  const angles = useMemo(() => [0, 72, 144, 216, 288], []);
  return (
    <group position={position} scale={0.06}>
      {angles.map((deg, i) => (
        <mesh key={i} position={[Math.cos((deg * Math.PI) / 180) * 1.0, 0, Math.sin((deg * Math.PI) / 180) * 1.0]}>
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#f2b8c6" : "#e8c987"} roughness={0.5} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.45, 8, 8]} />
        <meshStandardMaterial color="#fffde7" roughness={0.4} />
      </mesh>
    </group>
  );
}

function Plate() {
  return (
    <group position={[0, -0.06, 0]}>
      <mesh receiveShadow>
        <cylinderGeometry args={[1.1, 1.0, 0.06, 64]} />
        <meshStandardMaterial color="#f0e6d3" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.08, 0.015, 8, 64]} />
        <meshStandardMaterial color="#e8c987" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

function GoldDust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3]     = Math.cos(theta) * r;
      positions[i * 3 + 1] = -1.5 + Math.random() * 4;
      positions[i * 3 + 2] = Math.sin(theta) * r;
      speeds[i] = 0.1 + Math.random() * 0.3;
    }
    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.003;
      if (pos[i * 3 + 1] > 2.5) pos[i * 3 + 1] = -1.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#e8c987" size={0.018} transparent opacity={0.65} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function RosePetals({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = -2 + Math.random() * 4;
      positions[i * 3 + 1] = -1 + Math.random() * 4;
      positions[i * 3 + 2] = -2 + Math.random() * 4;
      speeds[i] = 0.04 + Math.random() * 0.08;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, offsets };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3]     += Math.sin(t * 0.5 + offsets[i]) * 0.0015;
      pos[i * 3 + 1] -= speeds[i] * 0.004;
      if (pos[i * 3 + 1] < -1.5) pos[i * 3 + 1] = 3.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#f2b8c6" size={0.025} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const tilt  = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      tilt.current.x = ((e.gamma ?? 0) / 45) * 0.5;
      tilt.current.y = ((e.beta  ?? 30) - 30) / 60;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("deviceorientation", onTilt);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  useFrame(({ clock }) => {
    if (reduced) {
      camera.position.set(0, 1.2, 4.5);
      camera.lookAt(0, 0.5, 0);
      return;
    }
    const t  = clock.elapsedTime * 0.08;
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    const mx = isMobile ? tilt.current.x : mouse.current.x;
    const my = isMobile ? tilt.current.y : mouse.current.y;
    const target = new THREE.Vector3(Math.sin(t) * 4.0 + mx * 0.6, 1.2 + my * 0.3, Math.cos(t) * 4.0);
    camera.position.lerp(target, 0.025);
    camera.lookAt(0, 0.6, 0);
  });

  return null;
}

function Cake({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (reduced || !groupRef.current) return;
    groupRef.current.rotation.y = clock.elapsedTime * 0.04;
  });

  const candleAngles = [0, 60, 120, 180, 240, 300];
  const flowerPositions: [number, number, number][] = [
    [0.55, 0.78, 0], [-0.5, 0.78, 0.2], [0.3, 0.78, -0.5],
    [0.9,  0.3,  0.3], [-0.85, 0.3, -0.1],
  ];
  const topY = 1.72;

  return (
    <group ref={groupRef}>
      <Plate />
      <CakeTier y={0.3}  radius={0.9}  height={0.6}  color="#f5ece0" drip />
      <CakeTier y={0.95} radius={0.65} height={0.5}  color="#f7efea" drip />
      <CakeTier y={1.5}  radius={0.42} height={0.44} color="#faf5f0" />
      {candleAngles.map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        return <Candle key={i} position={[Math.cos(a) * 0.28, topY, Math.sin(a) * 0.28]} />;
      })}
      {flowerPositions.map((pos, i) => <SugarFlower key={i} position={pos} />)}
    </group>
  );
}

function Scene({ reduced, lowPower }: { reduced: boolean; lowPower: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} color="#ffe8c0" />
      <directionalLight position={[3, 5, 3]} intensity={1.2} color="#fff4dc" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3, 3, -2]} intensity={0.4} color="#f2b8c6" />
      <pointLight position={[0, -1, 0]} intensity={0.1} color="#e8c987" />
      <CameraRig reduced={reduced} />
      <Float speed={reduced ? 0 : 0.6} rotationIntensity={0.05} floatIntensity={0.12}>
        <Cake reduced={reduced} />
      </Float>
      <GoldDust  count={lowPower ? 60  : 200} />
      <RosePetals count={lowPower ? 20 : 60} />
      <fog attach="fog" args={["#0b0814", 7, 18]} />
    </>
  );
}

export function CakeScene() {
  const reduced  = useReducedMotion();
  const lowPower = useIsLowPower();

  return (
    <ErrorBoundary>
      <Canvas
        dpr={[1, lowPower ? 1 : 1.5]}
        camera={{ position: [0, 1.2, 4.5], fov: 50 }}
        shadows
        gl={{ antialias: !lowPower, alpha: true }}
        style={{ position: "absolute", inset: 0 }}
        aria-label="3D birthday cake"
        role="img"
      >
        <Scene reduced={reduced} lowPower={lowPower} />
      </Canvas>
    </ErrorBoundary>
  );
}

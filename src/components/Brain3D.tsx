import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars, Sphere } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function BrainHemisphere({ side, color, emissive }: { side: "left" | "right"; color: string; emissive: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  const xOffset = side === "left" ? -0.52 : 0.52;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    ref.current.rotation.z = Math.cos(t * 0.25) * 0.08;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={ref} position={[xOffset, 0, 0]} scale={[0.85, 1.05, 0.9]}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.4}
          distort={0.35}
          speed={2.5}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
    </Float>
  );
}

/* Sulci / brain folds — thin torus rings that wrap around each hemisphere */
function BrainFolds({ side, color }: { side: "left" | "right"; color: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const xOffset = side === "left" ? -0.52 : 0.52;

  useFrame((state) => {
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.25) * 0.08;
  });

  const folds = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      y: -0.7 + i * 0.35,
      rotX: (Math.random() - 0.5) * 0.4,
      rotZ: (Math.random() - 0.5) * 0.3,
      scale: 0.75 + Math.random() * 0.2,
    }));
  }, []);

  return (
    <group ref={groupRef} position={[xOffset, 0, 0]}>
      {folds.map((f, i) => (
        <mesh key={i} position={[0, f.y, 0.15]} rotation={[f.rotX, 0, f.rotZ]} scale={[f.scale * 0.85, f.scale * 1.05, f.scale * 0.9]}>
          <torusGeometry args={[0.7, 0.06, 8, 32, Math.PI]} />
          <meshStandardMaterial color={color} transparent opacity={0.35} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* Brain stem */
function BrainStem() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });
  return (
    <mesh ref={ref} position={[0, -1.15, -0.1]} scale={[0.3, 0.45, 0.25]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#c084fc" emissive="#7c3aed" emissiveIntensity={0.3} roughness={0.3} />
    </mesh>
  );
}

/* Synaptic particles orbiting */
function SynapseParticles() {
  const count = 120;
  const ref = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const pink = new THREE.Color("#ff6eb4");
    const cyan = new THREE.Color("#22d3ee");
    const purple = new THREE.Color("#c084fc");
    const palette = [pink, cyan, purple];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.6 + Math.random() * 1.4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.12;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.25;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

/* Electric pulse rings */
function PulseRing({ delay }: { delay: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = ((state.clock.elapsedTime + delay) % 3) / 3;
    const scale = 0.5 + t * 2.5;
    ref.current.scale.set(scale, scale, scale);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.25;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.95, 1, 64]} />
      <meshBasicMaterial color="#22d3ee" transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function BrainGroup() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      <BrainHemisphere side="left" color="#60a5fa" emissive="#3b82f6" />
      <BrainHemisphere side="right" color="#f472b6" emissive="#ec4899" />
      <BrainFolds side="left" color="#93c5fd" />
      <BrainFolds side="right" color="#f9a8d4" />
      <BrainStem />
      <SynapseParticles />
      <PulseRing delay={0} />
      <PulseRing delay={1} />
      <PulseRing delay={2} />
    </group>
  );
}

export default function Brain3D() {
  return (
    <div className="w-56 h-56 md:w-72 md:h-72">
      <Canvas camera={{ position: [0, 0, 4.8], fov: 42 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#bfdbfe" />
        <directionalLight position={[-5, -3, -5]} intensity={0.8} color="#fbcfe8" />
        <pointLight position={[0, 0, 3]} intensity={1.2} color="#22d3ee" />
        <pointLight position={[0, 2, -2]} intensity={0.6} color="#c084fc" />
        <Stars radius={40} depth={25} count={400} factor={2.5} saturation={0.8} fade speed={1.2} />
        <BrainGroup />
      </Canvas>
    </div>
  );
}

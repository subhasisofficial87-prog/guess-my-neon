import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function BrainSphere({ position, color, speed, distort }: { position: [number, number, number]; color: string; speed: number; distort: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
  });
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={position}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial color={color} distort={distort} speed={3} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
}

function NeuronParticles() {
  const count = 80;
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 1.2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#67e8f9" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function BrainGroup() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Left hemisphere - blue */}
      <BrainSphere position={[-0.55, 0, 0]} color="#60a5fa" speed={0.4} distort={0.45} />
      {/* Right hemisphere - pink */}
      <BrainSphere position={[0.55, 0, 0]} color="#f9a8d4" speed={0.35} distort={0.45} />
      <NeuronParticles />
    </group>
  );
}

export default function Brain3D() {
  return (
    <div className="w-48 h-48 md:w-64 md:h-64">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#e0f2fe" />
        <directionalLight position={[-5, -3, -5]} intensity={0.6} color="#fce7f3" />
        <pointLight position={[0, 0, 3]} intensity={0.8} color="#67e8f9" />
        <Stars radius={50} depth={30} count={300} factor={2} saturation={0.5} fade speed={1.5} />
        <BrainGroup />
      </Canvas>
    </div>
  );
}

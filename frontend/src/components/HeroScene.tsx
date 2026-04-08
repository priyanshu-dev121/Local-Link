import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

const FloatingSphere = ({ position, color, size, speed }: { position: [number, number, number]; color: string; size: number; speed: number }) => (
  <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
    <Sphere args={[size, 64, 64]} position={position}>
      <MeshDistortMaterial color={color} roughness={0.2} metalness={0.8} distort={0.3} speed={2} />
    </Sphere>
  </Float>
);

const HeroScene = () => (
  <div className="absolute inset-0 opacity-60">
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#e84e1b" />
        <FloatingSphere position={[2.5, 1, 0]} color="#e84e1b" size={0.8} speed={1.5} />
        <FloatingSphere position={[-2.5, -0.5, -1]} color="#7c3aed" size={0.6} speed={2} />
        <FloatingSphere position={[0.5, -1.5, 1]} color="#e84e1b" size={0.4} speed={2.5} />
        <FloatingSphere position={[-1, 1.5, 0.5]} color="#7c3aed" size={0.35} speed={1.8} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Suspense>
    </Canvas>
  </div>
);

export default HeroScene;

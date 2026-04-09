import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

const FloatingSphere = ({ position, color, size, speed, distort }: { position: [number, number, number]; color: string; size: number; speed: number; distort: number }) => (
  <Float speed={speed} rotationIntensity={1.5} floatIntensity={2.5}>
    <Sphere args={[size, 64, 64]} position={position}>
      <MeshDistortMaterial 
        color={color} 
        roughness={0.15} 
        metalness={0.9} 
        distort={distort} 
        speed={speed}
      />
    </Sphere>
  </Float>
);

const HeroScene = () => (
  <div className="absolute inset-0 opacity-80 pointer-events-none">
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, 10]} intensity={1} color="#e84e1b" />
        <pointLight position={[0, 5, -5]} intensity={0.8} color="#7c3aed" />
        
        <FloatingSphere position={[4.5, 2, -2]} color="#e84e1b" size={1.2} speed={1.2} distort={0.4} />
        <FloatingSphere position={[-4.5, -1, -3]} color="#7c3aed" size={1} speed={1} distort={0.5} />
        <FloatingSphere position={[1.5, -3, 0]} color="#fb923c" size={0.5} speed={2} distort={0.3} />
        <FloatingSphere position={[-2, 3, 1]} color="#a78bfa" size={0.4} speed={2.5} distort={0.6} />
        <FloatingSphere position={[0, -0.5, -5]} color="#7c3aed" size={1.8} speed={0.8} distort={0.2} />
        <FloatingSphere position={[6, -2, -1]} color="#e84e1b" size={0.3} speed={3} distort={0.8} />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      </Suspense>
    </Canvas>
  </div>
);

export default HeroScene;

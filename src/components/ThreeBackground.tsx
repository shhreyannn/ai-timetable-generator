import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingGrid() {
  const meshRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const size = 6;
    const spacing = 1.5;
    for (let x = -size; x <= size; x += spacing) {
      for (let y = -size; y <= size; y += spacing) {
        for (let z = -2; z <= 2; z += spacing) {
          pts.push([x, y, z]);
        }
      }
    }
    return pts;
  }, []);

  const connections = useMemo(() => {
    const lines: [number, number, number][] = [];
    const threshold = 2.0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const dz = points[i][2] - points[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          lines.push(...points[i], ...points[j]);
        }
      }
    }
    return new Float32Array(lines);
  }, [points]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Nodes */}
      {points.map((pt, i) => (
        <mesh key={i} position={pt}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.3} />
        </mesh>
      ))}
      {/* Connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={connections}
            count={connections.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1F3A5F" transparent opacity={0.08} />
      </lineSegments>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <FloatingGrid />
      </Canvas>
    </div>
  );
}

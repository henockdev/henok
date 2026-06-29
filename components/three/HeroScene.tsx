'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { forwardRef, useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

// --- Particle Galaxy ---
function TechGalaxy({ count = 1800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const palette = [
      new THREE.Color('#38BDF8'),
      new THREE.Color('#8B5CF6'),
      new THREE.Color('#22D3EE'),
      new THREE.Color('#A78BFA'),
    ];
    for (let i = 0; i < count; i++) {
      const radius = Math.pow(Math.random(), 0.6) * 12;
      const branch = ((i % 5) / 5) * Math.PI * 2;
      const spinAngle = radius * 0.25;
      const randomX = (Math.random() - 0.5) * 0.6;
      const randomY = (Math.random() - 0.5) * 0.6;
      const randomZ = (Math.random() - 0.5) * 0.6;
      positions[i * 3] = Math.cos(branch + spinAngle) * radius + randomX;
      positions[i * 3 + 1] = randomY * 2.2;
      positions[i * 3 + 2] = Math.sin(branch + spinAngle) * radius + randomZ;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = Math.random() * 0.05 + 0.015;
    }
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.04 + mouse.current.x * 0.3;
    ref.current.rotation.x = mouse.current.y * 0.15;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      arr[ix + 1] += Math.sin(t * 0.5 + i * 0.02) * 0.0008;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// --- Floating Skill Cubes ---
function SkillCubes() {
  const group = useRef<THREE.Group>(null);
  const cubes = useRef<(THREE.Mesh | null)[]>([]);
  const skills = useMemo(
    () => [
      { label: 'React', color: '#38BDF8' },
      { label: 'TypeScript', color: '#3178C6' },
      { label: 'Python', color: '#22D3EE' },
      { label: 'Node', color: '#10B981' },
      { label: 'AI', color: '#8B5CF6' },
      { label: 'Mobile', color: '#A78BFA' },
      { label: 'Cloud', color: '#06B6D4' },
      { label: 'Network', color: '#F59E0B' },
    ],
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.08;
    cubes.current.forEach((cube, i) => {
      if (!cube) return;
      cube.rotation.x = t * 0.4 + i;
      cube.rotation.y = t * 0.3 + i * 0.5;
      const s = 1 + Math.sin(t * 1.2 + i) * 0.08;
      cube.scale.set(s, s, s);
    });
  });

  return (
    <group ref={group}>
      {skills.map((skill, i) => {
        const angle = (i / skills.length) * Math.PI * 2;
        const radius = 4.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <FloatCube
            key={skill.label}
            position={[x, Math.sin(i) * 0.6, z]}
            color={skill.color}
            label={skill.label}
            ref={(m) => {
              cubes.current[i] = m;
            }}
          />
        );
      })}
    </group>
  );
}

interface FloatCubeProps {
  position: [number, number, number];
  color: string;
  label: string;
}

const FloatCube = forwardRef<THREE.Mesh, FloatCubeProps>(({ position, color, label }, ref) => (
  <group position={position}>
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.42, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.6} roughness={0.2} />
    </mesh>
    <pointLight color={color} intensity={1.2} distance={2.4} />
  </group>
));
FloatCube.displayName = 'FloatCube';

// --- Neural Network ---
function NeuralNetwork() {
  const points = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouse = useRef(new THREE.Vector3());

  const nodes = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    const layers = [6, 8, 8, 5];
    const spacing = 1.4;
    layers.forEach((n, li) => {
      const offsetX = (li - (layers.length - 1) / 2) * spacing;
      for (let i = 0; i < n; i++) {
        const offsetY = (i - (n - 1) / 2) * spacing * 0.5;
        arr.push(new THREE.Vector3(offsetX, offsetY, 0));
      }
    });
    return arr;
  }, []);

  const edges = useMemo(() => {
    const list: number[] = [];
    const layerSizes = [6, 8, 8, 5];
    let idx = 0;
    const layerOffsets: number[] = [];
    for (const n of layerSizes) {
      layerOffsets.push(idx);
      idx += n;
    }
    for (let l = 0; l < layerSizes.length - 1; l++) {
      for (let i = 0; i < layerSizes[l]; i++) {
        for (let j = 0; j < layerSizes[l + 1]; j++) {
          list.push(layerOffsets[l] + i, layerOffsets[l + 1] + j);
        }
      }
    }
    return list;
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const nodePositions = points.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    const linePositions = linesRef.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!nodePositions || !linePositions) return;

    const npArr = nodePositions.array as Float32Array;
    const lpArr = linePositions.array as Float32Array;

    nodes.forEach((n, i) => {
      const ix = i * 3;
      const wob = Math.sin(t * 1.2 + i * 0.4) * 0.1;
      npArr[ix] = n.x + mouse.current.x * 0.2 + wob;
      npArr[ix + 1] = n.y + mouse.current.y * 0.2 + Math.cos(t + i) * 0.08;
      npArr[ix + 2] = n.z + Math.sin(t * 0.5 + i) * 0.05;
    });
    nodePositions.needsUpdate = true;

    for (let i = 0; i < edges.length; i += 2) {
      const a = edges[i];
      const b = edges[i + 1];
      lpArr[i * 3] = npArr[a * 3];
      lpArr[i * 3 + 1] = npArr[a * 3 + 1];
      lpArr[i * 3 + 2] = npArr[a * 3 + 2];
      lpArr[i * 3 + 3] = npArr[b * 3];
      lpArr[i * 3 + 4] = npArr[b * 3 + 1];
      lpArr[i * 3 + 5] = npArr[b * 3 + 2];
    }
    linePositions.needsUpdate = true;
  });

  return (
    <group position={[0, 0, -3]}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z])), 3]}
          />
        </bufferGeometry>
        <pointsMaterial color="#22D3EE" size={0.08} sizeAttenuation transparent opacity={0.9} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(edges.length * 3), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#8B5CF6" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

// --- Digital Earth ---
function DigitalEarth() {
  const ref = useRef<THREE.Mesh>(null);
  const dotsRef = useRef<THREE.Points>(null);

  const dots = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const palette = [new THREE.Color('#38BDF8'), new THREE.Color('#22D3EE'), new THREE.Color('#8B5CF6')];
    const R = 1.5;
    for (let i = 0; i < 1500; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const x = R * Math.sin(phi) * Math.cos(theta);
      const y = R * Math.sin(phi) * Math.sin(theta);
      const z = R * Math.cos(phi);
      positions.push(x, y, z);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors.push(c.r, c.g, c.b);
    }
    return { positions: new Float32Array(positions), colors: new Float32Array(colors) };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.1;
    if (dotsRef.current) dotsRef.current.rotation.y = t * 0.1;
  });

  return (
    <group position={[5.5, -1, -2]} scale={0.8}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshStandardMaterial color="#0B1120" emissive="#38BDF8" emissiveIntensity={0.05} transparent opacity={0.15} wireframe />
      </mesh>
      <points ref={dotsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dots.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dots.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial vertexColors size={0.04} sizeAttenuation transparent opacity={0.9} />
      </points>
    </group>
  );
}

// --- Lights ---
function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} color="#38BDF8" intensity={2.5} />
      <pointLight position={[-6, -4, 4]} color="#8B5CF6" intensity={2} />
      <pointLight position={[0, -6, -6]} color="#22D3EE" intensity={1.5} />
    </>
  );
}

// --- Top-level Canvas ---
export function HeroScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 -z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Lights />
        <TechGalaxy />
        <SkillCubes />
        <NeuralNetwork />
        <DigitalEarth />
      </Canvas>
    </div>
  );
}

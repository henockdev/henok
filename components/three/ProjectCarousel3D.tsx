'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

/**
 * ProjectCarousel3D
 * ─────────────────────────────────────────────────────────────
 * A rotating 3D carousel of the user's 4 projects, rendered
 * behind/below the hero text. Each card shows the project
 * thumbnail as a textured plane. Users can:
 *   • drag to rotate the carousel
 *   • click a card to navigate to /projects/[slug]
 *   • let it auto-rotate when idle
 *
 * Positioned in the lower 40% of the hero so it doesn't fight
 * with the centered headline.
 */

interface ProjectTile {
  slug: string;
  title: string;
  category: string;
  thumb: string;
  accent: string; // hex
}

interface ProjectCarouselProps {
  projects: ProjectTile[];
  /** Where to drop the camera height in the hero (in y units) */
  cameraY?: number;
  /** Where to position the carousel in y */
  carouselY?: number;
}

const CARD_W = 2.6;
const CARD_H = 1.6;
const RADIUS = 4.2;

function Tile({
  index,
  total,
  tile,
  angle,
  texture,
}: {
  index: number;
  total: number;
  tile: ProjectTile;
  angle: number;
  texture: THREE.Texture;
}) {
  const ref = useRef<THREE.Group>(null);
  const router = useRouter();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Subtle hover bob per card
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.7 + index * 1.2) * 0.06;
  });

  return (
    <group ref={ref} position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]} rotation={[0, angle, 0]}>
      {/* Card backplate (glow) */}
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[CARD_W + 0.2, CARD_H + 0.2]} />
        <meshBasicMaterial color={tile.accent} transparent opacity={0.18} />
      </mesh>
      {/* Card body (image) */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/projects/${tile.slug}`);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = '';
        }}
      >
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Card border */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[CARD_W + 0.04, CARD_H + 0.04]} />
        <meshBasicMaterial color={tile.accent} transparent opacity={0.6} />
      </mesh>
      {/* Caption label below */}
      <Html
        center
        position={[0, -CARD_H / 2 - 0.25, 0.02]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#fff',
            textTransform: 'uppercase',
            background: 'rgba(11,17,32,0.85)',
            padding: '4px 10px',
            borderRadius: 999,
            border: `1px solid ${tile.accent}55`,
            backdropFilter: 'blur(8px)',
            whiteSpace: 'nowrap',
          }}
        >
          {tile.category} · {tile.title.split(' — ')[0]}
        </div>
      </Html>
    </group>
  );
}

function ImageTile({ index, total, tile, angle }: { index: number; total: number; tile: ProjectTile; angle: number }) {
  // THREE.TextureLoader doesn't speak SVG — and crashes the whole scene when
  // it can't decode one. Route every thumbnail through an <img> → canvas →
  // CanvasTexture pipeline instead. Browsers handle SVG natively, JPG/PNG too,
  // and we never throw: a broken asset falls back to a coloured tile.
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      if (cancelled) return;
      const w = img.naturalWidth || 512;
      const h = img.naturalHeight || 320;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // For SVG without intrinsic size, browsers report 0; give it a sane box.
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      setTexture(tex);
    };
    img.onerror = () => {
      // Swallow — render a coloured card without texture.
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = tile.accent;
      ctx.fillRect(0, 0, 512, 320);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      setTexture(tex);
    };
    img.src = tile.thumb;
    return () => {
      cancelled = true;
    };
  }, [tile.thumb, tile.accent]);

  if (!texture) return null;
  return <Tile index={index} total={total} tile={tile} angle={angle} texture={texture} />;
}

function Carousel({
  projects,
  rotationY,
  dragging,
}: {
  projects: ProjectTile[];
  rotationY: { current: number };
  dragging: { current: boolean };
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Auto-rotate when not dragging
    if (!dragging.current) {
      rotationY.current += delta * 0.08;
    }
    groupRef.current.rotation.y = rotationY.current;
  });
  return (
    <group ref={groupRef} position={[0, -1.2, 0]}>
      {projects.map((p, i) => {
        const angle = (i / projects.length) * Math.PI * 2;
        return <ImageTile key={p.slug} index={i} total={projects.length} tile={p} angle={angle} />;
      })}
    </group>
  );
}

function DragController({ rotationY, dragging }: { rotationY: { current: number }; dragging: { current: boolean } }) {
  useEffect(() => {
    let lastX = 0;
    let downX = 0;
    let downY = 0;
    let isDown = false;

    const onDown = (e: PointerEvent) => {
      // Only intercept if the user starts dragging on the lower hero area
      const y = e.clientY / window.innerHeight;
      if (y < 0.45) return;
      isDown = true;
      downX = e.clientX;
      downY = e.clientY;
      lastX = e.clientX;
      dragging.current = true;
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      rotationY.current += dx * 0.005;
    };
    const onUp = () => {
      isDown = false;
      // delay to let click-vs-drag settle
      setTimeout(() => {
        dragging.current = false;
      }, 50);
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [rotationY, dragging]);
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[6, 6, 6]} color="#38BDF8" intensity={1.5} />
      <pointLight position={[-6, 3, -4]} color="#8B5CF6" intensity={1.2} />
      <pointLight position={[0, -6, 4]} color="#22D3EE" intensity={0.8} />
    </>
  );
}

export function ProjectCarousel3D({ projects }: ProjectCarouselProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Persistent refs so the closure in DragController stays stable
  const rotationY = useRef(0);
  const dragging = useRef(false);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 50 }}
          dpr={[1, 1.6]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Lights />
          <DragController rotationY={rotationY} dragging={dragging} />
          <Carousel projects={projects} rotationY={rotationY} dragging={dragging} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}

/**
 * CanvasErrorBoundary
 * A single failed texture used to nuke the whole hero (and the page).
 * This catches anything thrown inside the 3D tree and quietly degrades
 * to a no-op — the rest of the hero text/buttons/carousel stay alive.
 */
class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn('[ProjectCarousel3D] 3D scene crashed, falling back:', error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
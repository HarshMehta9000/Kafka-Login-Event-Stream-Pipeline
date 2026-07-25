"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html, Float } from "@react-three/drei";
import * as THREE from "three";

const DESTS = [
  { name: "iOS", color: "#22d3ee", p: [-2.6, 1.3, -0.4] as [number, number, number], c: [-1.1, 1.7, 0.2] as [number, number, number], w: 0.5 },
  { name: "Android", color: "#34d399", p: [2.7, 0.5, -0.4] as [number, number, number], c: [1.2, 1.3, 0.2] as [number, number, number], w: 0.42 },
  { name: "Missing", color: "#f59e0b", p: [0.2, -2, -0.8] as [number, number, number], c: [0.3, -0.6, 0.5] as [number, number, number], w: 0.08 },
];

const POOL = 46;

function pickIdx() {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < DESTS.length; i++) {
    acc += DESTS[i].w;
    if (r <= acc) return i;
  }
  return 0;
}

function River() {
  const curves = useMemo(
    () => DESTS.map((d) => new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(...d.c), new THREE.Vector3(...d.p))),
    []
  );
  const lines = useMemo(() => curves.map((cv) => cv.getPoints(40).map((v) => [v.x, v.y, v.z] as [number, number, number])), [curves]);

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const particles = useRef(
    Array.from({ length: POOL }).map(() => ({ idx: pickIdx(), t: Math.random(), speed: 0.25 + Math.random() * 0.35 }))
  );

  const router = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (router.current) router.current.rotation.y += delta * 0.4;
    const ps = particles.current;
    for (let i = 0; i < POOL; i++) {
      const m = meshRefs.current[i];
      if (!m) continue;
      const p = ps[i];
      p.t += delta * p.speed;
      if (p.t > 1) {
        p.t = 0;
        p.idx = pickIdx();
      }
      const pos = curves[p.idx].getPoint(p.t);
      m.position.copy(pos);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.color.set(DESTS[p.idx].color);
      mat.opacity = 0.3 + p.t * 0.7;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 0, 4]} intensity={40} color="#ffffff" />

      {/* paths */}
      {lines.map((pts, i) => (
        <Line key={i} points={pts} color={DESTS[i].color} lineWidth={1.2} transparent opacity={0.28} />
      ))}

      {/* router core */}
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.7}>
        <mesh ref={router}>
          <icosahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.6} wireframe />
        </mesh>
        <Html position={[0, -0.75, 0]} center distanceFactor={11}>
          <div className="select-none rounded border border-white/10 bg-black/60 px-2 py-0.5 text-[11px] text-cyan-200 backdrop-blur">
            Router
          </div>
        </Html>
      </Float>

      {/* destinations */}
      {DESTS.map((d) => (
        <group key={d.name} position={d.p}>
          <mesh>
            <sphereGeometry args={[0.18, 18, 18]} />
            <meshStandardMaterial color={d.color} emissive={d.color} emissiveIntensity={0.7} />
          </mesh>
          <Html position={[0, -0.45, 0]} center distanceFactor={12}>
            <div className="select-none whitespace-nowrap rounded border border-white/10 bg-black/60 px-1.5 py-0.5 text-[10.5px] backdrop-blur" style={{ color: d.color }}>
              {d.name}
            </div>
          </Html>
        </group>
      ))}

      {/* particle pool */}
      {Array.from({ length: POOL }).map((_, i) => (
        <mesh key={i} ref={(el) => { meshRefs.current[i] = el; }}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
        </mesh>
      ))}

      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </>
  );
}

export default function EventRiver3D() {
  return (
    <section id="river" className="mx-auto max-w-6xl px-5 py-20">
      <div className="mb-8 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">/ fan-out in 3d</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">One stream becomes three.</h2>
        <p className="mt-4 text-muted">
          The router inspects each event and fans it to the matching topic. Drag to orbit. At scale,
          partitioning by <span className="font-mono text-fg">user_id</span> hash keeps every user&apos;s events
          ordered within a topic, so downstream consumers see each user in sequence.
        </p>
      </div>
      <div className="relative h-[420px] overflow-hidden rounded-2xl border border-line bg-[#060a10] sm:h-[480px]">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: true }}>
          <fog attach="fog" args={["#060a10", 7, 16]} />
          <River />
        </Canvas>
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] text-slate-400 backdrop-blur">
          drag to orbit
        </div>
      </div>
    </section>
  );
}

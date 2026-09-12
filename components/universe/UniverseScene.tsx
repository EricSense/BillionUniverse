"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";
import type { ObjectInstance, Traversability, Universe } from "@/lib/schema";

export type ViewMode = "geometry" | "segment" | "physics" | "traverse";

const SEGMENT: Record<string, string> = {
  pallet_rack: "#c45c26",
  pallet: "#c9a66b",
  carton: "#e0c090",
  bin: "#d4a574",
  forklift: "#d6ff3f",
  pallet_jack: "#b6e05a",
  conveyor: "#6b7c94",
  dock_door: "#7ee0c8",
  column: "#8a9188",
  wall: "#5c6154",
  shelf: "#c45c26",
  display: "#d4894a",
  counter: "#b7a48a",
  fixture: "#d4894a",
  cart: "#7ee0c8",
  debris: "#8b6914",
  safety_barrier: "#ff6b4a",
  door: "#7ee0c8",
  unknown: "#a8b09a",
};

function toThree(x: number, y: number, z: number): [number, number, number] {
  return [x, z, y];
}

function colorFor(o: ObjectInstance, mode: ViewMode): string {
  if (mode === "physics") return o.physics.movable ? "#d6ff3f" : "#5c6154";
  if (mode === "segment") return SEGMENT[o.class] ?? "#a8b09a";
  if (o.class === "pallet_rack" || o.class === "shelf") return "#b85a24";
  if (o.class === "pallet") return "#a67c3d";
  if (o.class === "carton") return "#c9a66b";
  if (o.class === "forklift") return "#4a4f3e";
  if (o.class === "dock_door") return "#3d6b62";
  return "#8a8f82";
}

function Occupancy({ trav }: { trav: Traversability }) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = trav.width;
    c.height = trav.height;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const img = ctx.createImageData(trav.width, trav.height);
    for (let y = 0; y < trav.height; y++) {
      for (let x = 0; x < trav.width; x++) {
        const v = trav.grid[y]?.[x] ?? 0.15;
        const i = ((trav.height - 1 - y) * trav.width + x) * 4;
        if (v === 0) {
          img.data.set([80, 224, 200, 200], i);
        } else if (v === 1) {
          img.data.set([196, 92, 38, 220], i);
        } else {
          img.data.set([20, 22, 16, 90], i);
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }, [trav]);
  if (!texture) return null;
  const w = trav.width * trav.resolution_m;
  const h = trav.height * trav.resolution_m;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[w / 2, 0.04, h / 2]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} transparent opacity={0.85} />
    </mesh>
  );
}

function BoxObject({
  object: o,
  mode,
  selected,
  onSelect,
}: {
  object: ObjectInstance;
  mode: ViewMode;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const sx = Math.max(0.08, o.aabb.max[0] - o.aabb.min[0]);
  const sy = Math.max(0.08, o.aabb.max[1] - o.aabb.min[1]);
  const sz = Math.max(0.08, o.aabb.max[2] - o.aabb.min[2]);
  const cx = (o.aabb.min[0] + o.aabb.max[0]) / 2;
  const cy = (o.aabb.min[1] + o.aabb.max[1]) / 2;
  const cz = (o.aabb.min[2] + o.aabb.max[2]) / 2;
  const color = colorFor(o, mode);
  return (
    <mesh
      position={toThree(cx, cy, cz)}
      rotation={[0, -o.yaw, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(o.id);
      }}
    >
      <boxGeometry args={[sx, sz, sy]} />
      <meshStandardMaterial
        color={color}
        emissive={selected ? "#d6ff3f" : "#000000"}
        emissiveIntensity={selected ? 0.35 : 0}
        roughness={0.72}
        metalness={o.class === "pallet_rack" ? 0.35 : 0.08}
      />
    </mesh>
  );
}

export function UniverseScene({
  universe,
  mode,
  selectedId,
  onSelect,
}: {
  universe: Universe;
  mode: ViewMode;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const sx = universe.site.bounds.max[0];
  const sy = universe.site.bounds.max[1];
  return (
    <Canvas
      camera={{ position: [sx * 0.12, Math.max(18, sx * 0.22), sy * 0.12], fov: 42 }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={["#0c0d0a"]} />
      <hemisphereLight args={["#efe8d6", "#1a1d14", 0.7]} />
      <directionalLight position={[sx, 40, sy]} intensity={1.15} />
      <ambientLight intensity={0.25} />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[sx / 2, 0, sy / 2]}
        onClick={() => onSelect(null)}
      >
        <planeGeometry args={[sx, sy]} />
        <meshStandardMaterial color="#9a958c" roughness={0.95} />
      </mesh>
      <Grid
        position={[sx / 2, 0.01, sy / 2]}
        args={[sx, sy]}
        cellSize={1}
        cellThickness={0.4}
        sectionSize={5}
        sectionThickness={0.9}
        cellColor="#2c3124"
        sectionColor="#3d4334"
        fadeDistance={120}
      />
      {mode === "traverse" ? <Occupancy trav={universe.traversability} /> : null}
      {universe.objects.map((o) => (
        <BoxObject
          key={o.id}
          object={o}
          mode={mode}
          selected={selectedId === o.id}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        target={[sx / 2, 1.2, sy / 2]}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={8}
        maxDistance={120}
      />
    </Canvas>
  );
}

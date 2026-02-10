import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { PBRMapSet } from '../../types/generation';

interface Tiling3DPreviewProps {
  maps: PBRMapSet;
}

function TiledMaterial({ maps, repeat, lighting }: { maps: PBRMapSet; repeat: number; lighting: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const albedoTexture = useLoader(THREE.TextureLoader, maps.albedo);
  const normalTexture = useLoader(THREE.TextureLoader, maps.normal);
  const roughnessTexture = useLoader(THREE.TextureLoader, maps.roughness);
  const metalnessTexture = useLoader(THREE.TextureLoader, maps.metallic);

  useEffect(() => {
    [albedoTexture, normalTexture, roughnessTexture, metalnessTexture].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeat, repeat);
    });
  }, [albedoTexture, normalTexture, roughnessTexture, metalnessTexture, repeat]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={albedoTexture}
        normalMap={normalTexture}
        roughnessMap={roughnessTexture}
        metalnessMap={metalnessTexture}
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
}

export default function Tiling3DPreview({ maps }: Tiling3DPreviewProps) {
  const [repeat, setRepeat] = useState(2);
  const [lighting, setLighting] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <Label>Tiling Repeat</Label>
          <Select value={String(repeat)} onValueChange={(v) => setRepeat(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1×1</SelectItem>
              <SelectItem value="2">2×2</SelectItem>
              <SelectItem value="4">4×4</SelectItem>
              <SelectItem value="8">8×8</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="lighting">Enhanced Lighting</Label>
          <Switch id="lighting" checked={lighting} onCheckedChange={setLighting} />
        </div>
      </div>

      <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
        <Canvas shadows camera={{ position: [0, 0, 6], fov: 50 }}>
          <color attach="background" args={['#0a0a0a']} />
          <ambientLight intensity={lighting ? 0.3 : 0.5} />
          {lighting && (
            <>
              <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
              <pointLight position={[-5, 5, -5]} intensity={0.5} />
            </>
          )}
          <TiledMaterial maps={maps} repeat={repeat} lighting={lighting} />
          <OrbitControls enablePan enableZoom enableRotate />
        </Canvas>
      </div>

      <p className="text-xs text-muted-foreground">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </p>
    </div>
  );
}

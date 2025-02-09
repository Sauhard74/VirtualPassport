import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const earthMap = new THREE.TextureLoader().load('/earth-daymap.jpg');
  const earthBumpMap = new THREE.TextureLoader().load('/earth-bump.jpg');
  const earthSpecMap = new THREE.TextureLoader().load('/earth-specular.jpg');
  const cloudsMap = new THREE.TextureLoader().load('/earth-clouds.png');

  return (
    <>
      {/* Earth */}
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhongMaterial
          map={earthMap}
          bumpMap={earthBumpMap}
          bumpScale={0.1}
          specularMap={earthSpecMap}
          specular={new THREE.Color('grey')}
          shininess={5}
        />
      </mesh>
      
      {/* Clouds */}
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[1.505, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
        />
      </mesh>

      {/* Lights */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
    </>
  );
}

export function Globe() {
  return (
    <div className="w-72 h-72 relative">
      <Canvas
        camera={{ 
          position: [0, 0, 4], 
          fov: 45 
        }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
      >
        <Earth />
        <OrbitControls 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
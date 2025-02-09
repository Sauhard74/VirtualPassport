import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
  const earthMap = new THREE.TextureLoader().load('/earth-daymap.jpg');
  const earthBumpMap = new THREE.TextureLoader().load('/earth-bump.jpg');
  const earthSpecMap = new THREE.TextureLoader().load('/earth-specular.jpg');
  const cloudsMap = new THREE.TextureLoader().load('/earth-clouds.jpg');

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    '/earth-clouds.jpg',
    undefined,
    undefined,
    (error) => {
      console.error('Error loading clouds texture:', error);
    }
  );

  return (
    <>
      {/* Earth */}
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshPhongMaterial
          map={earthMap}
          bumpMap={earthBumpMap}
          bumpScale={0.05}
          specularMap={earthSpecMap}
          specular={new THREE.Color('grey')}
          shininess={20}
        />
      </mesh>
      
      {/* Clouds */}
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <sphereGeometry args={[2.005, 32, 32]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Lights */}
      <ambientLight intensity={1.2} />
      <pointLight position={[10, 10, 10]} intensity={3.5} />
      <pointLight position={[-10, -10, -10]} intensity={2.5} />
    </>
  );
}

export function Globe() {
  return (
    <div className="w-96 h-96 relative" style={{ background: 'transparent' }}>
      <Canvas
        camera={{ 
          position: [0, 0, 6],
          fov: 45 
        }}
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 2
        }}
        gl={{ 
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: false
        }}
      >
        <Earth />
        <OrbitControls 
          enableZoom={false}
          autoRotate
          autoRotateSpeed={2.5}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
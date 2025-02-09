import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(500, 500);
    containerRef.current.appendChild(renderer.domElement);

    // Create globe
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/earth-map.jpg'); // You'll need to add this image
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 5
    });
    const globe = new THREE.Mesh(geometry, material);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 3, 5);

    scene.add(globe);
    scene.add(ambientLight);
    scene.add(pointLight);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      globe.rotation.y += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0"
        style={{ width: '500px', height: '500px' }}
      />
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <span className="gradient-text">Virtual Travel</span>
          <br />
          Experience
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Embark on a daily adventure to discover new countries, cultures, and experiences.
        </p>
      </div>
    </div>
  );
}
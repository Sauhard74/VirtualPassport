import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      canvas: document.createElement('canvas')
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Earth setup
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    // Load Earth textures
    const earthMap = textureLoader.load('/earth-daymap.jpg');
    const bumpMap = textureLoader.load('/earth-bump.jpg');
    const specularMap = textureLoader.load('/earth-specular.jpg');
    const cloudsMap = textureLoader.load('/earth-clouds.png');

    // Earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthMap,
      bumpMap: bumpMap,
      bumpScale: 0.1,
      specularMap: specularMap,
      specular: new THREE.Color('grey'),
      shininess: 10
    });

    // Create Earth mesh
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Add clouds
    const cloudsGeometry = new THREE.SphereGeometry(5.1, 64, 64);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.4
    });
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(15, 10, 15);
    scene.add(pointLight);

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.002;
      clouds.rotation.y += 0.0023;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div 
        ref={containerRef} 
        className="absolute inset-0 z-0"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Virtual Travel
          </span>
          <br />
          <span className="text-white">Experience</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Embark on a daily adventure to discover new countries, cultures, and experiences.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity">
            Start Your Journey
          </button>
          <button className="px-6 py-3 bg-gray-800 rounded-lg text-white font-medium hover:bg-gray-700 transition-colors">
            View Passport
          </button>
        </div>
      </div>
    </div>
  );
}
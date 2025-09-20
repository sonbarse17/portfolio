"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import { Vector3 } from "three";
import countries from "../../data/globe.json";

function Globe({ globeConfig, data, points, scale }) {
  const { scene } = useThree();
  const globeRef = useRef();
  const [isReady, setIsReady] = useState(false);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.scale.set(scale, scale, scale);
    }
  });

  useEffect(() => {
    let mounted = true;
    
    if (!globeRef.current && scene && countries?.features && mounted) {
      try {
        // Create globe with immediate rendering
        const globe = new ThreeGlobe({ waitForGlobeReady: false });
        
        // Basic globe setup
        globe
          .globeImageUrl(null)
          .showGlobe(true)
          .showAtmosphere(true)
          .atmosphereColor('#ffffff')
          .atmosphereAltitude(0.1);

        // Add countries immediately
        if (countries.features && Array.isArray(countries.features)) {
          globe
            .hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.7)
            .hexPolygonColor(() => 'rgba(255,255,255,0.4)')
            .hexPolygonAltitude(0.01);
        }

        // Set material color
        requestAnimationFrame(() => {
          const globeMaterial = globe.globeMaterial();
          if (globeMaterial && mounted) {
            globeMaterial.color.setHex(0x062056);
            setIsReady(true);
          }
        });
        
        if (mounted) {
          globeRef.current = globe;
          scene.add(globe);
        }
      } catch (error) {
        console.error('Globe initialization failed:', error);
      }
    }
    
    return () => {
      mounted = false;
    };

    // Add arcs and points immediately
    if (globeRef.current && data && isReady && Array.isArray(data)) {
      // Arcs
      globeRef.current
        .arcsData(data)
        .arcStartLat(d => d.startLat)
        .arcStartLng(d => d.startLng)
        .arcEndLat(d => d.endLat)
        .arcEndLng(d => d.endLng)
        .arcColor(d => d.color)
        .arcAltitude(d => d.arcAlt)
        .arcStroke(0.3)
        .arcDashLength(0.25)
        .arcDashGap(2)
        .arcDashAnimateTime(2000);

      // Points
      if (points && Array.isArray(points)) {
        const pinPoints = points.map(point => ({
          lat: point.lat,
          lng: point.lng,
          color: '#3b82f6',
          size: 1.2
        }));

        globeRef.current
          .pointsData(pinPoints)
          .pointColor(d => d.color)
          .pointAltitude(0)
          .pointRadius(d => d.size)
          .pointsMerge(false)
          .pointResolution(16);
      }

      // Simplified rings
      const impactInterval = setInterval(() => {
        if (globeRef.current) {
          const rings = data.map(arc => ({
            lat: arc.endLat,
            lng: arc.endLng,
            maxR: 3,
            propagationSpeed: 5,
            repeatPeriod: 2000
          }));
          
          globeRef.current
            .ringsData(rings)
            .ringColor(() => '#3b82f6')
            .ringMaxRadius(3)
            .ringPropagationSpeed(5)
            .ringRepeatPeriod(2000);
        }
      }, 2000);

      return () => clearInterval(impactInterval);
    }

    return () => {
      if (globeRef.current && scene) {
        scene.remove(globeRef.current);
        globeRef.current = null;
      }
    };
  }, [scene, globeConfig, data, points, isReady]);

  return null;
}

export function World({ data, globeConfig, points }) {
  const [scale, setScale] = useState(1.5);
  const containerRef = useRef();

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      setScale(prev => {
        const newScale = prev + (e.deltaY > 0 ? -0.1 : 0.1);
        return Math.max(0.5, Math.min(3, newScale));
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);



  return (
    <div 
      ref={containerRef}
      style={{ 
        width: "100%", 
        height: "80vh", 
        minHeight: "600px", 
        cursor: "grab",
        overflow: "visible"
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 250], fov: 60 }}
        style={{ background: "transparent" }}
        performance={{ min: 0.8 }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[100, 100, 100]} intensity={1} />
        <pointLight position={[-200, 500, 200]} intensity={0.8} />
        
        <Globe globeConfig={globeConfig} data={data} points={points} scale={scale} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={globeConfig.autoRotate}
          autoRotateSpeed={globeConfig.autoRotateSpeed}
          minDistance={250}
          maxDistance={25E}
        />
      </Canvas>
    </div>
  );
}
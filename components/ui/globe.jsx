"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import countries from "../../data/globe.json";

extend({ ThreeGlobe });

function Globe({ globeConfig, data, points, scale }) {
  const { scene } = useThree();
  const globeRef = useRef();

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
      globeRef.current.scale.set(scale, scale, scale);
    }
  });

  useEffect(() => {
    if (!globeRef.current) {
      globeRef.current = new ThreeGlobe()
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(globeConfig.showAtmosphere)
        .atmosphereColor(globeConfig.atmosphereColor)
        .atmosphereAltitude(globeConfig.atmosphereAltitude)
        .hexPolygonColor(() => globeConfig.polygonColor);

      const globeMaterial = globeRef.current.globeMaterial();
      globeMaterial.color = new Color(globeConfig.globeColor);
      globeMaterial.emissive = new Color(globeConfig.emissive);
      globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
      globeMaterial.shininess = globeConfig.shininess || 0.9;

      scene.add(globeRef.current);
    }

    if (data && globeRef.current) {
      // Animated arcs (moving arrows)
      globeRef.current
        .arcsData(data)
        .arcStartLat(d => d.startLat)
        .arcStartLng(d => d.startLng)
        .arcEndLat(d => d.endLat)
        .arcEndLng(d => d.endLng)
        .arcColor(d => d.color)
        .arcAltitude(d => d.arcAlt)
        .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
        .arcDashLength(0.25)
        .arcDashInitialGap(d => d.order * 0.5)
        .arcDashGap(2)
        .arcDashAnimateTime(globeConfig.arcTime || 2000);

      // Cyan circle points
      if (points) {
        const pinPoints = points.map(point => ({
          lat: point.lat,
          lng: point.lng,
          color: '#06b6d4',
          size: 0.6,
          name: point.name
        }));

        globeRef.current
          .pointsData(pinPoints)
          .pointColor(d => d.color)
          .pointAltitude(0.02)
          .pointRadius(d => d.size)
          .pointsMerge(true)
          .pointResolution(8);
      }
    }

    // Wave rings when arrows pass through points
    const interval = setInterval(() => {
      if (globeRef.current && data && points) {
        const activePoints = [];
        
        // Add rings at arc endpoints (where arrows arrive)
        data.forEach(arc => {
          activePoints.push(
            { lat: arc.startLat, lng: arc.startLng },
            { lat: arc.endLat, lng: arc.endLng }
          );
        });
        
        const ringsData = activePoints.map(point => ({
          lat: point.lat,
          lng: point.lng,
          maxR: 2,
          propagationSpeed: 4,
          repeatPeriod: 1500
        }));
        
        globeRef.current
          .ringsData(ringsData)
          .ringColor(() => '#06b6d4')
          .ringMaxRadius(2)
          .ringPropagationSpeed(4)
          .ringRepeatPeriod(1500);
      }
    }, 1500);

    return () => {
      clearInterval(interval);
      if (globeRef.current) {
        scene.remove(globeRef.current);
      }
    };
  }, [scene, globeConfig, data, points]);

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
        return Math.max(0.5, Math.min(3, newScale)); // Limit between 0.5x and 3x
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
        camera={{ position: [0, 0, 180], fov: 75 }}
        style={{ background: "transparent", overflow: "visible" }}
      >
        <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
        <directionalLight
          color={globeConfig.directionalLeftLight}
          position={new Vector3(-400, 100, 400)}
        />
        <directionalLight
          color={globeConfig.directionalTopLight}
          position={new Vector3(-200, 500, 200)}
        />
        <pointLight
          color={globeConfig.pointLight}
          position={new Vector3(-200, 500, 200)}
          intensity={0.8}
        />
        
        <Globe globeConfig={globeConfig} data={data} points={points} scale={scale} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={globeConfig.autoRotate}
          autoRotateSpeed={globeConfig.autoRotateSpeed}
          minDistance={300}
          maxDistance={300}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
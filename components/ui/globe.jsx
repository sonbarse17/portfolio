"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import countries from "../../data/globe.json";

function Globe({ globeConfig, data, points, scale, isPaused, onLocationClick }) {
  const { scene } = useThree();
  const globeRef = useRef();
  const [isReady, setIsReady] = useState(false);

  // Optimized scaling
  useFrame(() => {
    if (globeRef.current && globeRef.current.scale.x !== scale) {
      globeRef.current.scale.setScalar(scale);
    }
  });

  // Memoized points
  const memoizedPoints = useMemo(() => {
    if (!points) return [];
    return points.map(point => ({
      lat: point.lat,
      lng: point.lng,
      color: '#3b82f6',
      size: 1.2,
      name: point.name
    }));
  }, [points]);

  // Globe initialization
  useEffect(() => {
    if (globeRef.current || !scene || !countries?.features) return;

    const globe = new ThreeGlobe({ waitForGlobeReady: false });
    
    globe
      .globeImageUrl(null)
      .showGlobe(true)
      .showAtmosphere(true)
      .atmosphereColor('#ffffff')
      .atmosphereAltitude(0.1)
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(2)
      .hexPolygonMargin(0.7)
      .hexPolygonColor(() => 'rgba(255,255,255,0.4)')
      .hexPolygonAltitude(0.01);

    const globeMaterial = globe.globeMaterial();
    if (globeMaterial) {
      globeMaterial.color.setHex(0x062056);
    }
    
    globeRef.current = globe;
    scene.add(globe);
    setIsReady(true);

    return () => {
      if (globeRef.current) {
        scene.remove(globeRef.current);
        globeRef.current = null;
      }
    };
  }, [scene]);

  // Arcs, points, and rings setup
  useEffect(() => {
    if (!globeRef.current || !isReady) return;

    // Arcs
    if (data && Array.isArray(data)) {
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
    }

    // Points with click handler
    if (memoizedPoints.length > 0) {
      globeRef.current
        .pointsData(memoizedPoints)
        .pointColor(d => d.color)
        .pointAltitude(0)
        .pointRadius(d => d.size)
        .pointsMerge(false)
        .pointResolution(12)
        .onPointClick(onLocationClick);
    }

    // Rings
    if (data && Array.isArray(data)) {
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
  }, [data, memoizedPoints, isReady, onLocationClick]);

  return null;
}

export function World({ data, globeConfig, points }) {
  const [scale, setScale] = useState(1.5);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const containerRef = useRef();
  const pauseTimeoutRef = useRef();

  // Optimized zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  // Smart pause/resume
  const handleInteractionStart = useCallback(() => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 2000);
  }, []);

  // Location click handler
  const handleLocationClick = useCallback((point) => {
    setSelectedLocation(point);
  }, []);

  // Controls
  const zoomIn = useCallback(() => setScale(prev => Math.min(3, prev + 0.2)), []);
  const zoomOut = useCallback(() => setScale(prev => Math.max(0.5, prev - 0.2)), []);
  const resetView = useCallback(() => {
    setScale(1.5);
    setSelectedLocation(null);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case ' ': e.preventDefault(); setIsPaused(!isPaused); break;
        case 'r': case 'R': resetView(); break;
        case '+': case '=': zoomIn(); break;
        case '-': case '_': zoomOut(); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, resetView, zoomIn, zoomOut]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <div className="relative w-full">
      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-10 bg-black/20 backdrop-blur-sm rounded-lg p-2 flex gap-2">
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded text-white text-xs transition-colors"
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? '▶️' : '⏸️'}
        </button>
        <button 
          onClick={zoomIn}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded text-white text-xs transition-colors"
        >
          +
        </button>
        <button 
          onClick={zoomOut}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded text-white text-xs transition-colors"
        >
          -
        </button>
        <button 
          onClick={resetView}
          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded text-white text-xs transition-colors"
        >
          🏠
        </button>
      </div>

      {/* Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 z-10 bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
          <h3 className="font-semibold">{selectedLocation.name}</h3>
          <p className="text-xs opacity-80">
            {selectedLocation.lat.toFixed(2)}°, {selectedLocation.lng.toFixed(2)}°
          </p>
          <button 
            onClick={() => setSelectedLocation(null)}
            className="absolute top-1 right-2 text-white/60 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

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
          performance={{ min: 0.5 }}
          dpr={[1, 1.2]}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[100, 100, 100]} intensity={1} />
          <pointLight position={[-200, 500, 200]} intensity={0.8} />
          
          <Globe 
            globeConfig={globeConfig} 
            data={data} 
            points={points} 
            scale={scale}
            isPaused={isPaused}
            onLocationClick={handleLocationClick}
          />
          
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={globeConfig.autoRotate && !isPaused}
            autoRotateSpeed={globeConfig.autoRotateSpeed}
            minDistance={250}
            maxDistance={250}
            onStart={handleInteractionStart}
            onEnd={handleInteractionEnd}
          />
        </Canvas>
      </div>
    </div>
  );
}
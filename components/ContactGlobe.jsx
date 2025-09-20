"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const World = dynamic(() => import("./ui/globe.jsx").then((m) => m.World), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-500 dark:text-gray-400">Loading Globe...</span>
    </div>
  )
});

// Fallback component for static export
const GlobeFallback = () => (
  <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
    <div className="text-center text-white">
      <div className="text-6xl mb-4">🌍</div>
      <h3 className="text-xl font-bold mb-2">Global Connectivity</h3>
      <p className="text-sm opacity-90">Ready to connect worldwide</p>
    </div>
  </div>
);

export function ContactGlobe() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#38bdf8",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };
  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
  
  // 10 major countries pin points
  const countryPoints = [
    { lat: 40.7128, lng: -74.0060, name: "New York, USA" },
    { lat: 51.5074, lng: -0.1278, name: "London, UK" },
    { lat: 35.6762, lng: 139.6503, name: "Tokyo, Japan" },
    { lat: 28.6139, lng: 77.2090, name: "New Delhi, India" },
    { lat: -33.8688, lng: 151.2093, name: "Sydney, Australia" },
    { lat: 55.7558, lng: 37.6176, name: "Moscow, Russia" },
    { lat: -23.5505, lng: -46.6333, name: "São Paulo, Brazil" },
    { lat: 30.0444, lng: 31.2357, name: "Cairo, Egypt" },
    { lat: 1.3521, lng: 103.8198, name: "Singapore" },
    { lat: 52.5200, lng: 13.4050, name: "Berlin, Germany" }
  ];

  const sampleArcs = [
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.2090,
      endLat: 40.7128,
      endLng: -74.0060,
      arcAlt: 0.3,
      color: colors[0],
    },
    {
      order: 2,
      startLat: 51.5074,
      startLng: -0.1278,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: colors[1],
    },
    {
      order: 3,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.25,
      color: colors[2],
    },
    {
      order: 4,
      startLat: 55.7558,
      startLng: 37.6176,
      endLat: -23.5505,
      endLng: -46.6333,
      arcAlt: 0.4,
      color: colors[0],
    },
    {
      order: 5,
      startLat: 30.0444,
      startLng: 31.2357,
      endLat: 52.5200,
      endLng: 13.4050,
      arcAlt: 0.15,
      color: colors[1],
    },
  ];

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full flex-1 overflow-visible">
        {isMounted ? (
          <World data={sampleArcs} globeConfig={globeConfig} points={countryPoints} />
        ) : (
          <GlobeFallback />
        )}
      </div>
    </div>
  );
}
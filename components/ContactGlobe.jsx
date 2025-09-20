"use client";
import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const World = dynamic(() => import("./ui/globe.jsx").then((m) => m.World), {
  ssr: false,
});

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

  return (
    <div className="flex flex-col items-center justify-center py-10 h-auto relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Let's Connect Globally
        </h3>
        <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
          Ready to collaborate on DevOps projects worldwide. Reach out from anywhere!
        </p>
      </motion.div>
      <div className="w-full overflow-visible">
        <World data={sampleArcs} globeConfig={globeConfig} points={countryPoints} />
      </div>
    </div>
  );
}
import React from 'react';
import { FloatingDockDemo } from './FloatingDockDemo';

export function AppleStyleDock() {
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '16px', 
      left: '50%', 
      transform: 'translateX(-50%)',
      zIndex: 1000,
      maxWidth: '100%'
    }}>
      <FloatingDockDemo />
    </div>
  );
}
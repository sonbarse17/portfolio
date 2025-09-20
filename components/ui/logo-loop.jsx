import React from 'react';

const LogoLoop = ({ 
  logos, 
  speed = 120, 
  direction = "left", 
  logoHeight = 48, 
  gap = 40, 
  pauseOnHover = false,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = "#ffffff",
  ariaLabel = "Logo carousel"
}) => {
  const animationClass = direction === "left" ? "animate-scroll-left" : "animate-scroll-right";
  
  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      aria-label={ariaLabel}
      style={{
        maskImage: fadeOut ? `linear-gradient(to right, transparent, ${fadeOutColor} 10%, ${fadeOutColor} 90%, transparent)` : undefined,
        WebkitMaskImage: fadeOut ? `linear-gradient(to right, transparent, ${fadeOutColor} 10%, ${fadeOutColor} 90%, transparent)` : undefined
      }}
    >
      <div 
        className={`flex items-center h-full ${animationClass} ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={{ gap: `${gap}px` }}
      >
        {[...logos, ...logos].map((logo, index) => (
          <div
            key={index}
            className={`flex-shrink-0 flex items-center justify-center ${scaleOnHover ? 'hover:scale-110 transition-transform' : ''}`}
            style={{ height: `${logoHeight}px`, minWidth: `${logoHeight}px` }}
          >
            {logo.href ? (
              <a href={logo.href} target="_blank" rel="noopener noreferrer" title={logo.title || logo.alt}>
                {logo.node || <img src={logo.src} alt={logo.alt} style={{ height: `${logoHeight}px` }} />}
              </a>
            ) : (
              logo.node || <img src={logo.src} alt={logo.alt} style={{ height: `${logoHeight}px` }} />
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default LogoLoop;
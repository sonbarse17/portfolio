import '../styles/globals.css'
import { useEffect } from 'react'
import { performanceMonitor } from '../lib/analytics'
import PerformanceDashboard from '../components/ui/performance-dashboard'
import Lenis from 'lenis'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize theme on app load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', shouldBeDark);
    
    // Initialize performance monitoring only in development
    if (process.env.NODE_ENV === 'development') {
      performanceMonitor.trackCoreWebVitals();
    }
    
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    // Track page load time
    const handleLoad = () => {
      try {
        if (performance.timing) {
          const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          performanceMonitor.metrics.pageLoadTime = loadTime;
          // console.log('Page Load Time:', loadTime + 'ms');
        } else if (performance.getEntriesByType) {
          const navEntry = performance.getEntriesByType('navigation')[0];
          if (navEntry) {
            performanceMonitor.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.fetchStart;
          }
        }
      } catch (error) {
        console.warn('Could not track page load time:', error);
      }
    };
    
    // Track errors
    const handleError = (event) => {
      performanceMonitor.trackError(event.error, 'Global error handler');
    };
    
    const handleUnhandledRejection = (event) => {
      performanceMonitor.trackError(new Error(event.reason), 'Unhandled promise rejection');
    };
    
    window.addEventListener('load', handleLoad);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      lenis.destroy();
    };
  }, []);
  
  return (
    <>
      <Component {...pageProps} />
      <PerformanceDashboard />
    </>
  )
}
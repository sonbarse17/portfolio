// Performance monitoring and analytics
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      apiCalls: [],
      errors: [],
      userInteractions: []
    };
    
    // Initialize basic metrics
    this.initializeMetrics();
  }

  // Core Web Vitals tracking
  trackCoreWebVitals() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    this.observers = this.observers || [];

    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0];
        if (firstInput) {
          console.log('FID:', firstInput.processingStart - firstInput.startTime);
          this.metrics.fid = firstInput.processingStart - firstInput.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log('CLS:', clsValue);
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  // Cleanup observers
  disconnect() {
    if (this.observers) {
      this.observers.forEach(observer => observer.disconnect());
      this.observers = [];
    }
  }

  // API performance tracking
  trackApiCall(url, startTime, endTime, success) {
    this.metrics.apiCalls.push({
      url,
      duration: endTime - startTime,
      success,
      timestamp: Date.now()
    });
  }

  // Error tracking
  trackError(error, context) {
    this.metrics.errors.push({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
    console.error('Tracked error:', error, context);
  }

  // User interaction tracking
  trackInteraction(type, element) {
    this.metrics.userInteractions.push({
      type,
      element,
      timestamp: Date.now()
    });
  }

  // Get performance report
  getReport() {
    return {
      ...this.metrics,
      bundleSize: this.getBundleSize(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  getBundleSize() {
    if (typeof window === 'undefined') return 0;
    try {
      const navEntry = performance.getEntriesByType('navigation')[0];
      return navEntry?.transferSize || navEntry?.encodedBodySize || 0;
    } catch (error) {
      return 0;
    }
  }

  initializeMetrics() {
    if (typeof window === 'undefined') return;
    
    // Set initial page load time if available
    setTimeout(() => {
      try {
        if (performance.timing && performance.timing.loadEventEnd > 0) {
          this.metrics.pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        }
      } catch (error) {
        console.warn('Could not get initial load time:', error);
      }
    }, 1000);
  }

  getMemoryUsage() {
    if (typeof window === 'undefined' || !window.performance?.memory) return {};
    return {
      used: window.performance.memory.usedJSHeapSize,
      total: window.performance.memory.totalJSHeapSize,
      limit: window.performance.memory.jsHeapSizeLimit
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor.disconnect();
  });
}
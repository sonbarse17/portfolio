import React, { useState, useEffect } from 'react';
import { performanceMonitor } from '../../lib/analytics';

const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(performanceMonitor.getReport());
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 dark:bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        aria-label="Toggle performance dashboard"
      >
        📊
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto transition-colors duration-300">
          <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white transition-colors duration-300">Performance Metrics</h3>
          
          {/* Core Web Vitals */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Core Web Vitals</h4>
            <div className="space-y-1 text-xs text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <div className="flex justify-between">
                <span>LCP:</span>
                <span className={metrics.lcp > 2500 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>FID:</span>
                <span className={metrics.fid > 100 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>CLS:</span>
                <span className={metrics.cls > 0.1 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* API Performance */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">API Calls</h4>
            <div className="text-xs text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{metrics.apiCalls.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span>
                  {metrics.apiCalls.length > 0 
                    ? `${Math.round((metrics.apiCalls.filter(call => call.success).length / metrics.apiCalls.length) * 100)}%`
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg Duration:</span>
                <span>
                  {metrics.apiCalls.length > 0 
                    ? `${Math.round(metrics.apiCalls.reduce((sum, call) => sum + call.duration, 0) / metrics.apiCalls.length)}ms`
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          {metrics.memoryUsage.used && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Memory Usage</h4>
              <div className="text-xs text-gray-900 dark:text-gray-100 transition-colors duration-300">
                <div className="flex justify-between">
                  <span>Used:</span>
                  <span>{Math.round(metrics.memoryUsage.used / 1024 / 1024)}MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{Math.round(metrics.memoryUsage.total / 1024 / 1024)}MB</span>
                </div>
              </div>
            </div>
          )}

          {/* Errors */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Errors</h4>
            <div className="text-xs text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <div className="flex justify-between">
                <span>Total Errors:</span>
                <span className={metrics.errors.length > 0 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.errors.length}
                </span>
              </div>
            </div>
          </div>

          {/* Page Load Time */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">Page Performance</h4>
            <div className="text-xs text-gray-900 dark:text-gray-100 transition-colors duration-300">
              <div className="flex justify-between">
                <span>Load Time:</span>
                <span>{metrics.pageLoadTime ? `${metrics.pageLoadTime}ms` : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Bundle Size:</span>
                <span>{metrics.bundleSize ? `${Math.round(metrics.bundleSize / 1024)}KB` : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;
import { PerformanceMonitor } from '../lib/analytics';

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    timing: {
      navigationStart: 1000,
      loadEventEnd: 2000
    },
    getEntriesByType: jest.fn(() => [{ transferSize: 1024 }]),
    memory: {
      usedJSHeapSize: 1024000,
      totalJSHeapSize: 2048000,
      jsHeapSizeLimit: 4096000
    }
  },
  writable: true
});

// Mock window object
Object.defineProperty(global, 'window', {
  value: {
    performance: global.performance
  },
  writable: true
});

describe('PerformanceMonitor', () => {
  let monitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor();
    jest.clearAllMocks();
  });

  describe('trackApiCall', () => {
    it('should track successful API calls', () => {
      monitor.trackApiCall('/api/test', 100, 200, true);
      
      const report = monitor.getReport();
      expect(report.apiCalls).toHaveLength(1);
      expect(report.apiCalls[0]).toMatchObject({
        url: '/api/test',
        duration: 100,
        success: true
      });
    });

    it('should track failed API calls', () => {
      monitor.trackApiCall('/api/error', 100, 500, false);
      
      const report = monitor.getReport();
      expect(report.apiCalls[0].success).toBe(false);
    });
  });

  describe('trackError', () => {
    it('should track errors with context', () => {
      const error = new Error('Test error');
      monitor.trackError(error, 'test context');
      
      const report = monitor.getReport();
      expect(report.errors).toHaveLength(1);
      expect(report.errors[0]).toMatchObject({
        message: 'Test error',
        context: 'test context'
      });
    });
  });

  describe('trackInteraction', () => {
    it('should track user interactions', () => {
      monitor.trackInteraction('click', 'button');
      
      const report = monitor.getReport();
      expect(report.userInteractions).toHaveLength(1);
      expect(report.userInteractions[0]).toMatchObject({
        type: 'click',
        element: 'button'
      });
    });
  });

  describe('getBundleSize', () => {
    it('should return bundle size from performance API', () => {
      const size = monitor.getBundleSize();
      expect(size).toBe(1024);
    });

    it('should return 0 if performance API unavailable', () => {
      global.performance.getEntriesByType = jest.fn(() => []);
      const size = monitor.getBundleSize();
      expect(size).toBe(0);
    });
  });

  describe('getMemoryUsage', () => {
    it('should return memory usage stats', () => {
      const memory = monitor.getMemoryUsage();
      expect(memory).toEqual({
        used: 1024000,
        total: 2048000,
        limit: 4096000
      });
    });

    it('should return empty object if memory API unavailable', () => {
      delete global.performance.memory;
      const memory = monitor.getMemoryUsage();
      expect(memory).toEqual({});
    });
  });

  describe('disconnect', () => {
    it('should disconnect all observers', () => {
      const mockDisconnect = jest.fn();
      monitor.observers = [{ disconnect: mockDisconnect }];
      
      monitor.disconnect();
      expect(mockDisconnect).toHaveBeenCalled();
      expect(monitor.observers).toEqual([]);
    });
  });
});
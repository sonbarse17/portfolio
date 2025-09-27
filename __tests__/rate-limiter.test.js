import { apiRateLimiter, contactRateLimiter } from '../lib/rate-limiter';

describe('RateLimiter', () => {
  beforeEach(() => {
    // Clear rate limiter state
    apiRateLimiter.requests.clear();
    contactRateLimiter.requests.clear();
  });

  describe('apiRateLimiter', () => {
    it('should allow requests within limit', () => {
      const identifier = 'test-user';
      
      for (let i = 0; i < 50; i++) {
        expect(apiRateLimiter.isAllowed(identifier)).toBe(true);
      }
    });

    it('should block requests when limit exceeded', () => {
      const identifier = 'test-user';
      
      // Use up all requests
      for (let i = 0; i < 60; i++) {
        apiRateLimiter.isAllowed(identifier);
      }
      
      // Next request should be blocked
      expect(apiRateLimiter.isAllowed(identifier)).toBe(false);
    });

    it('should return correct remaining requests', () => {
      const identifier = 'test-user';
      
      expect(apiRateLimiter.getRemainingRequests(identifier)).toBe(60);
      
      apiRateLimiter.isAllowed(identifier);
      expect(apiRateLimiter.getRemainingRequests(identifier)).toBe(59);
    });
  });

  describe('contactRateLimiter', () => {
    it('should allow limited contact form submissions', () => {
      const identifier = 'contact-user';
      
      for (let i = 0; i < 5; i++) {
        expect(contactRateLimiter.isAllowed(identifier)).toBe(true);
      }
      
      // 6th request should be blocked
      expect(contactRateLimiter.isAllowed(identifier)).toBe(false);
    });

    it('should reset after time window', () => {
      const identifier = 'contact-user';
      const limiter = contactRateLimiter;
      
      // Mock time to simulate window expiry
      const originalNow = Date.now;
      Date.now = jest.fn(() => 1000);
      
      // Use up all requests
      for (let i = 0; i < 5; i++) {
        limiter.isAllowed(identifier);
      }
      
      expect(limiter.isAllowed(identifier)).toBe(false);
      
      // Move time forward beyond window
      Date.now = jest.fn(() => 1000 + 300001); // 5 minutes + 1ms
      
      expect(limiter.isAllowed(identifier)).toBe(true);
      
      // Restore original Date.now
      Date.now = originalNow;
    });
  });
});
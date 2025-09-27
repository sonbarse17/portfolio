import { validateUrl, sanitizeInput, safeApiCall, githubRateLimiter } from '../lib/utils';

describe('Utils', () => {
  describe('validateUrl', () => {
    it('should validate allowed domains', () => {
      expect(validateUrl('https://api.github.com/users/test')).toBe(true);
      expect(validateUrl('https://github.com/test')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('javascript:alert(1)')).toBe(false);
      expect(validateUrl('http://malicious.com')).toBe(false);
      expect(validateUrl('ftp://example.com')).toBe(false);
    });

    it('should handle custom domains from env', () => {
      process.env.ALLOWED_DOMAINS = 'custom.com,trusted.org';
      expect(validateUrl('https://custom.com/api')).toBe(true);
      expect(validateUrl('https://trusted.org/data')).toBe(true);
      delete process.env.ALLOWED_DOMAINS;
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert(1)</script>test')).toBe('test');
      expect(sanitizeInput('<div>Hello</div>')).toBe('Hello');
    });

    it('should handle empty input', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('should preserve safe text', () => {
      expect(sanitizeInput('Hello World')).toBe('Hello World');
      expect(sanitizeInput('Test 123')).toBe('Test 123');
    });
  });

  describe('safeApiCall', () => {
    it('should handle successful API calls', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: 'test' })
        })
      );

      const result = await safeApiCall('https://api.github.com/test');
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ data: 'test' });
    });

    it('should handle API errors', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404
        })
      );

      const result = await safeApiCall('https://api.github.com/test');
      expect(result.success).toBe(false);
      expect(result.error).toBe('HTTP error! status: 404');
    });

    it('should reject invalid URLs', async () => {
      const result = await safeApiCall('javascript:alert(1)');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid URL');
    });
  });

  describe('githubRateLimiter', () => {
    beforeEach(() => {
      githubRateLimiter.reset();
    });

    it('should allow requests within limit', () => {
      expect(githubRateLimiter.canMakeRequest()).toBe(true);
      githubRateLimiter.recordRequest();
      expect(githubRateLimiter.canMakeRequest()).toBe(true);
    });

    it('should block requests when limit exceeded', () => {
      // Simulate hitting the limit
      for (let i = 0; i < 60; i++) {
        githubRateLimiter.recordRequest();
      }
      expect(githubRateLimiter.canMakeRequest()).toBe(false);
    });
  });
});
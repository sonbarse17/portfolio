import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// Security utilities
export const validateUrl = (url, customDomains = []) => {
  try {
    const parsedUrl = new URL(url);
    // Default allowed domains (can be overridden via env or parameter)
    const defaultDomains = ['api.github.com', 'github.com'];
    const envDomains = process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : [];
    const allowedDomains = [...defaultDomains, ...envDomains, ...customDomains];
    
    return allowedDomains.includes(parsedUrl.hostname);
  } catch {
    return false;
  }
};

export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
};

// API utilities with rate limiting
class RateLimiter {
  constructor(maxRequests = 60, windowMs = 60000) {
    this.requests = [];
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return this.requests.length < this.maxRequests;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }

  reset() {
    this.requests = [];
  }
}

export const githubRateLimiter = new RateLimiter(60, 60000);

export const safeApiCall = async (url, options = {}) => {
  try {
    if (!validateUrl(url, options.allowedDomains)) {
      return { success: false, error: 'Invalid URL' };
    }

    if (!githubRateLimiter.canMakeRequest()) {
      return { success: false, error: 'Rate limit exceeded' };
    }

    githubRateLimiter.recordRequest();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      return { success: false, error: `HTTP error! status: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Performance utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
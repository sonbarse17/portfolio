import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateUrl = (url: string, customDomains: string[] = []): boolean => {
  try {
    const parsedUrl = new URL(url)
    const defaultDomains = ['api.github.com', 'github.com']
    const envDomains = process.env.ALLOWED_DOMAINS?.split(',') || []
    const allowedDomains = [...defaultDomains, ...envDomains, ...customDomains]

    return allowedDomains.includes(parsedUrl.hostname)
  } catch {
    return false
  }
}

export const sanitizeInput = (input: unknown): string => {
  if (!input || typeof input !== 'string') return ''
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"`]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export const debounce = <T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const memoize = <T extends (...args: never[]) => ReturnType<T>>(fn: T) => {
  const cache = new Map<string, ReturnType<T>>()
  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = fn(...args) as ReturnType<T>
    cache.set(key, result)
    return result
  }
}

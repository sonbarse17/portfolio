import { contactRateLimiter } from '../../lib/rate-limiter';
import { sanitizeInput } from '../../lib/utils';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting by IP
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  
  if (!contactRateLimiter.isAllowed(clientIp)) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: 300 
    });
  }

  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message)
    };

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Here you would typically send the email or save to database
    // For now, just return success
    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully',
      remaining: contactRateLimiter.getRemainingRequests(clientIp)
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
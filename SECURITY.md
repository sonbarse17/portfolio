# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## Security Features

This portfolio implements several security measures:

- **Content Security Policy (CSP)** headers
- **Input sanitization** for all user inputs
- **Rate limiting** middleware (100 requests per minute per IP)
- **Security headers** (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- **Strict TypeScript** configuration
- **HTTPS enforcement** in production

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@sushantsonbarse.com with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will respond within 48 hours and provide updates on the fix timeline.

## Best Practices

When contributing:

- Never commit sensitive data (API keys, credentials)
- Use environment variables for configuration
- Sanitize all user inputs
- Follow secure coding guidelines
- Keep dependencies updated

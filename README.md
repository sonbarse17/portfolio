# Sushant Sonbarse - DevOps Engineer Portfolio

A high-performance, secure, and accessible portfolio website built with Next.js 15 App Router, showcasing DevOps engineering expertise and projects.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI + Radix UI
- **Animations**: Framer Motion 12
- **3D Graphics**: Three.js + OGL
- **Type Safety**: TypeScript (Strict Mode)
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged

## 📊 Performance Metrics

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 1.8s
- **First Input Delay (FID)**: < 80ms
- **Cumulative Layout Shift (CLS)**: < 0.05

### Lighthouse Scores (Target: 95+)
- **Performance**: 95+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

## 🛡️ Security Features

- **Content Security Policy (CSP)** headers
- **Input sanitization** for all user inputs
- **Rate limiting** middleware
- **Security headers** (X-Frame-Options, X-Content-Type-Options, etc.)
- **Strict TypeScript** configuration
- **Dependency vulnerability scanning**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run unit tests with Vitest
npm run test:e2e     # Run E2E tests with Playwright
npm run test:e2e:ui  # Run E2E tests with UI
```

## 📁 Project Structure

```
src/
├── app/                    # App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── freelance/         # Freelance services page
│   ├── services/          # Service detail pages
│   ├── globals.css        # Global styles
│   ├── loading.tsx        # Loading state
│   ├── error.tsx          # Error boundary
│   └── not-found.tsx      # 404 page
├── components/
│   ├── ui/                # Shadcn/UI components
│   ├── features/          # Feature components
│   └── layout/            # Layout components
├── lib/                   # Utilities
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types
```

## 🎨 Design System

The project uses a modern design system with:
- **Design tokens** via CSS variables
- **Consistent spacing** and typography scales
- **Dark/light mode** support with next-themes
- **Accessible components** from Radix UI
- **Utility-first** styling with Tailwind CSS

## ⚡ Performance Optimizations

1. **Bundle Optimization**
   - Tree-shaking for unused code
   - Dynamic imports for heavy components
   - Optimized package imports

2. **Image Optimization**
   - Next.js Image component with AVIF/WebP
   - Responsive images with proper sizing
   - Lazy loading

3. **Runtime Performance**
   - Server Components by default
   - Client Components only when needed
   - Proper cleanup of WebGL contexts

## 🔍 Testing

### Unit Tests (Vitest)
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

## 🌐 Deployment

Optimized for deployment on:
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**

### Environment Variables
```bash
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

- **Email**: sushant.sonbarse@example.com
- **LinkedIn**: [linkedin.com/in/sushant-sonbarse](https://linkedin.com/in/sushant-sonbarse)
- **GitHub**: [github.com/sonbarse17](https://github.com/sonbarse17)

---

Built with ❤️ by Sushant Sonbarse

# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your EmailJS credentials:
- Get free account at https://www.emailjs.com/
- Create service, template, and get public key
- Update the values in `.env.local`

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run start
```

---

## 📝 Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | TypeScript type checking |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

### Dependency Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
npm run type-check
npm run lint
```

---

## 📦 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/          # UI components (Button, Card, etc.)
│   ├── features/    # Feature components
│   └── layout/      # Layout components
├── lib/             # Utility functions
└── __tests__/       # Unit tests
```

---

## 🎨 Customization

### Update Personal Information
1. Edit `src/app/layout.tsx` - Update metadata
2. Edit `src/components/features/landing-page.tsx` - Update name and bio
3. Edit `src/components/features/timeline-section.tsx` - Update experience
4. Edit `src/components/features/projects-section.tsx` - Update projects

### Change Colors
Edit `src/app/globals.css` - Update CSS variables

### Add New Page
1. Create file in `src/app/your-page/page.tsx`
2. Add navigation link in components

---

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify
1. Push to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `out`
5. Add environment variables

### Manual Static Export
```bash
npm run build
# Upload 'out' directory to any static host
```

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

---

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Check `CONTRIBUTING.md` for development guidelines
- Open an issue on GitHub

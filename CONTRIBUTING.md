# Contributing Guidelines

Thank you for considering contributing to this portfolio project!

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sonbarse17/portfolio.git
   cd portfolio/nextjs-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Code Standards

### TypeScript
- Use strict TypeScript mode
- Avoid `any` types
- Define proper interfaces and types

### Code Style
- Run `npm run format` before committing
- Follow ESLint rules: `npm run lint`
- Use meaningful variable names

### Components
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript types for props

### Testing
- Write unit tests for utilities: `npm run test`
- Write E2E tests for critical flows: `npm run test:e2e`
- Ensure tests pass before submitting PR

## Commit Guidelines

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/tooling changes

Example: `feat: add dark mode toggle`

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run tests: `npm run test && npm run test:e2e`
4. Run linting: `npm run lint:fix`
5. Format code: `npm run format`
6. Commit with conventional commit message
7. Push and create PR

## Code Review

All PRs require:
- Passing CI/CD checks
- Code review approval
- No merge conflicts
- Updated documentation (if needed)

## Questions?

Open an issue or contact via email.

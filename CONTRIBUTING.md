# Contributing to WhatsApp Export Reader

First off, thank you for considering contributing to WhatsApp Export Reader! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain a welcoming environment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git
- A code editor (VS Code recommended)

### Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/wpp_exports_reader.git
   cd wpp_exports_reader
   ```

3. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

5. **Start development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

## 💻 Development Workflow

### Project Structure

```
wpp_exports_reader/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── ...          # Custom components
├── lib/             # Utilities and helpers
└── public/          # Static assets
```

### Key Components

- **`app/page.tsx`** - Main chat viewer
- **`lib/chat-parser.ts`** - WhatsApp export parser
- **`components/chat-message.tsx`** - Message bubble component
- **`components/audio-player.tsx`** - Custom audio player

### Making Changes

1. **Keep changes focused** - One feature or fix per PR
2. **Test thoroughly** - Test with real WhatsApp exports
3. **Maintain performance** - Check lazy loading still works
4. **Update documentation** - Update README if needed

## 🔍 Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Lint and format**
   ```bash
   bun run lint
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link any related issues
   - Request review

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] No console errors or warnings
- [ ] README updated (if needed)
- [ ] Works in both light and dark mode
- [ ] Tested with real WhatsApp exports

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` types when possible

### React

- Use functional components with hooks
- Prefer `const` over `let`
- Use React.memo for expensive components
- Keep components focused and single-purpose

### Styling

- Use Tailwind CSS classes
- Follow existing color schemes
- Support dark mode with `dark:` variants
- Use semantic class names

### Performance

- Implement lazy loading for media
- Avoid unnecessary re-renders
- Use Intersection Observer for visibility
- Keep bundle size minimal

## 💬 Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(search): add regex search support
fix(parser): handle messages with special characters
docs(readme): update installation instructions
perf(images): implement lazy loading for photos
```

## 🐛 Reporting Bugs

1. Check if the bug already exists in Issues
2. Use the bug report template
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser and OS version

## 💡 Suggesting Features

1. Check if the feature already exists in Issues
2. Use the feature request template
3. Describe:
   - The problem it solves
   - Proposed solution
   - Alternative solutions considered
   - Additional context

## 🧪 Testing

Test your changes with:

- Different chat exports (small and large)
- Various media types (images, videos, audio)
- Light and dark modes
- Different screen sizes
- Edge cases (empty chats, special characters)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## ❓ Questions?

Feel free to:
- Open a Discussion on GitHub
- Ask in Pull Request comments
- Reach out to maintainers

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Credited in release notes
- Part of an amazing community!

---

Thank you for contributing! Every contribution, no matter how small, makes a difference. 🙏


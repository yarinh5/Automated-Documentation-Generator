# 🤝 Contributing to Automated Documentation Generator

Thank you for your interest in contributing to the Automated Documentation Generator! We welcome contributions from the community and appreciate your help in making this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- TypeScript 5.3+
- Git
- OpenAI API key (for testing)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/your-username/automated-documentation-generator.git
   cd automated-documentation-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   # Copy the example environment file
   cp env.example .env

   # Add your OpenAI API key
   echo "OPENAI_API_KEY=your_api_key_here" >> .env
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 🔧 Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting. Please ensure your code follows these standards:

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Format code
npm run format
```

### TypeScript Guidelines

- Use TypeScript for all new code
- Provide proper type definitions
- Use interfaces for object shapes
- Prefer `const` over `let` when possible
- Use meaningful variable and function names

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage
- Use descriptive test names

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(search): add fuzzy search capability
fix(analyzer): handle malformed TypeScript files
docs(readme): update installation instructions
```

## 📝 Pull Request Process

### Before Submitting

1. **Ensure tests pass**
   ```bash
   npm test
   ```

2. **Check code style**
   ```bash
   npm run lint
   npm run format
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Update documentation** if needed

### PR Template

When creating a Pull Request, please include:

- **Description**: What does this PR do?
- **Type**: Bug fix, feature, documentation, etc.
- **Testing**: How was this tested?
- **Breaking Changes**: Any breaking changes?
- **Screenshots**: If applicable

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: Maintainers review the code
3. **Testing**: Manual testing if needed
4. **Approval**: At least one maintainer approval required

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node.js version, etc.
6. **Screenshots**: If applicable
7. **Logs**: Error messages or console output

### Bug Report Template

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS 12, Ubuntu 20.04]
- Node.js version: [e.g. 18.17.0]
- Package version: [e.g. 1.0.0]

**Additional Context**
Add any other context about the problem here.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
A clear and concise description of the feature you'd like to see.

**Problem Statement**
What problem does this feature solve?

**Proposed Solution**
Describe your proposed solution.

**Alternatives Considered**
Describe any alternative solutions you've considered.

**Additional Context**
Add any other context or screenshots about the feature request here.
```

## 📚 Documentation

### Documentation Guidelines

- Keep documentation up-to-date
- Use clear, concise language
- Include code examples
- Add screenshots when helpful
- Follow the existing style

### Documentation Types

1. **API Documentation**: Generated automatically
2. **User Guides**: In `USAGE.md`
3. **Developer Docs**: In `CONTRIBUTING.md`
4. **README**: Project overview
5. **Code Comments**: Inline documentation

## 🏷️ Labels

We use labels to categorize issues and PRs:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on

## 🎯 Good First Issues

Looking for your first contribution? Check out issues labeled `good first issue`:

- [Good First Issues](https://github.com/your-username/automated-documentation-generator/labels/good%20first%20issue)

## 🤔 Questions?

- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/automated-documentation-generator/discussions)
- 📧 **Email**: contributors@myproject.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/automated-documentation-generator/issues)

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Automated Documentation Generator! 🎉

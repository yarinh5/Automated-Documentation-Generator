#  Automated Documentation Generator

> AI-powered documentation generator with semantic search capabilities

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/automated-documentation-generator)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple.svg)](https://openai.com/)

A powerful tool that automatically generates beautiful, comprehensive documentation for your codebase using GPT-4 and provides intelligent semantic search capabilities through embeddings.

##  Features

-  **Apple-style Documentation**: Clean, minimal, and elegant documentation design
-  **GPT-4 Powered**: Intelligent documentation generation using OpenAI's latest model
-  **Semantic Search**: Find code using natural language queries with embeddings
-  **Comprehensive Coverage**: Generates README, API docs, and code examples
-  **TypeScript Support**: Full TypeScript support with type definitions
-  **Smart Analysis**: Automatically analyzes functions, classes, interfaces, and types
-  **CLI Interface**: Easy-to-use command-line interface
-  **Programmatic API**: Use as a library in your own projects

##  Quick Start

### Installation

```bash
npm install -g automated-documentation-generator
```

### Basic Usage

1. **Initialize configuration:**
```bash
auto-docs init
```

2. **Set your OpenAI API key:**
```bash
export OPENAI_API_KEY=your_api_key_here
```

3. **Generate documentation:**
```bash
auto-docs generate
```

4. **Search your codebase:**
```bash
auto-docs search --query "authentication function"
```

##  Documentation

### CLI Commands

#### `auto-docs generate`
Generate comprehensive documentation for your project.

**Options:**
- `-p, --path <path>` - Project path (default: ".")
- `-k, --api-key <key>` - OpenAI API key
- `-c, --config <file>` - Configuration file (default: "docs.config.json")
- `-o, --output <dir>` - Output directory (default: "./docs")
- `--no-examples` - Skip generating examples
- `--no-types` - Skip type definitions
- `--include-private` - Include private members
- `--style <style>` - Documentation style (apple|minimal|detailed)
- `--format <format>` - Output format (markdown|html)

#### `auto-docs search`
Search your codebase using semantic search.

**Options:**
- `-p, --path <path>` - Project path (default: ".")
- `-k, --api-key <key>` - OpenAI API key
- `-q, --query <query>` - Search query
- `-l, --limit <number>` - Number of results (default: 10)

#### `auto-docs init`
Initialize documentation configuration.

**Options:**
- `-p, --path <path>` - Project path (default: ".")

### Programmatic Usage

```typescript
import { AutoDocs } from "automated-documentation-generator";

const autoDocs = new AutoDocs(process.env.OPENAI_API_KEY!);

// Generate documentation
const { readme, apiDocs } = await autoDocs.generateDocumentation({
  name: "My Project",
  description: "A wonderful project",
  version: "1.0.0",
  author: "Your Name",
  license: "MIT",
});

// Search codebase
const results = await autoDocs.search("authentication function");

// Analyze project
const codeFiles = await autoDocs.analyzeProject();

// Generate embeddings
await autoDocs.generateEmbeddings();
```

##  Documentation Styles

### Apple Style (Default)
Clean, minimal design with:
- Bright whites and light greys
- Subtle blue/purple accents
- Rounded corners and soft shadows
- Glassmorphism effects
- Airy spacing and clear typography

### Minimal Style
Simple, focused design with:
- Clean typography
- Minimal colors
- Focus on content

### Detailed Style
Comprehensive design with:
- Rich formatting
- Detailed sections
- Extensive examples

## 🔍 Semantic Search

The semantic search feature uses OpenAI's embeddings to understand the meaning of your code and queries, allowing you to find relevant code using natural language.

### Examples

```bash
# Find authentication-related code
auto-docs search --query "user login authentication"

# Find database operations
auto-docs search --query "database query insert update"

# Find error handling
auto-docs search --query "error handling try catch"

# Find specific function
auto-docs search --query "calculateTotal function"
```

##  Configuration

Create a `docs.config.json` file to customize your documentation:

```json
{
  "name": "My Awesome Project",
  "description": "A project that does amazing things",
  "version": "1.0.0",
  "author": "Your Name",
  "license": "MIT",
  "repository": "https://github.com/username/repo",
  "homepage": "https://myproject.com",
  "bugs": "https://github.com/username/repo/issues",
  "keywords": ["typescript", "ai", "documentation"]
}
```

##  Development

### Prerequisites
- Node.js 18+
- TypeScript 5.3+
- OpenAI API key

### Setup
```bash
git clone https://github.com/your-username/automated-documentation-generator
cd automated-documentation-generator
npm install
npm run build
```

### Scripts
- `npm run build` - Build the project
- `npm run dev` - Run in development mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- [OpenAI](https://openai.com/) for the amazing GPT-4 API
- [TypeScript](https://www.typescriptlang.org/) for the excellent type system
- [Commander.js](https://github.com/tj/commander.js) for the CLI framework
- [Chalk](https://github.com/chalk/chalk) for beautiful terminal colors

---

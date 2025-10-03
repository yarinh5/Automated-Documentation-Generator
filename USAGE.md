# 📖 Usage Guide

This guide will help you get started with the Automated Documentation Generator.

## 🚀 Quick Start

### 1. Installation

```bash
# Install globally
npm install -g automated-documentation-generator

# Or install locally
npm install automated-documentation-generator
```

### 2. Set up your API key

```bash
# Set environment variable
export OPENAI_API_KEY=your_api_key_here

# Or use the --api-key option
auto-docs generate --api-key your_api_key_here
```

### 3. Initialize configuration

```bash
# Create a configuration file
auto-docs init

# This creates docs.config.json with your project details
```

### 4. Generate documentation

```bash
# Generate all documentation
auto-docs generate

# Customize output
auto-docs generate --output ./my-docs --style detailed
```

### 5. Search your codebase

```bash
# Interactive search
auto-docs search

# Direct search
auto-docs search --query "authentication function"
```

## 🔧 Configuration

### Configuration File (docs.config.json)

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
  "keywords": ["typescript", "api", "documentation"]
}
```

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your_openai_api_key

# Optional
DOCS_OUTPUT_DIR=./docs
DOCS_STYLE=apple
DOCS_INCLUDE_PRIVATE=false
DOCS_INCLUDE_EXAMPLES=true
SEARCH_LIMIT=10
```

## 📚 Command Reference

### `auto-docs generate`

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

**Examples:**
```bash
# Basic generation
auto-docs generate

# Custom output directory
auto-docs generate --output ./documentation

# Detailed style with private members
auto-docs generate --style detailed --include-private

# Skip examples and types
auto-docs generate --no-examples --no-types
```

### `auto-docs search`

Search your codebase using semantic search.

**Options:**
- `-p, --path <path>` - Project path (default: ".")
- `-k, --api-key <key>` - OpenAI API key
- `-q, --query <query>` - Search query
- `-l, --limit <number>` - Number of results (default: 10)

**Examples:**
```bash
# Interactive search
auto-docs search

# Search for specific functionality
auto-docs search --query "user authentication"

# Search with custom limit
auto-docs search --query "database operations" --limit 5
```

### `auto-docs init`

Initialize documentation configuration.

**Options:**
- `-p, --path <path>` - Project path (default: ".")

**Examples:**
```bash
# Initialize in current directory
auto-docs init

# Initialize in specific directory
auto-docs init --path ./my-project
```

## 🎨 Documentation Styles

### Apple Style (Default)
- Clean, minimal design
- Bright whites and light greys
- Subtle blue/purple accents
- Rounded corners and soft shadows
- Glassmorphism effects
- Airy spacing and clear typography

### Minimal Style
- Simple, focused design
- Clean typography
- Minimal colors
- Focus on content

### Detailed Style
- Comprehensive design
- Rich formatting
- Detailed sections
- Extensive examples

## 🔍 Semantic Search Examples

### Finding Functions
```bash
# Find authentication functions
auto-docs search --query "user login authentication"

# Find database operations
auto-docs search --query "database query insert update"

# Find error handling
auto-docs search --query "error handling try catch"
```

### Finding Classes
```bash
# Find service classes
auto-docs search --query "service class business logic"

# Find data models
auto-docs search --query "model class data structure"
```

### Finding Specific Patterns
```bash
# Find async functions
auto-docs search --query "async function promise"

# Find exported functions
auto-docs search --query "export function public API"

# Find configuration
auto-docs search --query "configuration settings options"
```

## 💻 Programmatic Usage

### Basic Usage

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
```

### Advanced Usage

```typescript
import { AutoDocs, ProjectConfig, DocumentationOptions } from "automated-documentation-generator";

const autoDocs = new AutoDocs(process.env.OPENAI_API_KEY!);

// Custom configuration
const config: ProjectConfig = {
  name: "E-commerce API",
  description: "A modern e-commerce API",
  version: "2.0.0",
  author: "E-commerce Team",
  license: "Apache-2.0",
  repository: "https://github.com/company/ecommerce-api",
  keywords: ["ecommerce", "api", "typescript"],
};

// Custom options
const options: DocumentationOptions = {
  includeExamples: true,
  includeTypeDefinitions: true,
  includePrivateMembers: false,
  outputFormat: "markdown",
  style: "apple",
};

// Generate documentation
const { readme, apiDocs } = await autoDocs.generateDocumentation(config, options);

// Generate embeddings for search
await autoDocs.generateEmbeddings();

// Search with custom limit
const results = await autoDocs.search("payment processing", 5);
```

## 🐳 Docker Usage

### Using Docker Compose

```bash
# Generate documentation
docker-compose --profile generate run --rm auto-docs

# Interactive search
docker-compose --profile search run --rm auto-docs-search

# Initialize configuration
docker-compose --profile init run --rm auto-docs-init
```

### Using Docker directly

```bash
# Build the image
docker build -t auto-docs .

# Generate documentation
docker run -v $(pwd):/workspace -e OPENAI_API_KEY=your_key auto-docs generate

# Search codebase
docker run -v $(pwd):/workspace -e OPENAI_API_KEY=your_key -it auto-docs search
```

## 🔧 Troubleshooting

### Common Issues

**1. OpenAI API Key not found**
```bash
# Set the environment variable
export OPENAI_API_KEY=your_api_key_here

# Or use the --api-key option
auto-docs generate --api-key your_api_key_here
```

**2. No code files found**
```bash
# Make sure you're in the right directory
cd /path/to/your/project

# Check if there are TypeScript/JavaScript files
ls -la *.ts *.js
```

**3. Permission denied**
```bash
# Make sure the CLI is executable
chmod +x $(which auto-docs)

# Or run with node
node $(which auto-docs) generate
```

**4. Out of memory errors**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
auto-docs generate
```

### Getting Help

- 📧 Email: support@myproject.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/automated-documentation-generator/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/automated-documentation-generator/discussions)

## 📝 Examples

Check out the `examples/` directory for more detailed usage examples:

- `examples/demo.ts` - Basic demo
- `examples/usage-examples.ts` - Advanced usage patterns
- `examples/custom-integration.ts` - Custom integration examples

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

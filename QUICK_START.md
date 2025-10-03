# ⚡ Quick Start Guide

Get your Automated Documentation Generator up and running in minutes!

## 🚀 One-Command Setup

```bash
# Clone and setup
git clone https://github.com/yarinh5/Automated-Documentation-Generator.git
cd Automated-Documentation-Generator
npm install
npm run build
```

## 🔑 Set Your API Key

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=your_api_key_here

# Or create a .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

## 📚 Generate Documentation

```bash
# Initialize configuration
npm run cli init

# Generate documentation
npm run cli generate

# Search your codebase
npm run cli search --query "authentication function"
```

## 🎯 Programmatic Usage

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

## 🐳 Docker Usage

```bash
# Build and run with Docker
docker build -t auto-docs .
docker run -v $(pwd):/workspace -e OPENAI_API_KEY=your_key auto-docs generate
```

## 📖 What You Get

- 🤖 **AI-Powered Documentation**: GPT-4 generates beautiful, comprehensive docs
- 🔍 **Semantic Search**: Find code using natural language queries
- 📚 **Multiple Formats**: README, API docs, and code examples
- ⚡ **TypeScript Support**: Full type definitions and IntelliSense
- 🎨 **Apple-Style Design**: Clean, minimal, and elegant documentation
- 🔧 **CLI Interface**: Easy-to-use command-line tools
- 📦 **Library API**: Use as a library in your own projects

## 🆘 Need Help?

- 📖 [Full Documentation](README.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 💡 [Usage Examples](examples/)
- 🐛 [Report Issues](https://github.com/yarinh5/Automated-Documentation-Generator/issues)

---

**Ready to revolutionize your documentation? Let's go! 🚀**

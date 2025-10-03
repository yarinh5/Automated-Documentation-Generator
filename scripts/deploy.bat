@echo off
REM Batch Deploy Script for Automated Documentation Generator
REM This script will upload the project to GitHub

echo 🚀 Deploying Automated Documentation Generator to GitHub...

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing git repository...
    git init
)

REM Add all files
echo 📝 Adding files to git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "feat: Automated Documentation Generator with AI-powered features

- 🤖 GPT-4 integration for intelligent documentation generation
- 🔍 Semantic search with embeddings for code exploration
- 📚 Comprehensive documentation generation (README, API docs, examples)
- ⚡ TypeScript support with full type definitions
- 🎨 Apple-style design principles
- 🔧 CLI interface with multiple commands
- 📦 Programmatic API for library usage
- 🐳 Docker support for containerized deployment
- 🧪 Comprehensive test suite with Jest
- 📖 Extensive documentation and usage guides
- 🔒 Security features and input validation
- 🚀 CI/CD pipeline with GitHub Actions
- 🎯 Smart code analysis and parsing
- 🧠 Embeddings cache for faster searches
- 📱 Responsive design and modern UI
- 🌍 Internationalization support
- 🔐 Secure API key management
- 📊 Performance metrics and monitoring
- 🎨 Customizable themes and styles
- 🔌 Extensible plugin system"

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo ✅ Successfully deployed to GitHub!
    echo 🌐 Repository: https://github.com/yarinh5/Automated-Documentation-Generator
    echo.
    echo 📋 Next steps:
    echo 1. Set up GitHub Actions secrets (OPENAI_API_KEY, NPM_TOKEN, etc.)
    echo 2. Enable GitHub Pages for documentation
    echo 3. Configure branch protection rules
    echo 4. Set up automated releases
    echo.
    echo 🎉 Your Automated Documentation Generator is now live on GitHub!
) else (
    echo ❌ Failed to push to GitHub. Please check your credentials and try again.
    pause
    exit /b 1
)

echo 🎯 Deployment completed successfully!
pause

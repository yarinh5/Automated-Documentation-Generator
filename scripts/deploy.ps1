# PowerShell Deploy Script for Automated Documentation Generator
# This script will upload the project to GitHub

Write-Host "🚀 Deploying Automated Documentation Generator to GitHub..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Check if remote origin exists
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "🔗 Adding remote origin..." -ForegroundColor Yellow
    git remote add origin "https://github.com/yarinh5/Automated-Documentation-Generator.git"
}

# Check if we're on main branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "🌿 Switching to main branch..." -ForegroundColor Yellow
    git checkout -b main
}

# Add all files
Write-Host "📝 Adding files to git..." -ForegroundColor Yellow
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    # Commit changes
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
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

    # Push to GitHub
    Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully deployed to GitHub!" -ForegroundColor Green
        Write-Host "🌐 Repository: https://github.com/yarinh5/Automated-Documentation-Generator" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📋 Next steps:" -ForegroundColor Yellow
        Write-Host "1. Set up GitHub Actions secrets (OPENAI_API_KEY, NPM_TOKEN, etc.)" -ForegroundColor White
        Write-Host "2. Enable GitHub Pages for documentation" -ForegroundColor White
        Write-Host "3. Configure branch protection rules" -ForegroundColor White
        Write-Host "4. Set up automated releases" -ForegroundColor White
        Write-Host ""
        Write-Host "🎉 Your Automated Documentation Generator is now live on GitHub!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to push to GitHub. Please check your credentials and try again." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ℹ️ No changes to commit" -ForegroundColor Blue
}

Write-Host "🎯 Deployment completed successfully!" -ForegroundColor Green

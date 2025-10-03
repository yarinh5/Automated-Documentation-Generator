# 📤 Upload Instructions for GitHub

Follow these step-by-step instructions to upload your Automated Documentation Generator to GitHub.

## 🎯 Quick Upload (Recommended)

### Option 1: Using PowerShell (Windows)

```powershell
# Navigate to your project directory
cd "F:\project\Automated Documentation Generator"

# Run the PowerShell script
.\scripts\deploy.ps1
```

### Option 2: Using Batch File (Windows)

```cmd
# Navigate to your project directory
cd "F:\project\Automated Documentation Generator"

# Run the batch file
scripts\deploy.bat
```

### Option 3: Using Bash Script (Linux/Mac)

```bash
# Navigate to your project directory
cd "/path/to/your/project"

# Make script executable
chmod +x scripts/deploy.sh

# Run the script
./scripts/deploy.sh
```

## 🔧 Manual Upload (Step by Step)

### 1. Open Command Prompt/Terminal

```cmd
# Navigate to your project directory
cd "F:\project\Automated Documentation Generator"
```

### 2. Initialize Git Repository

```cmd
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial commit - Automated Documentation Generator with AI features"
```

### 3. Connect to GitHub

```cmd
# Add remote origin
git remote add origin https://github.com/yarinh5/Automated-Documentation-Generator.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## 🚀 Using GitHub Desktop (GUI Method)

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Sign in** to your GitHub account
3. **Clone the repository**:
   - Click "Clone a repository from the Internet"
   - Enter: `https://github.com/yarinh5/Automated-Documentation-Generator.git`
   - Choose local path: `F:\project\Automated Documentation Generator`
4. **Add files**: All your project files should be automatically detected
5. **Commit changes**: Write a commit message and click "Commit to main"
6. **Push to GitHub**: Click "Push origin" to upload

## 🔐 Authentication Setup

### Using Personal Access Token (Recommended)

1. **Create Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`, `write:packages`
   - Copy the token

2. **Use Token**:
   ```cmd
   # When prompted for password, use your token instead
   git push -u origin main
   ```

### Using SSH Key

1. **Generate SSH Key**:
   ```cmd
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add to GitHub**:
   - Copy the public key from `~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH and GPG keys
   - Click "New SSH key" and paste the key

3. **Use SSH URL**:
   ```cmd
   git remote set-url origin git@github.com:yarinh5/Automated-Documentation-Generator.git
   ```

## 📋 Verification Checklist

After uploading, verify these items:

- [ ] All files are uploaded to GitHub
- [ ] README.md displays correctly
- [ ] Package.json has correct repository information
- [ ] GitHub Actions workflows are present
- [ ] No sensitive files (like .env) are uploaded
- [ ] Repository is public and accessible

## 🎯 Post-Upload Setup

### 1. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Enable workflows if prompted

### 2. Set Up Secrets

1. Go to Settings → Secrets and variables → Actions
2. Add these secrets:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NPM_TOKEN`: npm token (optional)
   - `DOCKER_USERNAME`: Docker Hub username (optional)
   - `DOCKER_PASSWORD`: Docker Hub password (optional)

### 3. Enable GitHub Pages

1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose "main" branch and "/ (root)" folder
4. Save settings

### 4. Configure Branch Protection

1. Go to Settings → Branches
2. Add rule for "main" branch
3. Enable "Require pull request reviews"
4. Enable "Require status checks to pass before merging"

## 🆘 Troubleshooting

### Common Issues

1. **Authentication Failed**:
   - Use Personal Access Token instead of password
   - Check if 2FA is enabled on your account

2. **Permission Denied**:
   - Verify repository ownership
   - Check if repository exists and is accessible

3. **Large Files**:
   - Use Git LFS for large files
   - Check .gitignore for unnecessary files

4. **Network Issues**:
   - Check internet connection
   - Try using SSH instead of HTTPS

### Getting Help

- 📧 **Email**: support@myproject.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yarinh5/Automated-Documentation-Generator/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yarinh5/Automated-Documentation-Generator/discussions)

## 🎉 Success!

Once uploaded successfully, your repository will be available at:
**https://github.com/yarinh5/Automated-Documentation-Generator**

Your Automated Documentation Generator is now live on GitHub! 🚀

---

**Ready to share your amazing project with the world! 🌍**

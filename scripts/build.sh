#!/bin/bash

# Build script for Automated Documentation Generator

echo "🚀 Building Automated Documentation Generator..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
rm -rf build/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running ESLint..."
npm run lint

# Run tests
echo "🧪 Running tests..."
npm test

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Create executable
echo "📝 Creating executable..."
chmod +x dist/cli/index.js

echo "✅ Build completed successfully!"
echo "📁 Output directory: dist/"
echo "🚀 Run with: node dist/cli/index.js --help"

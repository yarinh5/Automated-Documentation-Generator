/**
 * Usage Examples for Automated Documentation Generator
 *
 * This file demonstrates various ways to use the library
 * both programmatically and via CLI commands.
 */

import * as fs from "fs-extra";
import * as path from "path";
import { AutoDocs, DocumentationOptions, ProjectConfig } from "../src/index";

// Example 1: Basic Documentation Generation
export async function basicDocumentationGeneration() {
  console.log("📚 Example 1: Basic Documentation Generation");

  const autoDocs = new AutoDocs(process.env.OPENAI_API_KEY!);

  const config: ProjectConfig = {
    name: "My Awesome Library",
    description: "A library that does amazing things",
    version: "2.1.0",
    author: "Jane Smith",
    license: "MIT",
    repository: "https://github.com/janesmith/awesome-library",
    keywords: ["library", "typescript", "utilities"],
  };

  const options: DocumentationOptions = {
    includeExamples: true,
    includeTypeDefinitions: true,
    includePrivateMembers: false,
    outputFormat: "markdown",
    style: "apple",
  };

  const { readme, apiDocs } = await autoDocs.generateDocumentation(config, options);

  // Save to files
  await fs.writeFile("README.md", readme);
  await fs.writeFile("API.md", apiDocs);

  console.log("✅ Documentation generated and saved!");
}

// Example 2: Advanced Search Capabilities
export async function advancedSearchExample() {
  console.log("🔍 Example 2: Advanced Search Capabilities");

  const autoDocs = new AutoDocs(process.env.OPENAI_API_KEY!);

  // Generate embeddings first
  await autoDocs.generateEmbeddings();

  // Different types of searches
  const searches = [
    {
      query: "function that handles user authentication",
      description: "Find authentication functions",
    },
    {
      query: "class that manages database connections",
      description: "Find database management classes",
    },
    {
      query: "error handling try catch blocks",
      description: "Find error handling code",
    },
    {
      query: "async function that returns a promise",
      description: "Find async functions",
    },
  ];

  for (const search of searches) {
    console.log(`\n🔍 ${search.description}:`);
    const results = await autoDocs.search(search.query, 5);

    results.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.file}:${result.lineNumber}`);
      console.log(`     Similarity: ${(result.similarity * 100).toFixed(1)}%`);
      console.log(`     Context: ${result.context}`);
    });
  }
}

// Example 3: Custom Configuration
export async function customConfigurationExample() {
  console.log("⚙️ Example 3: Custom Configuration");

  // Create a custom configuration file
  const customConfig: ProjectConfig = {
    name: "E-commerce Microservice",
    description: "A microservice for handling e-commerce operations",
    version: "3.0.0",
    author: "E-commerce Team",
    license: "Apache-2.0",
    repository: "https://github.com/company/ecommerce-microservice",
    homepage: "https://ecommerce.company.com",
    bugs: "https://github.com/company/ecommerce-microservice/issues",
    keywords: ["microservice", "ecommerce", "api", "typescript", "nodejs"],
  };

  // Save configuration
  await fs.writeJSON("custom-docs.config.json", customConfig, { spaces: 2 });
  console.log("✅ Custom configuration saved to custom-docs.config.json");
}

// Example 4: Batch Processing
export async function batchProcessingExample() {
  console.log("📦 Example 4: Batch Processing");

  const autoDocs = new AutoDocs(process.env.OPENAI_API_KEY!);

  // Process multiple projects
  const projects = [
    {
      name: "Frontend App",
      path: "./frontend",
      config: {
        name: "E-commerce Frontend",
        description: "React-based e-commerce frontend",
        version: "1.0.0",
        author: "Frontend Team",
        license: "MIT",
      } as ProjectConfig,
    },
    {
      name: "Backend API",
      path: "./backend",
      config: {
        name: "E-commerce API",
        description: "Node.js e-commerce API",
        version: "1.0.0",
        author: "Backend Team",
        license: "MIT",
      } as ProjectConfig,
    },
  ];

  for (const project of projects) {
    console.log(`\n📁 Processing ${project.name}...`);

    try {
      // Change to project directory
      process.chdir(project.path);

      // Generate documentation
      const { readme, apiDocs } = await autoDocs.generateDocumentation(project.config);

      // Save to project-specific docs folder
      const docsDir = path.join(project.path, "docs");
      await fs.ensureDir(docsDir);
      await fs.writeFile(path.join(docsDir, "README.md"), readme);
      await fs.writeFile(path.join(docsDir, "API.md"), apiDocs);

      console.log(`✅ Documentation generated for ${project.name}`);

    } catch (error) {
      console.error(`❌ Error processing ${project.name}:`, error);
    }
  }
}

// Example 5: Integration with CI/CD
export async function ciCdIntegrationExample() {
  console.log("🔄 Example 5: CI/CD Integration");

  // This would typically be run in a CI/CD pipeline
  const autoDocs = new AutoDocs(process.env.OPENAI_API_KEY!);

  // Check if documentation needs updating
  const lastCommit = process.env.GIT_COMMIT_SHA || "HEAD";
  const hasCodeChanges = await checkForCodeChanges(lastCommit);

  if (hasCodeChanges) {
    console.log("📝 Code changes detected, updating documentation...");

    // Generate updated documentation
    const config = await loadConfigFromPackageJson(".");
    const { readme, apiDocs } = await autoDocs.generateDocumentation(config);

    // Save to docs folder
    await fs.ensureDir("docs");
    await fs.writeFile("docs/README.md", readme);
    await fs.writeFile("docs/API.md", apiDocs);

    // Commit changes (in a real CI/CD pipeline)
    console.log("✅ Documentation updated and committed");
  } else {
    console.log("ℹ️ No code changes detected, skipping documentation update");
  }
}

// Helper function to check for code changes
async function checkForCodeChanges(commitSha: string): Promise<boolean> {
  // This is a simplified example
  // In a real implementation, you would use git commands to check for changes
  return true; // For demo purposes, always return true
}

// Helper function to load config from package.json
async function loadConfigFromPackageJson(projectPath: string): Promise<ProjectConfig> {
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = await fs.readJSON(packageJsonPath);

  return {
    name: packageJson.name || "My Project",
    description: packageJson.description || "A wonderful project",
    version: packageJson.version || "1.0.0",
    author: packageJson.author || "Unknown",
    license: packageJson.license || "MIT",
    repository: packageJson.repository?.url || packageJson.repository,
    homepage: packageJson.homepage,
    bugs: packageJson.bugs?.url || packageJson.bugs,
    keywords: packageJson.keywords || [],
  };
}

// Example 6: Custom Search Functions
export async function customSearchFunctions() {
  console.log("🎯 Example 6: Custom Search Functions");

  const autoDocs = new AutoDocs(process.env.OPENAI_API_KEY!);
  await autoDocs.generateEmbeddings();

  // Custom search functions
  const searchFunctions = {
    findAsyncFunctions: async () => {
      const results = await autoDocs.search("async function", 10);
      return results.filter(r => r.text.toLowerCase().includes("async"));
    },

    findExportedClasses: async () => {
      const results = await autoDocs.search("export class", 10);
      return results.filter(r => r.text.includes("class"));
    },

    findErrorHandling: async () => {
      const results = await autoDocs.search("error handling try catch", 10);
      return results.filter(r =>
        r.text.toLowerCase().includes("error") ||
        r.text.toLowerCase().includes("catch")
      );
    },

    findDatabaseOperations: async () => {
      const results = await autoDocs.search("database query insert update delete", 10);
      return results.filter(r =>
        r.text.toLowerCase().includes("database") ||
        r.text.toLowerCase().includes("query") ||
        r.text.toLowerCase().includes("sql")
      );
    },
  };

  // Use custom search functions
  for (const [name, searchFn] of Object.entries(searchFunctions)) {
    console.log(`\n🔍 ${name}:`);
    const results = await searchFn();
    console.log(`   Found ${results.length} results`);

    results.slice(0, 3).forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.file}:${result.lineNumber}`);
    });
  }
}

// Run all examples
export async function runAllExamples() {
  console.log("🚀 Running all usage examples...\n");

  try {
    await basicDocumentationGeneration();
    await advancedSearchExample();
    await customConfigurationExample();
    await batchProcessingExample();
    await ciCdIntegrationExample();
    await customSearchFunctions();

    console.log("\n🎉 All examples completed successfully!");
  } catch (error) {
    console.error("❌ Error running examples:", error);
  }
}

// Export individual examples for selective running
export {
    advancedSearchExample, basicDocumentationGeneration, batchProcessingExample,
    ciCdIntegrationExample, customConfigurationExample, customSearchFunctions
};

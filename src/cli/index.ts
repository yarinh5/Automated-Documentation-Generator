#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import * as fs from "fs-extra";
import ora from "ora";
import * as path from "path";
import { CodeAnalyzer } from "../core/CodeAnalyzer";
import { DocumentationGenerator } from "../core/DocumentationGenerator";
import { SemanticSearch } from "../core/SemanticSearch";
import { DocumentationOptions, ProjectConfig } from "../types";

const program = new Command();

program
  .name("auto-docs")
  .description("AI-powered documentation generator with semantic search")
  .version("1.0.0");

program
  .command("generate")
  .description("Generate documentation for your project")
  .option("-p, --path <path>", "Project path", ".")
  .option("-k, --api-key <key>", "OpenAI API key")
  .option("-c, --config <file>", "Configuration file", "docs.config.json")
  .option("-o, --output <dir>", "Output directory", "./docs")
  .option("--no-examples", "Skip generating examples")
  .option("--no-types", "Skip type definitions")
  .option("--include-private", "Include private members")
  .option("--style <style>", "Documentation style", "apple")
  .option("--format <format>", "Output format", "markdown")
  .action(async (options) => {
    try {
      await generateDocumentation(options);
    } catch (error) {
      console.error(chalk.red("❌ Error:"), error);
      process.exit(1);
    }
  });

program
  .command("search")
  .description("Search your codebase using semantic search")
  .option("-p, --path <path>", "Project path", ".")
  .option("-k, --api-key <key>", "OpenAI API key")
  .option("-q, --query <query>", "Search query")
  .option("-l, --limit <number>", "Number of results", "10")
  .action(async (options) => {
    try {
      await performSearch(options);
    } catch (error) {
      console.error(chalk.red("❌ Error:"), error);
      process.exit(1);
    }
  });

program
  .command("init")
  .description("Initialize documentation configuration")
  .option("-p, --path <path>", "Project path", ".")
  .action(async (options) => {
    try {
      await initializeConfig(options);
    } catch (error) {
      console.error(chalk.red("❌ Error:"), error);
      process.exit(1);
    }
  });

async function generateDocumentation(options: any) {
  const spinner = ora("Initializing documentation generator...").start();

  // Validate API key
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    spinner.fail("OpenAI API key is required. Set OPENAI_API_KEY environment variable or use --api-key option.");
    return;
  }

  // Load configuration
  const configPath = path.resolve(options.path, options.config);
  let config: ProjectConfig;

  if (await fs.pathExists(configPath)) {
    config = await fs.readJSON(configPath);
    spinner.succeed("Configuration loaded");
  } else {
    spinner.warn("No configuration file found, using package.json");
    config = await loadConfigFromPackageJson(options.path);
  }

  // Set up documentation options
  const docOptions: DocumentationOptions = {
    includeExamples: options.examples !== false,
    includeTypeDefinitions: options.types !== false,
    includePrivateMembers: options.includePrivate || false,
    outputFormat: options.format as "markdown" | "html",
    style: options.style as "apple" | "minimal" | "detailed",
  };

  // Initialize generators
  const docGenerator = new DocumentationGenerator(apiKey);
  const semanticSearch = new SemanticSearch(apiKey, options.path);

  // Generate documentation
  spinner.start("Generating documentation...");
  const { readme, apiDocs } = await docGenerator.generateDocumentation(
    options.path,
    config,
    docOptions
  );

  // Generate embeddings for semantic search
  spinner.start("Generating embeddings for semantic search...");
  const codeAnalyzer = new CodeAnalyzer();
  const codeFiles = await codeAnalyzer.analyzeProject(options.path);
  await semanticSearch.generateEmbeddings(codeFiles);

  // Create output directory
  const outputDir = path.resolve(options.path, options.output);
  await fs.ensureDir(outputDir);

  // Write documentation files
  await fs.writeFile(path.join(outputDir, "README.md"), readme);
  await fs.writeFile(path.join(outputDir, "API.md"), apiDocs);

  // Generate examples if requested
  if (docOptions.includeExamples) {
    spinner.start("Generating code examples...");
    const examples = await docGenerator.generateCodeExamples(codeFiles, config);
    await fs.writeFile(path.join(outputDir, "EXAMPLES.md"), examples);
  }

  spinner.succeed(`Documentation generated successfully in ${outputDir}`);

  console.log(chalk.green("\n📚 Generated files:"));
  console.log(chalk.blue(`  📄 README.md`));
  console.log(chalk.blue(`  📄 API.md`));
  if (docOptions.includeExamples) {
    console.log(chalk.blue(`  📄 EXAMPLES.md`));
  }
  console.log(chalk.blue(`  🧠 Embeddings for semantic search`));

  console.log(chalk.yellow("\n🔍 You can now use semantic search:"));
  console.log(chalk.gray(`  auto-docs search --query "your search term"`));
}

async function performSearch(options: any) {
  const spinner = ora("Initializing semantic search...").start();

  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    spinner.fail("OpenAI API key is required. Set OPENAI_API_KEY environment variable or use --api-key option.");
    return;
  }

  const semanticSearch = new SemanticSearch(apiKey, options.path);

  if (options.query) {
    spinner.start("Searching...");
    const results = await semanticSearch.search(options.query, parseInt(options.limit));

    if (results.length === 0) {
      spinner.warn("No results found");
      return;
    }

    spinner.succeed(`Found ${results.length} results`);

    console.log(chalk.green(`\n🔍 Search results for "${options.query}":\n`));

    results.forEach((result, index) => {
      console.log(chalk.blue(`${index + 1}. ${result.file}:${result.lineNumber}`));
      console.log(chalk.gray(`   Similarity: ${(result.similarity * 100).toFixed(1)}%`));
      console.log(chalk.white(`   ${result.context}`));
      console.log(chalk.gray(`   ${result.text.substring(0, 200)}...`));
      console.log("");
    });
  } else {
    // Interactive search
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = () => {
      rl.question(chalk.cyan("Enter search query (or 'exit' to quit): "), async (query) => {
        if (query.toLowerCase() === "exit") {
          rl.close();
          return;
        }

        spinner.start("Searching...");
        const results = await semanticSearch.search(query, parseInt(options.limit));
        spinner.stop();

        if (results.length === 0) {
          console.log(chalk.yellow("No results found\n"));
        } else {
          console.log(chalk.green(`\n🔍 Found ${results.length} results:\n`));

          results.forEach((result, index) => {
            console.log(chalk.blue(`${index + 1}. ${result.file}:${result.lineNumber}`));
            console.log(chalk.gray(`   Similarity: ${(result.similarity * 100).toFixed(1)}%`));
            console.log(chalk.white(`   ${result.context}`));
            console.log("");
          });
        }

        askQuestion();
      });
    };

    askQuestion();
  }
}

async function initializeConfig(options: any) {
  const spinner = ora("Initializing configuration...").start();

  const configPath = path.resolve(options.path, "docs.config.json");

  if (await fs.pathExists(configPath)) {
    spinner.warn("Configuration file already exists");
    return;
  }

  // Try to load from package.json
  const packageJsonPath = path.resolve(options.path, "package.json");
  let config: ProjectConfig;

  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJSON(packageJsonPath);
    config = {
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
  } else {
    config = {
      name: "My Project",
      description: "A wonderful project",
      version: "1.0.0",
      author: "Unknown",
      license: "MIT",
      keywords: [],
    };
  }

  await fs.writeJSON(configPath, config, { spaces: 2 });
  spinner.succeed(`Configuration created at ${configPath}`);

  console.log(chalk.green("\n📝 Configuration file created!"));
  console.log(chalk.yellow("Edit docs.config.json to customize your documentation."));
  console.log(chalk.blue("\nNext steps:"));
  console.log(chalk.gray("  1. Set your OpenAI API key: export OPENAI_API_KEY=your_key"));
  console.log(chalk.gray("  2. Generate documentation: auto-docs generate"));
}

async function loadConfigFromPackageJson(projectPath: string): Promise<ProjectConfig> {
  const packageJsonPath = path.resolve(projectPath, "package.json");

  if (!(await fs.pathExists(packageJsonPath))) {
    throw new Error("No package.json found and no configuration file provided");
  }

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

program.parse();

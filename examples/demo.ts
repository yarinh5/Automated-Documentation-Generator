import { AutoDocs, ProjectConfig } from "../src/index";

// Example usage of the Automated Documentation Generator
async function demo() {
  console.log("🚀 Automated Documentation Generator Demo");
  console.log("==========================================\n");

  // Initialize with your OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ Please set OPENAI_API_KEY environment variable");
    return;
  }

  const autoDocs = new AutoDocs(apiKey);

  // Example project configuration
  const config: ProjectConfig = {
    name: "E-commerce API",
    description: "A modern e-commerce API built with TypeScript and Node.js",
    version: "1.0.0",
    author: "John Doe",
    license: "MIT",
    repository: "https://github.com/johndoe/ecommerce-api",
    homepage: "https://ecommerce-api.com",
    bugs: "https://github.com/johndoe/ecommerce-api/issues",
    keywords: ["ecommerce", "api", "typescript", "nodejs", "rest"],
  };

  try {
    console.log("📊 Analyzing project structure...");
    const codeFiles = await autoDocs.analyzeProject();
    console.log(`✅ Found ${codeFiles.length} code files`);

    console.log("\n🤖 Generating documentation...");
    const { readme, apiDocs } = await autoDocs.generateDocumentation(config, {
      includeExamples: true,
      includeTypeDefinitions: true,
      style: "apple",
    });

    console.log("✅ Documentation generated successfully!");
    console.log(`📄 README length: ${readme.length} characters`);
    console.log(`📄 API docs length: ${apiDocs.length} characters`);

    console.log("\n🧠 Generating embeddings for semantic search...");
    await autoDocs.generateEmbeddings();
    console.log("✅ Embeddings generated successfully!");

    console.log("\n🔍 Testing semantic search...");

    // Test different search queries
    const searchQueries = [
      "authentication function",
      "database connection",
      "error handling",
      "user management",
      "payment processing",
    ];

    for (const query of searchQueries) {
      console.log(`\n🔍 Searching for: "${query}"`);
      const results = await autoDocs.search(query, 3);

      if (results.length > 0) {
        console.log(`   Found ${results.length} results:`);
        results.forEach((result, index) => {
          console.log(`   ${index + 1}. ${result.file}:${result.lineNumber} (${(result.similarity * 100).toFixed(1)}% match)`);
          console.log(`      ${result.context}`);
        });
      } else {
        console.log("   No results found");
      }
    }

    console.log("\n🎉 Demo completed successfully!");
    console.log("\nNext steps:");
    console.log("1. Run 'auto-docs generate' to create documentation files");
    console.log("2. Run 'auto-docs search --query \"your query\"' to search your code");
    console.log("3. Check the generated docs in the ./docs folder");

  } catch (error) {
    console.error("❌ Error during demo:", error);
  }
}

// Run the demo if this file is executed directly
if (require.main === module) {
  demo().catch(console.error);
}

export { demo };

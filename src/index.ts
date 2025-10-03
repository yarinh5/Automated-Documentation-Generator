export { CodeAnalyzer } from "./core/CodeAnalyzer";
export { DocumentationGenerator } from "./core/DocumentationGenerator";
export { SemanticSearch } from "./core/SemanticSearch";
export * from "./types";

// Main entry point for programmatic usage
export class AutoDocs {
  private docGenerator: DocumentationGenerator;
  private semanticSearch: SemanticSearch;
  private codeAnalyzer: CodeAnalyzer;

  constructor(apiKey: string, projectPath: string = ".") {
    this.docGenerator = new DocumentationGenerator(apiKey);
    this.semanticSearch = new SemanticSearch(apiKey, projectPath);
    this.codeAnalyzer = new CodeAnalyzer();
  }

  async generateDocumentation(
    config: ProjectConfig,
    options?: Partial<DocumentationOptions>
  ) {
    return this.docGenerator.generateDocumentation(
      process.cwd(),
      config,
      {
        includeExamples: true,
        includeTypeDefinitions: true,
        includePrivateMembers: false,
        outputFormat: "markdown",
        style: "apple",
        ...options,
      }
    );
  }

  async search(query: string, limit: number = 10) {
    return this.semanticSearch.search(query, limit);
  }

  async analyzeProject() {
    return this.codeAnalyzer.analyzeProject(process.cwd());
  }

  async generateEmbeddings() {
    const codeFiles = await this.analyzeProject();
    return this.semanticSearch.generateEmbeddings(codeFiles);
  }
}

// Re-export types for convenience
import { DocumentationOptions, ProjectConfig } from "./types";

import * as fs from "fs-extra";
import OpenAI from "openai";
import * as path from "path";
import { CodeFile, EmbeddingResult, SearchResult } from "../types";

export class SemanticSearch {
  private openai: OpenAI;
  private embeddings: EmbeddingResult[] = [];
  private embeddingsPath: string;

  constructor(apiKey: string, projectPath: string) {
    this.openai = new OpenAI({ apiKey });
    this.embeddingsPath = path.join(projectPath, ".docs", "embeddings.json");
  }

  async generateEmbeddings(codeFiles: CodeFile[]): Promise<void> {
    console.log("🧠 Generating embeddings for semantic search...");

    const texts: string[] = [];
    const metadata: Array<{ file: string; lineNumber: number }> = [];

    // Extract meaningful text chunks from code files
    for (const file of codeFiles) {
      // Add file-level information
      texts.push(`File: ${file.path}\nLanguage: ${file.language}\nContent: ${this.extractFileSummary(file)}`);
      metadata.push({ file: file.path, lineNumber: 0 });

      // Add function information
      for (const func of file.functions) {
        if (func.isExported) {
          const funcText = `Function: ${func.name}\nParameters: ${func.parameters.map(p => `${p.name}: ${p.type}`).join(", ")}\nReturns: ${func.returnType}\nDescription: ${func.description}\nFile: ${file.path}`;
          texts.push(funcText);
          metadata.push({ file: file.path, lineNumber: func.lineNumber });
        }
      }

      // Add class information
      for (const cls of file.classes) {
        if (cls.isExported) {
          const classText = `Class: ${cls.name}\nDescription: ${cls.description}\nMethods: ${cls.methods.length}\nProperties: ${cls.properties.length}\nFile: ${file.path}`;
          texts.push(classText);
          metadata.push({ file: file.path, lineNumber: cls.lineNumber });
        }
      }

      // Add interface information
      for (const iface of file.interfaces) {
        if (iface.isExported) {
          const interfaceText = `Interface: ${iface.name}\nDescription: ${iface.description}\nProperties: ${iface.properties.length}\nMethods: ${iface.methods.length}\nFile: ${file.path}`;
          texts.push(interfaceText);
          metadata.push({ file: file.path, lineNumber: iface.lineNumber });
        }
      }

      // Add type information
      for (const type of file.types) {
        if (type.isExported) {
          const typeText = `Type: ${type.name}\nDefinition: ${type.definition}\nDescription: ${type.description}\nFile: ${file.path}`;
          texts.push(typeText);
          metadata.push({ file: file.path, lineNumber: type.lineNumber });
        }
      }
    }

    // Generate embeddings in batches
    const batchSize = 100;
    const embeddings: number[][] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);

      try {
        const response = await this.openai.embeddings.create({
          model: "text-embedding-3-small",
          input: batch,
        });

        const batchEmbeddings = response.data.map(item => item.embedding);
        embeddings.push(...batchEmbeddings);

        console.log(`Generated embeddings for batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`);
      } catch (error) {
        console.error(`Error generating embeddings for batch ${Math.floor(i / batchSize) + 1}:`, error);
      }
    }

    // Store embeddings with metadata
    this.embeddings = embeddings.map((embedding, index) => ({
      text: texts[index],
      embedding,
      file: metadata[index].file,
      lineNumber: metadata[index].lineNumber,
    }));

    // Save embeddings to file
    await this.saveEmbeddings();
    console.log(`✅ Generated ${this.embeddings.length} embeddings`);
  }

  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    if (this.embeddings.length === 0) {
      await this.loadEmbeddings();
    }

    if (this.embeddings.length === 0) {
      console.warn("No embeddings available. Please generate embeddings first.");
      return [];
    }

    // Generate embedding for the query
    const queryResponse = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryEmbedding = queryResponse.data[0].embedding;

    // Calculate similarities
    const similarities = this.embeddings.map(item => ({
      ...item,
      similarity: this.cosineSimilarity(queryEmbedding, item.embedding),
    }));

    // Sort by similarity and return top results
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => ({
        text: item.text,
        file: item.file,
        lineNumber: item.lineNumber,
        similarity: item.similarity,
        context: this.extractContext(item.text, query),
      }));
  }

  async searchByFunction(functionName: string): Promise<SearchResult[]> {
    return this.search(`function ${functionName}`, 5);
  }

  async searchByClass(className: string): Promise<SearchResult[]> {
    return this.search(`class ${className}`, 5);
  }

  async searchByType(typeName: string): Promise<SearchResult[]> {
    return this.search(`type ${typeName}`, 5);
  }

  async findSimilarCode(codeSnippet: string): Promise<SearchResult[]> {
    return this.search(codeSnippet, 10);
  }

  private extractFileSummary(file: CodeFile): string {
    const summary = [];

    if (file.functions.length > 0) {
      summary.push(`Functions: ${file.functions.filter(f => f.isExported).map(f => f.name).join(", ")}`);
    }

    if (file.classes.length > 0) {
      summary.push(`Classes: ${file.classes.filter(c => c.isExported).map(c => c.name).join(", ")}`);
    }

    if (file.interfaces.length > 0) {
      summary.push(`Interfaces: ${file.interfaces.filter(i => i.isExported).map(i => i.name).join(", ")}`);
    }

    if (file.types.length > 0) {
      summary.push(`Types: ${file.types.filter(t => t.isExported).map(t => t.name).join(", ")}`);
    }

    return summary.join(" | ");
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private extractContext(text: string, query: string): string {
    const queryWords = query.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/);

    // Find the sentence that contains the most query words
    let bestSentence = "";
    let maxMatches = 0;

    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      const matches = queryWords.filter(word => lowerSentence.includes(word)).length;

      if (matches > maxMatches) {
        maxMatches = matches;
        bestSentence = sentence.trim();
      }
    }

    return bestSentence || text.substring(0, 200) + "...";
  }

  private async saveEmbeddings(): Promise<void> {
    await fs.ensureDir(path.dirname(this.embeddingsPath));
    await fs.writeJSON(this.embeddingsPath, this.embeddings, { spaces: 2 });
  }

  private async loadEmbeddings(): Promise<void> {
    try {
      if (await fs.pathExists(this.embeddingsPath)) {
        this.embeddings = await fs.readJSON(this.embeddingsPath);
        console.log(`📚 Loaded ${this.embeddings.length} embeddings from cache`);
      }
    } catch (error) {
      console.warn("Failed to load embeddings:", error);
    }
  }

  async clearEmbeddings(): Promise<void> {
    this.embeddings = [];
    if (await fs.pathExists(this.embeddingsPath)) {
      await fs.remove(this.embeddingsPath);
    }
  }

  getEmbeddingsCount(): number {
    return this.embeddings.length;
  }
}

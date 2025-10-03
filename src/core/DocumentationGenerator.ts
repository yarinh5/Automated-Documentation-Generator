import OpenAI from "openai";
import { CodeFile, DocumentationOptions, ProjectConfig } from "../types";
import { CodeAnalyzer } from "./CodeAnalyzer";

export class DocumentationGenerator {
  private openai: OpenAI;
  private codeAnalyzer: CodeAnalyzer;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.codeAnalyzer = new CodeAnalyzer();
  }

  async generateDocumentation(
    projectPath: string,
    config: ProjectConfig,
    options: DocumentationOptions = {
      includeExamples: true,
      includeTypeDefinitions: true,
      includePrivateMembers: false,
      outputFormat: "markdown",
      style: "apple",
    }
  ): Promise<{ readme: string; apiDocs: string }> {
    console.log("🔍 Analyzing project structure...");
    const codeFiles = await this.codeAnalyzer.analyzeProject(projectPath);

    console.log("🤖 Generating documentation with GPT-4...");
    const [readme, apiDocs] = await Promise.all([
      this.generateREADME(codeFiles, config, options),
      this.generateAPIDocs(codeFiles, config, options),
    ]);

    return { readme, apiDocs };
  }

  private async generateREADME(
    codeFiles: CodeFile[],
    config: ProjectConfig,
    options: DocumentationOptions
  ): Promise<string> {
    const projectSummary = this.createProjectSummary(codeFiles, config);

    const prompt = `Create a comprehensive README.md file for a ${config.name} project.

Project Details:
- Name: ${config.name}
- Description: ${config.description}
- Version: ${config.version}
- Author: ${config.author}
- License: ${config.license}
${config.repository ? `- Repository: ${config.repository}` : ""}
${config.homepage ? `- Homepage: ${config.homepage}` : ""}

Project Structure Analysis:
${projectSummary}

Requirements:
1. Use Apple-style design principles: clean, minimal, elegant
2. Include a beautiful header with project name and description
3. Add installation instructions
4. Include usage examples with code snippets
5. Add API overview section
6. Include contributing guidelines
7. Add license information
8. Use emojis sparingly but effectively
9. Include badges for version, license, etc.
10. Make it visually appealing with proper markdown formatting

Style: ${options.style}
Include Examples: ${options.includeExamples}
Include Type Definitions: ${options.includeTypeDefinitions}

Generate a professional, comprehensive README that would impress developers and make them want to use this project.`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return response.choices[0]?.message?.content || "";
  }

  private async generateAPIDocs(
    codeFiles: CodeFile[],
    config: ProjectConfig,
    options: DocumentationOptions
  ): Promise<string> {
    const apiSummary = this.createAPISummary(codeFiles);

    const prompt = `Create comprehensive API documentation for ${config.name}.

Project: ${config.name} v${config.version}
Description: ${config.description}

API Structure:
${apiSummary}

Requirements:
1. Use Apple-style design: clean, minimal, elegant
2. Organize by modules/files
3. Include detailed function/class documentation
4. Add parameter descriptions and return types
5. Include usage examples for each major function
6. Add type definitions if available
7. Use proper markdown formatting with code blocks
8. Include navigation/table of contents
9. Make it easy to search and navigate
10. Include both public and private APIs (if requested)

Style: ${options.style}
Include Examples: ${options.includeExamples}
Include Type Definitions: ${options.includeTypeDefinitions}
Include Private Members: ${options.includePrivateMembers}

Generate professional API documentation that developers can easily understand and use.`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 6000,
    });

    return response.choices[0]?.message?.content || "";
  }

  private createProjectSummary(codeFiles: CodeFile[], config: ProjectConfig): string {
    const totalFiles = codeFiles.length;
    const totalFunctions = codeFiles.reduce((sum, file) => sum + file.functions.length, 0);
    const totalClasses = codeFiles.reduce((sum, file) => sum + file.classes.length, 0);
    const totalInterfaces = codeFiles.reduce((sum, file) => sum + file.interfaces.length, 0);
    const totalTypes = codeFiles.reduce((sum, file) => sum + file.types.length, 0);

    let summary = `Project Statistics:
- Total Files: ${totalFiles}
- Total Functions: ${totalFunctions}
- Total Classes: ${totalClasses}
- Total Interfaces: ${totalInterfaces}
- Total Types: ${totalTypes}

File Structure:
`;

    codeFiles.forEach(file => {
      summary += `\n📁 ${file.path}
  - Functions: ${file.functions.length}
  - Classes: ${file.classes.length}
  - Interfaces: ${file.interfaces.length}
  - Types: ${file.types.length}`;
    });

    summary += `\n\nKey Components:`;

    // Add key functions and classes
    codeFiles.forEach(file => {
      if (file.functions.length > 0) {
        summary += `\n\n🔧 ${file.path} - Functions:`;
        file.functions
          .filter(f => f.isExported)
          .slice(0, 5) // Limit to first 5 exported functions
          .forEach(func => {
            summary += `\n  - ${func.name}(${func.parameters.map(p => p.name).join(", ")})`;
          });
      }

      if (file.classes.length > 0) {
        summary += `\n\n🏗️ ${file.path} - Classes:`;
        file.classes
          .filter(c => c.isExported)
          .forEach(cls => {
            summary += `\n  - ${cls.name}${cls.extends ? ` extends ${cls.extends}` : ""}`;
          });
      }
    });

    return summary;
  }

  private createAPISummary(codeFiles: CodeFile[]): string {
    let summary = "";

    codeFiles.forEach(file => {
      if (file.functions.length === 0 && file.classes.length === 0 && file.interfaces.length === 0 && file.types.length === 0) {
        return;
      }

      summary += `\n## 📁 ${file.path}\n`;

      if (file.functions.length > 0) {
        summary += `\n### Functions (${file.functions.length})\n`;
        file.functions.forEach(func => {
          summary += `\n#### ${func.name}\n`;
          summary += `- **Parameters**: ${func.parameters.map(p => `${p.name}: ${p.type}${p.isOptional ? "?" : ""}`).join(", ")}\n`;
          summary += `- **Returns**: ${func.returnType}\n`;
          summary += `- **Async**: ${func.isAsync ? "Yes" : "No"}\n`;
          summary += `- **Exported**: ${func.isExported ? "Yes" : "No"}\n`;
          if (func.description) {
            summary += `- **Description**: ${func.description}\n`;
          }
        });
      }

      if (file.classes.length > 0) {
        summary += `\n### Classes (${file.classes.length})\n`;
        file.classes.forEach(cls => {
          summary += `\n#### ${cls.name}\n`;
          if (cls.extends) summary += `- **Extends**: ${cls.extends}\n`;
          if (cls.implements) summary += `- **Implements**: ${cls.implements.join(", ")}\n`;
          summary += `- **Methods**: ${cls.methods.length}\n`;
          summary += `- **Properties**: ${cls.properties.length}\n`;
          summary += `- **Exported**: ${cls.isExported ? "Yes" : "No"}\n`;
          if (cls.description) {
            summary += `- **Description**: ${cls.description}\n`;
          }
        });
      }

      if (file.interfaces.length > 0) {
        summary += `\n### Interfaces (${file.interfaces.length})\n`;
        file.interfaces.forEach(iface => {
          summary += `\n#### ${iface.name}\n`;
          if (iface.extends) summary += `- **Extends**: ${iface.extends.join(", ")}\n`;
          summary += `- **Properties**: ${iface.properties.length}\n`;
          summary += `- **Methods**: ${iface.methods.length}\n`;
          summary += `- **Exported**: ${iface.isExported ? "Yes" : "No"}\n`;
          if (iface.description) {
            summary += `- **Description**: ${iface.description}\n`;
          }
        });
      }

      if (file.types.length > 0) {
        summary += `\n### Types (${file.types.length})\n`;
        file.types.forEach(type => {
          summary += `\n#### ${type.name}\n`;
          summary += `- **Definition**: \`${type.definition}\`\n`;
          summary += `- **Exported**: ${type.isExported ? "Yes" : "No"}\n`;
          if (type.description) {
            summary += `- **Description**: ${type.description}\n`;
          }
        });
      }
    });

    return summary;
  }

  async generateCodeExamples(codeFiles: CodeFile[], config: ProjectConfig): Promise<string> {
    const examples = codeFiles
      .flatMap(file => file.functions)
      .filter(func => func.isExported && func.description)
      .slice(0, 5); // Top 5 examples

    const prompt = `Generate practical code examples for the ${config.name} project.

Project: ${config.name}
Description: ${config.description}

Key Functions to demonstrate:
${examples.map(func => `- ${func.name}: ${func.description}`).join("\n")}

Requirements:
1. Create realistic, practical examples
2. Show proper imports and setup
3. Include error handling
4. Add comments explaining each step
5. Make examples copy-pasteable
6. Use modern JavaScript/TypeScript best practices
7. Include both basic and advanced usage patterns

Generate 3-5 comprehensive examples that showcase the project's capabilities.`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    return response.choices[0]?.message?.content || "";
  }
}

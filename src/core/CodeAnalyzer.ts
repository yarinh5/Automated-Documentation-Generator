import * as fs from "fs-extra";
import { glob } from "glob";
import * as path from "path";
import { ClassInfo, CodeFile, FunctionInfo, InterfaceInfo, MethodInfo, ParameterInfo, PropertyInfo, TypeInfo } from "../types";

export class CodeAnalyzer {
  private supportedExtensions = [".ts", ".js", ".tsx", ".jsx"];

  async analyzeProject(projectPath: string): Promise<CodeFile[]> {
    const files = await this.findCodeFiles(projectPath);
    const analyzedFiles: CodeFile[] = [];

    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const relativePath = path.relative(projectPath, filePath);
        const language = this.getLanguageFromExtension(path.extname(filePath));

        const codeFile: CodeFile = {
          path: relativePath,
          content,
          language,
          functions: this.extractFunctions(content),
          classes: this.extractClasses(content),
          interfaces: this.extractInterfaces(content),
          types: this.extractTypes(content),
        };

        analyzedFiles.push(codeFile);
      } catch (error) {
        console.warn(`Failed to analyze file ${filePath}:`, error);
      }
    }

    return analyzedFiles;
  }

  private async findCodeFiles(projectPath: string): Promise<string[]> {
    const patterns = this.supportedExtensions.map(ext => `**/*${ext}`);
    const files: string[] = [];

    for (const pattern of patterns) {
      const matches = await glob(pattern, {
        cwd: projectPath,
        ignore: ["node_modules/**", "dist/**", "build/**", "**/*.test.*", "**/*.spec.*"],
      });
      files.push(...matches.map(file => path.join(projectPath, file)));
    }

    return files;
  }

  private getLanguageFromExtension(ext: string): string {
    const languageMap: { [key: string]: string } = {
      ".ts": "typescript",
      ".js": "javascript",
      ".tsx": "typescript",
      ".jsx": "javascript",
    };
    return languageMap[ext] || "unknown";
  }

  private extractFunctions(content: string): FunctionInfo[] {
    const functions: FunctionInfo[] = [];
    const lines = content.split("\n");

    // Function patterns
    const functionPatterns = [
      // Regular functions
      /^(export\s+)?(async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*:\s*([^{]+)/gm,
      // Arrow functions
      /^(export\s+)?(const|let|var)\s+(\w+)\s*=\s*(async\s+)?\(([^)]*)\)\s*:\s*([^{=]+)/gm,
      // Method definitions
      /^\s*(async\s+)?(\w+)\s*\(([^)]*)\)\s*:\s*([^{]+)/gm,
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const pattern of functionPatterns) {
        const match = pattern.exec(line);
        if (match) {
          const isExported = match[1]?.includes("export") || false;
          const isAsync = match[2]?.includes("async") || false;
          const name = match[3] || match[2];
          const parameters = this.parseParameters(match[4] || match[5] || "");
          const returnType = match[5] || match[6] || "void";

          functions.push({
            name,
            parameters,
            returnType: returnType.trim(),
            description: this.extractDescription(content, i),
            lineNumber: i + 1,
            isAsync,
            isExported,
          });
        }
      }
    }

    return functions;
  }

  private extractClasses(content: string): ClassInfo[] {
    const classes: ClassInfo[] = [];
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const classMatch = line.match(/^(export\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([^{]+))?\s*{/);

      if (classMatch) {
        const isExported = classMatch[1]?.includes("export") || false;
        const name = classMatch[2];
        const extendsClass = classMatch[3];
        const implementsInterfaces = classMatch[4]?.split(",").map(i => i.trim()) || [];

        // Find class body
        let braceCount = 1;
        let j = i + 1;
        const classBody: string[] = [];

        while (j < lines.length && braceCount > 0) {
          classBody.push(lines[j]);
          braceCount += (lines[j].match(/{/g) || []).length;
          braceCount -= (lines[j].match(/}/g) || []).length;
          j++;
        }

        const classContent = classBody.join("\n");
        const methods = this.extractMethods(classContent, i + 1);
        const properties = this.extractClassProperties(classContent, i + 1);

        classes.push({
          name,
          methods,
          properties,
          description: this.extractDescription(content, i),
          lineNumber: i + 1,
          isExported,
          extends: extendsClass,
          implements: implementsInterfaces.length > 0 ? implementsInterfaces : undefined,
        });
      }
    }

    return classes;
  }

  private extractInterfaces(content: string): InterfaceInfo[] {
    const interfaces: InterfaceInfo[] = [];
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const interfaceMatch = line.match(/^(export\s+)?interface\s+(\w+)(?:\s+extends\s+([^{]+))?\s*{/);

      if (interfaceMatch) {
        const isExported = interfaceMatch[1]?.includes("export") || false;
        const name = interfaceMatch[2];
        const extendsInterfaces = interfaceMatch[3]?.split(",").map(i => i.trim()) || [];

        // Find interface body
        let braceCount = 1;
        let j = i + 1;
        const interfaceBody: string[] = [];

        while (j < lines.length && braceCount > 0) {
          interfaceBody.push(lines[j]);
          braceCount += (lines[j].match(/{/g) || []).length;
          braceCount -= (lines[j].match(/}/g) || []).length;
          j++;
        }

        const interfaceContent = interfaceBody.join("\n");
        const properties = this.extractInterfaceProperties(interfaceContent, i + 1);
        const methods = this.extractInterfaceMethods(interfaceContent, i + 1);

        interfaces.push({
          name,
          properties,
          methods,
          description: this.extractDescription(content, i),
          lineNumber: i + 1,
          isExported,
          extends: extendsInterfaces.length > 0 ? extendsInterfaces : undefined,
        });
      }
    }

    return interfaces;
  }

  private extractTypes(content: string): TypeInfo[] {
    const types: TypeInfo[] = [];
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const typeMatch = line.match(/^(export\s+)?type\s+(\w+)\s*=\s*(.+);?$/);

      if (typeMatch) {
        const isExported = typeMatch[1]?.includes("export") || false;
        const name = typeMatch[2];
        const definition = typeMatch[3].trim();

        types.push({
          name,
          definition,
          description: this.extractDescription(content, i),
          lineNumber: i + 1,
          isExported,
        });
      }
    }

    return types;
  }

  private extractMethods(content: string, startLine: number): MethodInfo[] {
    const methods: MethodInfo[] = [];
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const methodMatch = line.match(/^\s*(private\s+|public\s+|protected\s+)?(static\s+)?(async\s+)?(\w+)\s*\(([^)]*)\)\s*:\s*([^{]+)/);

      if (methodMatch) {
        const isPrivate = methodMatch[1]?.includes("private") || false;
        const isStatic = methodMatch[2]?.includes("static") || false;
        const isAsync = methodMatch[3]?.includes("async") || false;
        const name = methodMatch[4];
        const parameters = this.parseParameters(methodMatch[5] || "");
        const returnType = methodMatch[6]?.trim() || "void";

        methods.push({
          name,
          parameters,
          returnType,
          description: this.extractDescription(content, i),
          lineNumber: startLine + i + 1,
          isAsync,
          isPrivate,
          isStatic,
        });
      }
    }

    return methods;
  }

  private extractClassProperties(content: string, startLine: number): PropertyInfo[] {
    const properties: PropertyInfo[] = [];
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const propertyMatch = line.match(/^\s*(private\s+|public\s+|protected\s+)?(readonly\s+)?(\w+)(\?)?\s*:\s*([^=;]+)(?:\s*=\s*[^;]+)?;?$/);

      if (propertyMatch) {
        const isReadonly = propertyMatch[2]?.includes("readonly") || false;
        const name = propertyMatch[3];
        const isOptional = propertyMatch[4] === "?";
        const type = propertyMatch[5]?.trim() || "any";

        properties.push({
          name,
          type,
          description: this.extractDescription(content, i),
          lineNumber: startLine + i + 1,
          isOptional,
          isReadonly,
        });
      }
    }

    return properties;
  }

  private extractInterfaceProperties(content: string, startLine: number): PropertyInfo[] {
    const properties: PropertyInfo[] = [];
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const propertyMatch = line.match(/^\s*(\w+)(\?)?\s*:\s*([^;]+);?$/);

      if (propertyMatch) {
        const name = propertyMatch[1];
        const isOptional = propertyMatch[2] === "?";
        const type = propertyMatch[3]?.trim() || "any";

        properties.push({
          name,
          type,
          description: this.extractDescription(content, i),
          lineNumber: startLine + i + 1,
          isOptional,
          isReadonly: false,
        });
      }
    }

    return properties;
  }

  private extractInterfaceMethods(content: string, startLine: number): MethodInfo[] {
    const methods: MethodInfo[] = [];
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const methodMatch = line.match(/^\s*(\w+)\s*\(([^)]*)\)\s*:\s*([^;]+);?$/);

      if (methodMatch) {
        const name = methodMatch[1];
        const parameters = this.parseParameters(methodMatch[2] || "");
        const returnType = methodMatch[3]?.trim() || "void";

        methods.push({
          name,
          parameters,
          returnType,
          description: this.extractDescription(content, i),
          lineNumber: startLine + i + 1,
          isAsync: false,
          isPrivate: false,
          isStatic: false,
        });
      }
    }

    return methods;
  }

  private parseParameters(paramString: string): ParameterInfo[] {
    if (!paramString.trim()) return [];

    return paramString.split(",").map(param => {
      const trimmed = param.trim();
      const optionalMatch = trimmed.match(/^(\w+)(\?)?\s*:\s*(.+)$/);

      if (optionalMatch) {
        return {
          name: optionalMatch[1],
          type: optionalMatch[3].trim(),
          description: "",
          isOptional: optionalMatch[2] === "?",
        };
      }

      return {
        name: trimmed,
        type: "any",
        description: "",
        isOptional: false,
      };
    });
  }

  private extractDescription(content: string, lineIndex: number): string {
    const lines = content.split("\n");
    let description = "";

    // Look for JSDoc comments above the line
    for (let i = lineIndex - 1; i >= 0; i--) {
      const line = lines[i].trim();

      if (line.startsWith("*")) {
        const comment = line.replace(/^\*\s*/, "");
        if (comment.startsWith("@")) break; // Stop at JSDoc tags
        description = comment + (description ? " " + description : "");
      } else if (line.startsWith("/**")) {
        break;
      } else if (line && !line.startsWith("//") && !line.startsWith("*")) {
        break;
      }
    }

    return description.trim();
  }
}

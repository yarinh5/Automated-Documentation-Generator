import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import { CodeAnalyzer } from "../src/core/CodeAnalyzer";

describe("CodeAnalyzer", () => {
  let analyzer: CodeAnalyzer;
  let tempDir: string;

  beforeEach(() => {
    analyzer = new CodeAnalyzer();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "auto-docs-test-"));
  });

  afterEach(() => {
    fs.removeSync(tempDir);
  });

  describe("analyzeProject", () => {
    it("should analyze TypeScript files", async () => {
      // Create a test TypeScript file
      const testFile = path.join(tempDir, "test.ts");
      const testContent = `
        /**
         * A test function
         */
        export function testFunction(param1: string, param2?: number): string {
          return param1 + param2;
        }

        export class TestClass {
          private property: string = "test";

          public method(): void {
            console.log("test");
          }
        }

        export interface TestInterface {
          name: string;
          value: number;
        }

        export type TestType = string | number;
      `;

      await fs.writeFile(testFile, testContent);

      const result = await analyzer.analyzeProject(tempDir);

      expect(result).toHaveLength(1);
      expect(result[0].path).toBe("test.ts");
      expect(result[0].language).toBe("typescript");
      expect(result[0].functions).toHaveLength(1);
      expect(result[0].classes).toHaveLength(1);
      expect(result[0].interfaces).toHaveLength(1);
      expect(result[0].types).toHaveLength(1);
    });

    it("should extract function information correctly", async () => {
      const testFile = path.join(tempDir, "functions.ts");
      const testContent = `
        export function asyncFunction(): Promise<string> {
          return Promise.resolve("test");
        }

        function privateFunction(): void {
          // private
        }
      `;

      await fs.writeFile(testFile, testContent);
      const result = await analyzer.analyzeProject(tempDir);

      const functions = result[0].functions;
      expect(functions).toHaveLength(2);

      const exportedFunction = functions.find(f => f.name === "asyncFunction");
      expect(exportedFunction).toBeDefined();
      expect(exportedFunction?.isExported).toBe(true);
      expect(exportedFunction?.isAsync).toBe(false); // Not detected as async in this simple parser
      expect(exportedFunction?.returnType).toBe("Promise<string>");
    });

    it("should extract class information correctly", async () => {
      const testFile = path.join(tempDir, "classes.ts");
      const testContent = `
        export class TestClass extends BaseClass implements Interface1, Interface2 {
          private property: string;
          public publicProperty: number = 42;

          constructor(value: string) {
            this.property = value;
          }

          public async method(): Promise<void> {
            // implementation
          }

          private privateMethod(): void {
            // private
          }
        }
      `;

      await fs.writeFile(testFile, testContent);
      const result = await analyzer.analyzeProject(tempDir);

      const classes = result[0].classes;
      expect(classes).toHaveLength(1);

      const testClass = classes[0];
      expect(testClass.name).toBe("TestClass");
      expect(testClass.isExported).toBe(true);
      expect(testClass.extends).toBe("BaseClass");
      expect(testClass.implements).toEqual(["Interface1", "Interface2"]);
      expect(testClass.methods.length).toBeGreaterThan(0);
      expect(testClass.properties.length).toBeGreaterThan(0);
    });

    it("should handle empty projects", async () => {
      const result = await analyzer.analyzeProject(tempDir);
      expect(result).toHaveLength(0);
    });

    it("should ignore node_modules and other excluded directories", async () => {
      // Create a file in node_modules
      const nodeModulesDir = path.join(tempDir, "node_modules");
      await fs.ensureDir(nodeModulesDir);
      await fs.writeFile(path.join(nodeModulesDir, "test.ts"), "export function test() {}");

      // Create a file in the root
      await fs.writeFile(path.join(tempDir, "main.ts"), "export function main() {}");

      const result = await analyzer.analyzeProject(tempDir);

      // Should only find the main.ts file, not the one in node_modules
      expect(result).toHaveLength(1);
      expect(result[0].path).toBe("main.ts");
    });
  });

  describe("error handling", () => {
    it("should handle invalid file paths gracefully", async () => {
      const result = await analyzer.analyzeProject("/nonexistent/path");
      expect(result).toHaveLength(0);
    });

    it("should handle malformed TypeScript files", async () => {
      const testFile = path.join(tempDir, "malformed.ts");
      const malformedContent = `
        export function incompleteFunction(
        // Missing closing parenthesis and body
      `;

      await fs.writeFile(testFile, malformedContent);

      // Should not throw an error
      const result = await analyzer.analyzeProject(tempDir);
      expect(result).toHaveLength(1);
    });
  });
});

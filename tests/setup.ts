// Test setup file
import "dotenv/config";

// Mock console methods to reduce noise during tests
const originalConsole = { ...console };

beforeAll(() => {
  // Suppress console output during tests unless explicitly needed
  console.log = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  // Restore console methods
  Object.assign(console, originalConsole);
});

// Global test utilities
global.testUtils = {
  // Helper to create mock OpenAI responses
  createMockOpenAIResponse: (content: string) => ({
    choices: [{ message: { content } }],
  }),

  // Helper to create mock code files
  createMockCodeFile: (overrides = {}) => ({
    path: "test-file.ts",
    content: "export function test() {}",
    language: "typescript",
    functions: [],
    classes: [],
    interfaces: [],
    types: [],
    ...overrides,
  }),

  // Helper to create mock project config
  createMockProjectConfig: (overrides = {}) => ({
    name: "Test Project",
    description: "A test project",
    version: "1.0.0",
    author: "Test Author",
    license: "MIT",
    ...overrides,
  }),
};

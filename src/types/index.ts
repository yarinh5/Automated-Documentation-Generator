export interface ProjectConfig {
  name: string;
  description: string;
  version: string;
  author: string;
  license: string;
  repository?: string;
  homepage?: string;
  bugs?: string;
  keywords?: string[];
}

export interface CodeFile {
  path: string;
  content: string;
  language: string;
  functions: FunctionInfo[];
  classes: ClassInfo[];
  interfaces: InterfaceInfo[];
  types: TypeInfo[];
}

export interface FunctionInfo {
  name: string;
  parameters: ParameterInfo[];
  returnType: string;
  description: string;
  lineNumber: number;
  isAsync: boolean;
  isExported: boolean;
}

export interface ClassInfo {
  name: string;
  methods: MethodInfo[];
  properties: PropertyInfo[];
  description: string;
  lineNumber: number;
  isExported: boolean;
  extends?: string;
  implements?: string[];
}

export interface InterfaceInfo {
  name: string;
  properties: PropertyInfo[];
  methods: MethodInfo[];
  description: string;
  lineNumber: number;
  isExported: boolean;
  extends?: string[];
}

export interface TypeInfo {
  name: string;
  definition: string;
  description: string;
  lineNumber: number;
  isExported: boolean;
}

export interface MethodInfo {
  name: string;
  parameters: ParameterInfo[];
  returnType: string;
  description: string;
  lineNumber: number;
  isAsync: boolean;
  isPrivate: boolean;
  isStatic: boolean;
}

export interface PropertyInfo {
  name: string;
  type: string;
  description: string;
  lineNumber: number;
  isOptional: boolean;
  isReadonly: boolean;
}

export interface ParameterInfo {
  name: string;
  type: string;
  description: string;
  isOptional: boolean;
  defaultValue?: string;
}

export interface DocumentationOptions {
  includeExamples: boolean;
  includeTypeDefinitions: boolean;
  includePrivateMembers: boolean;
  outputFormat: "markdown" | "html";
  style: "apple" | "minimal" | "detailed";
}

export interface EmbeddingResult {
  text: string;
  embedding: number[];
  file: string;
  lineNumber: number;
}

export interface SearchResult {
  text: string;
  file: string;
  lineNumber: number;
  similarity: number;
  context: string;
}

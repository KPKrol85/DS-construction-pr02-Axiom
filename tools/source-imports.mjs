import path from "node:path";

const cssImportPattern = /^\s*@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;/;

export const getCssImportPath = (line) => line.match(cssImportPattern)?.[1];

export const resolveJsImport = (importPath, importerPath) => {
  const resolved = path.resolve(path.dirname(importerPath), importPath);
  return path.extname(resolved) ? resolved : `${resolved}.js`;
};

export const parseJsImports = (source) => {
  const importPattern = /import\s+\{([^}]+)\}\s+from\s+["']([^"']+)["'];?/g;
  return Array.from(source.matchAll(importPattern), ([, names, importPath]) => ({
    names: names.trim(),
    path: importPath,
  }));
};

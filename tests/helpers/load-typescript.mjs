import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Exercise source modules using the existing TypeScript dependency; no test packages.
export default function loadTypeScript(relativePath, { imports = {}, globals = {} } = {}) {
  const filename = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..', relativePath);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  const loadedModule = { exports: {} };
  const nativeRequire = createRequire(filename);
  vm.runInNewContext(outputText, {
    module: loadedModule, exports: loadedModule.exports,
    require: (name) => Object.hasOwn(imports, name) ? imports[name] : nativeRequire(name),
    URL, AbortController, console,
    setTimeout: (...args) => setTimeout(...args),
    clearTimeout: (...args) => clearTimeout(...args),
    process: { env: {
      WOOCOMMERCE_BASE_URL: 'https://example.test',
      WOOCOMMERCE_CONSUMER_KEY: 'test-key',
      WOOCOMMERCE_CONSUMER_SECRET: 'test-secret',
      NEXT_PUBLIC_SITE_URL: 'https://example.test',
      NEXT_PUBLIC_WA_NUMBER: '123456789',
    } },
    ...globals,
  }, { filename });
  return loadedModule.exports;
}

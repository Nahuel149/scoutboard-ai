import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
const compiled = ts.transpileModule(fs.readFileSync("src/lib/ui-copy.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { uiCopy } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) walk(file); else if (file.endsWith(".tsx") && !file.includes("components")) migrate(file); } }
function migrate(file) {
  let text = fs.readFileSync(file, "utf8"); const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); const edits = [];
  function visit(node) {
    if (ts.isJsxAttribute(node) && ["en", "ja", "es", "text"].includes(node.name.getText(source))) return;
    if (ts.isJsxText(node)) { const key = node.text.replace(/\s+/g, " ").trim(); if (uiCopy[key]) { const leading = /^\s/.test(node.text) && !node.text.includes("\n") ? '{" "}' : ""; const trailing = /\s$/.test(node.text) && !node.text.includes("\n") ? '{" "}' : ""; edits.push({ start: node.getStart(source), end: node.end, value: `${leading}<UI text=${JSON.stringify(key)} />${trailing}` }); } }
    if (ts.isJsxExpression(node) && node.expression && !ts.isJsxAttribute(node.parent)) {
      const expr = node.expression.getText(source);
      if (/^(module\.(title|status|summary|proof|nextAction)|task\.(severity|area|title|detail|nextAction)|row\.(sourceType|keyStatus|portfolioUse|cacheRule|licenseNote|nextAction|capabilities)|item\.(title|detail)|issue\.(severity|field)|player\.(position|confidence)|player\.missingFields\.join\(", "\)|player\.birthDate \?\? "Not recorded")$/.test(expr)) edits.push({ start: node.getStart(source), end: node.end, value: `<UI text={${expr}} />` });
    }
    ts.forEachChild(node, visit);
  }
  visit(source); if (!edits.length) return;
  for (const e of edits.sort((a, b) => b.start - a.start)) text = text.slice(0, e.start) + e.value + text.slice(e.end);
  const directive = /^("use client";|'use client';)/; const line = 'import { UI } from "@/app/components/ui-text";\n';
  if (!text.includes('import { UI }')) text = directive.test(text) ? text.replace(directive, "$&\n" + line) : line + text;
  fs.writeFileSync(file, text); console.log(`${file}: ${edits.length} labels`);
}
walk("src/app");

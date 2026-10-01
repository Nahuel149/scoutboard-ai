import ts from "typescript";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
const labels = new Set();
function walk(dir) { for (const entry of readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); if (entry.isDirectory()) walk(file); else if (file.endsWith(".tsx")) { const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); function visit(node) { if (ts.isJsxAttribute(node) && ["en", "ja", "es", "text"].includes(node.name.getText(source))) return; if (ts.isJsxText(node)) { const text = node.text.replace(/\s+/g, " ").trim(); if (/[A-Za-z]{2}/.test(text)) labels.add(text); } ts.forEachChild(node, visit); } visit(source); } } }
walk("src/app");
console.log([...labels].sort().join("\n"));

import ts from "typescript";
import fs from "node:fs";
import path from "node:path";
// A one-time syntax-tree migration of existing adjacent translation blocks.
function visitFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) visitFiles(file);
    else if (entry.name.endsWith(".tsx") && !file.includes("components")) migrate(file);
  }
}
function migrate(file) {
  let text = fs.readFileSync(file, "utf8");
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const tag = node => ts.isJsxElement(node) ? node.openingElement.tagName.getText(source) : "";
  const lang = node => ts.isJsxElement(node) ? node.openingElement.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText(source) === "className")?.initializer?.text : "";
  const content = node => text.slice(node.openingElement.end, node.closingElement.getStart(source));
  function visit(node) {
    if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      const children = node.children.filter(child => !ts.isJsxText(child) || child.text.trim());
      for (let i = 0; i < children.length - 2; i++) {
        const [en, ja, es] = children.slice(i, i + 3);
        if (["p", "h2"].includes(tag(en)) && !lang(en) && lang(ja) === "jp" && lang(es) === "es") {
          const start = en.getStart(source), end = es.end;
          const opening = en.openingElement.getText(source);
          edits.push({ start, end, value: `${opening}<LocalizedContent en={< >${content(en)}</>} ja={< >${content(ja)}</>} es={< >${content(es)}</>} /></${tag(en)}>` .replaceAll("< >", "<>") });
          i += 2;
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  const literalHeading = /<h1>[^<{]+<\/h1>/;
  const hasHeading = literalHeading.test(text);
  if (!edits.length && !hasHeading) return;
  for (const edit of edits.sort((a, b) => b.start - a.start)) text = text.slice(0, edit.start) + edit.value + text.slice(edit.end);
  if (edits.length) text = 'import { LocalizedContent } from "@/app/components/language";\n' + text;
  if (hasHeading) {
    const route = "/" + file.replaceAll("\\", "/").replace(/^src\/app\//, "").replace(/\/?page.tsx$/, "");
    text = text.replace(literalHeading, `<h1><T text={pageTitles[${JSON.stringify(route)}]} /></h1>`);
    text = 'import { T } from "@/app/components/language";\nimport { pageTitles } from "@/lib/copy";\n' + text;
  }
  // Keep client directives first in existing interactive components.
  text = text.replace(/^(import[^\n]+\n)(["']use client["'];)/, "$2\n$1");
  fs.writeFileSync(file, text); console.log(`${file}: ${edits.length} blocks`);
}
visitFiles("src/app");

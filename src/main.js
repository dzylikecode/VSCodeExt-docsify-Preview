const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const server = require("./server/server.js");
const config = require("./config.js");
async function main(context) {
  vscode.window.showInformationMessage("Hello World from docsify-Preview!");
  server.init(config.host, config.port);
  server.jump(parseUrl(config.rootUrl));
  vscode.window.onDidChangeActiveTextEditor(await handleTextDocumentChange);
  vscode.window.onDidChangeTextEditorVisibleRanges(
    ({ textEditor, visibleRanges }) => {
      if (textEditor.document.languageId === "markdown") {
        server.scroll(
          (visibleRanges[0].start.line - 1) / textEditor.document.lineCount
        );
      }
    }
  );
}

async function handleTextDocumentChange() {
  if (vscode.window.activeTextEditor && checkDocumentIsMarkdown()) {
    const filePath = vscode.window.activeTextEditor.document.fileName;
    const workspacePath = config.workspacePath;
    const relativePath = path
      .relative(workspacePath, filePath)
      .replace(/\\/g, "/");
    server.setTitile(`[Preview] ${relativePath}`);
    const url = parseUrl(config.rootUrl, filePath);
    server.jump(url);
    scrollServer(
      vscode.window.activeTextEditor.visibleRanges,
      vscode.window.activeTextEditor
    );
  }
}

function scrollServer(visibleRanges, textEditor) {
  server.scroll(
    (visibleRanges[0].start.line - 1) / textEditor.document.lineCount
  );
}

function parseUrl(rootUrl, filePath = "") {
  rootUrl = path.join(rootUrl, "#");
  let urlRelative;
  if (filePath == "") {
    urlRelative = "/";
  } else {
    urlRelative = path.relative(config.docsifyRootPath, filePath);
  }
  return path.join(rootUrl, urlRelative);
}

function getDocumentType() {
  return vscode.window.activeTextEditor.document.languageId.toLowerCase();
}
function checkDocumentIsMarkdown() {
  return getDocumentType() === "markdown";
}

module.exports = {
  main,
};

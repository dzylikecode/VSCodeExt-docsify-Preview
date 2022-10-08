const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const server = require("./server/server.js");
async function main(context) {
  vscode.window.showInformationMessage("Hello World from docsify-Preview!");
  server.init();
  server.jump("http://127.0.0.1:55109/docs/#/");
  vscode.window.onDidChangeTextEditorVisibleRanges(
    ({ textEditor, visibleRanges }) => {
      if (textEditor.document.languageId === "markdown") {
        server.postMessage({
          command: "scroll",
          linePercent:
            (visibleRanges[0].start.line - 1) / textEditor.document.lineCount,
        });
      }
    }
  );
}

function getDocumentType() {
  return vscode.window.activeTextEditor.document.languageId.toLowerCase();
}

function checkDocumentIsMarkdown(showWarning) {
  return getDocumentType() === "markdown";
}

module.exports = {
  main,
};

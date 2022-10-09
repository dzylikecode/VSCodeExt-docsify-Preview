const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const server = require("./server/server.js");
const config = require("./config.js");
async function main(context) {
  vscode.window.showInformationMessage("Hello World from docsify-Preview!");
  const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  server.init(workspacePath, config.indexFilePath, config.host, config.port);
  server.jump(`http://${config.host}:${config.port}/#/`);
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

module.exports = {
  main,
};

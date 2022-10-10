const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const server = require("./server/server.js");
const config = require("./config.js");

let isClosed = false;

async function main(context, disposable) {
  config.initWorkSpace();
  isClosed = !(await server.create(config.host, config.port));
  if (isClosed) {
    vscode.window.showInformationMessage(
      `Docsify Preview: Failed to start server on port ${config.port}`
    );
    return;
  }
  server.jump(
    // not work becase docsify is not ready
    parseUrl(config.rootUrl, vscode.window.activeTextEditor.document.fileName)
  );
  // server.onMessage((socket, message) => {
  //   if (message.command === "requsetScroll") {
  //     let textEditor = vscode.window.activeTextEditor;
  //     let sendMessage = JSON.stringify({
  //       command: "loaded",
  //       linePercent:
  //         (textEditor.visibleRanges[0].start.line - 1) /
  //         textEditor.document.lineCount,
  //     });
  //     socket.send(sendMessage);
  //   }
  // });

  vscode.workspace.onDidSaveTextDocument(() => {
    if (!isClosed) {
      server.reload();
    }
  });
  vscode.window.onDidChangeActiveTextEditor(handleTextDocumentChange);
  vscode.window.onDidChangeTextEditorVisibleRanges(({ textEditor }) => {
    if (!isClosed) {
      if (textEditor.document.languageId === "markdown") {
        scrollServer(textEditor);
      }
    }
  });
  server.onClose(() => {
    isClosed = true;
  });
}

async function handleTextDocumentChange() {
  if (isClosed) {
    return;
  }
  if (vscode.window.activeTextEditor && checkDocumentIsMarkdown()) {
    const filePath = vscode.window.activeTextEditor.document.fileName;
    const workspacePath = config.workspacePath;
    const relativePath = path
      .relative(workspacePath, filePath)
      .replace(/\\/g, "/");
    server.setTitile(`[Preview] ${relativePath}`);
    const url = parseUrl(config.rootUrl, filePath);
    server.jump(url);
    scrollServer(vscode.window.activeTextEditor);
  }
}

function scrollServer(textEditor) {
  server.scroll(
    (textEditor.visibleRanges[0].start.line - 1) / textEditor.document.lineCount
  );
}

function parseUrl(rootUrl, filePath = "") {
  rootUrl = new URL("#/", rootUrl).href;
  let urlRelative = path
    .relative(config.docsifyRootPath, filePath)
    .replace(/\\/g, "/");
  return rootUrl + urlRelative;
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

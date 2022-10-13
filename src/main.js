const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const server = require("./server/server.js");
const config = require("./config.js");

let isClosed = false;

async function main(context, disposable) {
  config.getConfigurationForWorkspace();
  let isConfigured = false;
  while (isConfigured == false) {
    config.initWorkspace();
    try {
      isClosed = !(await server.create(config.host, config.port));
      isConfigured = true;
    } catch (e) {
      switch (e) {
        case "PortOccupied":
          vscode.window.showInformationMessage(
            `Docsify Preview: Failed to start server on port ${config.port}`
          );
          let newPort = await vscode.window.showInputBox({
            prompt: "Please input a new port",
            title: "Docsify Preview",
            value: "" + (config.port + 1),
          });
          if (newPort == undefined) {
            return;
          }
          config.port = +newPort;
          break;
        case "IndexNotFound":
          vscode.window.showInformationMessage(
            `Docsify Preview: ${config.docsifyIndexFilePath} not found`
          );
          let newIndexFile = await vscode.window.showInputBox({
            prompt: "Please input a new index file",
            title: "Docsify Preview",
            value: config.docsifyIndexFilePath,
          });
          if (newIndexFile == undefined) {
            return;
          }
          config.docsifyIndexFilePath = newIndexFile;
          break;
      }
    }
  }

  server.jumpFirstTime(
    parseUrl(config.rootUrl, vscode.window.activeTextEditor.document.fileName),
    getLinePercent()
  );
  server.onMessage((socket, message) => {
    if (message.command == "openInBrowser") {
      vscode.env.openExternal(server.url);
    }
  });

  vscode.workspace.onDidSaveTextDocument(() => {
    if (!isClosed) {
      server.reload();
    }
  });
  vscode.window.onDidChangeActiveTextEditor(handleTextDocumentChange);
  vscode.window.onDidChangeTextEditorVisibleRanges(({ textEditor }) => {
    if (!isClosed) {
      if (textEditor.document.languageId === "markdown") {
        server.scroll(getLinePercent());
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
    server.scroll(getLinePercent());
  }
}

function getLinePercent() {
  const textEditor = vscode.window.activeTextEditor;
  const linePercent =
    (textEditor.visibleRanges[0].start.line - 1) /
    textEditor.document.lineCount;
  return linePercent;
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

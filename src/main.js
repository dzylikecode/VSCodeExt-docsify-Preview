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
    parseUrl(vscode.window.activeTextEditor.document.fileName),
    getLinePercent(vscode.window.activeTextEditor)
  );
  server.onMessage((socket, message) => {
    if (message.command == "openInBrowser") {
      vscode.env.openExternal(server.url);
    } else if (message.command == "goHere") {
      console.log(message);
      goHere(message.url, message.linePercent);
    } else if (message.command == "loaded") {
      server.url = server.parseUrl(message.url);
      server.setTitile(`[Preview] ${message.url}`);
    } else if (message.command == "openDeveloperTools") {
      vscode.commands.executeCommand(
        "workbench.action.webview.openDeveloperTools"
      );
    }
    return;
    function goHere(url, linePercent) {
      let filePath = path.join(config.docsifyRootPath, url);
      let fileResource = vscode.Uri.file(filePath);
      let curDocument;
      vscode.workspace
        .openTextDocument(fileResource)
        .then((document) => {
          let editor = vscode.window.showTextDocument(
            document,
            vscode.ViewColumn.One
          );
          curDocument = document;
          return editor;
        })
        .then((editor) => {
          editor.revealRange(
            new vscode.Range(
              Math.floor(curDocument.lineCount * linePercent),
              0,
              Math.floor(curDocument.lineCount * linePercent),
              0
            ),
            vscode.TextEditorRevealType.AtTop
          );
        });
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
        server.scroll(getLinePercent(textEditor));
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
    const url = parseUrl(filePath);
    server.jump(url);
    server.scroll(getLinePercent(vscode.window.activeTextEditor));
  }
}

function getLinePercent(textEditor) {
  const linePercent =
    textEditor.visibleRanges[0].start.line / textEditor.document.lineCount;
  return linePercent;
}

function parseUrl(filePath) {
  let urlRelative = path
    .relative(config.docsifyRootPath, filePath)
    .replace(/\\/g, "/");
  return server.parseUrl("/" + urlRelative);
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

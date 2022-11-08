/* jslint esversion:11 */
const vscode = require("vscode");
const path = require("path");
const server = require("./server/server.js");
const workspaceConfig = require("./workspaceConfig.js");
const logger = require("./utils/logger.js");

class Preview {
  constructor() {
    this.isClosed = true;
  }
  get visible() {
    return server.visible;
  }
  init() {
    // 我感觉这是一直订阅, 所以应该初始化一次就好了
    vscode.workspace.onDidSaveTextDocument(this.reload.bind(this));
    vscode.window.onDidChangeActiveTextEditor(
      this.handleTextDocumentChange.bind(this)
    );
    vscode.window.onDidChangeTextEditorVisibleRanges(this.scroll.bind(this));
  }
  close() {
    server.close();
  }
  async create(viewColumn) {
    let isConfigured = false;
    // 大概猜测出需要结束这次的调用才能使得工作区的改变生效, 所以使用命令调用比较好
    do {
      workspaceConfig.init();
      try {
        this.isClosed = !(await server.create(
          workspaceConfig.host,
          workspaceConfig.port,
          viewColumn
        ));
        isConfigured = true;
      } catch (e) {
        switch (e) {
          case "PortOccupied":
            await dealPortOccupied();
            break;
          case "IndexNotFound":
            await dealIndexNotFound();
            break;
          default:
            logger.error(e);
            break;
        }
      }
    } while (isConfigured == false);
    attachMessageHandle();
    server.onClose(() => {
      this.isClosed = true;
    });
    return;
    async function dealPortOccupied() {
      vscode.window.showInformationMessage(
        `Docsify Preview: Failed to start server on port ${workspaceConfig.port}`
      );
      let newPort = await vscode.window.showInputBox({
        prompt: "Please input a new port",
        title: "Docsify Preview",
        value: "" + (workspaceConfig.port + 1),
      });
      if (newPort == undefined) {
        throw new Error("ConfigCanceled");
      }
      await workspaceConfig.setPort(+newPort);
    }
    async function dealIndexNotFound() {
      vscode.window.showInformationMessage(
        `Docsify Preview: ${workspaceConfig.docsifyIndexFilePath} not found`
      );
      let newIndexFile = await vscode.window.showInputBox({
        prompt: "Please input a new index file",
        title: "Docsify Preview",
        value: workspaceConfig.docsifyIndexFilePath,
      });
      if (newIndexFile == undefined) {
        throw new Error("ConfigCanceled");
      }
      await workspaceConfig.setDocsifyIndexFilePath(newIndexFile);
    }
  }
  async open(viewColumn) {
    if (this.isClosed) {
      try {
        await this.create(viewColumn);
      } catch (e) {
        if (e.message === "ConfigCanceled") {
          logger.info("configurations canceled");
          return;
        }
      }
      server.jumpFirstTime(
        parseUrl(vscode.window.activeTextEditor.document.fileName),
        getLinePercent(vscode.window.activeTextEditor)
      );
    } else {
      server.reveal(viewColumn);
    }
  }
  reload() {
    if (!this.isClosed) {
      server.reload();
    }
  }
  scroll({ textEditor }) {
    if (!this.isClosed) {
      if (textEditor.document.languageId === "markdown") {
        server.scroll(getLinePercent(textEditor));
      }
    }
  }
  async handleTextDocumentChange() {
    if (this.isClosed) {
      return;
    }
    if (vscode.window.activeTextEditor && checkDocumentIsMarkdown()) {
      const filePath = vscode.window.activeTextEditor.document.fileName;
      const url = parseUrl(filePath);
      server.jump(url);
      server.scroll(getLinePercent(vscode.window.activeTextEditor));
    }
  }
}

function attachMessageHandle() {
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
    } else if (message.command == "closePreview") {
      server.close();
    } else if (message.command == "openLink") {
      if (workspaceConfig.followLinkWithCtrl == false) {
        vscode.env.openExternal(message.url);
      }
    }
    return;
    function goHere(url, linePercent) {
      let filePath = path.join(workspaceConfig.docsifyRootPath, url);
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
}

function getLinePercent(textEditor) {
  const linePercent =
    textEditor.visibleRanges[0].start.line / textEditor.document.lineCount;
  return linePercent;
}

function parseUrl(filePath) {
  let urlRelative = path
    .relative(workspaceConfig.docsifyRootPath, filePath)
    .replace(/\\/g, "/");
  return server.parseUrl("/" + urlRelative);
}

function getDocumentType() {
  return vscode.window.activeTextEditor.document.languageId.toLowerCase();
}
function checkDocumentIsMarkdown() {
  return getDocumentType() === "markdown";
}

module.exports = new Preview();

const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const webViewHtmlRelativePath = "src/server/webView.html";
const injectedRelativePath = "src/server/listener/injected.html";
let host = "127.0.0.1";
let indexFileName;
let docsifyRootPath;
let extensionPath;
let injectCode;
let port;
let webViewHtmlPath;
let injectedPath;
let docsifyIndexFilePath;

function initExtension(context) {
  extensionPath = context.extensionPath;
  webViewHtmlPath = path.join(extensionPath, webViewHtmlRelativePath);
  injectedPath = path.join(extensionPath, injectedRelativePath);
  injectCode = fs.readFileSync(injectedPath, "utf8");
}

function getConfigurationForWorkspace() {
  port = vscode.workspace.getConfiguration("docsifyPreview").get("port");
  docsifyIndexFilePath =
    vscode.workspace.getConfiguration("docsifyPreview").indexFile;
}

function initWorkspace() {
  docsifyRootPath = path.dirname(docsifyIndexFilePath);
  indexFileName = path.basename(docsifyIndexFilePath);
}

module.exports = {
  initExtension,
  initWorkspace,
  getConfigurationForWorkspace,
  get indexFileName() {
    return indexFileName;
  },
  get webViewHtmlPath() {
    return webViewHtmlPath;
  },
  host,
  get port() {
    return port;
  },
  set port(newPort) {
    port = newPort;
    vscode.workspace
      .getConfiguration("docsifyPreview")
      .update("port", newPort, false);
  },
  get rootUrl() {
    return `http://${this.host}:${this.port}/`;
  },
  get docsifyRootPath() {
    return path.join(this.workspacePath, docsifyRootPath);
  },
  get workspacePath() {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  },
  get extensionPath() {
    return extensionPath;
  },
  get injectCode() {
    return injectCode;
  },
  get panelIconPath() {
    return vscode.Uri.file(path.join(this.extensionPath, "assets/icon.svg"));
  },
  get docsifyIndexFilePath() {
    return docsifyIndexFilePath;
  },
  set docsifyIndexFilePath(newPath) {
    docsifyIndexFilePath = newPath;
    vscode.workspace
      .getConfiguration("docsifyPreview")
      .update("indexFile", newPath, false);
  },
  get rightClickOpenInBrowser() {
    return vscode.workspace
      .getConfiguration("docsifyPreview")
      .get("rightClickOpenInBrowser").enable;
  },
};

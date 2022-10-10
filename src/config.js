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

let webViewHtmlPath;
let injectedPath;

function initExtension(context) {
  extensionPath = context.extensionPath;
  webViewHtmlPath = path.join(extensionPath, webViewHtmlRelativePath);
  injectedPath = path.join(extensionPath, injectedRelativePath);
  injectCode = fs.readFileSync(injectedPath, "utf8");
}

function initWorkSpace() {
  let docsifyIndexFilePath =
    vscode.workspace.getConfiguration("docsifyPreview").indexFile;
  docsifyRootPath = path.dirname(docsifyIndexFilePath);
  indexFileName = path.basename(docsifyIndexFilePath);
}

module.exports = {
  initExtension,
  initWorkSpace,
  get indexFileName() {
    return indexFileName;
  },
  get webViewHtmlPath() {
    return webViewHtmlPath;
  },
  host,
  get port() {
    return vscode.workspace.getConfiguration("docsifyPreview").port;
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
};

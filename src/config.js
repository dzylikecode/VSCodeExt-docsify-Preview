const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const webViewHtmlRelativePath = "src/server/webView.html";
const injectedRelativePath = "src/server/listener/injected.html";
let port = 55109;
let host = "127.0.0.1";
let rootUrl;
let indexFileName = "index.html";
let docsifyRootPath = "/docs";
let extensionPath;
let injectCode;

let webViewHtmlPath;
let injectedPath;

function init(context) {
  extensionPath = context.extensionPath;
  webViewHtmlPath = path.join(extensionPath, webViewHtmlRelativePath);
  injectedPath = path.join(extensionPath, injectedRelativePath);
  rootUrl = `http://${host}:${port}/`;
  injectCode = fs.readFileSync(injectedPath, "utf8");
}
module.exports = {
  init,
  indexFileName,
  get webViewHtmlPath() {
    return webViewHtmlPath;
  },
  host,
  port,
  get rootUrl() {
    return rootUrl;
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

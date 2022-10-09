const path = require("path");
const vscode = require("vscode");
const webViewHtmlRelativePath = "src/server/webView.html";
const httpServerHtmlRelativePath = "src/server/httpServer.html";
let port = 55109;
let host = "127.0.0.1";
let rootUrl;
let indexFilePath = "/index.html";
let docsifyRootPath = "/docs";
let extensionPath;

let webViewHtmlPath;
let httpServerHtmlPath;

function init(context) {
  extensionPath = context.extensionPath;
  webViewHtmlPath = path.join(extensionPath, webViewHtmlRelativePath);
  httpServerHtmlPath = path.join(extensionPath, httpServerHtmlRelativePath);
  rootUrl = `http://${host}:${port}/`;
}
module.exports = {
  init,
  indexFilePath,
  get webViewHtmlPath() {
    return webViewHtmlPath;
  },
  get httpServerHtmlPath() {
    return httpServerHtmlPath;
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
};

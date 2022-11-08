/* jslint esversion:11 */
const path = require("path");
const vscode = require("vscode");

function WorkspaceConfig() {
  let host = "127.0.0.1";
  let indexFileName;
  let docsifyRootPath;
  let port;
  let docsifyIndexFilePath;

  function init() {
    port = vscode.workspace.getConfiguration("docsifyPreview").get("port");
    docsifyIndexFilePath =
      vscode.workspace.getConfiguration("docsifyPreview").indexFile;
    docsifyRootPath = path.dirname(docsifyIndexFilePath);
    indexFileName = path.basename(docsifyIndexFilePath);
  }

  return {
    init: init,
    get host() {
      return host;
    },
    get port() {
      return port;
    },
    async setPort(value) {
      port = value;
      return vscode.workspace
        .getConfiguration("docsifyPreview")
        .update("port", value, false);
    },
    get rootUrl() {
      return `http://${this.host}:${this.port}/`;
    },
    get workspacePath() {
      return vscode.workspace.workspaceFolders[0].uri.fsPath;
    },
    get docsifyRootPath() {
      return path.join(this.workspacePath, docsifyRootPath);
    },
    get docsifyIndexFilePath() {
      return docsifyIndexFilePath;
    },
    async setDocsifyIndexFilePath(newPath) {
      docsifyIndexFilePath = newPath;
      return vscode.workspace
        .getConfiguration("docsifyPreview")
        .update("indexFile", newPath, false);
    },
    get indexFileName() {
      return indexFileName;
    },
    get followLinkWithCtrl() {
      return vscode.workspace
        .getConfiguration("docsifyPreview")
        .get("followLinkWithCtrl");
    },
  };
}

module.exports = WorkspaceConfig();

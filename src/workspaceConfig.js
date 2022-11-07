/** jshint ES6 */
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
    set port(value) {
      port = value;
      vscode.workspace
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
    set docsifyIndexFilePath(newPath) {
      docsifyIndexFilePath = newPath;
      vscode.workspace
        .getConfiguration("docsifyPreview")
        .update("indexFile", newPath, false);
    },
    get indexFileName() {
      return indexFileName;
    },
  };
}

module.exports = WorkspaceConfig();

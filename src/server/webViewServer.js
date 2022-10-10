const vscode = require("vscode");
const fs = require("fs");
const config = require("../config.js");
const path = require("path");
// 最好能使用单例模式就好了
const webViewServer = {
  create() {
    this.panel = vscode.window.createWebviewPanel(
      "docify_Previewer", // Webview id
      "docsify Preview", // Webview title
      vscode.ViewColumn.Two, // open the second column for preview inside editor
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    this.panel.iconPath = config.panelIconPath;
    try {
      this.panel.webview.html = fs.readFileSync(config.webViewHtmlPath, "utf8");
    } catch (err) {
      console.log(err);
    }
  },
  postMessage(message) {
    if (this.panel) {
      this.panel.webview.postMessage(message);
    }
  },
  jump(url) {
    this.postMessage({ command: "jump", url: url });
  },
  setTitile(title) {
    if (this.panel) {
      this.panel.title = title;
    }
  },
  onClose(callback) {
    this.panel.onDidDispose(() => {
      callback();
      this.panel = null;
    });
  },
  close() {
    this.panel.dispose();
  },
};

module.exports = webViewServer;

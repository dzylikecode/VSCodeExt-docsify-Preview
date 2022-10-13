const vscode = require("vscode");
const fs = require("fs");
const config = require("../config.js");
// 最好能使用单例模式就好了
const webViewServer = {
  create() {
    this.panel = vscode.window.createWebviewPanel(
      "docsifyPreviewer", // Webview id
      "docsify Preview", // Webview title
      { viewColumn: vscode.ViewColumn.Two, preserveFocus: true }, // open the second column for preview inside editor
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
  onMessage(callback) {
    this.panel.webview.onDidReceiveMessage((message) => {
      callback(null, message);
    });
  },
  jumpFirstTime(url, linePercent) {
    this.postMessage({
      command: "jumpFirstTime",
      url: url,
      linePercent: linePercent,
    });
  },
  jump(url) {
    this.postMessage({ command: "jump", url: url });
  },
  scroll(linePercent) {
    this.postMessage({ command: "scroll", linePercent: linePercent });
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

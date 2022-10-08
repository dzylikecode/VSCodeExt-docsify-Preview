const vscode = require("vscode");
const fs = require("fs");
const config = require("../config.js");
// 最好能使用单例模式就好了
const server = {
  init() {
    this.panel = vscode.window.createWebviewPanel(
      // Webview id
      "docify_Previewer",
      // Webview title
      "docsify Preview",
      // This will open the second column for preview inside editor
      vscode.ViewColumn.Two,
      {
        // Enable scripts in the webview
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    try {
      this.panel.webview.html = fs.readFileSync(config.serverHtmlPath, "utf8");
    } catch (err) {
      console.log(err);
    }
  },
  postMessage(message) {
    this.panel.webview.postMessage(message);
  },
  jump(url) {
    this.postMessage({ command: "jump", url: url });
  },
};

module.exports = server;

const vscode = require("vscode");
const fs = require("fs");
const config = require("../config.js");
const path = require("path");

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
    let innerPanel = this.panel;
    this.panel.iconPath = config.panelIconPath;
    try {
      this.panel.webview.html = getHtmlContent(config.webViewHtmlPath);
    } catch (err) {
      console.log(err);
    }
    return;
    function getHtmlContent(filePath) {
      let html = fs.readFileSync(filePath, "utf8");
      return replaceVarialbe(html);
      function replaceVarialbe(html) {
        return html.replace(/\$\{([^\}]+)\}/g, (match, src) => {
          return getSrcPath(src);
        });
      }
      function getSrcPath(srcPath) {
        const onDiskPath = vscode.Uri.file(
          path.join(config.webViewAssetsPath, srcPath)
        );
        const styleSrc = innerPanel.webview.asWebviewUri(onDiskPath);
        return styleSrc;
      }
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

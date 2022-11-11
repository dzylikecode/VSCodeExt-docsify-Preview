/* jslint esversion:11 */
const vscode = require("vscode");
const fs = require("../utils/vsFile.js");
const extensionConfig = require("../extensionConfig.js");
const path = require("path");
const logger = require("../utils/logger.js");

// 最好能使用单例模式就好了
const webViewServer = {
  async create(viewColumn) {
    this.panel = vscode.window.createWebviewPanel(
      "docsifyPreviewer", // Webview id
      "docsify Preview",
      { viewColumn: viewColumn, preserveFocus: decideFocus(viewColumn) },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    let innerPanel = this.panel;
    this.panel.iconPath = extensionConfig.panelIconPath;
    try {
      this.panel.webview.html = await getHtmlContent(
        extensionConfig.webViewHtmlPath
      );
    } catch (err) {
      logger.error(err);
    }
    return;
    async function getHtmlContent(filePath) {
      let html = await fs.readFile(filePath);
      return replaceVarialbe(html);
      function replaceVarialbe(html) {
        return html.replace(/\$\{([^\}]+)\}/g, (match, src) => {
          return getSrcPath(src);
        });
      }
      function getSrcPath(srcPath) {
        const onDiskPath = vscode.Uri.file(
          path.join(extensionConfig.webViewAssetsPath, srcPath)
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
  reveal(viewColumn) {
    this.panel?.reveal(viewColumn, decideFocus(viewColumn));
  },
  close() {
    this.panel?.dispose();
  },
  get visible() {
    return this.panel?.visible;
  },
};

function decideFocus(viewColumn) {
  return vscode.ViewColumn.Two == viewColumn;
}

module.exports = webViewServer;

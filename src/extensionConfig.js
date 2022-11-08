/* jslint esversion:11 */
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const webViewHtmlRelativePath = "src/server/webView.html";
const injectedRelativePath = "src/server/listener/injected.html";
const webViewAssetsRelativePath = "src/server";

function ExtensionConfig() {
  this.init = (context) => {
    this.extensionPath = context.extensionPath;
    this.webViewHtmlPath = path.join(
      this.extensionPath,
      webViewHtmlRelativePath
    );
    this.webViewAssetsPath = path.join(
      this.extensionPath,
      webViewAssetsRelativePath
    );
    this.injectedPath = path.join(this.extensionPath, injectedRelativePath);
    this.panelIconPath = vscode.Uri.file(
      path.join(this.extensionPath, "assets/icon.svg")
    );
    this.injectCode = fs.readFileSync(this.injectedPath, "utf8");
  };
  return;
}

module.exports = new ExtensionConfig();

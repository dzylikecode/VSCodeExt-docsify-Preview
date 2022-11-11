/* jslint esversion:11 */
const path = require("path");
const vscode = require("vscode");
const fs = require("./utils/vsFile.js");
const webViewHtmlRelativePath = "src/server/webView.html";
const injectedRelativePath = "src/server/listener/injected.html";
const webViewAssetsRelativePath = "src/server";

function ExtensionConfig() {
  this.init = async (context) => {
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
    this.injectCode = await fs.readFile(this.injectedPath);
  };
  return;
}

module.exports = new ExtensionConfig();

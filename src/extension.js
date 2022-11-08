/* jslint esversion:11 */
const logger = require("./utils/logger.js");
const vscode = require("vscode");
const preview = require("./preview.js");
const extensionConfig = require("./extensionConfig.js");

function activate(context) {
  logger.init("Docsify Preview", "markdown");
  extensionConfig.init(context);
  preview.init();
  const registerCommand = (menu, fn) =>
    context.subscriptions.push(vscode.commands.registerCommand(menu, fn));

  registerCommand("docsify-preview.sidePreview", () =>
    preview.visible ? preview.close() : preview.open(vscode.ViewColumn.Two)
  );
  registerCommand(
    "docsify-preview.fullPreview",
    () => preview.open(vscode.ViewColumn.One) //  打开了后, 语言环境就不是markdown了, 但是可以用 ctrl+w 关闭
  );
}

// this method is called when your extension is deactivated
function deactivate() {
  preview.close();
}

module.exports = {
  activate,
  deactivate,
};

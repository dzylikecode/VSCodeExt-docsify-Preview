const vscode = require("vscode");
const { main } = require("./main.js");
const config = require("./config.js");
const server = require("./server/server.js");

function activate(context) {
  config.initExtension(context);
  let disposable = vscode.commands.registerCommand(
    "docsify-preview.sidePreview",
    async () => main(context, disposable)
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

const logger = require("./utils/logger.js");
const vscode = require("vscode");
const { main } = require("./main.js");
const config = require("./config.js");
const server = require("./server/server.js");

function activate(context) {
  logger.init("Docsify Preview", "markdown");
  config.initExtension(context);
  let disposable = vscode.commands.registerCommand(
    "docsify-preview.sidePreview",
    async () => main(context, disposable)
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {
  server.close();
}

module.exports = {
  activate,
  deactivate,
};

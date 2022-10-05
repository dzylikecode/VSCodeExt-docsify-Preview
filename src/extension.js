const vscode = require("vscode");
const { main } = require("./main.js");
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "docsify-preview" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "docsify-preview.createServer",
    main
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

const vscode = require("vscode");
const path = require("path");
async function main(context) {
  vscode.window.showInformationMessage("Hello World from docsify-Preview!");
  const panel = vscode.window.createWebviewPanel(
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
  panel.webview.html = await vscode.window.activeTextEditor.document.getText();
}

module.exports = {
  main,
};

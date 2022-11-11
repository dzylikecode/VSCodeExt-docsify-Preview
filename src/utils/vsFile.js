const vscode = require("vscode");

async function readFile(filePath) {
  return (
    await vscode.workspace.fs.readFile(vscode.Uri.file(filePath))
  ).toString();
}

module.exports = {
  readFile,
};

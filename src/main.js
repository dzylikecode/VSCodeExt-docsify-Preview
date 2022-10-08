const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const server = require("./server/server.js");
async function main(context) {
  vscode.window.showInformationMessage("Hello World from docsify-Preview!");
  server.init();
  server.jump("http://127.0.0.1:55109/docs/#/");
}

module.exports = {
  main,
};

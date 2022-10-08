const path = require("path");

const serverHtmlRelativePath = "src/server/Webview/index.html";

let indexFile = "docs/index.html";

let serverHtmlPath;

function init(context) {
  let extensionPath = context.extensionPath;
  serverHtmlPath = path.join(extensionPath, serverHtmlRelativePath);
}
module.exports = {
  init,
  indexFile,
  get serverHtmlPath() {
    return serverHtmlPath;
  },
};

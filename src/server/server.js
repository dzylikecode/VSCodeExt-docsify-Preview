const httpServer = require("./httpServer.js");
const webViewServer = require("./webViewServer.js");

let server = {
  init(workspacePath, indexFilePath, host, port) {
    httpServer.init(workspacePath, indexFilePath, host, port);
    webViewServer.init();
    webViewServer.onClose(() => httpServer.close);
  },
  jump(url) {
    webViewServer.jump(url);
  },
  scroll(linePercent) {
    httpServer.scroll(linePercent);
  },
  setTitile(title) {
    webViewServer.setTitile(title);
  },
};

module.exports = server;

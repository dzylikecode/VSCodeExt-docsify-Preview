const httpServer = require("./httpServer.js");
const webViewServer = require("./webViewServer.js");

let server = {
  init(host, port) {
    httpServer.init(host, port);
    webViewServer.init();
    webViewServer.onClose(() => httpServer.close());
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

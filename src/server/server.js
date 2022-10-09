const httpServer = require("./httpServer.js");
const webViewServer = require("./webViewServer.js");

let server = {
  create(host, port) {
    httpServer.create(host, port);
    webViewServer.create();
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
  reload(callback) {
    httpServer.postMessage({ command: "reload" });
  },
  postMessage(message) {
    httpServer.postMessage(message);
  },
  onMessage(callback) {
    httpServer.onMessage(callback);
  },
  onClose(callback) {
    webViewServer.onClose(callback);
  },
};

module.exports = server;

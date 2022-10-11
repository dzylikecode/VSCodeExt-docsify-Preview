const httpServer = require("./httpServer.js");
const webViewServer = require("./webViewServer.js");

let server = {
  async create(host, port) {
    let res = await createHttpServer(host, port);
    if (res) {
      webViewServer.create();
    }
    return res;
    function createHttpServer(host, port) {
      return new Promise((resolve, reject) => {
        httpServer.create(host, port, (res) => resolve(res), reject);
      });
    }
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
  reload() {
    httpServer.postMessage({ command: "reload" });
  },
  postMessage(message) {
    httpServer.postMessage(message);
  },
  onMessage(callback) {
    httpServer.onMessage(callback);
  },
  onClose(callback) {
    webViewServer.onClose(() => {
      callback();
      httpServer.close();
    });
  },
  close() {
    webViewServer.close();
  },
};

module.exports = server;

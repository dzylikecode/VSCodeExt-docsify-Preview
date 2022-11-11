/* jslint esversion:11 */
const httpServer = require("./httpServer.js");
const webViewServer = require("./webViewServer.js");
const workspaceConfig = require("../workspaceConfig.js");
let server = {
  async create(host, port, viewColumn) {
    let res = await createHttpServer(host, port);
    if (res) {
      await webViewServer.create(viewColumn);
    }
    return res;
    function createHttpServer(host, port) {
      return new Promise((resolve, reject) => {
        httpServer.create(host, port, (res) => resolve(res), reject);
      });
    }
  },
  jumpFirstTime(url, linePercent) {
    webViewServer.jumpFirstTime(url, linePercent);
  },
  jump(url) {
    webViewServer.jump(url);
  },
  scroll(linePercent) {
    webViewServer.scroll(linePercent);
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
    webViewServer.onMessage(callback);
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
  reveal(viewColumn) {
    webViewServer.reveal(viewColumn);
  },
  parseUrl(url) {
    const rootUrl = new URL("#", workspaceConfig.rootUrl).href;
    return rootUrl + url;
  },
  get visible() {
    return webViewServer.visible;
  },
};

module.exports = server;

/* jslint esversion:11 */
const ws = require("ws");
const extensionConfig = require("../../extensionConfig.js");
const logger = require("../../utils/logger.js");

let webSocketServer = {
  attach(server) {
    this.sockets = [];
    this.websocketServer = new ws.Server({ server });
    this.websocketServer.on("connection", (socket) => {
      logger.info("Socket connected");
      socket.on("message", (message) => {
        console.log("Message received: " + message);
        message = "" + message;
        this.callbackOnMessage(socket, JSON.parse(message));
      });
      this.sockets.push(socket);
      socket.onclose = () => {
        logger.info("Socket disconnected");
        this.sockets.splice(this.sockets.indexOf(socket), 1);
      };
    });
    logger.info("Creating websocket");
  },
  postMessage(message) {
    this.sockets.forEach((socket) => {
      socket.send(JSON.stringify(message), (error) => {
        if (!error) return;
        logger.error(error);
      });
    });
  },
  onMessage(callback) {
    this.callbackOnMessage = callback;
  },
  scroll(linePercent) {
    this.postMessage({ command: "scroll", linePercent: linePercent });
  },
  injectHtml(html) {
    let index = html.indexOf("</body>");
    let newHtml = html.substring(0, index);
    newHtml += extensionConfig.injectCode;
    newHtml += html.substring(index);
    return newHtml;
  },
  close() {
    logger.info("Closing websocket");
    this.websocketServer.close();
  },
};

module.exports = webSocketServer;

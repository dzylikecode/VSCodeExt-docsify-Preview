const ws = require("ws");
const config = require("../../config.js");

let webSocketServer = {
  attach(server) {
    this.sockets = [];
    this.websocketServer = new ws.Server({ server });
    this.websocketServer.on("connection", (socket) => {
      console.log("Socket connected");
      socket.on("message", (message) => {
        console.log("Message received: " + message);
        message = "" + message;
        this.callbackOnMessage(socket, JSON.parse(message));
      });
      this.sockets.push(socket);
      socket.onclose = () => {
        console.log("Socket disconnected");
        this.sockets.splice(this.sockets.indexOf(socket), 1);
      };
    });
    console.log("Created websocket, listing");
  },
  postMessage(message) {
    this.sockets.forEach((socket) => {
      socket.send(JSON.stringify(message), (error) => {
        if (!error) return;
        console.error(error);
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
    newHtml += config.injectCode;
    newHtml += html.substring(index);
    return newHtml;
  },
  close() {
    console.log("Closing websocket");
    this.websocketServer.close();
  },
};

module.exports = webSocketServer;

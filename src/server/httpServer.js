const http = require("http");
const fs = require("fs");
const config = require("../config.js");
const ws = require("ws");
const express = require("express");
const app = express();

class WebSocketServer {
  constructor(server, indexFilePath) {
    this.sockets = [];
    this.websocketServer = new ws.Server({ server });
    this.setupConnectionHandler(indexFilePath);
    console.log("Created websocket, listing");
  }
  postMessage(message) {
    this.sockets.forEach((socket) => {
      socket.send(JSON.stringify(message), (error) => {
        if (!error) return;
        console.error(error);
      });
    });
  }
  scroll(linePercent) {
    this.postMessage({ command: "scroll", linePercent: linePercent });
  }
  notifyRefresh() {
    console.log("Notifying clients about refresh");
    this.sockets.forEach((socket) => {
      socket.send("refresh", (error) => {
        if (!error) return;
        console.error(error);
      });
    });
  }
  close() {
    console.log("Closing websocket");
    this.websocketServer.close();
  }
  ////////////////////////////////////////
  // private
  setupConnectionHandler(indexFilePath) {
    this.websocketServer.on("connection", (socket) => {
      console.log("Socket connected");
      this.sockets.push(socket);
      socket.onclose = () => {
        console.log("Socket disconnected");
        this.sockets.splice(this.sockets.indexOf(socket), 1);
      };
      this.postMessage({ command: "jump", url: indexFilePath });
    });
  }
}

let httpServer = {
  init(workspacePath, indexFilePath, host, port) {
    this.workspacePath = workspacePath;

    app.use("/", (request, response) => {
      let url = decodeURI(request.originalUrl);
      if (url == "/") {
        let httpServerHtml = fs.readFileSync(
          config.httpServerHtmlPath,
          "utf-8"
        );
        response.send(httpServerHtml);
        return;
      }
      response.sendFile(workspacePath + url);
    });
    this.server = http.createServer(app);
    this.websocketServer = new WebSocketServer(this.server, indexFilePath);
    this.server.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  },
  postMessage(message) {
    this.websocketServer.postMessage(message);
  },
  scroll(linePercent) {
    this.websocketServer.scroll(linePercent);
  },
  close() {
    this.websocketServer.close();
    this.server.close();
  },
};

module.exports = httpServer;

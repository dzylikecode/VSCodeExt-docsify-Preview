const http = require("http");
const fs = require("fs");
const config = require("../config.js");
const ws = require("ws");
const express = require("express");
const app = express();
const path = require("path");

class WebSocketServer {
  constructor(server) {
    this.sockets = [];
    this.websocketServer = new ws.Server({ server });
    this.setupConnectionHandler();
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
  close() {
    console.log("Closing websocket");
    this.websocketServer.close();
  }
  ////////////////////////////////////////
  // private
  setupConnectionHandler() {
    this.websocketServer.on("connection", (socket) => {
      console.log("Socket connected");
      this.sockets.push(socket);
      socket.onclose = () => {
        console.log("Socket disconnected");
        this.sockets.splice(this.sockets.indexOf(socket), 1);
      };
    });
  }
}

let httpServer = {
  init(host, port) {
    app.use("/", (request, response) => {
      let url = decodeURI(request.originalUrl);
      if (url == "/") {
        let html = this.injectCode(
          this.parseFilePath(config.indexFilePath),
          config.httpServerHtmlPath
        );
        response.send(html);
        return;
      }
      let filePath = this.parseFilePath(url);
      if (fs.existsSync(filePath)) {
        response.sendFile(filePath);
      } else {
        console.log("File not found: " + filePath);
      }
    });
    this.server = http.createServer(app);
    this.websocketServer = new WebSocketServer(this.server);
    this.server.listen(port, host, () => {
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
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  },
  injectCode(docsifyFilePath, httpServerHtmlPath) {
    let docsifyHtml = fs.readFileSync(docsifyFilePath, "utf8");
    let httpServerHtml = fs.readFileSync(httpServerHtmlPath, "utf8");
    let index = docsifyHtml.indexOf("</body>");
    let newHtml = docsifyHtml.substring(0, index);
    newHtml += httpServerHtml;
    newHtml += docsifyHtml.substring(index);
    return newHtml;
  },
  parseFilePath(filePath) {
    let docsifyFilePath = path.join(config.docsifyRootPath, filePath);
    return docsifyFilePath;
  },
};

module.exports = httpServer;

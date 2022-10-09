const http = require("http");
const fs = require("fs");
const config = require("../config.js");
const listener = require("./listener/listener.js");
const express = require("express");
const app = express();
const path = require("path");

let httpServer = {
  create(host, port) {
    let docsifyHtml = getDocsifyIndexHtml();
    let html = listener.injectHtml(docsifyHtml);
    this.server = createServer(html);
    listener.attach(this.server);
    this.server.listen(port, host, () => {
      console.log(`Listening on port ${port}`);
    });
    return;
    function getDocsifyIndexHtml() {
      let docsifyIndexHtmlPath = parseFilePath(config.indexFileName);
      return fs.readFileSync(docsifyIndexHtmlPath, "utf8");
    }
    function createServer(html) {
      let expressApp = createApp(html);
      return http.createServer(expressApp);
      function createApp(html) {
        app.use("/", (request, response) => {
          let url = decodeURI(request.originalUrl);
          if (url == "/") {
            response.send(html);
            return;
          }
          let filePath = parseFilePath(url);
          if (fs.existsSync(filePath)) {
            response.sendFile(filePath);
          } else {
            console.log("File not found: " + filePath);
          }
        });
        return app;
      }
    }
  },
  postMessage(message) {
    listener.postMessage(message);
  },
  onMessage(callback) {
    listener.onMessage(callback);
  },
  scroll(linePercent) {
    listener.postMessage({ command: "scroll", linePercent: linePercent });
  },
  close() {
    listener.close();
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  },
};

function parseFilePath(filePath) {
  let docsifyFilePath = path.join(config.docsifyRootPath, filePath);
  return docsifyFilePath;
}

module.exports = httpServer;

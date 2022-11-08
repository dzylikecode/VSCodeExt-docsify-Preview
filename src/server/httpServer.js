/* jslint esversion:11 */
const http = require("http");
const fs = require("fs");
const logger = require("../utils/logger.js");
const workspaceConfig = require("../workspaceConfig.js");
const listener = require("./listener/listener.js");
const express = require("express");
const app = express();
const path = require("path");

let httpServer = {
  create(host, port, resolve, reject) {
    let docsifyHtml = getDocsifyIndexHtml();
    let html = listener.injectHtml(docsifyHtml);
    this.server = createServer(html);
    listener.attach(this.server);
    this.server.listen(port, host, () => {
      logger.info(`Listening on port ${port}`);
      resolve(true);
    });
    return;
    function getDocsifyIndexHtml() {
      let docsifyIndexHtmlPath = parseFilePath(workspaceConfig.indexFileName);
      if (fs.existsSync(docsifyIndexHtmlPath) == false) {
        reject("IndexNotFound");
      }
      return fs.readFileSync(docsifyIndexHtmlPath, "utf8");
    }
    function createServer(html) {
      let expressApp = createApp(html);
      let server = http.createServer(expressApp);
      server.on("error", function (err) {
        logger.error(err);
        reject("PortOccupied");
      });
      return server;
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
            response.status(404).send({
              error: {
                status: 404,
                message: "File not found: " + filePath,
              },
            });
            logger.warn("File not found: " + filePath);
          }
        });
        return app;
      }
    }
  },
  postMessage(message) {
    if (this.server) {
      listener.postMessage(message);
    }
  },
  onMessage(callback) {
    listener.onMessage(callback);
  },
  scroll(linePercent) {
    this.postMessage({ command: "scroll", linePercent: linePercent });
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
  let docsifyFilePath = path.join(workspaceConfig.docsifyRootPath, filePath);
  return docsifyFilePath;
}

module.exports = httpServer;

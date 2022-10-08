const http = require("http");
const express = require("express");
const app = express();

let http_server = {
  init(rootPath, entryFile, port) {
    app.use(express.static(rootPath));
    app.get("/", (req, res) => {
      res.sendFile(entryFile);
    });
  },
};

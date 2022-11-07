const vscode = require("vscode");
const _ = require("lodash");
function Logger() {
  let channel;

  this.init = (name, langID) => {
    channel = vscode.window.createOutputChannel(name, langID);
  };

  const logCurry = _.curry(log);

  this.info = logCurry("info");
  this.error = logCurry("error");
  this.warn = logCurry("warn");

  return;
  function log(level, message) {
    const curTime = new Date().toLocaleTimeString();
    channel.appendLine(`["${level}" - ${curTime}] ${message}`);
  }
}

module.exports = new Logger();

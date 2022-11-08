/* jslint esversion:11 */
const vscode = require("vscode");

function Logger() {
  let channel;

  this.init = (name, langID) => {
    channel = vscode.window.createOutputChannel(name, langID);
  };

  const logCurry = (level) => (message) => log(level, message);

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

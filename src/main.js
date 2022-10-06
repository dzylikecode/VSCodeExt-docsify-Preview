const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
async function main(context) {
  vscode.window.showInformationMessage("Hello World from docsify-Preview!");
  showInVSCode();
}

const indexFile = path.join(__dirname, "./index.html");

async function getHtmlContent(url) {
  let text = "";
  try {
    text = fs.readFileSync(indexFile, "utf8");
  } catch (err) {
    console.log(err);
  }
  return formatHtml(text, { url: url });
  function formatHtml(html, variables) {
    let newFile = html.replace(
      /\${(\w+)}/g,
      (match, varName) => variables[varName] || ""
    );
    return newFile;
  }
}

async function showInVSCode() {
  const panel = vscode.window.createWebviewPanel(
    // Webview id
    "docify_Previewer",
    // Webview title
    "docsify Preview",
    // This will open the second column for preview inside editor
    vscode.ViewColumn.Two,
    {
      // Enable scripts in the webview
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );
  panel.webview.html = await getHtmlContent("http://localhost:8080/");
}

module.exports = {
  main,
};

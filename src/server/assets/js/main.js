/** jslint dom */
const vscode = acquireVsCodeApi();
const iframe = document.getElementById("Server");
const log = (msg) => {
  console.log("webview: ");
  console.log(msg);
};
let currentUrl;
let curScrollPos = 0;

log("Hello!");

// Handle the message inside the webview
window.addEventListener("message", (event) => {
  const message = event.data; // The JSON data our extension sent
  log(JSON.stringify(message));

  switch (message.command) {
    case "jumpFirstTime":
      loadFrame(message.url);
      iframe.onload = () => {
        if (message.linePercent) {
          // 避免每次reload都是调用下面的函数
          iframe.contentWindow.postMessage(
            {
              command: "jumpFirstTime",
              linePercent: message.linePercent,
            },
            "*"
          );
          message.linePercent = undefined; // 由于闭包, 需要将其undefined
        }
      };
      break;
    case "jump":
      loadFrame(message.url);
      break;
    case "popContextMenu":
      popContextMenu(message.event.x, message.event.y);
      curScrollPos = message.scrollPos;
      break;
    case "loaded":
      currentUrl = message.url;
      vscode.postMessage({ command: "loaded", url: currentUrl });
      break;
    case "scroll":
      updateScroll(message.linePercent);
      break;
    case "hideContextMenu":
      hideContextMenu();
      break;
  }
});

function loadFrame(url) {
  iframe.src = url;
}

function updateScroll(linePercent) {
  iframe.contentWindow.postMessage(
    { command: "scroll", linePercent: linePercent },
    "*"
  );
}

function hideContextMenu() {
  $("ul.contextMenu").fadeOut("fast");
}

function popContextMenu(x, y) {
  log("context");
  if ($("ul.contextMenu").is(":visible")) {
    hideContextMenu();
  } else {
    $("ul.contextMenu").show().css({ top: y, left: x });
  }
}

function openInBrowser() {
  log("open in browser");
  hideContextMenu();
  vscode.postMessage({ command: "openInBrowser" });
}

function goHere() {
  log("go here");
  hideContextMenu();
  vscode.postMessage({
    command: "goHere",
    url: currentUrl,
    linePercent: curScrollPos,
  });
}

function openDeveloperTools() {
  hideContextMenu();
  vscode.postMessage({
    command: "openDeveloperTools",
  });
}

function closePreview() {
  hideContextMenu();
  vscode.postMessage({
    command: "closePreview",
  });
}

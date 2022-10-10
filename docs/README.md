# docsify preview

## 基本思路

```markmap
- 点击按钮 => 建立一个服务器, 打开一个视图
- 服务器监听

  当前markdown路径

  当前markdown的滚动条

  如果当前文件保存, 则会重新reload
```

- open in browser

## issue

postMessage 不起作用 https://htmldom.dev/communication-between-an-iframe-and-its-parent-window/

## reference

- [HTTP Server / HTML Preview](https://marketplace.visualstudio.com/items?itemName=Flixs.vs-code-http-server-and-html-preview)

  > 提过了 websocket 的思路

- [markdown-preview-enhanced](https://github.com/shd101wyy/markdown-preview-enhanced)
- [Synchronized Scrolling](https://marketplace.visualstudio.com/items?itemName=masakit.synchronized-scrolling)
- [How to Build a VS Code extension for Markdown preview using Remark processor](https://dev.to/salesforceeng/how-to-build-a-vs-code-extension-for-markdown-preview-using-remark-processor-1169)
- [remark-preview](https://github.com/SubratThakur/remark-preview)

  > recommand, 提供 editor 控制 preview 的思路

- [Webview API](https://code.visualstudio.com/api/extension-guides/webview)
- [vscode-vs-browser](https://github.com/Phu1237/vscode-vs-browser)

  > recommand

- [live-server](https://github.com/ritwickdey/vscode-live-server)

  提供 inject 的思路

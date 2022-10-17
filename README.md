# Docsify Preview

- market: https://marketplace.visualstudio.com/items?itemName=dzylikecode.docsify-preview
- online docs: https://dzylikecode.github.io/VSCodeExt-docsify-Preview/#/

[Docsify](https://docsify.js.org/#/) is a magical documentation site generator. What the plugin does is help you see the preview of your markdown file when writing it so that you can get better feedback. What you see is what you get.

## Features

- preview Docsify in the sidebar

  ![](assets/feature/preview.gif)

- auto scroll when markdown file scrolled

  ![](assets/feature/scroll-sync.gif)

- auto jump to the corresponding position when opening a markdown file

  ![](assets/feature/jump.gif)

- auto-reload when the markdown file saved

  ![](assets/feature/reload.gif)

- context menu

  - Open in browser

  - go here

    ![](assets/feature/go-here.gif)

If you are interested in my Docsify template, welcome to visit my [Docsify-template](https://dzylikecode.github.io/#/blog/docsify/?id=template), which supports mindmap, math formula, mermaid, jsRunkit, and so on.

If you want to paste images in markdown, welcome to use my other plugin:[md-paste-enhanced](https://marketplace.visualstudio.com/items?itemName=dzylikecode.md-paste-enhanced).

> If you like this plugin, please give me a star. Thanks!

## Extension Settings

- `docsifyPreview.port`

  Set the port of the server

  - the default value is `10812`

- `docsifyPreview.indexFile`

  Set the path of your custom `index.html`

  To change the path, use `/` refer to the relative path from the workspace.

  - Example: `/index.html`

  - the default value is `/docs/index.html`

## Known Issues

I have fixed all the issues I met. If you find any issues, please report them to [issue](https://github.com/dzylikecode/VSCodeExt-docsify-Preview/issues)

The scroll will be in the wrong position when you save the markdown file if the current markdown file can't be found in the sidebar. I find the reason is that Docsify won't execute the function `hook.ready` if the Markdown file is not in the sidebar. So you'd better add the markdown file to the sidebar first before writing the Markdown file with joy.

## Release Notes

### 1.1.0

- fix:

  - open in browser

    it will open the wrong link if you change the page in the preview

  - the title doesn't respond when you change the page in the preview

- refactor code

### 1.0.0

🎉 🎉 🎉

- [x] fix: the scroll position will be put at the wrong position when opening the `Docsify Preview` the first time
- [x] change: use the context menu to open the preview in a browser instead of right-clicking
- [x] add: the button "go here" in the context menu

  If you click the button, the VSCode will open the corresponding markdown and scroll to the same position.

- [x] fix: the state of whether the sidebar is closed will be reset if you reload the window

### 0.2.2

@paulhibbitts

fix: An annoying bug is that you have to drag the next markdown to the sidebar to see the preview.

### 0.2.1

change the label of the menu to "Show Docsify preview to the side"

> Thanks to @paulhibbitts

### 0.2.0

feature: right-click the preview will open the preview in the default browser

### 0.1.0

feature: add input box if the configuration is not correct

### 0.0.1

congratulations!

- [x] scroll sync
- [x] reload automatically when saving markdown
- [x] jump to the corresponding link automatically when switching the markdown

## buy me a coffee :coffee:

I'm a student from China and I sacrificed the entire National Day holiday to write this plugin(Not only that, but I also overdrawn five days of study😰). If you like this plugin, please give me a star. If you want to buy me a coffee, scan the QR code below. Thanks! 😝 😝 😝

|                           PayPal                           |            WeChat Pay            |            Alipay             |
| :--------------------------------------------------------: | :------------------------------: | :---------------------------: |
| [dzylikecode](https://www.paypal.com/paypalme/dzylikecode) | ![](assets/afford/WeChatPay.png) | ![](assets/afford/AliPay.jpg) |

## backers

Thank you very much!!!

@paulhibbitts

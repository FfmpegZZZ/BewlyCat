# BewlyCat

此 fork 在 [keleus/BewlyCat](https://github.com/keleus/BewlyCat) 的基础上维护 macOS Safari 适配，同时保留 Chrome、Edge 和 Firefox 构建。

![GitHub Release](https://img.shields.io/github/v/release/keleus/BewlyCat?label=Github) ![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/oopkfefbgecikmfbbapnlpjidoomhjpl?label=Chrome) ![Edge Addons Version](https://img.shields.io/badge/dynamic/json?color=blue&label=Edge&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Faaammfjdfifgnfnbflolojihjfhdploj&prefix=v) ![Firefox Version](https://img.shields.io/amo/v/bewlycat?label=Firefox)

![Github Downloads](https://img.shields.io/github/downloads/keleus/BewlyCat/total?label=Github%20Downloads) ![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/oopkfefbgecikmfbbapnlpjidoomhjpl?label=Chrome%20Users) ![Edge Addons Users](https://img.shields.io/badge/dynamic/json?label=Edge%20Users&query=%24.activeInstallCount&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Faaammfjdfifgnfnbflolojihjfhdploj) ![Firefox Users](https://img.shields.io/amo/users/bewlycat?label=Firefox%20Users)

此项目基于[BewlyBewly](https://github.com/BewlyBewly/BewlyBewly)开发，并在其基础上进行功能扩充和调整，并合并了一些其他拓展的功能。

<p align="center" style="margin-bottom: 0px !important;">
<img width="300" alt="BewlyCat icon" src="./assets/icon-512.png"><br/>
</p>

<p align="center">只需对您的 Bilibili 主页进行一些小更改即可。</p>

## 👋 介绍

> [!IMPORTANT]
> 本插件及Fork代码禁止以任何形式的客户端封装！！！插件的目的是仅优化B站官方网站的使用体验。
>
> 该项目面向我个人使用习惯修改。当然，欢迎功能建议与bug反馈。
>
> 浏览器拓展商店上架均同时提交审核，实际更新速度取决于各个商店审核速度。请勿在issue中催促审核，商店异常行为由商店导致！
>
> 上游不提供 Safari 打包；此 fork 提供 Safari 开发测试包，安装和本地构建方法见下文。
>
> 本项目由MIT许可在原项目基础上开发，并亦与原作者联系取得了授权，包括上架Chrome应用商店等权利。

> [!CAUTION]
> 为了本项目能够在Github中直接被搜索到，项目将脱离BewlyBewly的Fork网络，成为一个独立的项目。但项目基于BewlyBewly是不变的～项目不会移除历史贡献者和原项目信息。
>
> B站于2026年1月调整了首页推荐API，请更新至`1.5.6`版本及以上，以适配新的首页推荐，排行榜和分区。

## 主要功能异同

### 新增功能

1. 新增视频卡片、顶栏链接后台打开的能力。
2. 新增默认播放器样式设置，当播放器样式是默认和宽屏的时候会自动滚动到弹幕框与底部平齐。
3. 新增用户面板大会员权益领取入口。
4. 新增首页推荐前进后退的能力。
5. 新增合集播放自动关闭功能（需要在设置里开启），方便挂合集听歌。
6. 新增web模式推荐按照点赞/播放比例过滤视频的能力（需要设置里开启）
7. 参考了`Extension for Bilibili Player`插件的快捷键，支持了其中大部分功能的自定义快捷键。
8. 记住倍速比例功能，开启后会记住上次倍速
9. 合集视频随机播放功能
10. 视频详情页稍后再看外置
11. 自定义暗色基准色，开启后会根据基准色调整暗黑模式的显示
12. 新增合集视频保持默认播放模式功能

13. 局部音量均衡：在「设置 → Bilibili → 播放器 → 音量均衡」启用，平衡不同视频之间的音量，并通过播放器组件关闭原生均衡。支持目标响度、强度调整及运行状态显示，详见[算法与资源管理](docs/local-loudness.md)。

### 删除功能

1. ~~删除了原插件广东话翻译~~广东话翻译由BewlyBewly插件原作者维护（缺少翻译情况下默认显示英文翻译结果）
2. 删除了内置字体，减少打包体积（14.4M -> 600K）
3. 删除了旧版顶栏（减少开发成本），并重构了原项目的顶栏组件（功能无差异）
4. 删除了部分影响功能正常使用的动画（如抽屉打开关闭的动画）

## ⬇️ 安装

### 在线安装

[Chrome应用商店](https://chromewebstore.google.com/detail/oopkfefbgecikmfbbapnlpjidoomhjpl)

[Edge应用商店](https://microsoftedge.microsoft.com/addons/detail/bewlycat/aaammfjdfifgnfnbflolojihjfhdploj):审核周期不定

[Firefox应用商店](https://addons.mozilla.org/en-US/firefox/addon/bewlycat/):已上线～（`1.0.2`版本已经修复抽屉问题）

> [!CAUTION]
> 审核可能存在延迟，Chrome一般会晚30分钟-15天，Edge一般会晚3-30天，Firefox一般会晚1-30分钟

### 本地安装

#### macOS Safari

要求 macOS 14（Sonoma）或更新系统，以及 Safari 26 或更新版本。扩展使用的请求方法过滤规则需要 Safari 26；Safari 版本支持情况见 [MDN 兼容表](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/declarativeNetRequest/RuleCondition#browser_compatibility)。

1. 在此 fork 的 [Releases](https://github.com/FfmpegZZZ/BewlyCat/releases) 或 [Build Release 工作流](https://github.com/FfmpegZZZ/BewlyCat/actions/workflows/release.yml) 下载 `BewlyCat-safari-macos.zip`。Actions 的 artifact 解压后还需要解压其中的应用压缩包。
2. 将解压后的 `BewlyCat.app` 移到“应用程序”并打开。当前包使用本地临时签名，未经过 Apple 公证；macOS 首次打开可能需要在“系统设置 → 隐私与安全性”中允许打开。
3. 在 Safari 设置的“高级”中开启“显示网页开发者功能”，然后在设置的“开发者”页开启“允许未签名的扩展”。退出 Safari 后需重新开启该选项，详见 [Apple 开发文档](https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension)。
4. 在“Safari → 设置 → 扩展”中启用 BewlyCat，并允许它访问 `bilibili.com` 和 `hdslb.com`，随后刷新 B 站页面。

包同时包含 Apple Silicon 和 Intel 架构。正式分发需要自己的 Apple Developer 签名和公证，详见 [Safari 扩展分发文档](https://developer.apple.com/documentation/safariservices/distributing-your-safari-web-extension)。

#### 本地构建 Safari

安装 Node.js、与 `package.json` 中 `packageManager` 对应的 pnpm，以及完整的 Xcode（仅 Command Line Tools 不够）。首次运行 Xcode 并完成初始化，然后执行：

```bash
pnpm install --frozen-lockfile
pnpm build-safari
pnpm convert-safari
```

网页扩展资源生成在 `extension-safari/`，转换后的 Xcode 项目位于 `extension-safari-macos/`。在 Xcode 中选择 macOS 方案和签名团队后运行。若 `xcrun` 找不到转换工具，先选择完整 Xcode：

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

#### 同步上游

此 fork 的 [同步工作流](https://github.com/FfmpegZZZ/BewlyCat/actions/workflows/sync.yml) 每六小时合并上游 `main`，更新后触发 Safari 构建。手动运行也可补建已同步的代码。遇到合并冲突时需先人工解决；若上游修改了工作流文件，需配置具有 `repo` 和 `workflow` 权限的 `SYNC_TOKEN` 仓库密钥。

[CI](https://github.com/keleus/BewlyCat/actions)：使用最新代码自动构建

[Releases](https://github.com/keleus/BewlyCat/releases)：稳定版

#### Edge 和 Chrome(推荐)

> 确保您下载了 [extension.zip](https://github.com/keleus/BewlyCat/releases)。

在 Edge 浏览器中打开 `edge://extensions` 或者在 Chrome 浏览器中打开 `chrome://extensions` 界面，只需将下载的 `extension.zip` 文件拖放到浏览器中即可完成安装。

<details>
 <summary> Edge & Chrome 的另一种安装方法 </summary>

#### Edge

> 确保您下载了 [extension.zip](https://github.com/keleus/BewlyCat/releases) 并解压缩该文件。

1. 在地址栏输入 `edge://extensions/` 并按回车
2. 打开 `开发者模式` 并点击 `加载已解压的拓展程序` <br/> <img width="655" alt="image" src="https://user-images.githubusercontent.com/33394391/232246901-e3544c16-bde2-480d-b770-ca5242793963.png">
3. 在浏览器中加载解压后的扩展文件夹

#### Chrome

> 确保您下载了 [extension.zip](https://github.com/keleus/BewlyCat/releases) 并解压缩该文件。

1. 在地址栏输入 `chrome://extensions/` 并按回车
2. 打开 `开发者模式` 并点击 `加载已解压的拓展程序` <br/> <img width="655" alt="Snipaste_2022-03-27_18-17-04" src="https://user-images.githubusercontent.com/33394391/160276882-13da0484-92c1-47dd-add8-7655c5c2bf1c.png">
3. 在浏览器中加载解压后的扩展文件夹

</details>

## 🤝 构建项目参考

查看 [CONTRIBUTING.md](docs/CONTRIBUTING-cmn_CN.md)

### BewlyCat&BewlyBewly贡献者

[![Contributors](https://contrib.rocks/image?repo=keleus/BewlyCat)](https://github.com/keleus/BewlyCat/graphs/contributors)

## ❤️ 鸣谢

- [BewlyBewly](https://github.com/BewlyBewly/BewlyBewly) - 该项目的基础
- [vitesse-webext](https://github.com/antfu/vitesse-webext) - 该项目使用的模板
- [UserScripts/bilibiliHome](https://github.com/indefined/UserScripts/tree/master/bilibiliHome),
[bilibili-app-recommend](https://github.com/magicdawn/bilibili-app-recommend) - 获取访问密钥的参考来源
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) - 部分功能实现
- [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect)

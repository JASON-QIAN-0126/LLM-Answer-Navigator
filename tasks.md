下面是一份可以直接丢给 Cursor 的任务流说明文档。
风格就是「一步一步让它实现插件」，你可以整份复制给它当系统/项目说明。

⸻

项目：LLM 对话页面回答导航 Chrome 插件

一、项目目标（让模型先理解大图景）

你现在要实现一个 Chrome 插件（Manifest V3），功能是：
	•	在常见大语言模型对话页面（例如 ChatGPT 页面，后续可扩展到其它）中：
	•	自动识别每一条 AI 回答块（assistant 的 reply）。
	•	在页面右下角显示一个悬浮导航面板，包含：
	•	「上一条回答」按钮
	•	「下一条回答」按钮
	•	当前回答序号 / 总回答数（例如 3 / 12）
	•	支持键盘快捷键触发上一条 / 下一条（例如：Alt+↑、Alt+↓）。
	•	点击按钮或使用快捷键时，平滑滚动到对应 AI 回答的开头，并高亮该回答。

要求：
	•	使用 Manifest V3。
	•	代码结构清晰、可扩展，便于后续增加更多站点适配器。
	•	不需要任何后端服务，完全前端插件实现。

⸻

二、技术栈 & 结构约定

请按如下技术/结构实现：
	•	语言：TypeScript
	•	打包：可以用最简单的方案（例如 esbuild 或 vite-plugin-web-extension），只要能打包 content script / background / options / popup 即可，由你自行选择最简单可靠的一种。
	•	Manifest：Chrome 扩展 Manifest V3。
	•	基本模块划分：
	•	background（Service Worker）：接收快捷键命令，转发给当前 Tab 的 content script。
	•	content script：核心逻辑，负责：
	•	识别 AI 回答 DOM 节点并建立索引。
	•	注入右下角悬浮导航 UI。
	•	执行滚动 & 高亮。
	•	监听 background 发来的「上一条/下一条」指令。
	•	options 页面：后续用于配置多站点适配器和开关，目前先简单实现基础骨架。
	•	popup 页面（可选，先做一个简单状态展示页）。

建议目录结构（可以微调，但保持语义清晰）：

project-root/
  src/
    manifest.json
    background/
      index.ts
    content/
      index.ts
      siteAdapters/
        chatgptAdapter.ts
        index.ts      # 导出当前支持的站点适配器列表
      navigation/
        answerIndexManager.ts
        navigatorUI.ts
        scrollAndHighlight.ts
    options/
      index.html
      index.ts
    popup/
      index.html
      index.ts
  dist/              # 打包输出
  package.json
  ...


⸻

三、任务流（按顺序执行，每一步完成后建议 git commit）

任务 1：初始化项目 & 基础 Manifest

目标：
建立一个可加载到 Chrome 的最小扩展骨架（Manifest V3），并能成功加载 background + content script。

要求：
	1.	初始化项目：
	•	创建 package.json，安装 TypeScript + 打包工具（你选择最简方案，比如 esbuild）。
	•	配置基础的 tsconfig.json。
	2.	在 src/manifest.json 中：
	•	使用 manifest_version: 3。
	•	声明：
	•	name, version, description.
	•	background.service_worker 指向打包后的 background 脚本。
	•	content_scripts：
	•	matches 包含至少 ChatGPT 的 URL：https://chatgpt.com/* 或 https://chat.openai.com/*（考虑新版域名）。
	•	js 指向打包后的 content script。
	•	permissions 包括：tabs, scripting, storage.
	•	commands：
	•	定义两个命令：prev-answer、next-answer，分别绑定快捷键（例如 Alt+Up、Alt+Down）。
	3.	建立打包流程：
	•	添加 npm script，比如 build：打包所有入口（background、content、options、popup）。
	•	确保 npm run build 后能生成 dist/，包含打包好的脚本和 manifest.json。
	4.	手动在 Chrome 的「扩展程序 → 加载已解压的扩展程序」中加载 dist/，确保：
	•	扩展显示正常。
	•	background service worker 正常运行（控制台无报错）。

完成后：

执行一次 npm run build，确认可以在 Chrome 中加载扩展 → git add . && git commit -m "Init Chrome extension skeleton with MV3 and build setup"。

⸻

任务 2：在 Content Script 中检测当前站点 & 简单日志

目标：
让 content script 在 ChatGPT 页面上运行，并确认可以在控制台看到简单输出。

要求：
	1.	在 src/content/index.ts 中：
	•	判断当前 window.location 是否是 ChatGPT 对话页面（允许简单判断域名 + 路径）。
	•	在符合条件时输出一行日志，比如（中文即可）：
「LLM Answer Navigator: ChatGPT 页面已检测到，准备初始化」。
	2.	构建并在 ChatGPT 页面打开开发者工具，确认 content script 的日志存在。

完成后：

git add . && git commit -m "Add basic content script detection for ChatGPT"

⸻

任务 3：实现站点适配器框架（Site Adapter，先只支持 ChatGPT）

目标：
建立一个可扩展的「站点适配器」结构，先实现 ChatGPT 专用适配器。

要求：
	1.	在 src/content/siteAdapters/index.ts 中：
	•	定义一个通用接口（用 TypeScript 类型实现）：
	•	isSupported(url: Location): boolean
	•	findAllAnswers(root: Document | HTMLElement): HTMLElement[]
	•	导出一个函数 getActiveAdapter(url: Location)：
	•	遍历所有适配器，返回第一个 isSupported 为 true 的。
	•	如果没有匹配，返回 null。
	2.	在 src/content/siteAdapters/chatgptAdapter.ts 中实现 ChatGPT 适配器：
	•	isSupported：根据 host 和 pathname 判断是否是 ChatGPT 的对话页面。
	•	findAllAnswers：
	•	在 ChatGPT DOM 结构中，找出所有「AI 回答块」的根节点。
	•	如果拿不准，可以先用较宽泛的选择器：找到所有非用户消息，并后续可以再精细化。
	•	暂时只要能返回一个 HTMLElement[]，数量大致正确即可。
	3.	在 src/content/index.ts 中：
	•	调用 getActiveAdapter，如果不存在适配器，直接返回。
	•	存在适配器时：调用 findAllAnswers(document)，输出这些节点数量和其中第一个节点的信息（仅日志）。

完成后：

在 ChatGPT 页面刷新，检查控制台中打印出的回答节点数量。
git add . && git commit -m "Add site adapter framework and ChatGPT adapter skeleton"

⸻

任务 4：实现回答索引管理模块（AnswerIndexManager）

目标：
用一个专门模块来维护「回答列表」及当前 index 的逻辑。

要求：
	1.	在 src/content/navigation/answerIndexManager.ts 中，实现一个类/模块，提供概念上的接口（函数名你可以自己定，但要有这些功能）：
	•	初始化：
	•	接收：站点适配器、根 DOM（document）。
	•	构建一个内部数组 answers，每个元素包含：
	•	对应回答的 domNode: HTMLElement
	•	topOffset: number（可以通过 getBoundingClientRect + scroll offset 计算）
	•	按 topOffset 排序。
	•	提供方法：
	•	getTotalCount(): number
	•	getCurrentIndex(): number
	•	setCurrentIndex(index: number)（内部更新当前 index，防止越界）
	•	getNodeByIndex(index: number): HTMLElement | null
	•	根据当前滚动位置更新当前 index，例如 updateCurrentIndexByScroll(scrollY: number)。
	2.	在 content/index.ts 中使用该模块：
	•	初始化 AnswerIndexManager。
	•	监听页面滚动事件（节流/防抖处理可选），并调用 updateCurrentIndexByScroll。
	•	在控制台实时打印当前 index（方便调试）。

完成后：

在 ChatGPT 页面多滚动几下，确认控制台显示的当前回答索引能随滚动变化。
git add . && git commit -m "Add AnswerIndexManager for managing answer nodes and current index"

⸻

任务 5：实现悬浮导航 UI（NavigatorUI）

目标：
在页面右下角放一个悬浮操作面板，包含「上一条」「下一条」按钮和简单的 index 显示。

要求：
	1.	在 src/content/navigation/navigatorUI.ts 中：
	•	提供一个类/模块，用于：
	•	创建一个固定定位的浮层 div，放到 document.body。
	•	内含：
	•	「上一条」按钮
	•	「下一条」按钮
	•	当前 index + 1 / total 的文本区域
	•	支持更新当前 index / 总数的显示。
	•	提供事件回调接口：
	•	可注册 onPrev() / onNext() 回调，在按钮点击时调用。
	2.	样式要求（不必复杂）：
	•	固定在右下角，避免遮挡页面关键区域。
	•	有简单背景和圆角，保证在深色/浅色背景下都可见。
	•	避免影响页面原有布局（不改全局样式）。
	3.	在 src/content/index.ts 中：
	•	初始化 NavigatorUI，把 onPrev 和 onNext 绑定到：
	•	调用 AnswerIndexManager 计算目标 index。
	•	滚动到对应的回答（滚动逻辑可简化为 scrollIntoView，后面再封装）。
	•	更新 UI 的 total 值和当前 index。
	•	在滚动事件中，调用 UI 更新当前 index 显示。

完成后：

在 ChatGPT 对话页面检查：右下角应出现导航浮层，点击按钮能在回答之间切换并滚动。
git add . && git commit -m "Add NavigatorUI floating panel and integrate with AnswerIndexManager"

⸻

任务 6：实现滚动与高亮模块（Scroll & Highlight）

目标：
把「滚动」和「高亮当前回答」抽成独立模块，提升体验。

要求：
	1.	在 src/content/navigation/scrollAndHighlight.ts 中：
	•	提供函数/模块：
	•	scrollToAnswer(node: HTMLElement)：
	•	使用平滑滚动（如 scrollIntoView({ behavior: 'smooth', block: 'start' })）。
	•	预留顶部偏移逻辑（有顶栏时可用）。
	•	highlightAnswer(node: HTMLElement)：
	•	为当前回答添加高亮 class（例如 llm-answer-nav-highlight）。
	•	移除之前高亮的节点上的 class（需要在模块中缓存当前高亮节点）。
	•	高亮样式尽量轻量：比如边框、背景轻微变色即可。
	•	在模块内部注入一小段样式到 <head>，定义 .llm-answer-nav-highlight 的样式。
	2.	在 content/index.ts 导航逻辑中：
	•	使用 scrollToAnswer + highlightAnswer 替换之前的简单滚动逻辑。
	•	当用户滚动时，根据当前 index 自动更新高亮。

完成后：

在 ChatGPT 页面测试：点击上一条/下一条应平滑滚动到对应回答并高亮当前回答。
git add . && git commit -m "Add scroll and highlight module for current answer navigation"

⸻

任务 7：实现 Background 快捷键命令 & 与 Content Script 通信

目标：
通过 Chrome 扩展 commands 实现全局快捷键，触发上一条 / 下一条导航。

要求：
	1.	在 src/background/index.ts 中：
	•	监听 chrome.commands.onCommand。
	•	对不同命令（prev-answer / next-answer）：
	•	获取当前活动 tab。
	•	使用 chrome.tabs.sendMessage 向该 tab 发送消息，例如：
	•	{ type: 'LLM_NAV_PREV_ANSWER' }
	•	{ type: 'LLM_NAV_NEXT_ANSWER' }
	2.	在 src/content/index.ts 中：
	•	监听来自 background 的消息：
	•	收到 LLM_NAV_PREV_ANSWER 时，调用同样的导航逻辑（等价于点击 UI 的「上一条」按钮）。
	•	收到 LLM_NAV_NEXT_ANSWER 时，调用「下一条」逻辑。
	3.	确保：
	•	在 ChatGPT 页面按快捷键时，能触发导航。

完成后：

测试快捷键是否生效。
git add . && git commit -m "Wire up background commands to content script navigation via messaging"

⸻

任务 8：实现基础 Options 页面骨架（预留多站点配置能力）

目标：
实现一个简单的 Options 页面，用来展示和预留未来可配置项（例如：是否启用某些站点、滚动偏移、是否自动高亮等）。

要求：
	1.	在 src/options/index.html + index.ts 中：
	•	显示：
	•	插件名称和简单说明。
	•	一个开关（例如「是否在 ChatGPT 页面启用导航」）。
	•	使用 chrome.storage 存储配置。
	2.	在 content/index.ts 中：
	•	读取对应配置，如果用户关闭了该站点功能，则不初始化导航逻辑。
	3.	在 manifest.json 中：
	•	声明 options_page 或 chrome_url_overrides 相应配置。

完成后：

git add . && git commit -m "Add basic options page to toggle ChatGPT navigation feature"

⸻

任务 9：抽象多站点适配的结构（为未来扩展做准备）

目标：
让整个架构可以轻松扩展到更多 LLM 对话站点。

要求：
	1.	在 siteAdapters/index.ts 中：
	•	保持适配器列表为一个数组，当前只有 chatgptAdapter。
	•	写好类型定义和注释，让以后添加新站点只需：
	•	新建文件 xxxAdapter.ts。
	•	追加到适配器数组中。
	2.	在 AnswerIndexManager 中：
	•	不直接依赖「ChatGPT」字样，只依赖通用 findAllAnswers 接口。
	3.	在 README 或注释中：
	•	简要说明：如何添加一个新站点适配器（步骤说明即可）。

完成后：

git add . && git commit -m "Generalize site adapter system for future LLM sites"

⸻

任务 10：清理、补充 README、打最终包

目标：
整理项目，让它作为一个可用的 PoC 插件。

要求：
	1.	编写 README.md，内容包括：
	•	项目功能概述。
	•	安装 & 本地构建步骤。
	•	如何在 Chrome 中加载扩展。
	•	已支持站点（目前是 ChatGPT）。
	•	已实现功能：
	•	悬浮 UI 导航
	•	快捷键导航
	•	滚动 & 高亮
	•	已知限制和 TODO（例如：其它站点适配、更多样式配置等）。
	2.	清理：
	•	删除无用的日志（或者只保留关键调试日志）。
	•	保证 TypeScript 无明显报错。
	3.	打包 & 手动验证：
	•	npm run build
	•	在 Chrome 中重新加载扩展，对 ChatGPT 实际对话页面进行完整测试。

完成后：

git add . && git commit -m "Polish project, add README, finalize initial PoC"

⸻

四、验收标准（整体）
	•	在 ChatGPT 对话页面：
	•	右下角出现悬浮导航面板。
	•	显示当前回答序号 / 总回答数。
	•	点击「上一条」「下一条」可以在所有 AI 回答之间跳转，滚动到回答顶部并高亮该回答。
	•	使用定义的快捷键（如 Alt+↑ / Alt+↓）可以执行同样的导航。
	•	在插件 Options 页面可以关闭/开启 ChatGPT 导航功能。
	•	代码结构清晰，siteAdapters/AnswerIndexManager/NavigatorUI/scrollAndHighlight 等模块职责分明，方便后续扩展支持更多网站。

⸻

你可以把这一整段作为「项目说明 + 任务列表」直接丢给 Cursor，让它一步一步实现。
如果中间哪一步它做得不对，你再把那一小段任务复制给它重试即可。
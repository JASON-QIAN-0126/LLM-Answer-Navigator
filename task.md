下面是一份可以直接丢给 Cursor 的任务清单，目标是：
把原来的上一条/下一条翻页功能，升级成右侧纵向「时间线 + 圆点节点」导航，每个 node 代表一个用户 prompt，hover 显示 prompt 文本，点击跳到对应 AI 回答开头，并支持标记重点颜色。

你可以整份复制给 Cursor，当项目说明 + 分步任务。

⸻

项目增强：右侧「时间线节点」对话导航

总体目标

在现有 LLM 对话页面导航插件基础上，替换 UI：
	•	在页面右侧渲染一条 纵向时间线（细竖线），在线上按顺序绘制多个圆点节点。
	•	每个节点代表一条用户 prompt（问题），点击节点时：
	•	页面平滑滚动到对应 AI 回答块的开头。
	•	对应回答高亮。
	•	鼠标 hover 某节点时：
	•	展示该 prompt 的简要内容（tooltip 气泡）。
	•	节点支持「重点标记」：
	•	通过特定交互（建议：Alt+点击 或右键）把节点标为重点，颜色加深或变为另一种颜色。
	•	重点标记状态持久化到 chrome.storage，刷新后仍然保留。

⸻

任务 1：扩展站点适配器，获取「prompt + 回答」成对信息

目标：
目前适配器可能只返回 AI 回答节点。现在要让它能返回「用户 prompt + 对应回答」的成对结构，以便时间线节点展示 prompt 文本，但跳转到回答。

要求
	1.	在 siteAdapters 中定义新的类型，例如：

	•	每一项包含：
	•	promptNode: HTMLElement（用户问题所在 DOM）
	•	promptText: string
	•	answerNode: HTMLElement（对应 AI 回答根节点）
	•	id: string（对话内唯一 ID，可用索引 + 时间戳拼接）

	2.	在 chatgptAdapter 中新增一个方法（或者扩展现有接口）：

	•	类似：getPromptAnswerPairs(root: Document): PromptAnswerPair[]
	•	实现方式：
	•	顺着对话流 DOM，从上到下扫描消息。
	•	识别 role = user 的消息作为 prompt。
	•	找到它后面紧跟的 role = assistant 消息作为对应回答。
	•	用一条记录 { promptNode, promptText, answerNode } 保存。

	3.	在 siteAdapters/index.ts 中：

	•	暴露统一接口，供外部调用该方法获取 pairs。

	4.	在 content/index.ts 中临时测试：

	•	调用适配器的 getPromptAnswerPairs。
	•	在控制台打印：对话条数、若干条 promptText 预览（只截取前 50 字符）。

完成后 commit：
git commit -m "Feat: extend site adapter to expose prompt-answer pairs for ChatGPT"

⸻

任务 2：用 Prompt-Answer 对构建新的索引管理器

目标：
基于「prompt + answer pair」而不是单独回答，建立新的索引管理模块，后续时间线节点就用这个索引。

要求
	1.	在 navigation/answerIndexManager.ts 中：

	•	如果当前已经有 AnswerIndexManager，在不破坏旧功能的前提下：
	•	新增（或重构）一个基于 PromptAnswerPair 的索引结构。
	•	每一项至少包含：
	•	id
	•	promptText
	•	answerNode
	•	topOffset（以 answerNode 为基准）
	•	按 topOffset 排序。
	•	对外暴露接口（示例）：
	•	getItems(): PromptAnswerItem[]
	•	getTotalCount(): number
	•	getCurrentIndex(): number
	•	setCurrentIndex(index: number)
	•	getItemByIndex(index: number): PromptAnswerItem | null
	•	updateCurrentIndexByScroll(scrollY: number): void

	2.	滚动状态推断逻辑：

	•	当前 index 仍然以回答块的 topOffset 为基准计算，保持之前行为一致，只是挂在 pair 上。

	3.	在 content/index.ts 中：

	•	替换掉原先只用 AI 回答的索引初始化逻辑。
	•	使用 getPromptAnswerPairs 构建新 AnswerIndexManager。
	•	确保原先的上一条/下一条按钮（如果还保留）仍然可以工作。

完成后 commit：
git commit -m "Refactor: build AnswerIndexManager based on prompt-answer pairs"

⸻

任务 3：设计并实现右侧时间线 UI 组件骨架

目标：
实现一个新的 UI 组件 RightSideTimelineNavigator，挂在页面右侧，暂时只画竖线和若干占位圆点。

要求
	1.	在 navigation/ 下新增文件，例如：rightSideTimelineNavigator.ts。
	2.	组件职责：

	•	创建挂载容器：
	•	固定在页面右侧中间，纵向居中，占用较窄宽度（例如 40px 左右）。
	•	高度撑满视口（100vh）。
	•	在容器内部：
	•	渲染一条纵向竖线（可用 ::before 或一个 div）。
	•	渲染多个圆点节点，位置先简单 均匀分布（后面再按 scroll 位置信息调整）。

	3.	对外接口（示例）：

	•	init(items: PromptAnswerItem[]): 接受所有条目，创建对应节点。
	•	updateActiveIndex(index: number): 根据当前 index 更新 active 样式。
	•	onNodeClick(callback: (itemIndex: number) => void): 注册点击事件回调。
	•	以后还要加 hover 和标记逻辑，所以结构上要有扩展性。

	4.	样式要求（先简洁版）：

	•	默认状态：
	•	竖线颜色偏浅（灰色）。
	•	圆点：小圆形，默认灰色填充或边框。
	•	当前 active 节点：
	•	颜色更亮或尺寸稍大。
	•	注意不要盖住页面右侧原有重要交互（适当设置 z-index 和位置）。

	5.	将 RightSideTimelineNavigator 在 content/index.ts 中初始化：

	•	调用 init() 时传入从 AnswerIndexManager 获取的 items。
	•	临时在点击节点时，在控制台打印 index，验证绑定事件无误。

完成后 commit：
git commit -m "Feat: add right-side timeline navigator UI with basic node rendering"

⸻

任务 4：节点位置与滚动位置映射

目标：
让右侧时间线节点在纵向位置上大致反映在文档中的位置，而不是均匀分布。

要求
	1.	为每个 PromptAnswerItem 计算一个 relativePosition：

	•	示例：relativePosition = topOffset / documentHeight（0~1 之间）。
	•	documentHeight 可以用 document.documentElement.scrollHeight。

	2.	在 RightSideTimelineNavigator 中：

	•	根据 relativePosition 将每个节点的 top 设置为容器高度的相应比例（例如 top: relativePosition * 100%）。
	•	保证首尾不会完全贴边，可以设置一点 padding（如 5% ~ 95%）。

	3.	监听窗口 resize 时：

	•	当视口高度或内容高度变化时，重新计算节点位置（可在 AnswerIndexManager 中提供刷新接口，或在 Timeline 中重新拉取 relativePosition）。

	4.	验证：

	•	滚动页面时，观察节点竖线上的分布与实际页面内容位置大致对应。

完成后 commit：
git commit -m "Feat: map timeline node positions to document scroll positions"

⸻

任务 5：点击节点时滚动到回答并高亮

目标：
将时间线节点点击行为与已有 scrollAndHighlight 模块连接起来。

要求
	1.	在 content/index.ts 中：

	•	为 RightSideTimelineNavigator 注册 onNodeClick 回调：
	•	根据 index 调用 AnswerIndexManager.getItemByIndex。
	•	使用 scrollAndHighlight.scrollToAnswer(item.answerNode)。
	•	使用 scrollAndHighlight.highlightAnswer(item.answerNode)。
	•	同时更新当前 index，调用 timeline.updateActiveIndex(index)。

	2.	当用户手动滚动页面时：

	•	按现有逻辑使用 updateCurrentIndexByScroll 算出当前 index。
	•	调用 timeline.updateActiveIndex(index)，保证：
	•	当前可见回答对应的节点处于 active 样式。

	3.	确保：

	•	点击节点后，如果滚动动画结束，active 状态正确同步；
	•	快捷键导航（如果仍保留）引起的滚动，也会更新 timeline active 状态。

完成后 commit：
git commit -m "Feat: connect timeline node click with scroll and highlight behavior"

⸻

任务 6：节点 hover 显示 prompt 内容（tooltip）

目标：
鼠标悬浮在某个节点上时，显示对应的用户 prompt 文本（简要版）。

要求
	1.	在 RightSideTimelineNavigator 中：

	•	为每个节点元素：
	•	绑定 mouseenter / mouseleave 事件。
	•	在容器内或 body 上创建一个 tooltip 元素，例如：
	•	内容为 item.promptText 的前 N 个字符（比如 80 字），若超出则添加 ...。
	•	tooltip 在节点附近显示（右侧或左侧小浮层）。

	2.	样式要求：

	•	tooltip 有背景色、圆角、阴影，字体尺寸略小。
	•	注意不要超出视口；接近顶部/底部时可微调位置。

	3.	逻辑细节：

	•	鼠标离开节点时隐藏 tooltip。
	•	快速在多个节点间移动时，tooltip 应跟随更新，不要闪烁。

完成后 commit：
git commit -m "Feat: add hover tooltip to timeline nodes showing prompt preview"

⸻


任务 8：与旧的悬浮按钮导航替换

目标：
去除旧的右下角悬浮上一条/下一条按钮



完成后 commit：
⸻

任务 9：优化、清理与文档更新

目标：
整理所有改动，保证体验流畅、代码清晰。

要求
	1.	体验检查：

	•	在 ChatGPT 页面实际对话：
	•	对话多条 prompt 时，右侧时间线节点数与对话条数一致。
	•	hover 看到正确的 prompt 内容。
	•	点击节点会滚到对应回答开头，并高亮。
	•	滚动页面时，active 节点跟随变化。
	•	节点重点标记功能正常，刷新页面后仍保留。

	2.	性能 & 稳定性：

	•	确保 MutationObserver（如果有）不会导致重复添加节点。
	•	对非常长的对话不会有明显卡顿（简单检查即可）。

	3.	代码整理：

	•	删除或注释掉不再使用的调试日志。
	•	给关键模块（特别是 RightSideTimelineNavigator 和 AnswerIndexManager）补充注释，解释设计意图。

	4.	更新 README：

	•	加一节「右侧时间线导航」说明：
	•	节点含义。
	•	hover / 点击 / 标记行为说明。
	•	如何在设置中开启/关闭。

完成后 commit：
git commit -m "Polish: refine timeline navigator UX, clean up code and update docs"

⸻

把这份任务清单整段交给 Cursor，让它按任务 0 → 9 的顺序执行即可。
中途如果有哪一步做得不符合预期，你可以把对应任务段单独拎出来，再发给它重做或修改。
# LLM Chat Prompt Navigator - 代码清理和优化 TODO

## 🔥 严重问题 (P0 - 必须修复)

### 性能优化
- [ ] **优化 MutationObserver 监听范围**
  - 文件: `src/content/index.ts:376-379`
  - 问题: 监听整个 document.body 的所有变化
  - 建议: 限制监听特定的对话容器，使用更精确的选择器
  - 预计影响: 减少 30-50% 的DOM事件处理开销

- [ ] **修复 ResizeObserver 潜在的无限循环**
  - 文件: `src/content/navigation/rightSideTimelineNavigator.ts:40-43`
  - 问题: 观察自身容器可能触发循环
  - 建议: 在 updateNodePositions 中添加标志位防止递归触发

- [ ] **优化滚动性能**
  - 文件: `src/content/index.ts:134-144`
  - 问题: 滚动事件中频繁执行 getBoundingClientRect()
  - 建议: 
    1. 使用 IntersectionObserver 替代手动计算
    2. 缓存位置信息，仅在必要时重新计算

### Bug修复
- [ ] **修复 init() 函数的竞态条件**
  - 文件: `src/content/index.ts:233-394`
  - 问题: 多个并发的URL变化可能导致重复初始化
  - 建议: 使用 Promise 队列或互斥锁机制

- [ ] **添加事件监听器清理逻辑**
  - 文件: `src/content/index.ts:311, 314`
  - 问题: scroll 和 resize 监听器未在 destroy 时移除
  - 建议: 在 clearUI() 中添加 removeEventListener

## 🧹 代码清理 (P1 - 推荐完成)

### Console.log 清理
- [ ] **移除开发调试日志**
  - [ ] `src/background/index.ts` - 移除第 2, 6 行
  - [ ] `src/popup/index.ts` - 移除第 2 行
  - [ ] `src/options/index.ts` - 移除第 2, 46, 144 行
  - [ ] `src/content/index.ts` - 移除约 30 处调试日志
  - [ ] `src/content/navigation/answerIndexManager.ts` - 移除第 215 行
  - [ ] `src/content/navigation/navigatorUI.ts` - 移除第 260, 262, 302, 365, 370 行
  - [ ] `src/content/navigation/rightSideTimelineNavigator.ts` - 移除第 60, 81, 308, 445, 565, 568 行
  - [ ] `src/content/navigation/scrollAndHighlight.ts` - 移除第 93, 97, 122, 136 行
  - [ ] `src/content/siteAdapters/chatgptAdapter.ts` - 移除第 118, 120, 192, 227 行
  - [ ] `src/content/siteAdapters/claudeAdapter.ts` - 移除第 48 行
  - [ ] `src/content/siteAdapters/geminiAdapter.ts` - 移除第 37 行
  - [ ] `src/content/siteAdapters/index.ts` - 移除第 98 行

- [ ] **保留但优化错误日志**
  - [ ] 为 console.error 和 console.warn 添加环境判断
  - [ ] 建议：添加 isDevelopment 环境变量控制日志输出

### 废弃代码移除
- [ ] **移除已废弃的 findAllAnswers 方法**
  - [ ] `src/content/siteAdapters/chatgptAdapter.ts:32-133`
  - [ ] 更新 SiteAdapter 接口，移除 @deprecated 标记
  - [ ] 确认所有调用已迁移到 getPromptAnswerPairs

- [ ] **移除或重构 NavigatorUI.ts**
  - 文件: `src/content/navigation/navigatorUI.ts` (整个文件 382 行)
  - 问题: 代码注释显示已被 RightSideTimelineNavigator 替代
  - 建议: 
    1. 如完全不使用，删除整个文件
    2. 如作为备用方案，添加说明文档

- [ ] **补充 Claude 和 Gemini Adapter 的实现**
  - [ ] `src/content/siteAdapters/claudeAdapter.ts` - 缺少 findAllAnswers 实现
  - [ ] `src/content/siteAdapters/geminiAdapter.ts` - 缺少 findAllAnswers 实现
  - 建议: 如果不再需要，从接口中移除该方法

## 🔧 代码优化 (P2 - 可选优化)

### 性能优化
- [ ] **实现虚拟滚动优化时间线节点**
  - 文件: `src/content/navigation/rightSideTimelineNavigator.ts`
  - 当对话数量 > 100 时，只渲染可见区域的节点

- [ ] **延迟加载主题配置**
  - 文件: `src/content/navigation/themes.ts`
  - 避免在初始化时同步加载

- [ ] **优化 DOM 查询**
  - 在 adapter 中缓存常用选择器结果
  - 减少 querySelectorAll 调用次数

### 代码质量
- [ ] **添加类型安全检查**
  - 为所有 as HTMLElement 断言添加运行时检查
  - 添加更严格的 TypeScript 配置

- [ ] **提取魔法数字为常量**
  - 例如: 100ms (debounce), 1000ms (timeout), 80vh (height) 等
  - 集中管理在配置文件中

- [ ] **统一错误处理机制**
  - 创建统一的错误处理工具函数
  - 添加错误上报机制（可选）

## 📋 测试和验证

- [ ] **性能测试**
  - [ ] 测试包含 100+ 条对话的长会话性能
  - [ ] 测试快速滚动时的帧率
  - [ ] 测试内存泄漏（长时间使用和频繁切换对话）

- [ ] **功能测试**
  - [ ] 验证所有 console.log 移除后功能正常
  - [ ] 测试多个标签页同时使用的场景
  - [ ] 测试快速切换对话的稳定性

- [ ] **兼容性测试**
  - [ ] ChatGPT 网站更新后的兼容性
  - [ ] Claude 和 Gemini 的适配器验证

## 📝 文档更新

- [ ] 更新 README 说明性能优化内容
- [ ] 添加开发者调试指南
- [ ] 补充 Adapter 开发文档

---

## 优先级说明
- **P0**: 严重影响性能或功能的问题，必须尽快修复
- **P1**: 影响代码质量和维护性，强烈建议完成
- **P2**: 锦上添花的优化，可根据时间安排

## 预计工作量
- P0 问题: 约 4-6 小时
- P1 清理: 约 2-3 小时
- P2 优化: 约 6-8 小时

总计: **12-17 小时**


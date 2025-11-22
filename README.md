# 🧭 LLM Answer Navigator

[English](./README_EN.md) | 简体中文

一个 Chrome 浏览器扩展，用于在大语言模型对话页面中快速导航 AI 回答。

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Version](https://img.shields.io/badge/version-1.2.0-orange)

## ✨ 功能特性

### 🎯 右侧时间线导航（v1.2.0 新增）

- **📍 气泡式均匀分布**：节点根据数量在时间线上均匀分布，新节点加入时旧节点自动上浮
- **💬 智能预览**：鼠标悬浮节点显示问题内容预览（tooltip，最多 80 字符）
- **🖱️ 点击跳转**：点击节点跳转到对应的用户提问位置并高亮
- **🟢 实时跟随**：
  - 使用快捷键导航时，时间线节点自动同步高亮
  - 手动滚动页面时，时间线自动检测并高亮当前查看的对话
- **🆕 动态更新**：在对话中发送新提问时，时间线自动添加新节点
- **👁️ 显示/隐藏**：按 `Alt + D` (Mac: `Option + D`) 切换时间线显示

### ⌨️ 键盘快捷键

- **Windows/Linux**: 
  - `Alt + ↑` / `Alt + ↓` - 上/下一个对话
  - `Alt + D` - 显示/隐藏时间线
- **Mac**: 
  - `Option (⌥) + ↑` / `Option (⌥) + ↓` - 上/下一个对话
  - `Option (⌥) + D` - 显示/隐藏时间线

### 🎨 其他特性

- 🎯 **智能识别**：自动识别页面上所有用户问题和 AI 回答配对
- 🔄 **快速导航**：通过时间线节点或快捷键在对话间跳转
- 💡 **视觉高亮**：跳转时自动高亮当前回答
- ⚙️ **可配置**：通过设置页面自定义功能

## 🌐 支持的网站

- ✅ **ChatGPT** (chatgpt.com, chat.openai.com)
- 📋 更多站点正在开发中...

## 📦 安装方法

### 方法一：从源码安装（推荐开发者）

1. **克隆仓库**
   ```bash
   git clone https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator.git
   cd LLM-Answer-Navigator
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建扩展**
   ```bash
   npm run build
   ```

4. **加载到 Chrome**
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 启用右上角的「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择项目中的 `dist` 目录

### 方法二：直接安装（即将推出）

Chrome Web Store 版本正在审核中...

## 🎮 使用方法

### 基本使用

1. **访问支持的网站**（如 ChatGPT）
2. **查看时间线**：页面右侧会出现纵向时间线，每个圆点代表一个对话
3. **开始导航**：
   - **鼠标悬浮节点**：显示问题内容预览
   - **点击节点**：页面自动滚动到对应的用户提问并高亮
   - **使用快捷键**：`Option/Alt + ↑/↓` 上/下一个对话
4. **当前位置指示**：正在查看的对话节点会以绿色高亮显示并放大

### 时间线特点

- **气泡布局**：节点在时间线上均匀分布，新消息在底部，旧消息自动上浮
- **智能跟随**：手动滚动页面时，时间线会自动更新当前激活的节点
- **快速预览**：鼠标悬浮在节点上即可看到问题内容（最多 80 字符）
- **动态更新**：发送新提问时，时间线自动添加新节点并选中
- **显示/隐藏**：按 `Alt + D` (Mac: `Option + D`) 切换时间线显示

## ⚙️ 配置选项

1. 点击扩展图标旁的菜单 → 「选项」
2. 或右键点击扩展图标 → 「选项」
3. 在设置页面可以：
   - **站点开关**：开启/关闭特定站点的导航功能
   - **快捷键说明**：查看所有可用快捷键

💡 **自定义快捷键**：访问 `chrome://extensions/shortcuts/` 可以修改快捷键

## 🛠️ 开发

### 项目结构

```
llm-answer-navigator/
├── src/
│   ├── background/          # Background Service Worker
│   │   └── index.ts
│   ├── content/             # Content Scripts
│   │   ├── index.ts
│   │   ├── siteAdapters/    # 站点适配器
│   │   │   ├── index.ts
│   │   │   └── chatgptAdapter.ts
│   │   └── navigation/      # 导航功能模块
│   │       ├── answerIndexManager.ts
│   │       ├── rightSideTimelineNavigator.ts
│   │       ├── scrollAndHighlight.ts
│   │       └── themes.ts
│   ├── options/             # 设置页面
│   │   ├── index.html
│   │   └── index.ts
│   ├── popup/               # 弹出窗口
│   │   ├── index.html
│   │   └── index.ts
│   └── manifest.json        # 扩展清单
├── dist/                    # 构建输出目录
├── build.js                 # 构建脚本
├── package.json
├── tsconfig.json
├── README.md                # 中文文档
├── README_EN.md             # 英文文档
└── CHANGELOG.md             # 更新日志
```

### 开发命令

```bash
# 安装依赖
npm install

# 开发构建（监听文件变化）
npm run dev

# 生产构建
npm run build
```

### 添加新站点支持

如果你想为其他 LLM 网站添加支持，可以创建新的站点适配器：

1. 在 `src/content/siteAdapters/` 目录下创建新的适配器文件
2. 实现 `SiteAdapter` 接口
3. 在 `src/content/siteAdapters/index.ts` 中注册新适配器

详细步骤请参考现有的 `chatgptAdapter.ts` 实现。

## 🏗️ 技术栈

- **语言**：TypeScript 5.3
- **打包工具**：esbuild
- **扩展规范**：Chrome Extension Manifest V3
- **API**：
  - Chrome Extension APIs (tabs, scripting, storage, commands)
  - DOM APIs
  - MutationObserver & ResizeObserver

## 📋 架构设计

### 核心模块

1. **Background Service Worker**
   - 监听快捷键命令
   - 转发消息到 Content Script

2. **Content Script**
   - 页面检测和适配器选择
   - 对话节点索引管理
   - 时间线 UI 渲染和交互
   - 滚动和高亮效果

3. **站点适配器（Site Adapters）**
   - 识别特定站点
   - 提取用户提问和 AI 回答配对
   - 可扩展架构，易于添加新站点

4. **导航模块**
   - `AnswerIndexManager`：管理对话节点和当前索引
   - `RightSideTimelineNavigator`：时间线导航 UI
   - `scrollAndHighlight`：滚动和高亮效果

### 技术亮点

- **Prompt-Answer 配对系统**：智能识别用户提问和 AI 回答的对应关系
- **气泡布局算法**：节点均匀分布，支持动态添加
- **实时滚动同步**：基于视口中线的精准位置检测
- **事件捕获机制**：解决 SPA 页面内部滚动监听问题

## 🔧 已知限制

- 仅支持 ChatGPT 网站
- 快捷键在某些情况下可能与浏览器快捷键冲突

## 🗺️ 路线图

### v1.3.0（计划中）
- [ ] 支持 Claude (claude.ai)
- [ ] 支持 Gemini (gemini.google.com)
- [ ] 节点右键菜单（复制、书签等）
- [ ] 时间线主题自定义

### 未来版本
- [ ] 支持更多 LLM 站点（Copilot, Perplexity 等）
- [ ] 对话书签和标注功能
- [ ] 导出对话功能
- [ ] 搜索和过滤功能

## 🤝 贡献

欢迎贡献！如果你想：
- 🐛 报告 bug
- 💡 建议新功能
- 🌐 添加新站点支持
- 🔧 改进代码

请提交 Issue 或 Pull Request。

### 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📮 反馈与支持

如有问题或建议，欢迎通过以下方式联系：
- 💬 提交 [GitHub Issue](https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator/issues)
- ⭐ 如果这个项目对你有帮助，欢迎给个 Star！

## 📊 版本历史

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本更新历史。

### 最新版本：v1.2.0

**主要更新**：
- 🎉 全新右侧时间线导航 UI
- 🔄 支持新对话动态添加
- 📍 智能滚动跟随
- 🐛 修复多个已知问题

---

**开发者**: [@JASON-QIAN-0126](https://github.com/JASON-QIAN-0126)

**项目地址**: [https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator](https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator)

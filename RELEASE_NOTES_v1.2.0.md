# 🎉 LLM Answer Navigator v1.2.0 发布说明

[English Version](#english-version) | [中文版本](#中文版本)

---

## 中文版本

### 🚀 重大更新

#### 全新右侧时间线导航
- **气泡式布局**：节点在时间线上均匀分布，新节点在底部，旧节点自动上浮
- **智能预览**：鼠标悬浮节点显示问题内容（最多 80 字符）
- **点击跳转**：点击节点直接跳转到对应的用户提问位置
- **实时同步**：
  - 使用快捷键导航时，时间线自动高亮对应节点
  - 手动滚动页面时，时间线自动检测并高亮当前查看的对话
- **动态更新**：发送新提问时，时间线自动添加新节点

### 🔧 架构优化

- **Prompt-Answer 配对系统**：重构数据结构，以用户提问为核心
- **移除旧 UI**：移除右下角悬浮按钮，文件大小从 42.5KB 降至 33.5KB
- **性能优化**：使用事件捕获和防抖机制，提升响应速度

### 🐛 问题修复

1. **滚动监听修复**
   - 使用事件捕获模式监听滚动
   - 解决 ChatGPT 内部容器滚动无法检测的问题

2. **点击跳转优化**
   - 引入锁机制，防止点击时的自动滚动干扰
   - 解决"点击第 2 个却高亮最后一个"的 Bug

3. **切换对话优化**
   - 切换对话时立即清理旧节点
   - 避免视觉残留

4. **初始化时机优化**
   - 修复首次进入对话不显示节点的问题
   - 增加延迟初始化和重试机制

### 📚 文档更新

- ✅ 添加中英文 README 支持
- ✅ 详细的 CHANGELOG
- ✅ 完善的使用说明

### ⌨️ 快捷键

- **Mac**: `Option (⌥) + ↑/↓` 上/下一个对话，`Option (⌥) + D` 显示/隐藏
- **Windows/Linux**: `Alt + ↑/↓` 上/下一个对话，`Alt + D` 显示/隐藏

### 🌐 支持的网站

- ✅ ChatGPT (chatgpt.com, chat.openai.com)

### 📦 安装方法

```bash
git clone https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator.git
cd LLM-Answer-Navigator
npm install
npm run build
# 然后在 chrome://extensions/ 加载 dist 目录
```

### 🔮 下一步计划 (v1.3.0)

- [ ] 支持 Claude (claude.ai)
- [ ] 支持 Gemini (gemini.google.com)
- [ ] 节点右键菜单
- [ ] 时间线主题自定义

---

## English Version

### 🚀 Major Updates

#### Brand New Right-Side Timeline Navigation
- **Bubble Layout**: Nodes are evenly distributed on the timeline, new nodes at the bottom, old nodes automatically float up
- **Smart Preview**: Hover over nodes to see question content (up to 80 characters)
- **Click to Jump**: Click nodes to jump directly to the corresponding user prompt
- **Real-time Sync**:
  - Timeline automatically highlights corresponding nodes when using keyboard shortcuts
  - Timeline automatically detects and highlights current conversation when manually scrolling
- **Dynamic Updates**: Timeline automatically adds new nodes when sending new questions

### 🔧 Architecture Improvements

- **Prompt-Answer Pairing System**: Refactored data structure, centered around user prompts
- **Removed Old UI**: Removed bottom-right floating buttons, file size reduced from 42.5KB to 33.5KB
- **Performance Optimization**: Using event capture and debounce mechanisms for better responsiveness

### 🐛 Bug Fixes

1. **Scroll Listening Fix**
   - Using event capture mode for scroll listening
   - Solved the issue of ChatGPT internal container scroll not being detected

2. **Click Navigation Optimization**
   - Introduced lock mechanism to prevent auto-scroll interference during clicks
   - Fixed the bug where "clicking node 2 highlights the last one"

3. **Conversation Switch Optimization**
   - Immediately clear old nodes when switching conversations
   - Avoid visual residue

4. **Initialization Timing Optimization**
   - Fixed the issue of nodes not showing on first conversation entry
   - Added delayed initialization and retry mechanism

### 📚 Documentation Updates

- ✅ Added bilingual README support (Chinese & English)
- ✅ Detailed CHANGELOG
- ✅ Comprehensive usage instructions

### ⌨️ Keyboard Shortcuts

- **Mac**: `Option (⌥) + ↑/↓` Previous/Next, `Option (⌥) + D` Show/Hide
- **Windows/Linux**: `Alt + ↑/↓` Previous/Next, `Alt + D` Show/Hide

### 🌐 Supported Websites

- ✅ ChatGPT (chatgpt.com, chat.openai.com)

### 📦 Installation

```bash
git clone https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator.git
cd LLM-Answer-Navigator
npm install
npm run build
# Then load the dist directory in chrome://extensions/
```

### 🔮 Next Steps (v1.3.0)

- [ ] Support Claude (claude.ai)
- [ ] Support Gemini (gemini.google.com)
- [ ] Node right-click menu
- [ ] Timeline theme customization

---

## 📊 Statistics

- **Total Commits**: 50+
- **Files Changed**: 15
- **Lines Added**: 1,667
- **Lines Removed**: 395
- **File Size**: 33.5KB (optimized from 42.5KB)

## 🙏 Acknowledgments

Thanks to all contributors and users who provided feedback!

## 📮 Feedback

- GitHub Issues: [https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator/issues](https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator/issues)
- Give us a ⭐ if you like this project!

---

**Developer**: [@JASON-QIAN-0126](https://github.com/JASON-QIAN-0126)

**Release Date**: November 22, 2024

**License**: MIT


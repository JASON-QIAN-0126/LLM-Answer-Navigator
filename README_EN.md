# 🧭 LLM Answer Navigator

English | [简体中文](./README.md)

A Chrome browser extension for quick navigation through AI responses in Large Language Model conversation pages.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Version](https://img.shields.io/badge/version-1.2.0-orange)

## ✨ Features

### 🎯 Right-Side Timeline Navigation (New in v1.2.0)

- **📍 Bubble Layout**: Nodes are evenly distributed on the timeline, with new nodes appearing at the bottom and old nodes automatically floating up
- **💬 Smart Preview**: Hover over nodes to see question content preview (tooltip, up to 80 characters)
- **🖱️ Click to Jump**: Click nodes to jump to the corresponding user prompt and highlight it
- **🟢 Real-time Sync**:
  - Timeline nodes automatically sync and highlight when using keyboard shortcuts
  - Timeline automatically detects and highlights the current conversation when manually scrolling
- **🆕 Dynamic Updates**: Timeline automatically adds new nodes when sending new questions in a conversation
- **👁️ Show/Hide**: Press `Alt + D` (Mac: `Option + D`) to toggle timeline visibility

### ⌨️ Keyboard Shortcuts

- **Windows/Linux**: 
  - `Alt + ↑` / `Alt + ↓` - Previous/Next conversation
  - `Alt + D` - Show/Hide timeline
- **Mac**: 
  - `Option (⌥) + ↑` / `Option (⌥) + ↓` - Previous/Next conversation
  - `Option (⌥) + D` - Show/Hide timeline

### 🎨 Other Features

- 🎯 **Smart Recognition**: Automatically identifies all user questions and AI answer pairs on the page
- 🔄 **Quick Navigation**: Navigate between conversations via timeline nodes or keyboard shortcuts
- 💡 **Visual Highlighting**: Automatically highlights current answer when jumping
- ⚙️ **Configurable**: Customize features through the settings page

## 🌐 Supported Websites

- ✅ **ChatGPT** (chatgpt.com, chat.openai.com)
- 📋 More sites coming soon...

## 📦 Installation

### Method 1: Install from Source (Recommended for Developers)

1. **Clone the repository**
   ```bash
   git clone https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator.git
   cd LLM-Answer-Navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load into Chrome**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked"
   - Select the `dist` directory in the project

### Method 2: Direct Installation (Coming Soon)

Chrome Web Store version is under review...

## 🎮 Usage

### Basic Usage

1. **Visit a supported website** (e.g., ChatGPT)
2. **View the timeline**: A vertical timeline will appear on the right side of the page, with each dot representing a conversation
3. **Start navigating**:
   - **Hover over nodes**: Display question content preview
   - **Click nodes**: Page automatically scrolls to the corresponding user prompt and highlights it
   - **Use keyboard shortcuts**: `Option/Alt + ↑/↓` for previous/next conversation
4. **Current position indicator**: The conversation node you're currently viewing will be highlighted in green and enlarged

### Timeline Features

- **Bubble Layout**: Nodes are evenly distributed on the timeline, with new messages at the bottom and old messages automatically floating up
- **Smart Following**: Timeline automatically updates the active node when manually scrolling the page
- **Quick Preview**: Hover over nodes to see question content (up to 80 characters)
- **Dynamic Updates**: Timeline automatically adds new nodes and selects them when sending new questions
- **Show/Hide**: Press `Alt + D` (Mac: `Option + D`) to toggle timeline visibility

## ⚙️ Configuration

1. Click the menu next to the extension icon → "Options"
2. Or right-click the extension icon → "Options"
3. On the settings page, you can:
   - **Site Toggle**: Enable/disable navigation features for specific sites
   - **Keyboard Shortcuts**: View all available keyboard shortcuts

💡 **Custom Shortcuts**: Visit `chrome://extensions/shortcuts/` to modify keyboard shortcuts

## 🛠️ Development

### Project Structure

```
llm-answer-navigator/
├── src/
│   ├── background/          # Background Service Worker
│   │   └── index.ts
│   ├── content/             # Content Scripts
│   │   ├── index.ts
│   │   ├── siteAdapters/    # Site Adapters
│   │   │   ├── index.ts
│   │   │   └── chatgptAdapter.ts
│   │   └── navigation/      # Navigation Modules
│   │       ├── answerIndexManager.ts
│   │       ├── rightSideTimelineNavigator.ts
│   │       ├── scrollAndHighlight.ts
│   │       └── themes.ts
│   ├── options/             # Options Page
│   │   ├── index.html
│   │   └── index.ts
│   ├── popup/               # Popup Window
│   │   ├── index.html
│   │   └── index.ts
│   └── manifest.json        # Extension Manifest
├── dist/                    # Build Output Directory
├── build.js                 # Build Script
├── package.json
├── tsconfig.json
├── README.md                # Chinese Documentation
├── README_EN.md             # English Documentation
└── CHANGELOG.md             # Changelog
```

### Development Commands

```bash
# Install dependencies
npm install

# Development build (watch mode)
npm run dev

# Production build
npm run build
```

### Adding New Site Support

If you want to add support for other LLM websites, you can create a new site adapter:

1. Create a new adapter file in the `src/content/siteAdapters/` directory
2. Implement the `SiteAdapter` interface
3. Register the new adapter in `src/content/siteAdapters/index.ts`

For detailed steps, refer to the existing `chatgptAdapter.ts` implementation.

## 🏗️ Tech Stack

- **Language**: TypeScript 5.3
- **Build Tool**: esbuild
- **Extension Spec**: Chrome Extension Manifest V3
- **APIs**:
  - Chrome Extension APIs (tabs, scripting, storage, commands)
  - DOM APIs
  - MutationObserver & ResizeObserver

## 📋 Architecture

### Core Modules

1. **Background Service Worker**
   - Listen for keyboard shortcut commands
   - Forward messages to Content Script

2. **Content Script**
   - Page detection and adapter selection
   - Conversation node index management
   - Timeline UI rendering and interaction
   - Scroll and highlight effects

3. **Site Adapters**
   - Identify specific sites
   - Extract user question and AI answer pairs
   - Extensible architecture, easy to add new sites

4. **Navigation Modules**
   - `AnswerIndexManager`: Manage conversation nodes and current index
   - `RightSideTimelineNavigator`: Timeline navigation UI
   - `scrollAndHighlight`: Scroll and highlight effects

### Technical Highlights

- **Prompt-Answer Pairing System**: Intelligently identifies the correspondence between user questions and AI answers
- **Bubble Layout Algorithm**: Nodes are evenly distributed, supporting dynamic addition
- **Real-time Scroll Sync**: Precise position detection based on viewport centerline
- **Event Capture Mechanism**: Solves internal scroll listening issues in SPA pages

## 🔧 Known Limitations

- Only supports ChatGPT website
- Keyboard shortcuts may conflict with browser shortcuts in some cases

## 🗺️ Roadmap

### v1.3.0 (Planned)
- [ ] Support Claude (claude.ai)
- [ ] Support Gemini (gemini.google.com)
- [ ] Node right-click menu (copy, bookmark, etc.)
- [ ] Timeline theme customization

### Future Versions
- [ ] Support more LLM sites (Copilot, Perplexity, etc.)
- [ ] Conversation bookmarks and annotations
- [ ] Export conversation feature
- [ ] Search and filter functionality

## 🤝 Contributing

Contributions are welcome! If you want to:
- 🐛 Report bugs
- 💡 Suggest new features
- 🌐 Add new site support
- 🔧 Improve code

Please submit an Issue or Pull Request.

### Contribution Guidelines

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 📮 Feedback & Support

If you have any questions or suggestions, feel free to contact us:
- 💬 Submit a [GitHub Issue](https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator/issues)
- ⭐ If this project helps you, please give it a Star!

## 📊 Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version update history.

### Latest Version: v1.2.0

**Major Updates**:
- 🎉 Brand new right-side timeline navigation UI
- 🔄 Support for dynamic addition of new conversations
- 📍 Smart scroll following
- 🐛 Fixed multiple known issues

---

**Developer**: [@JASON-QIAN-0126](https://github.com/JASON-QIAN-0126)

**Project URL**: [https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator](https://github.com/JASON-QIAN-0126/LLM-Answer-Navigator)


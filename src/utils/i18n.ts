export type Language = 'zh-CN' | 'en' | 'auto';

export const messages = {
  'zh-CN': {
    // Options Page
    'options.title': '设置 - Ai Chat Quick Navigator',
    'options.header.title': 'Ai Chat Quick Navigator',
    'options.header.subtitle': '在与AI对话页面中快速导航',
    'options.general': '通用设置',
    'options.language': '语言 / Language',
    'options.language.desc': '选择界面语言',
    'options.theme': '主题设置',
    'options.theme.ui': '界面主题',
    'options.theme.desc': '选择导航面板的颜色主题',
    'options.theme.auto': '跟随系统',
    'options.theme.light': '浅色',
    'options.theme.dark': '深色',
    'options.theme.blue': '天蓝',
    'options.theme.lavender': '薰衣草紫',
    'options.theme.pink': '粉红色',
    'options.theme.orange': '橘黄色',
    'options.sites': '站点支持',
    'options.sites.custom': '自定义站点（测试中）',
    'options.sites.custom.desc': '添加其他 LLM 网站（默认使用通用适配逻辑）',
    'options.sites.custom.placeholder': '输入域名，如: chat.example.com',
    'options.sites.custom.add': '添加',
    'options.sites.custom.delete': '删除',
    'options.shortcuts': '快捷键',
    'options.shortcuts.nav': '导航快捷键',
    'options.shortcuts.nav.desc': 'Mac: Option (⌥) + W/S | Win: Alt + W/S',
    'options.shortcuts.mark': '标记当前对话',
    'options.shortcuts.mark.desc': 'Mac: Option (⌥) + A | Win: Alt + A',
    'options.shortcuts.toggle': '显示/隐藏面板',
    'options.shortcuts.toggle.desc': 'Mac: Option (⌥) + D | Win: Alt + D',
    'options.shortcuts.custom.hint': '💡 想要自定义快捷键？访问',
    'options.save.success': '✓ 设置已保存',
    'options.domain.invalid': '请输入有效的域名',
    'options.domain.exists': '该域名已存在',

    // Popup Page
    'popup.title': 'Ai Chat Quick Navigator',
    'popup.desc': '在对话页面中快速导航 AI 回答',
    'popup.shortcuts': '快捷键 (Shortcuts)',
    'popup.switch': '↕️ 切换回答',
    'popup.mark': '📌 标记/取消',
    'popup.toggle': '👁️ 显示/隐藏',
    'popup.hint.theme': '右键点击插件图标 -> 选项，可自定义主题颜色和开启其他站点支持。',
    'popup.hint.shortcuts': '快捷键访问',
    'popup.hint.modify': '修改。',
    'popup.feedback': '任何意见想法，欢迎访问'
  },
  'en': {
    // Options Page
    'options.title': 'Settings - Ai Chat Quick Navigator',
    'options.header.title': 'Ai Chat Quick Navigator',
    'options.header.subtitle': 'Quickly navigate in AI conversation pages',
    'options.general': 'General Settings',
    'options.language': 'Language / 语言',
    'options.language.desc': 'Select interface language',
    'options.theme': 'Theme Settings',
    'options.theme.ui': 'Interface Theme',
    'options.theme.desc': 'Select color theme for the navigation panel',
    'options.theme.auto': 'Auto (System)',
    'options.theme.light': 'Light',
    'options.theme.dark': 'Dark',
    'options.theme.blue': 'Sky Blue',
    'options.theme.lavender': 'Lavender',
    'options.theme.pink': 'Pink',
    'options.theme.orange': 'Orange',
    'options.sites': 'Site Support',
    'options.sites.custom': 'Custom Sites (Beta)',
    'options.sites.custom.desc': 'Add other LLM websites (uses generic adapter)',
    'options.sites.custom.placeholder': 'Enter domain, e.g., chat.example.com',
    'options.sites.custom.add': 'Add',
    'options.sites.custom.delete': 'Delete',
    'options.shortcuts': 'Shortcuts',
    'options.shortcuts.nav': 'Navigation',
    'options.shortcuts.nav.desc': 'Mac: Option (⌥) + W/S | Win: Alt + W/S',
    'options.shortcuts.mark': 'Toggle Pin',
    'options.shortcuts.mark.desc': 'Mac: Option (⌥) + A | Win: Alt + A',
    'options.shortcuts.toggle': 'Toggle Panel',
    'options.shortcuts.toggle.desc': 'Mac: Option (⌥) + D | Win: Alt + D',
    'options.shortcuts.custom.hint': '💡 Customize shortcuts at',
    'options.save.success': '✓ Settings Saved',
    'options.domain.invalid': 'Please enter a valid domain',
    'options.domain.exists': 'Domain already exists',

    // Popup Page
    'popup.title': 'Ai Chat Quick Navigator',
    'popup.desc': 'Quickly navigate AI answers in conversation pages',
    'popup.shortcuts': 'Shortcuts',
    'popup.switch': '↕️ Switch Answer',
    'popup.mark': '📌 Toggle Pin',
    'popup.toggle': '👁️ Show/Hide',
    'popup.hint.theme': 'Right-click icon -> Options to customize theme and sites.',
    'popup.hint.shortcuts': 'Visit',
    'popup.hint.modify': 'to modify shortcuts.',
    'popup.feedback': 'Feedback & Suggestions: '
  }
};

export function getSystemLanguage(): Language {
  const lang = navigator.language;
  if (lang.startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en';
}

export function getTranslation(key: string, lang: Language): string {
  // 处理 auto 情况
  const targetLang = lang === 'auto' ? getSystemLanguage() : lang;
  
  const dict = messages[targetLang] || messages['en'];
  return dict[key as keyof typeof dict] || key;
}


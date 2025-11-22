// Content Script
import { getActiveAdapter } from './siteAdapters/index';

console.log('LLM Answer Navigator: Content script loaded');

/**
 * 初始化导航功能
 */
function init() {
  // 获取当前页面适配的站点适配器
  const adapter = getActiveAdapter(window.location);
  
  if (!adapter) {
    console.log('LLM Answer Navigator: 当前页面不支持，跳过初始化');
    return;
  }
  
  console.log(`LLM Answer Navigator: ${adapter.name} 页面已检测到，准备初始化`);
  
  // 查找所有 AI 回答节点
  const answers = adapter.findAllAnswers(document);
  console.log(`LLM Answer Navigator: 找到 ${answers.length} 个回答节点`);
  
  if (answers.length > 0) {
    console.log('第一个回答节点信息:', {
      tagName: answers[0].tagName,
      className: answers[0].className,
      textPreview: answers[0].textContent?.substring(0, 100)
    });
  }
  
  // 后续将在这里添加核心逻辑
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  
  if (message.type === 'LLM_NAV_PREV_ANSWER') {
    console.log('Navigate to previous answer');
    // 后续实现
  } else if (message.type === 'LLM_NAV_NEXT_ANSWER') {
    console.log('Navigate to next answer');
    // 后续实现
  }
});


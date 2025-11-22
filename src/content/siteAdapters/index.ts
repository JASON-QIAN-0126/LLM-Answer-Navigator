/**
 * 站点适配器接口
 * 每个站点适配器需要实现这个接口
 */
export interface SiteAdapter {
  /**
   * 判断当前 URL 是否支持此适配器
   */
  isSupported(location: Location): boolean;
  
  /**
   * 在页面中查找所有 AI 回答节点
   * @param root - 根节点，通常是 document 或某个容器元素
   * @returns AI 回答节点数组
   */
  findAllAnswers(root: Document | HTMLElement): HTMLElement[];
  
  /**
   * 适配器名称
   */
  name: string;
}

// 导入所有适配器
import { chatgptAdapter } from './chatgptAdapter';

/**
 * 所有已注册的适配器列表
 * 添加新站点适配器时，只需导入并添加到这个数组
 */
const adapters: SiteAdapter[] = [
  chatgptAdapter,
  // 未来可以在这里添加更多适配器，例如：
  // claudeAdapter,
  // geminiAdapter,
];

/**
 * 根据当前 URL 获取合适的适配器
 * @param location - 当前页面的 location 对象
 * @returns 找到的适配器，如果没有匹配则返回 null
 */
export function getActiveAdapter(location: Location): SiteAdapter | null {
  for (const adapter of adapters) {
    if (adapter.isSupported(location)) {
      return adapter;
    }
  }
  return null;
}

/**
 * 获取所有已注册的适配器
 */
export function getAllAdapters(): SiteAdapter[] {
  return [...adapters];
}


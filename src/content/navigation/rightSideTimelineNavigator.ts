import type { PromptAnswerItem } from './answerIndexManager';

/**
 * 右侧时间线导航器
 * 在页面右侧显示纵向时间线，每个节点代表一个对话
 */
export class RightSideTimelineNavigator {
  private container: HTMLElement;
  private timelineBar: HTMLElement;
  private nodes: HTMLElement[] = [];
  private items: PromptAnswerItem[] = [];
  private activeIndex: number = 0;
  private onClickCallback: ((index: number) => void) | null = null;
  private tooltip: HTMLElement;

  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    this.container = this.createContainer();
    this.timelineBar = this.createTimelineBar();
    this.tooltip = this.createTooltip();
    this.container.appendChild(this.timelineBar);
    document.body.appendChild(this.container);
    document.body.appendChild(this.tooltip);
    
    // 监听容器大小变化
    this.resizeObserver = new ResizeObserver(() => {
      this.updateNodePositions();
    });
    this.resizeObserver.observe(this.container);
  }

  /**
   * 创建主容器
   */
  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'llm-timeline-navigator';
    
    // 样式
    Object.assign(container.style, {
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '40px',
      height: '80vh',
      maxHeight: '800px',
      zIndex: '2147483647', // 使用最大层级，但避免影响其他功能
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      pointerEvents: 'none'
    });

    return container;
  }

  /**
   * 创建时间线竖线
   */
  private createTimelineBar(): HTMLElement {
    const bar = document.createElement('div');
    bar.className = 'timeline-bar';
    
    Object.assign(bar.style, {
      position: 'absolute',
      left: '50%',
      top: '0',
      width: '2px',
      height: '100%',
      backgroundColor: 'rgba(150, 150, 150, 0.3)',
      transform: 'translateX(-50%)',
      pointerEvents: 'none'
    });

    return bar;
  }

  /**
   * 创建 tooltip（用于 hover 显示 prompt 内容）
   */
  private createTooltip(): HTMLElement {
    const tooltip = document.createElement('div');
    tooltip.id = 'llm-timeline-tooltip';
    tooltip.style.display = 'none';
    
    Object.assign(tooltip.style, {
      position: 'fixed',
      maxWidth: '300px',
      padding: '10px 14px',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: '#fff',
      fontSize: '13px',
      lineHeight: '1.5',
      borderRadius: '6px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      zIndex: '9999',
      pointerEvents: 'none',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap'
    });

    return tooltip;
  }

  /**
   * 显示 tooltip
   */
  private showTooltip(text: string, nodeElement: HTMLElement): void {
    // 截断文本（最多 80 字符）
    const displayText = text.length > 80 ? text.substring(0, 80) + '...' : text;
    this.tooltip.textContent = displayText;
    this.tooltip.style.display = 'block';

    // 计算位置（显示在节点左侧）
    const rect = nodeElement.getBoundingClientRect();
    const tooltipWidth = 300; // maxWidth
    const gap = 15; // 节点与 tooltip 之间的间距

    // 默认显示在左侧
    let left = rect.left - tooltipWidth - gap;
    let top = rect.top + rect.height / 2;

    // 如果左侧空间不够，显示在右侧
    if (left < 10) {
      left = rect.right + gap;
    }

    // 确保不超出顶部和底部
    const tooltipHeight = this.tooltip.offsetHeight;
    if (top + tooltipHeight / 2 > window.innerHeight - 10) {
      top = window.innerHeight - tooltipHeight - 10;
    } else if (top - tooltipHeight / 2 < 10) {
      top = 10;
    } else {
      top = top - tooltipHeight / 2;
    }

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }

  /**
   * 隐藏 tooltip
   */
  private hideTooltip(): void {
    this.tooltip.style.display = 'none';
  }

  /**
   * 创建单个节点
   */
  private createNode(item: PromptAnswerItem, index: number): HTMLElement {
    const node = document.createElement('div');
    node.className = 'timeline-node';
    node.dataset.index = String(index);
    
    // 基础样式
    Object.assign(node.style, {
      position: 'absolute',
      left: '50%',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#888',
      border: '2px solid #fff',
      cursor: 'pointer',
      transform: 'translate(-50%, -50%)',
      transition: 'all 0.2s ease',
      pointerEvents: 'auto',
      zIndex: '1'
    });

    // 鼠标悬浮效果 + 显示 tooltip
    node.addEventListener('mouseenter', () => {
      const nodeIndex = parseInt(node.dataset.index || '0');
      
      // 样式变化
      if (nodeIndex !== this.activeIndex) {
        node.style.backgroundColor = '#666';
        node.style.transform = 'translate(-50%, -50%) scale(1.2)';
      }
      
      // 显示 tooltip
      if (this.items[nodeIndex]) {
        this.showTooltip(this.items[nodeIndex].promptText, node);
      }
    });

    node.addEventListener('mouseleave', () => {
      const nodeIndex = parseInt(node.dataset.index || '0');
      
      // 恢复样式
      if (nodeIndex !== this.activeIndex) {
        node.style.backgroundColor = '#888';
        node.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      
      // 隐藏 tooltip
      this.hideTooltip();
    });

    // 点击事件
    node.addEventListener('click', () => {
      const clickedIndex = parseInt(node.dataset.index || '0');
      if (this.onClickCallback) {
        this.onClickCallback(clickedIndex);
      }
    });

    return node;
  }

  /**
   * 初始化时间线（传入所有对话条目）
   */
  init(items: PromptAnswerItem[]): void {
    // 清空旧节点
    this.nodes.forEach(node => node.remove());
    this.nodes = [];
    this.items = items;

    if (items.length === 0) {
      console.warn('⚠️ Timeline: 没有对话条目，无法初始化');
      return;
    }

    // 创建节点并根据相对位置分布
    items.forEach((item, index) => {
      const node = this.createNode(item, index);
      this.container.appendChild(node);
      this.nodes.push(node);
    });

    // 计算并设置节点位置
    this.updateNodePositions();

    console.log(`✅ Timeline: 初始化完成，创建了 ${this.nodes.length} 个节点`);
  }

  /**
   * 更新所有节点的位置
   * 采用“等间距分布”策略 (Even Distribution)：
   * - 第一个节点固定在顶部 (Padding 位置)
   * - 最后一个节点固定在底部 (ContainerHeight - Padding)
   * - 中间节点均匀分布
   * - 这种方式类似“气泡”效果：新节点加入底部，旧节点自动向上挤压调整，且不再依赖页面 scrollHeight，彻底解决节点不可见问题
   */
  private updateNodePositions(): void {
    const count = this.items.length;
    if (count === 0) return;

    const containerHeight = this.container.clientHeight;
    // 容器可能还没渲染出来
    if (containerHeight === 0) return;

    const padding = 30; // 上下留白
    const usableHeight = containerHeight - padding * 2;

    this.items.forEach((item, index) => {
      const node = this.nodes[index];
      if (!node) return;

      let topPosition = padding;

      if (count === 1) {
        // 如果只有一个节点，显示在顶部
        topPosition = padding;
      } else {
        // 多个节点：按索引均匀分布
        // 公式：Padding + (当前索引 / (总数 - 1)) * 可用高度
        // index=0 -> 0% (Top)
        // index=max -> 100% (Bottom)
        const ratio = index / (count - 1);
        topPosition = padding + ratio * usableHeight;
      }
      
      node.style.top = `${topPosition}px`;
    });
  }

  /**
   * 刷新节点位置（当窗口 resize 或内容变化时调用）
   */
  refreshPositions(): void {
    this.updateNodePositions();
  }

  /**
   * 更新当前激活的节点
   */
  updateActiveIndex(index: number): void {
    if (index < 0 || index >= this.nodes.length) {
      return;
    }

    // 重置之前的 active 节点
    if (this.activeIndex >= 0 && this.activeIndex < this.nodes.length) {
      const oldNode = this.nodes[this.activeIndex];
      oldNode.style.backgroundColor = '#888';
      oldNode.style.transform = 'translate(-50%, -50%) scale(1)';
      oldNode.style.border = '2px solid #fff';
    }

    // 设置新的 active 节点
    this.activeIndex = index;
    const newNode = this.nodes[index];
    newNode.style.backgroundColor = '#4CAF50'; // 绿色高亮
    newNode.style.transform = 'translate(-50%, -50%) scale(1.4)';
    newNode.style.border = '3px solid #fff';
    newNode.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
  }

  /**
   * 注册节点点击回调
   */
  onNodeClick(callback: (itemIndex: number) => void): void {
    this.onClickCallback = callback;
  }

  /**
   * 显示时间线
   */
  show(): void {
    this.container.style.display = 'flex';
  }

  /**
   * 隐藏时间线
   */
  hide(): void {
    this.container.style.display = 'none';
  }

  /**
   * 切换显示/隐藏
   */
  toggle(): void {
    if (this.container.style.display === 'none') {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * 销毁时间线
   */
  destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.container.remove();
    this.tooltip.remove();
  }
}


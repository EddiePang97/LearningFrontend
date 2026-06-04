import type { LearningStage } from '../learningPath';

export const lv4: LearningStage = {
    id: 'lv4-performance',
    level: 4,
    title: 'Level 4: 破限 - 性能优化',
    description: '极致加载与极致流畅。学习如何通过量化指标和底层优化打造工业级的高性能应用。',
    topics: ['Web Vitals', 'CRP 优化', '缓存策略', '资源加载', '渲染优化'],
    keyConcepts: ['LCP/FID/CLS', '重排/重绘', 'Lazy Loading', 'HTTP/2'],
    mission: '对一个真实页面做性能体检，并完成一轮有指标、有证据的优化。',
    outcome: '能够用 Web Vitals 和 DevTools 定位瓶颈，制定加载、缓存、渲染和拆包优化方案。',
    checklist: ['能读懂 LCP、INP/FID、CLS、TTFB 等核心指标', '能优化关键渲染路径、资源优先级、图片和缓存策略', '能使用代码分割、懒加载、Worker 和虚拟化降低主线程压力'],
    resources: [{ name: 'Web.dev: Performance', url: 'https://web.dev/learn-core-web-vitals/' }],
    lessons: [
        {
            id: 'lv4-l1',
            title: '1. Web Vitals：量化你的用户体验',
            labId: 'web-vitals-lab',
            content: `
# 核心 Web 指标 (Core Web Vitals)

## 三大核心指标
1. **LCP (Largest Contentful Paint)**: 最大内容绘制。衡量加载速度。应控制在 **2.5s** 内。
2. **FID (First Input Delay)**: 首次输入延迟。衡量交互性。应控制在 **100ms** 内。
3. **CLS (Cumulative Layout Shift)**: 累积布局偏移。衡量视觉稳定性。应控制在 **0.1** 下。

## 测量工具
- **Lighthouse**: 开发调试。
- **PageSpeed Insights**: 真实用户数据预测。
        `
        },
        {
            id: 'lv4-l2',
            title: '2. 关键渲染路径 (CRP) 深度加速',
            labId: 'crp-process',
            content: `
# 关键渲染路径优化

## CRP 流程
HTML -> DOM, CSS -> CSSOM -> Render Tree -> Layout -> Paint。

## 优化策略
1. **压缩 HTML/CSS/JS**: 减少字节。
2. **内联关键 CSS**: 避免首屏样式阻塞。
3. **Async/Defer JS**: 防止脚本阻塞 DOM 解析。
        `
        },
        {
            id: 'lv4-l3',
            title: '3. HTTP 缓存策略：强缓存与协商缓存',
            labId: 'http-cache',
            content: `
# 浏览器缓存机制

## 1. 强缓存 (Strong Cache)
**核心头信息**: \`Expires\`, \`Cache-Control\`

命中强缓存时，浏览器**不会向服务器发送任何请求**，直接从本地内存 (Memory Cache) 或硬盘 (Disk Cache) 读取资源。状态码通常显示为 200 (from disk cache)。

- **何时使用**: 
  - 长期不变的静态资源，如 \`logo.png\`, \`jquery.min.js\`。
  - 带有 Hash 指纹的文件，如 \`main.a1b2c3.js\`（文件名变了就是新资源，旧的直接永久缓存）。

## 2. 协商缓存 (Negotiated Cache)
**核心头信息**: \`Last-Modified / If-Modified-Since\`, \`ETag / If-None-Match\`

当强缓存失效（或未设置），浏览器会携带缓存标识向服务器发起请求。如果资源未改变，服务器返回 **304 Not Modified**，不返回包体，浏览器繼續使用本地缓存。

- **何时使用**:
  - 可能频繁变动的资源，如 \`index.html\`。
  - 需要以此确保用户总是获取最新版本的关键入口文件。

> [!TIP]
> 现代开发推荐组合：HTML 使用协商缓存（\`no-cache\`），JS/CSS/Image 使用强缓存（\`max-age=31536000\`）配合文件名 Hash。
        `
        },
        {
            id: 'lv4-l4',
            title: '4. 现代加载：Preload, Prefetch 与 Preconnect',
            labId: 'resource-hints-lab',
            content: `
# 资源优先级控制

- **Preload**: 高优先级。用于当前页面必须要用的资源（如字体、关键脚本）。
- **Prefetch**: 低优先级。用于预测用户下一步可能访问的页面资源。
- **Preconnect**: 提前建立 TCP/TLS 连接，减少握手开销。
        `
        },
        {
            id: 'lv4-l5',
            title: '5. 图像与视频优化：不仅仅是压缩',
            labId: 'media-optimization-lab',
            content: `
# 媒体资源优化

- **WebP/AVIF**: 比 JPEG 效率高得多的现代格式。
- **响应式图片**: \`<picture>\` 标签根据屏幕大小加载不同尺寸。
- **Lazy Loading**: \`loading="lazy"\` 让图片滚动到视口再加载。
        `
        },
        {
            id: 'lv4-l6',
            title: '6. 代码分割 (Code Splitting) 实践',
            labId: 'code-splitting-lab',
            content: `
# 包体积优化

## 拆包原则
将第三方库 (Vendor) 与业务代码分离，将不同路由页面代码分离。

## 实现方式
- React: \`React.lazy()\` + \`Suspense\`。
- Vue: \`defineAsyncComponent\`。
        `
        },
        {
            id: 'lv4-l7',
            title: '7. 解决“页面卡顿”：重排与重绘优化',
            content: `
# 渲染抖动优化

- **重排 (Reflow)**: 修改了几何属性（宽高、边距）。成本极高。
- **重绘 (Repaint)**: 修改了颜色、背景等。

## 优化技巧
- 使用 \`transform\` 和 \`opacity\` 做动画（触发 GPU 加速，不重排）。
- 批量操作 DOM，或使用 \`DocumentFragment\`。
        `
        },
        {
            id: 'lv4-l8',
            title: '8. Service Workers 与 离线化能力',
            content: `
# PWA 核心：Service Workers

它可以拦截网络请求、管理缓存，甚至在无网状态下让页面秒开。

## 生命周期
Install -> Activate -> Fetch。

> [!CAUTION]
> Service Workers 运行在独立线程，无法直接访问 DOM。
        `
        },
        {
            id: 'lv4-l9',
            title: '9. Web Workers：将计算密集型任务移出主线程',
            labId: 'web-workers',
            content: `
# 多线程 JavaScript

## 为什么需要 Web Workers？
JS 是单线程的。如果进行大量复杂计算（如解析 G 级文件、复杂加密），会导致 UI 冻结。

Web Workers 让你可以开启一个子线程，计算完成后再通过 \`postMessage\` 把结果传给主线程。
        `
        },
        {
            id: 'lv4-l10',
            title: '10. 极致优化：Tree Shaking 与 现代模块分发',
            content: `
# 打包极致优化

- **Tree Shaking**: 依赖 ESM 的静态结构。
- **Modern Mode**: 为支持 ESM 的浏览器分发体积更小的代码包，而为旧浏览器提供 Polyfill。

> [!IMPORTANT]
> “快”不仅是主观感受，更是转化率和留存率的生命线。
        `
        }
    ],
    quizzes: [
        {
            id: 'lv4-q1',
            question: 'LCP (最大内容绘制) 应控制在多少秒以内最为理想？',
            options: ['1.0s', '2.5s', '5.0s', '10.0s'],
            correctAnswer: 1,
            explanation: 'Google 建议 LCP 应在 2.5 秒内完成，以提供良好的用户体验。',
            difficulty: 'Easy'
        }
    ]
};

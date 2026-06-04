import type { LearningStage } from '../learningPath';

export const lv9: LearningStage = {
    id: 'lv9-senior',
    level: 9,
    title: 'Level 9: 巅峰 - 资深面试题',
    description: '实战大厂 3-4 轮面试。覆盖底层原理、系统设计及复杂场景下的高并发/大数据处理。',
    topics: ['手写实现', '工程架构设计', '系统监控', '新技术调研'],
    keyConcepts: ['源码深度', '方案折中', '技术视野'],
    mission: '完成一组资深前端场景题，形成可讲、可写、可落地的高级方案库。',
    outcome: '能够在面试和真实评审中拆解复杂问题，给出有边界、有取舍的技术方案。',
    checklist: ['能手写并发控制、深拷贝、响应式、虚拟列表等核心实现', '能设计错误监控、协同编辑、Hybrid、离线包等复杂系统', '能用业务目标、成本、风险和演进性解释技术取舍'],
    resources: [],
    lessons: [
        {
            id: 'lv9-l1',
            title: '1. 手写系列（一）：Promise.all 限制并发',
            labId: 'concurrency-lab',
            content: `
# 资深手写题

## 并发控制
如果让你同时上传 100 张图片，浏览器会卡死。如何实现一个调度器，让同时运行的任务不超过 5 个？

## 核心考察
队列管理、递归启动后续任务、闭包状态。
        `
        },
        {
            id: 'lv9-l2',
            title: '2. 手写系列（二）：完美的深拷贝（带循环引用）',
            labId: 'deep-clone-lab',
            content: `
# 考察点
1. **递归**。
2. **WeakMap**: 记录已拷贝对象，防范无限递归。
3. **Symbol/Map/Set**: 特殊类型的处理。
        `
        },
        {
            id: 'lv9-l3',
            title: '3. 进阶原理：Vue 3 源码中响应式与 Diff',
            labId: 'reactivity-lab',
            content: `
# 源码深度

- **Effect/Dep/Track**: 追踪依赖的完整链条。
- **位运算优化**: Vue 源码中如何利用位运算快速判断节点类型。
        `
        },
        {
            id: 'lv9-l4',
            title: '4. 系统设计：如何 design 一个前端错误监控系统？',
            labId: 'monitoring-lab',
            content: `
# 系统设计题 (System Design)

## 关键模块
- **采集端**: SDK 设计（低侵入、高效率）。
- **传输端**: \`navigator.sendBeacon\` 保证数据可靠到达。
- **存储端**: 面对亿级数据如何清洗和聚合。
- **报警端**: 阈值策略与通知。
        `
        },
        {
            id: 'lv9-l5',
            title: '5. 大数据渲染：如何处理 10 万条数据的长列表？',
            labId: 'virtual-list-lab',
            content: `
# 性能极限

## 虚拟列表 (Virtual List)
只渲染可视区域的几十个节点。通过 offset 模拟滚动。

## 核心算法
动态计算高度、滚动缓冲区 (Buffer) 设置、防止白屏。
        `
        },
        {
            id: 'lv9-l6',
            title: '6. 协同办公：OT 算法与 CRDT 简介',
            content: `
# 复杂场景设计

如果让你做一个像飞书文档一样的多人在线实时协作系统，如何解决“编辑冲突”？
- **OT (Operational Transformation)**: 服务端仲裁。
- **CRDT**: 无需服务器的冲突解决数据结构。
        `
        },
        {
            id: 'lv9-l7',
            title: '7. 前端工程化：如何从 0 搭建一个前端基建？',
            content: `
# 团队负责人视角

1. 技术选型 (Vite/TS)。
2. 规范建设 (GitFlow/ESLint)。
3. 组件沉淀。
4. 脚手架开发 (CLI)。
5. 发布自动化。
        `
        },
        {
            id: 'lv9-l8',
            title: '8. 离线包与 Hybrid 混合开发架构',
            content: `
# 移动端混合架构

- **JSBridge**: 通信原理。
- **离线包**: 如何利用本地文件加速拉起 H5 容器，实现接近 Native 的体验。
        `
        },
        {
            id: 'lv9-l9',
            title: '9. 深入二进制：WebAssembly 的现状与未来',
            content: `
# 性能终结者

- **WASM**: 让 C++/Rust 代码在浏览器运行，速度飞起。
- **应用场景**: 视频剪辑、加密库、大型 3D 游戏。
        `
        },
        {
            id: 'lv9-l10',
            title: '10. 技术视野：2025 年后的前端趋势预测',
            content: `
# 向前看

- **AI 驱动**: Copilot 与智能 UI 生成。
- **Serverless**: 前端直接操控算力。
- **边缘计算 (Edge)**: 全球分布式渲染。

> [!IMPORTANT]
> 面试不是标准答案，而是展示你对技术的热情和深度的思考。
        `
        }
    ],
    quizzes: [
        {
            id: 'lv9-q1',
            question: '实现 Promise.all 并发限制的主要核心是？',
            options: ['使用 reduce', '维护一个执行计数和等待队列', '多开几个浏览器窗口', '使用 setImmediate'],
            correctAnswer: 1,
            explanation: '关键在于控制当前 promise 池的数量。',
            difficulty: 'Hard'
        }
    ]
};

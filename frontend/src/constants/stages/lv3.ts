import type { LearningStage } from '../learningPath';

export const lv3: LearningStage = {
    id: 'lv3-frameworks',
    level: 3,
    title: 'Level 3: 神兵 - React 与 Vue',
    description: '深度理解现代前端框架的设计哲学。从 Virtual DOM 到响应式原理，掌握组件化开发的真谛。',
    topics: ['Virtual DOM', 'React Hooks', 'Vue 响应式', '状态管理', '组件模式'],
    keyConcepts: ['调和算法', '双向绑定', '单向数据流', 'Fiber'],
    mission: '完成一个有路由、组件拆分、状态管理和数据流的中型 React/Vue 前端应用。',
    outcome: '能够用框架组织真实页面，并理解 Hooks、响应式、状态管理和渲染性能的取舍。',
    checklist: ['能设计组件边界、props/state 和复用模式', '能处理路由、表单、请求、错误和加载状态', '能解释 Virtual DOM、Fiber、响应式和常见优化手段'],
    resources: [{ name: 'React 官方文档', url: 'https://react.dev/' }],
    lessons: [
        {
            id: 'lv3-l1',
            title: '1. Virtual DOM 与 Diff 算法真相',
            labId: 'virtual-dom',
            content: `
# Virtual DOM (虚拟 DOM)

## 为什么需要它？
直接操作真实 DOM 非常昂贵。Virtual DOM 通过 JS 对象模拟 DOM 树，在内存中计算差异（Diff），最后批量更新真实 DOM。

## Diff 算法核心策略
1. **同层比较**: 不跨层级比较。
2. **Key 的作用**: 通过 Key 标识节点，极大提升复用效率，避免错误渲染。
        `
        },
        {
            id: 'lv3-l2',
            title: '2. React Hooks：useState 与 useEffect 深度指南',
            labId: 'react-hooks',
            content: `
# React Hooks 基础

## useState
用于定义组件状态。记住：**状态更新是异步的**（在同一事件循环中合并）。

## useEffect
处理副作用（数据获取、订阅、手动修改 DOM）。
- **[]**: 仅在挂载时运行一次。
- **[prop]**: 依赖项变化时运行。
- **return () => {}**: 必不可少的清除函数。
        `
        },
        {
            id: 'lv3-l3',
            title: '3. 性能优化：useMemo、useCallback 与 React.memo',
            labId: 'react-perf-lab',
            content: `
# React 性能调优

- **useMemo**: 缓存计算结果。
- **useCallback**: 缓存函数引用，防止子元素重复渲染。
- **React.memo**: 高阶组件，跳过未发生 Props 变化的组件渲染。

> [!TIP]
> 不要过度使用。过多的缓存本身也会带来内存 and 计算开销。
        `
        },
        {
            id: 'lv3-l4',
            title: '4. 状态管理：从 Redux 到 Zustand',
            labId: 'state-mgmt',
            content: `
# 状态管理方案

## 1. Context API (本次实验重点)
- **解决了什么**: 传统的 Props Drilling (属性透传) 需要将数据层层传递，非常繁琐。
- **核心概念**:
  - **Provider (提供者)**: 在顶层注入数据。
  - **Consumer (消费者)**: 任意底层组件直接订阅数据，跳过中间层。
- **适用场景**: 主题切换、用户信息、国际化配置等低频更新的全局数据。

## 2. Redux / Flux
- 严格的单向数据流 (Action -> Reducer -> Store)。
- 附带强大的 DevTools 和中间件生态，适合大型复杂应用。

## 3. Zustand / Pinia
- **Zustand (React)**: 极简主义，无需 Provider 包裹，Hooks 风格。
- **Pinia (Vue)**: Vue 官方推荐，去掉了复杂的 mutation，开箱即用。
        `
        },
        {
            id: 'lv3-l5',
            title: '5. 组件设计模式：HOC、Render Props 与 Hooks',
            labId: 'component-patterns',
            content: `
# 高级组件模式

- **HOC (高阶组件)**: 包装组件，注入功能。
- **Render Props**: 通过 Props 传递渲染逻辑。
- **Hooks (推荐)**: 目前主流的逻辑复用方式，更解耦。
        `
        },
        {
            id: 'lv3-l6',
            title: '6. React Fiber：调度器的艺术',
            labId: 'fiber-architecture',
            content: `
# React Fiber 架构

## 为什么要重构？
老版本 React 递归更新，一旦任务过大就会阻塞主线程导致卡顿。

## Fiber 的魔力
将更新任务拆分为微小的“工作单元”，可以**暂停、恢复、优先级排序**。实现了丝滑的交互体验。
        `
        },
        {
            id: 'lv3-l7',
            title: '7. Vue 3 Composition API 实战',
            content: `
# Vue 3 组合式 API

## 与 Options API 的区别
不再按 \`data\`, \`methods\` 拆分，而是按**逻辑功能**组织代码。

## ref vs reactive
- **ref**: 适用于基本类型和对象，需要 \`.value\`。
- **reactive**: 仅适用于对象，不需要 \`.value\`。
        `
        },
        {
            id: 'lv3-l8',
            title: '8. Vue 响应式原理：Proxy 的优势',
            content: `
# Vue 3 响应式原理

## Proxy vs Object.defineProperty
- **Vue 2**: 无法监听对象属性的新增/删除，无法直接监听数组下标。
- **Vue 3 (Proxy)**: 全方位代理，惰性监听，性能更强。
        `
        },
        {
            id: 'lv3-l9',
            title: '9. 框架对比：Vue 的双向绑定 vs React 的单向',
            content: `
# 哲学之争

- **React**: 专注于“视图是状态的函数”。一切手动控制，灵活但门槛高。
- **Vue**: 专注于“渐进式”。模板自动解析、双向绑定简化表单处理，开发效率极高。
        `
        },
        {
            id: 'lv3-l10',
            title: '10. SSR 与 SSG：Next.js / Nuxt 带来的质变',
            content: `
# 现代框架的进阶：全栈渲染

- **SSR (服务端渲染)**: 解决首屏白屏和 SEO 问题。
- **SSG (静态生成)**: 提前生成静态 HTML，性能巅峰。

> [!IMPORTANT]
> 掌握全栈框架（Next.js/Nuxt）是向高级开发者迈进的关键一步。
        `
        }
    ],
    quizzes: [
        {
            id: 'lv3-q1',
            question: 'React 中 Key 的主要作用是？',
            options: ['给元素加 ID', '提升列表 Diff 的效率', '美化代码', '用于 CSS 选择器'],
            correctAnswer: 1,
            explanation: 'Key 帮助 React 识别哪些元素发生了改变、被添加或删除。',
            difficulty: 'Medium'
        }
    ]
};

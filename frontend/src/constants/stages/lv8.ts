import type { LearningStage } from '../learningPath';

export const lv8: LearningStage = {
    id: 'lv8-architecture',
    level: 8,
    title: 'Level 8: 宗师 - 架构设计',
    description: '从工具使用者成长为规则制定者。掌握设计模式、微前端、低代码及组件库架构。',
    topics: ['设计模式', '微前端', '低代码', '私有组件库', 'Monorepo'],
    keyConcepts: ['解耦', '可维护性', '模块联邦', '领域驱动(DDD)'],
    mission: '设计一个可扩展、可协作、可长期维护的前端系统架构方案。',
    outcome: '能够从业务复杂度、团队协作、发布效率和稳定性角度做技术选型。',
    checklist: ['能使用设计模式、SOLID、IoC/DI 做模块解耦', '能设计组件库、Monorepo、微前端或低代码基础架构', '能输出技术方案、风险评估、演进路径和稳定性建设计划'],
    resources: [{ name: 'Refactoring.Guru', url: 'https://refactoring.guru/design-patterns' }],
    lessons: [
        {
            id: 'lv8-l1',
            title: '1. 常用设计模式（上）：单例与观察者',
            labId: 'design-patterns-lab',
            content: `
# 前端设计模式

- **单例模式 (Singleton)**: 确保一个类只有一个实例（如全局 Store, 弹窗生成器）。
- **观察者模式 (Observer)**: 定义一对多的依赖。当一个对象状态改变，所有依赖它的对象都会收到通知（如 Vue 的响应式）。
        `
        },
        {
            id: 'lv8-l2',
            title: '2. 常用设计模式（下）：策略与发布订阅',
            content: `
# 更多模式

- **策略模式 (Strategy)**: 将算法逻辑与使用逻辑解耦（如各种折扣计算、路由配置）。
- **发布订阅模式 (Pub-Sub)**: 观察者模式的解耦进阶版。增加了一个中间经纪人（Event Bus）。
        `
        },
        {
            id: 'lv8-l3',
            title: '3. 微前端 (Micro-Frontends) 全景视图',
            labId: 'mfe-lab',
            content: `
# 巨型应用拆解

## 核心痛点
巨石应用编译慢、团队协作冲突严重、技术栈锁死。

## 方案对比
- **IFrame**: 最彻底隔离，体验最差。
- **qiankun (基于 single-spa)**: 劫持 JS 执行和样式。
- **Module Federation**: 真正的运行时模块共享。
        `
        },
        {
            id: 'lv8-l4',
            title: '4. 低代码 (Low Code) 与可视化搭建原理',
            content: `
# 降本增效利器

## 技术实现
1. **协议设计**: JSON Schema 定义组件属性。
2. **渲染引擎**: 根据 JSON 递归生成 React/Vue 组件。
3. **物料池**: 封装好的原子组件。
        `
        },
        {
            id: 'lv8-l5',
            title: '5. 私有组件库架构：从规范到发布',
            content: `
# 打造沉淀

## 架构选型
- **dumi / Storybook**: 组件演示与文档。
- **Changesets**: 版本自动化。
- **Monorepo**: 管理多包依赖。
        `
        },
        {
            id: 'lv8-l6',
            title: '6. 软件设计原则 (SOLID)',
            labId: 'solid-lab',
            content: `
# 架构之基

1. **S (单一职责)**: 一个模块只做一件事。
2. **O (开闭原则)**: 对扩展开放，对修改关闭。
3. **L (里氏替换)**。
4. **I (接口隔离)**。
5. **D (依赖倒置)**: 高层模块不应依赖底层模块。
        `
        },
        {
            id: 'lv8-l7',
            title: '7. Monorepo：多项目代码管理方案',
            content: `
# 现代仓库组织

使用 **Turborepo** 或 **Nx**。
- 解决本地联调麻烦。
- 依赖共享，缓存构建任务。
        `
        },
        {
            id: 'lv8-l8',
            title: '8. 解耦：控制反转 (IoC) 与 依赖注入 (DI)',
            content: `
# IoC/DI 真相

不再是 A 里面直接 \`new B\`，而是告诉外部“我需要一个 B”。
- 优势：A 和 B 彻底解耦，极大提升单元测试的便利性。
        `
        },
        {
            id: 'lv8-l9',
            title: '9. 稳定性建设：错误监控与埋点设计',
            content: `
# 线上的眼睛

## 核心指标
- **JS Error**: window.onerror。
- **Promise Reject**: unhandledrejection 事件。
- **全链路追踪**: Sentry 等工具接入。
        `
        },
        {
            id: 'lv8-l10',
            title: '10. 架构师思维：如何做技术选型与评审？',
            content: `
# 进阶之路

- 避免“为了炫技而引入新技术”。
- 评估成本、收益、风险、生态。
- 制定规范，沉淀方法论。
        `
        }
    ],
    quizzes: [
        {
            id: 'lv8-q1',
            question: 'Vue 的双向数据绑定底层主要使用了哪种设计模式？',
            options: ['单例模式', '观察者模式', '工厂模式', '适配器模式'],
            correctAnswer: 1,
            explanation: '依赖收集和通知更新是标准的观察者模式。',
            difficulty: 'Medium'
        }
    ]
};

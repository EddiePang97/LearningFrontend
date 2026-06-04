import type { LearningStage } from '../learningPath';

export const lv0: LearningStage = {
    id: 'lv0-basics',
    level: 0,
    title: 'Level 0: 筑基 - HTML & CSS 核心',
    description: '从零构建工业级网页。掌握 HTML5 语义化、CSS 核心布局与响应式设计。',
    topics: ['HTML5 语义化', 'CSS 盒模型', 'Flexbox/Grid', '响应式设计', '选择器权重'],
    keyConcepts: ['语义化', 'BFC', '层叠上下文', '响应式断点'],
    mission: '完成一个语义清晰、布局稳定、移动端友好的响应式落地页。',
    outcome: '能够独立把设计稿拆成 HTML/CSS 结构，并解释盒模型、布局和响应式决策。',
    checklist: ['页面结构使用 header/main/section/footer 等语义标签', 'Flex/Grid 布局在手机、平板、桌面都不挤压', '能说明选择器权重、盒模型和断点策略'],
    resources: [{ name: 'MDN: HTML 基础', url: 'https://developer.mozilla.org/zh-CN/docs/Learn/HTML' }],
    lessons: [
        {
            id: 'lv0-l1',
            title: '1. HTML5 语义化与现代结构',
            labId: 'layout-spatial',
            content: `
# HTML5 语义化与现代结构

## 为什么要用语义化？
语义化不仅是让代码好看，它有三大核心价值：
1. **SEO (搜索引擎优化)**: 爬虫通过标签理解页面重点。
2. **Accessibility (无障碍)**: 屏幕阅读器依赖结构为视障人士导航。
3. **可维护性**: 看到 \`<header>\` 就知道是头部，比 \`<div class="top-box">\` 直观得多。

## 核心语义化标签
- **<header>**: 页眉或导航容器。通常位于页面顶部。
- **<nav>**: 导航链接组。
- **<main>**: 页面特有的主体内容。每页仅一个。
- **<article>**: 独立、可复用的内容（如博客文章）。
- **<section>**: 通用的文档章节。
- **<footer>**: 页脚及版权信息。

> [!TIP]
> 观察右侧的交互图示，点击不同部分查看它们在标准网页布局中的空间位置。
`
        },
        {
            id: 'lv0-l2',
            title: '2. CSS 盒模型深度解析',
            labId: 'box-model',
            content: `
# CSS 盒模型深度解析

## 组成的物理结构
1. **Content**: 文本或图片所在区域。
2. **Padding**: 内容到边框的内边距。
3. **Border**: 包裹内容的边框。
4. **Margin**: 盒子与外界的距离，**不计入背景颜色**。

## box-sizing 的两种模式
- **content-box (标准)**: \`width = content\`。添加 padding 后，盒子会被挤大。
- **border-box (IE/现代主流)**: \`width = content + padding + border\`。布局时更符合直觉。

> [!IMPORTANT]
> 右侧的交互实验室展示了“盒子”的每一层。尝试调整参数，感受 Margin 和 Padding 对空间占用影响的区别。
`
        },
        {
            id: 'lv0-l3',
            title: '3. 选择器优先级与权重计算',
            labId: 'specificity',
            content: `
# 选择器优先级与权重计算

## 权重计算规则
权重是一个四位数（非十进制，而是级别）：
1. **Inline Style (1,0,0,0)**: 直接写在标签上的。
2. **ID Selector (0,1,0,0)**: 如 \`#nav\`。
3. **Class/Pseudo-class (0,0,1,0)**: 如 \`.btn\`, \`:hover\`。
4. **Element/Pseudo-element (0,0,0,1)**: 如 \`div\`, \`::after\`。

## 级联与 !important
- 当权重相等时，**后写的规则**覆盖先写的。
- \`!important\` 强制优先级最高，除非万不得已不要使用。
`
        },
        {
            id: 'lv0-l4',
            title: '4. Flexbox 实战应用 (一维布局)',
            labId: 'flex-box',
            content: `
# Flexbox 实战应用

## 主轴与交叉轴
- **Main Axis (主轴)**: 默认水平。由 \`flex-direction\` 控制。
- **Cross Axis (交叉轴)**: 与主轴垂直。

## 核心属性
- \`justify-content\`: 主轴对齐 (center, space-between...)。
- \`align-items\`: 交叉轴对齐。
- \`flex-grow/shrink\`: 控制元素的拉伸与收缩。
`
        },
        {
            id: 'lv0-l5',
            title: '5. Grid 布局进阶 (二维布局)',
            labId: 'grid-layout',
            content: `
# Grid 布局进阶

## 什么是二维布局？
Flex 适合一行搞定，Grid 则适合**行和列同时控制**。

## 布局技巧
- \`grid-template-columns: repeat(3, 1fr);\`: 均分三列。
- \`grid-area\`: 给区域起名字，像玩拼图一样排版。
`
        }
    ],
    quizzes: [
        {
            id: 'lv0-q1',
            question: 'HTML5 语义化标签的主要作用是什么？',
            options: ['代码美观', '利于 SEO 和无障碍访问', '提高渲染速度', '减小文件体积'],
            correctAnswer: 1,
            explanation: '语义化增强了机器 and 辅助工具对页面结构的理解。',
            difficulty: 'Easy'
        },
        {
            id: 'lv0-q2',
            question: '在 box-sizing: content-box 下，设置 width: 100px; padding: 10px; border: 5px; 元素的物理宽度是？',
            options: ['100px', '120px', '130px', '115px'],
            correctAnswer: 2,
            explanation: '100 (content) + 20 (padding) + 10 (border) = 130px。',
            difficulty: 'Medium'
        }
    ]
};

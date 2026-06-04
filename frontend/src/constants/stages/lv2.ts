import type { LearningStage } from '../learningPath';

export const lv2: LearningStage = {
    id: 'lv2-engineering',
    level: 2,
    title: 'Level 2: 装备 - 前端工程化',
    description: '从“写代码”转向“做工程”。掌握 Git、构建工具、TypeScript 及规范化开发流。',
    topics: ['Git 工作流', '包管理', 'Vite/Webpack', 'TypeScript', 'CI/CD'],
    keyConcepts: ['Tree Shaking', 'HMR', '类型安全', '自动化部署'],
    mission: '把一个普通前端项目升级为可协作、可构建、可检查、可部署的工程化项目。',
    outcome: '能够搭建 Vite/TypeScript 工程，配置规范检查，并理解构建产物与发布流程。',
    checklist: ['能使用 Git 分支、提交、合并和冲突处理完成协作流程', '能说明 npm/pnpm、ESM/CJS、Vite/Webpack 的关键差异', '能配置 TypeScript、ESLint、Prettier 和基础 CI/CD'],
    resources: [{ name: 'Vite 官方文档', url: 'https://cn.vitejs.dev/' }],
    lessons: [
        {
            id: 'lv2-l1',
            title: '1. Git 核心：从提交到分支管理',
            content: `
# Git 版本控制核心概念

Git 是现代前端开发必不可少的工具。它记录代码的每一次变更，让我们能穿越时空，回滚代码，或者并行开发新功能。

## 1. 提交 (Commit)
提交是 Git 中的基本单位。你可以把它想象成**代码的快照**。
- 每次提交都有一个唯一的 ID（Hash）。
- 它包含作者、时间戳和变更内容。

\`\`\`bash
git commit -m "feat: add login page"
\`\`\`

## 2. 分支 (Branch)
分支是**并行的宇宙**。
- **main/master**: 通常是稳定的主线。
- **feature**: 开发新功能的分支。

\`\`\`bash
git checkout -b feature/login
# 在这个分支上的改动不会影响 master
\`\`\`

## 3. 合并 (Merge)
当功能开发完成后，我们需要把“平行宇宙”合并回主线。
- **Fast-forward**: 直接把 master 指针向前移动。
- **Merge Commit**: 创建一个新的提交节点，连接两个分支的历史。

> [!TIP]
> 熟悉 Git 命令行的同时，也可以配合 GUI 工具（如 SourceTree, GitKraken 或 VS Code 内置插件）来查看分支图谱。
`
        },
        {
            id: 'lv2-l2',
            title: '2. Git 进阶：Rebase、Cherry-pick 与冲突解决',
            content: `
# Git 进阶技巧

## Rebase vs Merge
- **Merge**: 保留真实时间线，生成合并节点。
- **Rebase**: 变基，保持提交历史呈直线。

## 冲突处理
当同一行代码被多次修改时，Git 无法自动合并。此时需要手动编辑文件，保留正确版本并删除标记。
        `
        },
        {
            id: 'lv2-l3',
            title: '3. 包管理之争：NPM、Yarn 与 PNPM',
            content: `
# 包管理工具对比

- **npm**: 官方稳定，版本 3 后使用扁平化安装。
- **Yarn**: 并行下载，引入 lock 文件。
- **pnpm**: 通过**内容寻址存储**，极大节省空间，安装速度最快。

> [!TIP]
> 现代新项目首选 **pnpm**。
        `
        },
        {
            id: 'lv2-l4',
            title: '4. ES Modules (ESM) 与 CommonJS (CJS)',
            content: `
# 模块化规范

- **CJS (NodeJS 传统)**: \`require\` / \`module.exports\`。同步加载。
- **ESM (现代标准)**: \`import\` / \`export\`。异步加载，支持 **Tree Shaking**。

在现代前端开发中，我们几乎总是使用 ESM。
        `
        },
        {
            id: 'lv2-l5',
            title: '5. Vite: 为什么它这么快？',
            labId: 'bundler-flow',
            content: `
# Vite 核心原理解析

## 极速开发环境
Vite 利用了浏览器原生的 **ESM** 支持。在开发环境下它不打包代码，而是直接以模块形式请求，实现秒开。

## 生产环境
使用 **Rollup** 进行打包，确保代码兼容性与体积优化。
        `
        },
        {
            id: 'lv2-l6',
            title: '6. Webpack 深度：Loader 与 Plugin 的奥秘',
            labId: 'webpack-pipeline',
            content: `
# Webpack 核心机制详解

Webpack 本质上是一个模块打包器，但它通过 **Loader** 和 **Plugin** 变得极其强大。

## 1. Loaders (转换器)
Webpack 默认只认识 JavaScript 和 JSON。Loaders 让它可以处理其他类型的文件。
- **css-loader**: 解析 CSS 文件中的 \`@import\` 和 \`url()\`。
- **style-loader**: 将 CSS 注入到 DOM 的 \`<style>\` 标签中。
- **ts-loader**: 将 TypeScript 转换为 JavaScript。

## 2. Plugins (插件)
插件可以执行范围更广的任务，比如打包优化、资源管理、环境变量注入。
- **HtmlWebpackPlugin**: 自动生成 HTML 文件并引入打包后的 JS。
- **MiniCssExtractPlugin**: 将 CSS 提取为单独的文件，而不是内联在 JS 中。

## 配置示例
\`\`\`javascript
module.exports = {
  module: {
    rules: [
      { test: /\\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })]
};
\`\`\`
        `
        },
        {
            id: 'lv2-l7',
            title: '7. TypeScript 基础：类型注解与接口',
            labId: 'typescript-check',
            content: `
# TypeScript 入门

## 核心优势
- **静态检查**: 在编译阶段发现错误。
- **IDE 支持**: 完美的自动补全和跳转。

## 基本语法
\`\`\`typescript
interface User {
  id: number;
  name: string;
}
const user: User = { id: 1, name: "Antigravity" };
\`\`\`
        `
        },
        {
            id: 'lv2-l8',
            title: '8. TypeScript 进阶：泛型与联合类型',
            labId: 'typescript-advanced',
            content: `
# TypeScript 进阶概念详解

## 1. 泛型 (Generics)
泛型允许我们在定义函数或类时，不预先指定具体的类型，而在使用的时候再指定。这就像是给类型传参。

### 为什么需要泛型？
假设我们要封装一个通用的“盒子”容器：
\`\`\`typescript
// 不使用泛型：无法知道盒子装的是什么，只能用 any，丢失了类型检查
function createBox(value: any) {
  return { value }; 
}

// 使用泛型 <T>：T 就像一个占位符
function createBox<T>(value: T) {
  return { value };
}

const numBox = createBox(100); // T 自动推导为 number
const strBox = createBox("Hello"); // T 自动推导为 string

// numBox.value.toUpperCase(); // ❌ 报错！TS 知道 number 没有 toUpperCase
\`\`\`

---

## 2. 联合类型 (Union Types)
联合类型表示一个值可以是几种类型之一。我们使用竖线 \`|\` 分隔。

### 实际应用：状态管理
在 React 开发中，我们经常用它来定义有限的状态集合，而不是用模糊的 \`string\`。

\`\`\`typescript
// ❌ 差评：string 太宽泛，容易拼写错误
// let status: string = "loading"; 
// status = "pendin"; // 拼写错误也不会报错

// ✅ 好评：限制取值范围
type Status = 'idle' | 'loading' | 'success' | 'error';

let currentStatus: Status = 'loading';
// currentStatus = 'failed'; // ❌ 报错！'failed' 不在合法的类型中
\`\`\`

> [!TIP]
> 善用联合类型可以让你的业务逻辑更加严谨，IDE 的自动补全也会更智能。
        `
        },
        {
            id: 'lv2-l9',
            title: '9. ESLint 与 Prettier：统一代码品味',
            labId: 'lint-format-lab',
            content: `
# 规范化工具

- **ESLint**: 找 Bug。检查潜在的代码错误和逻辑陷阱。
- **Prettier**: 改格式。强制所有人的代码缩进、分号、单双引号完全一致。

## 价值
减少 Code Review 中的低级争论。
        `
        },
        {
            id: 'lv2-l10',
            title: '10. CI/CD：自动化部署流水线',
            labId: 'ci-cd-lab',
            content: `
# CI/CD：打造可信赖的交付流

手动部署容易出错且难以追溯。现代开发依赖自动化流水线。

## 标准流水线步骤
1. **Checkout**: 拉取代码。
2. **Install**: 安装依赖 (\`npm install\`)。
3. **Lint & Test**: 静态检查与单元测试，这是质量的**安全网**，未通过则禁止部署。
4. **Build**: 构建产物 (\`npm run build\`)。
5. **Deploy**: 上传至服务器或 CDN。

## GitHub Actions 示例
\`\`\`yaml
name: CI/CD
on: [push]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test  # 关键步骤！
      - run: npm run build
\`\`\`

> [!IMPORTANT]
> 无论是个人项目还是企业应用，尽早建立 CI/CD 都是投入产出比最高的基础设施投资。
        `
        }
    ],
    quizzes: [
        {
            id: 'lv2-q1',
            question: '哪个 Git 命令可以将本地未提交的修改临时“存起来”？',
            options: ['git save', 'git stash', 'git backup', 'git pause'],
            correctAnswer: 1,
            explanation: 'git stash 用于将当前工作区和暂存区的改动暂存，方便切换分支。',
            difficulty: 'Easy'
        }
    ]
};

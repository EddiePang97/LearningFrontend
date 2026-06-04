import type { LearningStage } from '../learningPath';

export const lv6: LearningStage = {
    id: 'lv6-fullstack',
    level: 6,
    title: 'Level 6: 跨界 - Node.js 全栈',
    description: '前端开发者的后端进阶之路。掌握 Node.js 核心机制、Web 框架及全栈开发思维。',
    topics: ['Event Loop (Node)', 'Streams', 'Express/Koa', 'NestJS', '数据库基础'],
    keyConcepts: ['非阻塞 I/O', '中间件架构', 'RESTful API', 'SSR'],
    mission: '用 Node.js 搭建一套可被前端真实调用的 API 服务。',
    outcome: '能够设计 REST API、连接数据库、处理认证中间件，并完成基础部署。',
    checklist: ['能解释 Node 事件循环、Stream、Buffer 和模块系统', '能实现 Express/NestJS 中间件、路由、错误处理和接口规范', '能完成数据库建模、登录鉴权、环境配置和 PM2/Docker 部署'],
    resources: [{ name: 'Node.js 官方文档', url: 'https://nodejs.org/' }],
    lessons: [
        {
            id: 'lv6-l1',
            title: '1. Node.js 架构：事件循环与 Libuv',
            labId: 'node-event-loop',
            content: `
# Node.js 核心架构

## 单线程还是多线程？
Node.js 的 **JavaScript 执行** 是单线程的，但其底层的 **I/O 操作** 是由 Libuv 库提供的多线程池处理的。

## 事件循环六阶段
1. **timers**: 执行 setTimeout/setInterval。
2. **pending callbacks**: 执行延迟的 I/O 回调。
3. **idle, prepare**: 内部使用。
4. **poll**: 轮询 I/O 事件。
5. **check**: 执行 setImmediate。
6. **close callbacks**: 执行关闭连接的回调。
        `
        },
        {
            id: 'lv6-l2',
            title: '2. Buffer 与 Stream：处理二进制数据的艺术',
            labId: 'stream-lab',
            content: `
# 缓冲区与流

- **Buffer**: 在内存中开辟的一块固定大小의 区域，用于存储原始二进制数据。
- **Stream**: 像是流水一样处理数据。
  - **Readable**: 可读流。
  - **Writable**: 可写流。
  - **Duplex**: 可读可写。
  - **Transform**: 边读边写的转换流。

> [!TIP]
> 使用流处理大文件（如 4GB 视频），可以避免一次性加载到内存导致 OOM。
        `
        },
        {
            id: 'lv6-l3',
            title: '3. 模块系统：CJS 与 ESM 的终极共存',
            content: `
# Node.js 模块系统

- **CommonJS (require)**: 动态加载，适合运行时导出。
- **ES Modules (import)**: 静态分析，由 \`.mjs\` 后缀或 \`"type": "module"\` 开启。

## 互操作性
在 ESM 中引用 CJS 需要注意 \`__dirname\` 等变量的缺失。
        `
        },
        {
            id: 'lv6-l4',
            title: '4. File System (fs) 实战：同步、异步与 Promises',
            content: `
# 文件系统操作

## 演进过程
1. **fs.readFile**: 回调嵌套（回调地狱）。
2. **fs.readFileSync**: 阻塞进程（不推荐在 Web 环境使用）。
3. **fs.promises.readFile**: 现代 async/await 方式（推荐）。

## 权限管理
理解 \`chmod\` 和 \`chown\` 在文件操作中的重要性。
        `
        },
        {
            id: 'lv6-l5',
            title: '5. 网络编程：构建你的第一个 Http 服务器',
            content: `
# Http 模块基础

\`\`\`javascript
const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello Fullstack!');
});
server.listen(3000);
\`\`\`

## 核心要点
理解请求头 (\`req.headers\`)、响应头 (\`res.setHeader\`) 以及状态码的语义。
        `
        },
        {
            id: 'lv6-l6',
            title: '6. Express 哲学：中间件的工作原理',
            labId: 'middleware-lab',
            content: `
# Express 中间件 (Middleware)

## 洋葱模型
请求进入后，像剥洋葱一样一层层经过中间件。

## 结构
\`(req, res, next) => { ... next(); }\`
如果没有调用 \`next()\`，请求会像断了线的纸鸢一样永远卡住。
        `
        },
        {
            id: 'lv6-l7',
            title: '7. 数据库入门：SQL vs NoSQL',
            content: `
# 数据持久化

- **Relational (MySQL, Postgres)**: 适合结构严谨、强一致性的业务（如交易）。
- **Document (MongoDB)**: 适合灵活、无模式的文档存储。
- **Key-Value (Redis)**: 适合缓存、极速读写。

## ORM / ODM
使用 Prisma, TypeORM 或 Mongoose 简化数据库操作。
        `
        },
        {
            id: 'lv6-l8',
            title: '8. RESTful API 设计规范',
            content: `
# RESTful API

## 语义化动词
- **GET**: 获取。
- **POST**: 新增。
- **PUT**: 全量更新。
- **PATCH**: 局部更新。
- **DELETE**: 删除。

## 无状态性
服务器不存储客户端环境，每个请求都应包含理解该请求所需的全部信息。
        `
        },
        {
            id: 'lv6-l9',
            title: '9. NestJS：企业级应用的首选框架',
            content: `
# NestJS 入门

## 核心概念
- **Modules**: 模块化组织。
- **Controllers**: 处理路由。
- **Providers (Services)**: 业务逻辑，支持**依赖注入**。
        `
        },
        {
            id: 'lv6-l10',
            title: '10. 性能与部署：PM2 与 Docker',
            content: `
# 让你的 Node 飞起来

- **Cluster 模式**: 利用多核 CPU 性能。
- **PM2**: 进程守护工具，支持自动重启、监控、负载均衡。
- **Docker**: 环境打包，确保“在我的机器上能运行”同样能运行在服务器上。

> [!IMPORTANT]
> 前端掌握了后端，就好比拥有了创造整个世界的能力。
        `
        }
    ],
    quizzes: [
        {
            id: 'lv6-q1',
            question: 'Node.js 的事件循环中，setImmediate 属于哪个阶段？',
            options: ['timers', 'poll', 'check', 'close callbacks'],
            correctAnswer: 2,
            explanation: 'check 阶段专门用于执行 setImmediate 回调。',
            difficulty: 'Medium'
        }
    ]
};

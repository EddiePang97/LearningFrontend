import type { LearningStage } from './learningPath';

const backendLv0: LearningStage = {
    id: 'backend-lv0',
    level: 0,
    title: 'Level 0: Node.js 与服务端基础',
    description: '先理解服务端到底在做什么，再学框架。掌握 Node.js 运行时、请求响应模型、路由和中间件的最小闭环。',
    topics: ['Node.js Runtime', 'HTTP Server', 'Request / Response', 'Routing', 'Middleware'],
    keyConcepts: ['事件循环', '单线程并发', '路由分发', '中间件链'],
    mission: '搭建一个能接收请求、分发路由、记录日志并返回 JSON 的最小 Node.js API 服务。',
    outcome: '能解释服务端如何启动、监听端口、处理请求，并说清楚中间件为什么是服务端框架的核心组织方式。',
    checklist: [
        '能画出浏览器请求到 Node.js 服务返回响应的基本路径',
        '能解释为什么 Node.js 单线程仍然可以处理大量并发请求',
        '能实现基础路由、统一 JSON 响应和日志中间件',
    ],
    resources: [
        { name: 'Node.js 官方文档', url: 'https://nodejs.org/en/docs' },
        { name: 'MDN: HTTP 概览', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Overview' },
    ],
    lessons: [
        {
            id: 'backend-lv0-l1',
            title: '1. 服务端程序到底在干什么',
            content: `
# 服务端程序到底在干什么

前端代码运行在浏览器里，而服务端程序运行在服务器进程里。它的核心职责通常有三类：

1. **接收请求**: 监听一个端口，接住客户端发来的 HTTP 请求。
2. **执行业务逻辑**: 查数据库、做权限判断、拼装响应结果。
3. **返回响应**: 把状态码、响应头和响应体回给客户端。

## 一个最小的服务端心智模型

\`\`\`text
Client -> HTTP Request -> Node Process -> Route Handler -> Response
\`\`\`

先建立这个模型，后面学 Express、NestJS、Koa 才不会觉得它们像魔法。
`,
        },
        {
            id: 'backend-lv0-l2',
            title: '2. Node.js 运行时与事件循环',
            labId: 'node-event-loop',
            content: `
# Node.js 运行时与事件循环

Node.js 不是浏览器，它是一个让 JavaScript 可以跑在服务端的运行时。

## 为什么它能高并发？

- JavaScript 主线程一次只执行一段代码。
- 但很多 I/O 工作会交给底层系统能力处理。
- I/O 完成后，再把回调或任务放回事件循环里继续执行。

这意味着 **Node.js 并不靠多线程硬扛所有请求**，而是靠事件驱动和非阻塞 I/O 来提高吞吐。

> [!IMPORTANT]
> “单线程” 不等于 “一次只能服务一个用户”。真正的关键在于：你的代码是不是阻塞了事件循环。
`,
        },
        {
            id: 'backend-lv0-l3',
            title: '3. HTTP 请求、响应与 JSON API',
            content: `
# HTTP 请求、响应与 JSON API

一个后端接口最常见的职责，就是把输入转成输出。

## 你至少要读懂这些部分

- **Method**: GET / POST / PUT / DELETE
- **Path**: 访问的是哪条资源路径
- **Headers**: 元数据，比如 Content-Type、Authorization
- **Body**: 请求负载，通常是 JSON

## 响应也必须结构化

- **Status Code**: 200、201、400、404、500
- **Response Headers**
- **Response Body**

如果响应格式没有统一，前端、测试、日志排查都会变乱。
`,
        },
        {
            id: 'backend-lv0-l4',
            title: '4. 路由分发与中间件链',
            labId: 'middleware-lab',
            content: `
# 路由分发与中间件链

后端项目一旦变大，不能把所有逻辑堆在一个 handler 里。常见的组织方式是：

1. **路由**: 决定这次请求该交给哪个 handler
2. **中间件**: 在真正业务逻辑前后插入通用处理

## 中间件最常见的价值

- 日志记录
- 身份校验
- 请求体解析
- 错误捕获

你可以把它理解成“请求经过的流水线”，每一层都只负责一个明确职责。
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv0-q1',
            question: 'Node.js 能处理高并发请求的关键原因更接近下面哪一个？',
            options: ['因为每个请求都独占一个线程', '因为 JavaScript 执行速度天然比别的语言快', '因为它依赖事件驱动和非阻塞 I/O', '因为所有请求都会被浏览器缓存'],
            correctAnswer: 2,
            explanation: 'Node.js 的吞吐能力核心在于事件循环和非阻塞 I/O，而不是“一请求一线程”。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv0-q2',
            question: '中间件最适合放哪类逻辑？',
            options: ['只属于某一个路由的独占业务逻辑', '日志、鉴权、错误处理这类可复用的横切逻辑', '数据库表结构定义', '前端页面样式'],
            correctAnswer: 1,
            explanation: '中间件最适合承载跨多个接口复用的通用处理能力。',
            difficulty: 'Easy',
        },
    ],
};

const backendLv1: LearningStage = {
    id: 'backend-lv1',
    level: 1,
    title: 'Level 1: REST API 设计与验证',
    description: '从“能返回数据”升级到“接口有边界、有契约、有错误模型”。学会资源建模、状态码、校验和一致的响应格式。',
    topics: ['REST', 'Resource Modeling', 'Validation', 'Status Code', 'Error Format'],
    keyConcepts: ['资源导向', '输入验证', '错误契约', '幂等性'],
    mission: '设计一组结构清晰、错误可预期的课程或任务管理 API，并为输入、状态码和错误格式建立统一规范。',
    outcome: '能独立设计 CRUD API，知道路径、方法、状态码、请求体和错误结构该如何配合。',
    checklist: [
        '能把业务对象拆成清晰的资源路径和操作方式',
        '能区分 200 / 201 / 204 / 400 / 404 / 409 的典型场景',
        '能为输入错误、业务错误和系统错误定义不同响应方式',
    ],
    resources: [
        { name: 'MDN: HTTP 响应状态码', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status' },
        { name: 'RESTful API Design Best Practices', url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design' },
    ],
    lessons: [
        {
            id: 'backend-lv1-l1',
            title: '1. 资源导向设计：先设计对象，再设计接口',
            content: `
# 资源导向设计

很多初学者会先想“我要写几个接口”，更成熟的做法是先想：

- 系统里有哪些核心资源？
- 它们之间是什么关系？
- 用户会对它们执行哪些动作？

比如课程平台里，\`courses\`、\`lessons\`、\`progress\` 都可以视为资源。这样路径会自然演化成：

\`\`\`text
GET    /courses
GET    /courses/:id
POST   /courses
PATCH  /courses/:id
DELETE /courses/:id
\`\`\`

比起 \`/getCourseList\` 这类“动作式命名”，资源式路径更容易扩展，也更容易被团队理解。
`,
        },
        {
            id: 'backend-lv1-l2',
            title: '2. 状态码不是装饰，它是接口契约的一部分',
            content: `
# 状态码的职责

状态码不是“随便都回 200”，它是客户端判断结果的第一层信号。

## 典型分工

- **200 OK**: 成功返回结果
- **201 Created**: 成功创建资源
- **204 No Content**: 成功，但无需返回 body
- **400 Bad Request**: 输入格式不合法
- **404 Not Found**: 请求的资源不存在
- **409 Conflict**: 状态冲突，比如重复创建
- **500 Internal Server Error**: 服务端未预期异常

如果状态码用乱了，前端和调用方就只能靠猜。
`,
        },
        {
            id: 'backend-lv1-l3',
            title: '3. 输入验证：不要把脏数据放进系统',
            content: `
# 输入验证

接口的第一道防线不是数据库，而是输入验证。

## 至少要验证这些维度

- 类型是否正确
- 必填字段是否缺失
- 字符串长度是否合法
- 枚举值是否落在允许范围
- 数值边界是否超出

验证失败时，返回结构也应该统一，而不是一会儿字符串、一会儿数组、一会儿抛栈信息。
`,
        },
        {
            id: 'backend-lv1-l4',
            title: '4. 一致的错误响应模型',
            labId: 'api-contract-lab',
            content: `
# 一致的错误响应模型

一个成熟 API 不只是“成功返回长什么样”，也要规定“失败返回长什么样”。

例如：

\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "title is required",
    "details": [
      { "field": "title", "reason": "required" }
    ]
  }
}
\`\`\`

这样前端、测试和日志平台都能稳定消费错误信息，而不是靠字符串匹配。
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv1-q1',
            question: '创建成功一个新资源时，最合适的状态码通常是什么？',
            options: ['200', '201', '204', '409'],
            correctAnswer: 1,
            explanation: '201 Created 明确表示服务器已成功创建资源。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv1-q2',
            question: '为什么输入验证应该尽量发生在请求进入业务逻辑之前？',
            options: ['因为这样数据库会更快', '因为这样可以尽早阻止脏数据进入系统', '因为这样前端就不需要校验了', '因为这样状态码都可以统一返回 200'],
            correctAnswer: 1,
            explanation: '越早阻止无效输入，越能减少系统内部污染和排查成本。',
            difficulty: 'Medium',
        },
    ],
};

const backendLv2: LearningStage = {
    id: 'backend-lv2',
    level: 2,
    title: 'Level 2: 认证、授权与会话',
    description: '把“谁能进来、进来后能做什么”讲清楚。理解 Session、Cookie、Token、JWT 和 RBAC 的角色分工。',
    topics: ['Authentication', 'Authorization', 'Session', 'JWT', 'RBAC'],
    keyConcepts: ['身份校验', '权限控制', '有状态会话', '无状态令牌'],
    mission: '设计一个带登录态和角色权限的 API 流程，让普通用户和管理员拥有不同能力边界。',
    outcome: '能区分认证与授权，知道 Cookie / Session 与 Token / JWT 各自适合什么场景，并能设计基础角色权限模型。',
    checklist: [
        '能解释认证和授权不是一回事',
        '能说明 Session / Cookie 与 JWT / Token 的主要差异',
        '能设计“登录后是谁、能做什么、何时失效”的最小权限模型',
    ],
    resources: [
        { name: 'OWASP Authentication Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
        { name: 'JWT Introduction', url: 'https://jwt.io/introduction' },
    ],
    lessons: [
        {
            id: 'backend-lv2-l1',
            title: '1. 认证与授权，不要混成一个词',
            content: `
# 认证与授权

- **认证 (Authentication)**: 你是谁？
- **授权 (Authorization)**: 你能做什么？

一个用户成功登录，只说明“身份成立”，并不自动代表“可以访问所有接口”。

## 常见例子

- 登录成功：完成了认证
- 只有管理员能删除课程：这是授权
`,
        },
        {
            id: 'backend-lv2-l2',
            title: '2. Cookie、Session 与服务端会话',
            content: `
# Cookie 与 Session

Cookie 是浏览器保存的一小段数据，Session 则通常是服务端保存的会话状态。

常见模式是：

1. 用户登录成功
2. 服务端创建一条 session 记录
3. 浏览器收到 session id 并用 Cookie 带回
4. 后续请求靠这个 id 找回登录态

这种方式的特点是：**状态主要存在服务端**。
`,
        },
        {
            id: 'backend-lv2-l3',
            title: '3. Token、JWT 与无状态认证',
            labId: 'jwt-lab',
            content: `
# Token 与 JWT

另一种常见方案是登录后签发 Token，而不是在服务端保存完整会话。

## JWT 里通常有什么

- 用户标识
- 角色或权限信息
- 过期时间
- 签名

它的价值是把一部分身份信息打包进令牌里，减少服务端查 Session 的依赖。但要注意：

- JWT **不是天然更安全**
- 一旦签发出去，失效控制、撤销策略都要单独设计
`,
        },
        {
            id: 'backend-lv2-l4',
            title: '4. RBAC：把权限写成模型，而不是写死在 if 里',
            labId: 'rbac-lab',
            content: `
# RBAC 权限模型

RBAC = Role-Based Access Control，基于角色的访问控制。

## 一个最小心智模型

- 用户属于某个角色
- 角色拥有一组权限
- 接口或操作要求某个权限

例如：

- student: read:lesson
- editor: read:lesson, update:lesson
- admin: *

这样权限就不再散落在各种业务判断里，而是进入可维护的模型层。
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv2-q1',
            question: '“用户已经登录成功，但没有删除课程的权限” 这句话主要描述的是哪一层问题？',
            options: ['认证失败', '授权限制', '数据库索引问题', '缓存失效'],
            correctAnswer: 1,
            explanation: '登录成功说明认证通过，但是否允许执行删除动作属于授权问题。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv2-q2',
            question: 'Session 方案和 JWT 方案的一个关键差别更接近下面哪项？',
            options: ['Session 只能用于前端项目', 'JWT 不需要 HTTP', 'Session 更偏服务端持有状态，JWT 更偏令牌自带信息', 'JWT 一定比 Session 更安全'],
            correctAnswer: 2,
            explanation: '两者最核心的差异是状态主要存放在哪里，以及后续身份恢复如何完成。',
            difficulty: 'Medium',
        },
    ],
};

const backendLv3: LearningStage = {
    id: 'backend-lv3',
    level: 3,
    title: 'Level 3: SQL 与 PostgreSQL',
    description: '从“会查数据”升级到“能为业务建模”。理解表结构、主键、索引、事务与约束，让数据库成为系统可靠性的支撑而不是黑盒。',
    topics: ['SQL', 'PostgreSQL', 'Schema Design', 'Index', 'Transaction'],
    keyConcepts: ['范式与反范式', '查询计划', '事务边界', '约束一致性'],
    mission: '为课程、用户和学习进度设计一组可扩展的数据表，并写出能够稳定支持业务的查询与更新逻辑。',
    outcome: '能独立设计关系型 schema，解释索引与事务为什么存在，并判断哪些查询会成为性能瓶颈。',
    checklist: [
        '能把一个业务对象集合拆成清晰的数据表与关系',
        '能解释主键、外键、唯一约束和索引分别在保护什么',
        '能说明为什么有些更新必须放进同一个事务里',
    ],
    resources: [
        { name: 'PostgreSQL Documentation', url: 'https://www.postgresql.org/docs/' },
        { name: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/' },
    ],
    lessons: [
        {
            id: 'backend-lv3-l1',
            title: '1. 数据建模：先想关系，再想字段',
            content: `
# 数据建模

关系型数据库不是“想到什么字段就加什么字段”，而是先思考：

- 系统里有哪些实体？
- 它们之间是什么关系？
- 哪些数据应该拆表，哪些应该留在一起？

例如课程平台里，\`users\`、\`courses\`、\`lessons\`、\`progress\` 是不同职责的数据对象。它们的边界想清楚，后面的查询和权限才不会混乱。
`,
        },
        {
            id: 'backend-lv3-l2',
            title: '2. 主键、外键、唯一约束到底在保护什么',
            content: `
# 约束不是束缚，而是保护

- **主键**: 唯一标识一行数据
- **外键**: 保证引用关系有效
- **唯一约束**: 防止重复业务数据
- **非空约束**: 防止关键字段缺失

很多业务 bug 表面看像代码问题，本质上是数据库没有帮你守住边界。
`,
        },
        {
            id: 'backend-lv3-l3',
            title: '3. 索引与查询性能：为什么查得慢',
            labId: 'index-query-lab',
            content: `
# 索引与查询性能

索引的价值不是“让一切都变快”，而是让数据库在某些查找路径上减少扫描成本。

## 常见误区

- 不是字段越多索引越好
- 不是每个查询都能命中索引
- 写入越频繁，索引维护成本越高

所以索引本质上是 **读取性能、写入成本、存储空间** 之间的交易。
`,
        },
        {
            id: 'backend-lv3-l4',
            title: '4. 事务：把必须一起成功的操作绑在一起',
            labId: 'transaction-lab',
            content: `
# 事务

事务的核心问题不是“数据库高级特性”，而是：

> 哪几步操作如果只成功一半，系统就会坏掉？

例如创建订单并扣库存，如果只做成其中一步，就会产生错误状态。事务的价值就是保证这一组操作要么一起成功，要么一起回滚。
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv3-q1',
            question: '下面哪一个最适合放进同一个事务里？',
            options: ['读取首页课程列表', '创建订单并扣减库存', '渲染一个前端按钮', '记录一条本地调试日志'],
            correctAnswer: 1,
            explanation: '当多步更新必须一起成功时，事务才能保护业务一致性。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv3-q2',
            question: '索引的主要价值更接近下面哪项？',
            options: ['让所有 SQL 都自动变快', '减少某些查询路径的扫描成本', '替代事务保证一致性', '减少网络延迟'],
            correctAnswer: 1,
            explanation: '索引主要优化特定查询路径，不是全能提速按钮。',
            difficulty: 'Medium',
        },
    ],
};

const backendLv4: LearningStage = {
    id: 'backend-lv4',
    level: 4,
    title: 'Level 4: 缓存与 Redis',
    description: '学会在“快”和“对”之间做权衡。理解缓存为什么会快，也理解缓存为什么会脏、会失效、会把系统复杂度拉高。',
    topics: ['Redis', 'Cache Aside', 'TTL', 'Consistency', 'Hot Key'],
    keyConcepts: ['缓存命中', '缓存失效', '一致性窗口', '穿透与雪崩'],
    mission: '为高频读取接口设计一层可靠缓存，并解释它在性能、失效策略和数据一致性上的取舍。',
    outcome: '能判断哪些数据适合缓存，什么时候该更新缓存，什么时候宁可回源数据库。',
    checklist: [
        '能区分缓存提升的是哪类请求性能',
        '能解释 TTL、主动失效和回源更新各自的代价',
        '能识别缓存穿透、击穿、雪崩等典型风险',
    ],
    resources: [
        { name: 'Redis Documentation', url: 'https://redis.io/docs/latest/' },
        { name: 'Cache-Aside Pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside' },
    ],
    lessons: [
        {
            id: 'backend-lv4-l1',
            title: '1. 为什么缓存能让系统变快',
            content: `
# 缓存的价值

缓存最核心的作用是：把昂贵的数据获取路径，换成更便宜的读取路径。

常见场景包括：

- 热门课程列表
- 首页聚合统计
- 用户基础资料

这些数据如果每次都回源数据库，成本会持续叠加；如果命中缓存，就可以明显减少后端压力和响应时间。
`,
        },
        {
            id: 'backend-lv4-l2',
            title: '2. Cache Aside：最常见也最容易出问题的模式',
            labId: 'cache-aside-lab',
            content: `
# Cache Aside

最常见的缓存流程是：

1. 先查缓存
2. 缓存没有命中，再查数据库
3. 把数据库结果写回缓存

这很常见，但难点在于：

- 更新数据库后何时失效缓存
- 并发请求同时打空缓存怎么办
- 热点数据过期瞬间会不会把数据库打爆
`,
        },
        {
            id: 'backend-lv4-l3',
            title: '3. TTL、一致性与失效策略',
            content: `
# TTL 与一致性

缓存不是数据库副本，它天生就可能短时间不一致。

## 你要回答的不是“能不能脏”
而是：

- 可以脏多久？
- 用户能不能接受这段不一致？
- 失效时是立即重建，还是下次读取再回源？

不同业务对一致性的容忍度差别很大，课程浏览量和支付状态绝不能一视同仁。
`,
        },
        {
            id: 'backend-lv4-l4',
            title: '4. 穿透、击穿、雪崩：缓存事故的三种典型形态',
            content: `
# 三类缓存事故

- **穿透**: 请求的数据根本不存在，缓存和数据库都扛不住
- **击穿**: 一个热点 key 失效瞬间，大量请求同时回源
- **雪崩**: 大量 key 同时失效，回源流量成片爆发

理解这些模式，才能设计出真正稳定的缓存策略，而不是只会“加个 Redis”。
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv4-q1',
            question: '缓存 aside 模式里，缓存没命中后最常见的下一步是什么？',
            options: ['立刻返回 500', '直接丢弃请求', '回源数据库并把结果写回缓存', '重启 Redis'],
            correctAnswer: 2,
            explanation: 'Cache Aside 的典型流程就是 miss 后回源，再回填缓存。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv4-q2',
            question: '一个热点 key 过期瞬间，大量请求一起打到数据库，这种问题更接近哪一种？',
            options: ['缓存穿透', '缓存击穿', '缓存雪崩', '跨站请求伪造'],
            correctAnswer: 1,
            explanation: '热点 key 失效后集中回源通常称为缓存击穿。',
            difficulty: 'Medium',
        },
    ],
};

const backendLv5: LearningStage = {
    id: 'backend-lv5',
    level: 5,
    title: 'Level 5: 队列与后台任务',
    description: '把“用户请求马上要结果”和“系统稍后慢慢处理”拆开。理解消息队列、异步任务、重试、幂等和失败补偿。',
    topics: ['Queue', 'Background Job', 'Retry', 'Idempotency', 'Scheduler'],
    keyConcepts: ['异步解耦', '最终一致性', '死信处理', '任务可重入'],
    mission: '设计一个把主请求和后台处理分离的任务链路，例如邮件发送、报告生成或视频转码。',
    outcome: '能识别哪些工作不该阻塞主请求，并能设计带重试和幂等保护的后台任务流程。',
    checklist: [
        '能判断什么场景更适合异步处理',
        '能解释为什么重试机制必须搭配幂等设计',
        '能说明任务失败后如何补偿或人工介入',
    ],
    resources: [
        { name: 'BullMQ Guide', url: 'https://docs.bullmq.io/' },
        { name: 'Designing Data-Intensive Applications Notes', url: 'https://dataintensive.net/' },
    ],
    lessons: [
        {
            id: 'backend-lv5-l1',
            title: '1. 哪些事情不应该阻塞主请求',
            content: `
# 请求链路与后台任务

不是所有工作都应该在 HTTP 请求里同步完成。

典型适合异步化的工作：

- 发邮件
- 生成报表
- 处理图片或视频
- 发送通知

这些任务往往耗时长、失败概率高，或者用户不需要立刻看到结果。把它们留在主请求里，会拖慢接口并放大失败范围。
`,
        },
        {
            id: 'backend-lv5-l2',
            title: '2. 消息队列的价值：解耦、削峰、异步',
            content: `
# 队列的价值

队列不是为了“显得架构高级”，而是解决几个真实问题：

- **解耦**: 生产者不必直接等待消费者完成
- **削峰**: 流量高峰时先排队，后面慢慢处理
- **异步**: 用户请求可以更快返回

所以队列本质上是在时间上把系统拆开，让主链路更稳定。
`,
        },
        {
            id: 'backend-lv5-l3',
            title: '3. 重试机制：失败后再来一次，但不能乱来',
            labId: 'queue-retry-lab',
            content: `
# 重试机制

很多后台任务失败不是永久失败，而是临时失败，例如网络波动、第三方服务短暂超时。

这时重试很有价值，但如果没有边界，会带来更大问题：

- 无限重试把系统拖垮
- 重复执行导致脏数据
- 下游被反复轰炸

所以重试必须和延迟、次数上限、告警策略一起设计。
`,
        },
        {
            id: 'backend-lv5-l4',
            title: '4. 幂等性：为什么“再执行一次”不应该把结果做坏',
            content: `
# 幂等性

队列系统里一个任务被执行多次并不罕见，所以你必须回答：

> 同一个任务如果再次执行，结果还能不能保持正确？

例如：

- 已经发过的欢迎邮件，不应无限重复发
- 已经处理过的支付回调，不应重复扣款

幂等性设计的目标不是“绝不重试”，而是“即使重试也不把业务状态做坏”。
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv5-q1',
            question: '下面哪类工作最适合放入后台任务队列？',
            options: ['用户点击按钮后的 CSS 动画', '数据库主键生成', '报表生成并邮件发送', '浏览器本地输入校验'],
            correctAnswer: 2,
            explanation: '报表生成和邮件发送通常耗时较长，而且不必阻塞主请求。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv5-q2',
            question: '为什么任务重试通常必须搭配幂等性设计？',
            options: ['因为这样 prettier 才会通过', '因为重复执行可能把业务状态做坏', '因为 Redis 不支持重试', '因为这样前端页面会更快'],
            correctAnswer: 1,
            explanation: '没有幂等保护的重试，很容易产生重复扣款、重复通知等严重业务错误。',
            difficulty: 'Medium',
        },
    ],
};

const backendLv6: LearningStage = {
    id: 'backend-lv6',
    level: 6,
    title: 'Level 6: 文件、对象存储与流',
    description: '把“上传一个文件”这件事拆开来看。理解文件为什么不能简单塞进普通请求、对象存储如何协作、流式处理为什么能降低内存压力。',
    topics: ['Upload', 'Object Storage', 'Stream', 'Signed URL', 'Content Delivery'],
    keyConcepts: ['二进制传输', '流式处理', '直传与回源', '访问控制'],
    mission: '设计一个安全可靠的文件上传、存储与访问流程，支持图片、附件或课程资源的管理。',
    outcome: '能解释文件上传链路、对象存储职责和流式处理价值，并能判断哪些文件不该由业务服务直接长期托管。',
    checklist: [
        '能区分业务 API 和文件存储服务在职责上的边界',
        '能解释为什么大文件处理更适合流式而不是一次性读入内存',
        '能说明上传、访问、权限和过期链接之间的关系',
    ],
    resources: [
        { name: 'Node.js Streams', url: 'https://nodejs.org/api/stream.html' },
        { name: 'AWS S3 Concepts', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html' },
    ],
    lessons: [
        {
            id: 'backend-lv6-l1',
            title: '1. 文件上传不只是一个表单提交',
            content: `
# 文件上传链路

用户点“上传”之后，后端面临的问题远不只是“把 bytes 收到手”：

- 文件大小是否可接受
- 类型是否可信
- 是否应该落本地磁盘、对象存储，还是临时中转
- 上传成功后元数据如何入库

如果把文件当普通 JSON 一样看待，后面很容易在性能、权限和存储成本上踩坑。
`,
        },
        {
            id: 'backend-lv6-l2',
            title: '2. 对象存储：为什么文件常常不直接放业务服务里',
            content: `
# 对象存储的职责

课程封面、附件、导出报表、视频资源这些文件，通常更适合放在对象存储里，而不是由业务服务长期直接托管。

对象存储的价值在于：

- 更便宜的大规模存储
- 更成熟的访问策略
- 更容易和 CDN、签名链接、生命周期管理配合

业务服务更应该负责“谁可以上传、谁可以访问、元数据怎么记录”，而不是自己变成文件服务器。
`,
        },
        {
            id: 'backend-lv6-l3',
            title: '3. 流式处理：为什么大文件不该整块读进内存',
            labId: 'stream-lab',
            content: `
# 流式处理

当文件很大时，一次性把整份内容读进内存会带来明显风险：

- 内存占用飙升
- GC 压力变大
- 并发上传时服务更容易失稳

流式处理的价值就是：**边读边写、边传边处理**，让大文件链路对内存更友好。
`,
        },
        {
            id: 'backend-lv6-l4',
            title: '4. 上传权限、签名链接与安全访问',
            labId: 'signed-url-lab',
            content: `
# 文件访问控制

上传成功不代表谁都能下载。

常见做法包括：

- 后端校验上传身份
- 生成带时效的签名 URL
- 区分公开资源与私有资源
- 控制 Content-Type 和可访问时长

文件系统一旦失去访问边界，往往比普通 API 泄漏更难收拾。
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv6-q1',
            question: '为什么大文件处理通常更适合流式而不是一次性读入内存？',
            options: ['因为这样 prettier 更容易格式化', '因为这样能降低内存压力并提升大文件链路稳定性', '因为这样就不需要网络传输了', '因为数据库不支持大文件'],
            correctAnswer: 1,
            explanation: '流式处理的关键价值就是边读边写，减少大文件对内存的冲击。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv6-q2',
            question: '对象存储在文件系统里的核心职责更接近下面哪项？',
            options: ['替代所有业务 API', '负责大规模文件存储与访问能力，业务服务负责权限与元数据', '专门用来跑前端组件', '只用于缓存 SQL 查询'],
            correctAnswer: 1,
            explanation: '对象存储与业务服务应各自承担最擅长的职责。',
            difficulty: 'Medium',
        },
    ],
};

const backendLv7: LearningStage = {
    id: 'backend-lv7',
    level: 7,
    title: 'Level 7: 可观测性',
    description: '让线上服务从“出问题只能猜”变成“出问题能定位”。掌握日志、指标、追踪和告警的配合方式。',
    topics: ['Log', 'Metric', 'Trace', 'Alert', 'Observability'],
    keyConcepts: ['结构化日志', 'SLI/SLO', '分布式追踪', '告警噪音控制'],
    mission: '为后端服务补齐最小可观测性能力，让核心请求路径和故障状态都能被记录、查询和告警。',
    outcome: '能通过日志、指标和 trace 组合判断线上问题发生在哪里、影响了谁、优先级有多高。',
    checklist: [
        '能区分日志、指标和追踪解决的是不同问题',
        '能为关键请求路径设计最小可观测性信号',
        '能解释为什么告警不是越多越好',
    ],
    resources: [
        { name: 'OpenTelemetry', url: 'https://opentelemetry.io/docs/' },
        { name: 'Google SRE Workbook', url: 'https://sre.google/workbook/table-of-contents/' },
    ],
    lessons: [
        {
            id: 'backend-lv7-l1',
            title: '1. 日志：先让问题留下证据',
            labId: 'monitoring-lab',
            content: `
# 日志

没有日志时，线上问题通常只能靠猜。

好的日志至少要回答：

- 发生了什么
- 发生在什么时候
- 影响了哪个请求、哪个用户或哪个资源
- 错误发生前后上下文是什么

比起随手 \`console.log\`，更成熟的做法是结构化日志，让后续查询和聚合更稳定。
`,
        },
        {
            id: 'backend-lv7-l2',
            title: '2. 指标：看趋势，而不是只看单次错误',
            content: `
# 指标

日志适合看单个事件，指标更适合看整体趋势。

例如：

- 请求量 QPS
- 错误率
- 平均延迟 / P95 / P99
- 队列堆积长度

指标的价值是帮你判断：这是偶发问题，还是系统级退化。
`,
        },
        {
            id: 'backend-lv7-l3',
            title: '3. Trace：一条请求到底卡在哪一段',
            content: `
# Trace

当一个请求会穿过网关、应用服务、数据库、缓存甚至消息队列时，单靠日志很难完整还原路径。

Trace 的价值就是把一条请求跨多个组件的执行链路串起来，回答：

- 慢在哪一段
- 哪个下游最耗时
- 哪个服务开始报错
`,
        },
        {
            id: 'backend-lv7-l4',
            title: '4. 告警：别让人被噪音淹没',
            content: `
# 告警设计

告警不是“什么都报”，而是“真的值得立刻关注的才报”。

如果告警太多、太泛、太不稳定，团队会迅速麻木。成熟告警更看重：

- 是否真影响用户
- 是否需要立即处理
- 是否能明确定位负责人

告警系统的目标是触发行动，不是制造噪音。
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv7-q1',
            question: '如果你想看整个平台错误率是不是在持续上升，最优先该看哪类信号？',
            options: ['CSS 变量', '指标', '本地环境变量', 'Git 分支名'],
            correctAnswer: 1,
            explanation: '错误率、延迟分位数等整体趋势更适合通过指标观察。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv7-q2',
            question: 'Trace 最适合帮助回答哪类问题？',
            options: ['页面按钮颜色为什么不统一', '一条请求跨多个组件时慢在哪一段', '如何压缩图片资源', '如何写 prettier 配置'],
            correctAnswer: 1,
            explanation: 'Trace 的强项是串起多组件请求链路，定位慢点和故障段。',
            difficulty: 'Medium',
        },
    ],
};

const backendLv8: LearningStage = {
    id: 'backend-lv8',
    level: 8,
    title: 'Level 8: 后端安全',
    description: '从“接口能用”升级到“接口在真实攻击面前站得住”。理解限流、密钥管理、输入安全、最小权限和常见 Web 攻击防护。',
    topics: ['Rate Limit', 'Secrets', 'OWASP', 'Input Security', 'Threat Modeling'],
    keyConcepts: ['最小权限', '攻击面', '纵深防御', '安全默认值'],
    mission: '为一个公开 API 服务补齐最核心的安全边界，降低滥用、注入、泄漏和错误配置风险。',
    outcome: '能识别常见后端攻击面，并设计基本的速率限制、输入安全、密钥管理和权限隔离方案。',
    checklist: [
        '能列出一个公开后端服务最常见的攻击面',
        '能解释为什么密钥管理和最小权限要前置设计',
        '能说明限流、输入校验和安全日志分别保护什么',
    ],
    resources: [
        { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
        { name: 'OWASP API Security Top 10', url: 'https://owasp.org/www-project-api-security/' },
    ],
    lessons: [
        {
            id: 'backend-lv8-l1',
            title: '1. 后端真正暴露给世界的攻击面有哪些',
            content: `
# 攻击面

后端安全不是某一个“安全中间件”能一把解决的问题。

典型攻击面包括：

- 对外公开 API
- 登录与注册入口
- 文件上传
- 管理后台接口
- 第三方回调入口

先把攻击面列出来，才能谈防护优先级。
`,
        },
        {
            id: 'backend-lv8-l2',
            title: '2. 输入安全：别让用户输入变成系统武器',
            labId: 'cors-lab',
            content: `
# 输入安全

任何用户输入、第三方回调、上传内容，本质上都不可信。

你至少要考虑：

- 类型与格式校验
- 长度和边界控制
- 特殊字符和注入风险
- 文件类型与 MIME 欺骗

输入安全不是“前端做过了就算了”，真正的信任边界在后端。
`,
        },
        {
            id: 'backend-lv8-l3',
            title: '3. 限流、密钥与最小权限',
            labId: 'rate-limit-lab',
            content: `
# 限流、密钥与最小权限

一个公开 API 如果没有限流，迟早会遇到滥用、撞库或成本失控问题。

同时，安全不只看请求入口，还要看系统内部：

- 密钥是否硬编码
- 服务账户权限是不是过大
- 管理接口是否隔离

安全设计的核心不是“绝不出事”，而是即使某一层失手，也不要一口气全线失守。
`,
        },
        {
            id: 'backend-lv8-l4',
            title: '4. 威胁建模：先想最坏情况，再决定先防什么',
            labId: 'csp-lab',
            content: `
# 威胁建模

安全资源永远有限，所以你需要判断：

- 谁最可能攻击你
- 最有价值的资产是什么
- 一旦泄漏，损失最大的是哪部分

威胁建模不是写 PPT，而是帮你决定：

> 本阶段最该优先补哪几道安全边界？
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv8-q1',
            question: '为什么后端仍然必须做输入校验，即使前端已经校验过了？',
            options: ['因为后端喜欢重复劳动', '因为前端校验无法构成真正的信任边界', '因为数据库不会存字符串', '因为这样响应时间一定更快'],
            correctAnswer: 1,
            explanation: '前端输入可以被绕过，真正可信的安全边界必须落在后端。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv8-q2',
            question: '最小权限原则的目标更接近下面哪项？',
            options: ['让所有服务都拥有管理员权限', '让每个组件只拥有完成职责所需的最小权限', '把所有密钥写死在仓库里', '减少所有日志输出'],
            correctAnswer: 1,
            explanation: '最小权限能降低单点失守后的横向扩散风险。',
            difficulty: 'Medium',
        },
    ],
};

const backendLv9: LearningStage = {
    id: 'backend-lv9',
    level: 9,
    title: 'Level 9: 后端系统设计',
    description: '把前面学过的 API、数据库、缓存、队列、观测和安全放进同一张图里。学会从流量、数据、故障和成本的角度设计一个能扩展的服务架构。',
    topics: ['System Design', 'Scalability', 'Reliability', 'Tradeoff', 'Capacity Planning'],
    keyConcepts: ['扩展策略', '瓶颈迁移', '冗余与容灾', '一致性与可用性取舍'],
    mission: '围绕一个真实后端业务场景，设计出从入口流量到存储、缓存、异步处理和观测告警的一整套服务架构。',
    outcome: '能从请求路径、数据规模、流量高峰、故障恢复和成本控制多个角度解释一个后端系统为什么这样设计。',
    checklist: [
        '能把系统拆成入口层、业务层、数据层和异步处理层',
        '能解释系统瓶颈为什么会随着规模变化不断迁移',
        '能讨论一致性、可用性、复杂度与成本之间的真实取舍',
    ],
    resources: [
        { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
        { name: 'Google SRE Book', url: 'https://sre.google/sre-book/table-of-contents/' },
    ],
    lessons: [
        {
            id: 'backend-lv9-l1',
            title: '1. 系统设计不是画框图，而是解释压力怎么流动',
            content: `
# 系统设计的真正问题

系统设计不是“会不会画负载均衡 + 数据库 + Redis”。

真正要回答的是：

- 流量从哪里进来
- 压力最大会落在哪一段
- 哪一层先成为瓶颈
- 出现故障时系统会怎样退化

只有当你把这些问题讲清楚，架构图才有意义。
`,
        },
        {
            id: 'backend-lv9-l2',
            title: '2. 扩展策略：纵向扩展、横向扩展与拆分边界',
            labId: 'system-design-lab',
            content: `
# 扩展策略

系统增长时，最先想到的往往是“多加几台机器”，但扩展并不只是一种方式。

## 常见路径

- **纵向扩展**: 单机更强，简单但有上限
- **横向扩展**: 多实例分担流量，更灵活但会引入一致性和路由问题
- **服务拆分**: 不同能力拆成独立边界，但复杂度明显上升

设计的关键不是背术语，而是判断：在当前阶段，哪种扩展最划算。
`,
        },
        {
            id: 'backend-lv9-l3',
            title: '3. 数据、缓存、队列如何一起配合',
            content: `
# 数据层协同设计

一个成熟后端系统通常不会只靠数据库单点扛所有事情。

常见配合方式：

- 数据库保证核心持久化与事务一致性
- 缓存吸收高频读取
- 队列承接异步与削峰任务

但这也意味着：系统复杂度变高后，你需要主动管理一致性窗口、回源策略和失败补偿。
`,
        },
        {
            id: 'backend-lv9-l4',
            title: '4. 故障、降级与恢复：系统设计的下半场',
            content: `
# 故障与恢复

真正生产级的系统设计，不只考虑“平时怎么跑”，还必须考虑“坏了以后怎么退”。

## 你至少要能回答

- 某个依赖挂了以后，系统还能保留哪些核心能力
- 哪些功能应该优先降级
- 如何发现故障已经发生
- 恢复后如何确认数据和状态没有进一步损坏

能否优雅退化，往往比“平时跑得多快”更能决定系统成熟度。
`,
        },
    ],
    quizzes: [
        {
            id: 'backend-lv9-q1',
            question: '系统设计里最值得优先回答的问题更接近下面哪项？',
            options: ['图画得是否复杂', '流量、数据和故障压力会落在哪些环节', '按钮颜色是否统一', '代码缩进是否为 2 空格'],
            correctAnswer: 1,
            explanation: '系统设计的核心是解释压力、瓶颈和故障如何在系统中流动。',
            difficulty: 'Easy',
        },
        {
            id: 'backend-lv9-q2',
            question: '为什么成熟的系统设计必须讨论降级与恢复？',
            options: ['因为这样面试听起来更高级', '因为真实系统一定会遇到依赖故障，必须提前想好还能保留哪些核心能力', '因为这样可以完全避免所有错误', '因为数据库本身就会自动修复所有问题'],
            correctAnswer: 1,
            explanation: '生产系统不可避免会遇到故障，提前设计降级和恢复策略是成熟度的一部分。',
            difficulty: 'Medium',
        },
    ],
};

export const BACKEND_STAGES: LearningStage[] = [
    backendLv0,
    backendLv1,
    backendLv2,
    backendLv3,
    backendLv4,
    backendLv5,
    backendLv6,
    backendLv7,
    backendLv8,
    backendLv9,
];

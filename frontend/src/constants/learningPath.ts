export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Lesson {
    id: string;
    title: string;
    content: string;
    labId?: 'box-model' | 'layout-spatial' | 'flex-box' | 'grid-layout' | 'specificity' | 'event-loop' | 'closure-scope' | 'prototype-chain' | 'this-binding' | 'bundler-flow' | 'webpack-pipeline' | 'typescript-check' | 'typescript-advanced' | 'lint-format-lab' | 'ci-cd-lab' | 'virtual-dom' | 'react-hooks' | 'react-perf-lab' | 'state-mgmt' | 'component-patterns' | 'fiber-architecture' | 'web-vitals-lab' | 'resource-hints-lab' | 'media-optimization-lab' | 'code-splitting-lab' | 'crp-process' | 'web-workers' | 'http-cache' | 'xss-lab' | 'cors-lab' | 'jwt-lab' | 'csrf-lab' | 'csp-lab' | 'node-event-loop' | 'stream-lab' | 'middleware-lab' | 'big-o-lab' | 'sorting-lab' | 'tree-lab' | 'recursion-lab' | 'array-ll-lab' | 'stack-queue-lab' | 'hash-table-lab' | 'search-lab' | 'dp-lab' | 'design-patterns-lab' | 'mfe-lab' | 'solid-lab' | 'concurrency-lab' | 'deep-clone-lab' | 'reactivity-lab' | 'monitoring-lab' | 'virtual-list-lab' | 'queue-retry-lab' | 'system-design-lab' | 'transaction-lab' | 'index-query-lab' | 'rbac-lab' | 'cache-aside-lab' | 'signed-url-lab' | 'rate-limit-lab' | 'api-contract-lab';
}

export interface LearningStage {
    id: string;
    level: number;
    title: string;
    description: string;
    topics: string[];
    keyConcepts: string[];
    mission: string;
    outcome: string;
    checklist: string[];
    resources: { name: string; url: string }[];
    quizzes: QuizQuestion[];
    lessons: Lesson[];
}

export interface LearningTrack {
    id: 'frontend' | 'backend' | 'fullstack' | 'network';
    title: string;
    shortTitle: string;
    description: string;
    mission: string;
    stages: LearningStage[];
}

import { ALL_STAGES } from './stages';
import { BACKEND_STAGES } from './backendStages';

export const LEARNING_PATH: LearningStage[] = ALL_STAGES;

const createPlaceholderStage = (
    trackId: LearningTrack['id'],
    level: number,
    title: string,
    description: string,
    topics: string[],
    mission: string,
    outcome: string
): LearningStage => ({
    id: `${trackId}-lv${level}`,
    level,
    title: `Level ${level}: ${title}`,
    description,
    topics,
    keyConcepts: topics,
    mission,
    outcome,
    checklist: [
        '完成本 level 的核心概念学习',
        '能用自己的话解释关键机制',
        '完成对应练习或项目任务'
    ],
    resources: [],
    lessons: [
        {
            id: `${trackId}-lv${level}-l1`,
            title: `1. ${title}`,
            content: `# ${title}

这个 level 属于 ${trackId} track，目前是课程骨架。后续可以在这里补充详细课件、互动 Lab、练习项目和面试题。

## 学习目标

${outcome}
`
        }
    ],
    quizzes: [
        {
            id: `${trackId}-lv${level}-q1`,
            question: `完成 ${title} 后，你最应该能做到什么？`,
            options: [
                '只记住术语',
                outcome,
                '跳过实践直接进入下一章',
                '只看代码不理解机制'
            ],
            correctAnswer: 1,
            explanation: '这个阶段的目标是形成可解释、可实践、可迁移的能力。',
            difficulty: 'Easy'
        }
    ]
});

const FULLSTACK_STAGES: LearningStage[] = [
    {
        id: 'fullstack-lv0',
        level: 0,
        title: 'Level 0: 需求拆解与产品边界',
        description: '先把“要做什么”说清楚，再决定“怎么做”。学会把模糊需求拆成用户流程、数据对象、前后端边界和可交付范围。',
        topics: ['Requirement', 'Scope', 'User Flow', 'Data Shape', 'Delivery Slice'],
        keyConcepts: ['用户目标', '范围切分', '前后端契约', '最小可交付路径'],
        mission: '把一个模糊产品想法拆成第一版可开发的全栈任务清单，明确 UI、API、数据与验收边界。',
        outcome: '能把需求从“一个点子”转成可交付的第一阶段全栈范围，并解释哪些功能应该后做。',
        checklist: [
            '能区分用户目标、业务规则和技术实现细节',
            '能画出最小用户流程并标出前端、后端、数据库责任',
            '能把大功能切成一版可交付的小范围',
        ],
        resources: [
            { name: 'Product Requirement Writing Guide', url: 'https://www.atlassian.com/agile/project-management/requirements' },
            { name: 'User Story Mapping Overview', url: 'https://www.jpattonassociates.com/user-story-mapping/' },
        ],
        lessons: [
            {
                id: 'fullstack-lv0-l1',
                title: '1. 从用户目标开始，不要从技术组件开始',
                content: `
# 从用户目标开始

全栈项目最容易犯的错，是一上来就讨论：

- 用什么框架
- 接几个接口
- 数据库建几张表

更成熟的顺序应该是：

1. 用户想完成什么任务
2. 这个任务的最小成功路径是什么
3. 哪些信息必须被保存
4. 哪些能力必须由后端承担

只有先把用户目标说清楚，后面的 UI、API 和 schema 才不会东拼西凑。
`,
            },
            {
                id: 'fullstack-lv0-l2',
                title: '2. 把需求拆成用户流程与状态变化',
                content: `
# 用户流程与状态变化

一个全栈功能通常不是一个页面，而是一条状态链路。

例如“创建任务”这个需求，背后至少包括：

- 用户输入内容
- 前端做基础校验
- 后端接收并验证
- 数据写入数据库
- 页面刷新列表状态

如果你只盯着页面，很容易漏掉真正重要的状态变化点。
`,
            },
            {
                id: 'fullstack-lv0-l3',
                title: '3. 识别前端边界、后端边界与数据边界',
                content: `
# 三种边界

需求拆解里最关键的不是“功能很多”，而是边界要清楚。

- **前端边界**: 展示什么、收集什么、即时反馈什么
- **后端边界**: 校验什么、保存什么、保护什么
- **数据边界**: 哪些信息必须持久化，哪些只是临时 UI 状态

边界模糊时，常见结果就是前后端互相补锅，最后谁都说不清责任。
`,
            },
            {
                id: 'fullstack-lv0-l4',
                title: '4. 第一版范围：做最小可交付闭环',
                content: `
# 最小可交付闭环

真正可交付的全栈范围，不是“功能很多”，而是“能闭环”。

一个第一版通常只需要：

- 一个核心用户流程
- 一组最小数据模型
- 一套基础错误处理
- 一个能演示成功路径的 UI

先闭环，再扩展，是全栈项目最稳的推进方式。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv0-q1',
                question: '全栈需求拆解时，最应该先明确的内容是什么？',
                options: ['数据库用 MySQL 还是 PostgreSQL', '用户想完成什么目标与最小成功路径', '页面主色调是什么', '是否要先接入监控系统'],
                correctAnswer: 1,
                explanation: '用户目标和最小成功路径决定了后续 UI、API 和数据边界。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv0-q2',
                question: '为什么第一版范围强调“闭环”而不是“功能数量”？',
                options: ['因为闭环更容易展示真实价值与责任边界', '因为功能越少性能一定越好', '因为这样就不需要后端', '因为这样测试一定可以省略'],
                correctAnswer: 0,
                explanation: '能闭环的范围才能真实验证用户流程、数据和错误处理是否成立。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'fullstack-lv1',
        level: 1,
        title: 'Level 1: 端到端功能架构',
        description: '连接 UI、API、数据库与状态流，让“点击按钮”到“数据落库再回到界面”成为一条完整链路。',
        topics: ['E2E Flow', 'API', 'State Flow', 'Persistence', 'Failure Path'],
        keyConcepts: ['请求链路', '状态同步', '服务边界', '成功与失败路径'],
        mission: '设计一个完整功能闭环，说明一次操作如何穿过前端、后端和数据库再返回用户。',
        outcome: '能画出一条端到端功能链路，并解释每一层为什么存在、在哪一层做什么。',
        checklist: [
            '能描述从用户点击到响应渲染的完整请求路径',
            '能识别前端状态、接口契约和数据库写入之间的耦合点',
            '能说明成功路径和失败路径应该如何分流',
        ],
        resources: [
            { name: 'Web Application Architecture', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Website_security' },
            { name: 'API Design Best Practices', url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design' },
        ],
        lessons: [
            {
                id: 'fullstack-lv1-l1',
                title: '1. 一次点击背后的链路',
                content: `
# 一次点击背后的链路

当用户点击“创建课程”时，系统真正要处理的是一条完整链路：

1. 前端收集输入
2. 本地做初步校验
3. 发起 API 请求
4. 后端验证并执行业务逻辑
5. 数据库持久化
6. 返回响应
7. 前端更新列表或详情状态

全栈架构的核心，就是把这条链路讲清楚。
`,
            },
            {
                id: 'fullstack-lv1-l2',
                title: '2. 接口不是函数调用，而是跨边界契约',
                content: `
# 接口契约

前端和后端之间最容易失真的是接口边界。

一个成熟接口至少要明确：

- 输入结构
- 成功响应结构
- 失败响应结构
- 状态码语义

接口不是“先写了再看”，而是前后端协作时最重要的公共契约。
`,
            },
            {
                id: 'fullstack-lv1-l3',
                title: '3. 前端状态与后端真相不是一回事',
                content: `
# 状态与真相

前端看到的状态，是用户当前会话里的“局部视图”；后端保存的状态，才是系统的共享真相。

这意味着：

- 前端可以先显示 loading、success、error
- 但最终成功与否必须以后端结果为准
- 乐观更新要搭配回滚策略

很多全栈 bug，本质上就是把“界面状态”误当成“系统事实”。
`,
            },
            {
                id: 'fullstack-lv1-l4',
                title: '4. 把失败路径设计出来',
                content: `
# 失败路径

全栈功能设计不能只画 happy path。

你还需要明确：

- 输入不合法时谁报错
- 资源不存在时接口怎么回
- 写库失败时页面如何提示
- 重试与刷新后状态如何恢复

失败路径设计得越早，后面的代码越不容易乱。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv1-q1',
                question: '端到端功能架构里，最重要的核心视角更接近哪一项？',
                options: ['把所有页面先画出来', '把一次操作如何穿过前端、后端和数据库说清楚', '先决定部署平台', '只关注 SQL 语法'],
                correctAnswer: 1,
                explanation: '全栈架构的价值在于讲清楚完整链路，而不是只看单个层面。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv1-q2',
                question: '为什么前端状态不能直接当成系统真相？',
                options: ['因为前端不能显示数据', '因为真正的共享业务状态仍以后端持久化结果为准', '因为前端不能发请求', '因为所有状态都应该存在 localStorage'],
                correctAnswer: 1,
                explanation: '前端状态是会话视图，系统真相仍由后端和持久化层维护。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'fullstack-lv2',
        level: 2,
        title: 'Level 2: 数据建模到界面呈现',
        description: '从 schema 到接口再到 UI 列表和详情，把“数据怎么存”和“界面怎么展示”真正对齐。',
        topics: ['Schema', 'Query', 'List View', 'Detail View', 'UI State'],
        keyConcepts: ['数据模型', '列表与详情投影', '接口裁剪', '状态对齐'],
        mission: '围绕一个数据驱动页面，设计 schema、查询接口和前端状态，让列表、详情与更新动作彼此一致。',
        outcome: '能让数据模型、接口结构和界面状态相互配合，而不是各写各的。',
        checklist: [
            '能区分数据库实体、接口响应对象和界面展示对象',
            '能设计列表接口与详情接口的不同返回粒度',
            '能解释新增、更新、删除后 UI 应该如何同步状态',
        ],
        resources: [
            { name: 'Database Normalization Basics', url: 'https://www.postgresql.org/docs/current/ddl.html' },
            { name: 'TanStack Query Overview', url: 'https://tanstack.com/query/latest/docs/framework/react/overview' },
        ],
        lessons: [
            {
                id: 'fullstack-lv2-l1',
                title: '1. 数据库实体不等于页面组件',
                content: `
# 实体与界面不是一回事

数据库里的实体是为了持久化和约束设计的，页面里的组件是为了展示和交互设计的。

这意味着：

- 数据库字段不一定全部暴露给前端
- 页面展示字段有时来自多个实体拼装
- 列表页和详情页也不一定需要同样的数据粒度

全栈设计成熟的标志之一，就是知道什么该共用，什么不该直接照搬。
`,
            },
            {
                id: 'fullstack-lv2-l2',
                title: '2. 列表接口与详情接口为什么通常不一样',
                content: `
# 列表与详情的粒度差异

列表页关心的是：

- 快速加载
- 关键字段摘要
- 排序、筛选、分页

详情页关心的是：

- 更完整的数据结构
- 附加关系信息
- 编辑与操作上下文

如果两个接口完全一样，要么列表太重，要么详情信息不够。
`,
            },
            {
                id: 'fullstack-lv2-l3',
                title: '3. 新增、更新、删除后的界面同步',
                content: `
# 界面同步

一个数据驱动页面最大的体验问题，通常不是“接口没返回”，而是“返回了但 UI 没跟上”。

常见同步动作包括：

- 创建后插入列表
- 更新后刷新详情或局部字段
- 删除后移除项目并处理空状态

如果不提前设计这些同步策略，界面会很快出现“看起来没问题，实际状态已错位”的情况。
`,
            },
            {
                id: 'fullstack-lv2-l4',
                title: '4. 让 schema、接口和状态命名保持一致',
                content: `
# 对齐命名与结构

全栈协作最隐蔽的成本，往往是命名和结构不一致。

例如数据库叫 \`published_at\`，接口叫 \`publishTime\`，前端状态又叫 \`date\`，久而久之每一层都在翻译。

适度统一命名、明确字段语义，可以显著降低维护成本和沟通噪音。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv2-q1',
                question: '为什么列表接口和详情接口通常不应该完全一样？',
                options: ['因为 REST 不允许复用字段', '因为列表强调轻量摘要，详情强调完整上下文', '因为前端不能处理大对象', '因为数据库只能返回一列'],
                correctAnswer: 1,
                explanation: '列表和详情承担的任务不同，返回粒度通常也应该不同。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv2-q2',
                question: '下面哪种情况最容易导致全栈状态错位？',
                options: ['创建后及时更新列表状态', '删除后处理空状态', '接口返回成功但前端没有同步刷新对应数据', '列表接口只返回摘要字段'],
                correctAnswer: 2,
                explanation: '数据写成功但界面没同步，是最典型的数据驱动 UI 错位来源。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'fullstack-lv3',
        level: 3,
        title: 'Level 3: 表单、校验与错误状态',
        description: '把输入、校验、提交、错误提示和回填状态串起来，让复杂表单在前后端协作下仍然可靠。',
        topics: ['Form', 'Validation', 'Error State', 'Submission', 'Recovery'],
        keyConcepts: ['双层校验', '字段级错误', '提交状态', '回填策略'],
        mission: '构建一个可靠提交的复杂表单，让前端体验、后端校验和错误反馈保持一致。',
        outcome: '能设计前后端一致的校验模型，并处理提交中、失败后和重试时的界面状态。',
        checklist: [
            '能区分前端即时校验和后端最终校验的职责',
            '能设计字段级错误与全局错误的展示方式',
            '能说明提交失败后数据该如何保留、回填或重试',
        ],
        resources: [
            { name: 'React Forms Guide', url: 'https://react.dev/reference/react-dom/components/input' },
            { name: 'Zod Documentation', url: 'https://zod.dev/' },
        ],
        lessons: [
            {
                id: 'fullstack-lv3-l1',
                title: '1. 复杂表单不是一堆 input 拼起来',
                content: `
# 复杂表单的本质

复杂表单真正难的地方，不是输入框数量，而是状态很多：

- 初始值
- 用户修改值
- 本地校验结果
- 服务端返回错误
- 提交中状态
- 提交成功后的重置或跳转

如果这些状态没有提前设计，表单很快就会变得又脆又乱。
`,
            },
            {
                id: 'fullstack-lv3-l2',
                title: '2. 前端校验快，后端校验准',
                content: `
# 双层校验

前端校验适合做：

- 必填提醒
- 长度范围
- 基础格式检查

后端校验必须负责：

- 最终业务规则
- 权限相关限制
- 并发或唯一性冲突

全栈表单可靠的关键，是让这两层各司其职，而不是互相替代。
`,
            },
            {
                id: 'fullstack-lv3-l3',
                title: '3. 字段级错误与全局错误要分开',
                content: `
# 错误分层

表单错误并不都属于同一类：

- 某个字段格式不对：字段级错误
- 提交权限不足：全局错误
- 服务临时不可用：系统错误

如果所有错误都挤在一个 toast 或一条 message 里，用户几乎不知道该改哪里。
`,
            },
            {
                id: 'fullstack-lv3-l4',
                title: '4. 提交失败后的恢复体验',
                content: `
# 失败后的恢复

提交失败不是终点，真正的体验差异在于：

- 用户输入有没有丢
- 错误信息是否可理解
- 能不能直接重试
- 成功后是否正确清理状态

恢复体验设计得好，复杂表单也可以让人愿意继续完成。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv3-q1',
                question: '为什么复杂表单必须同时考虑前端校验和后端校验？',
                options: ['因为这样代码会更多', '因为前端负责即时体验，后端负责最终可信业务约束', '因为后端不能返回错误', '因为这样就不需要 loading 状态'],
                correctAnswer: 1,
                explanation: '前端提升交互体验，后端守住真实业务边界，两层都不可缺。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv3-q2',
                question: '下面哪种最适合作为字段级错误展示？',
                options: ['接口 500 时显示“系统异常”', 'title 为空时在 title 输入框附近提示 required', '用户无权限时弹一个字段提示', '数据库宕机时高亮所有输入框'],
                correctAnswer: 1,
                explanation: '字段级错误应直接对应某个具体输入项，帮助用户就地修正。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'fullstack-lv4',
        level: 4,
        title: 'Level 4: 登录态与权限界面',
        description: '把 auth 能力贯穿 UI、API 和路由，理解登录态恢复、受保护路由和不同角色下的界面差异。',
        topics: ['Auth UI', 'Protected Route', 'Session', 'RBAC', 'Role-aware UX'],
        keyConcepts: ['登录态恢复', '受保护页面', '角色差异化视图', '权限前置判断'],
        mission: '实现角色化的应用体验，让不同用户登录后看到正确的页面、操作与错误提示。',
        outcome: '能让不同角色看到正确的数据和操作，并让前端权限体验与后端真实授权保持一致。',
        checklist: [
            '能说明登录态在页面刷新后如何恢复',
            '能区分“未登录”与“已登录但无权限”的前端处理',
            '能让导航、按钮和页面内容随着角色变化而变化',
        ],
        resources: [
            { name: 'Authentication Patterns for SPAs', url: 'https://developer.okta.com/blog/2022/07/06/spa-web-security-csrf-xss' },
            { name: 'React Router Protected Routes', url: 'https://reactrouter.com/en/main/start/overview' },
        ],
        lessons: [
            {
                id: 'fullstack-lv4-l1',
                title: '1. 登录态不只是一个 token',
                content: `
# 登录态恢复

从全栈角度看，登录态至少涉及：

- 浏览器如何保存凭证
- 页面刷新后如何恢复用户身份
- 凭证失效后如何退出或重定向

如果只把登录态理解成“存一个 token”，很快就会在刷新、失效和跨页面体验上踩坑。
`,
            },
            {
                id: 'fullstack-lv4-l2',
                title: '2. 受保护路由与页面入口控制',
                content: `
# 路由保护

不是每个页面都应该对所有人开放。

前端至少要处理：

- 未登录用户重定向
- 已登录用户访问公开页时的跳转策略
- 加载用户资料前的中间状态

受保护路由的价值，是把“谁可以进来”先在入口层控制住。
`,
            },
            {
                id: 'fullstack-lv4-l3',
                title: '3. 角色差异化界面',
                content: `
# 角色差异化

同一个页面，不同角色看到的界面可能完全不一样：

- student 只能查看
- editor 可以编辑
- admin 可以执行高风险操作

这不仅影响按钮显示，还影响导航结构、空状态提示和默认入口。
`,
            },
            {
                id: 'fullstack-lv4-l4',
                title: '4. 权限错误的前端表达',
                content: `
# 权限错误表达

权限问题不能一律表现成“页面坏了”。

前端需要明确区分：

- 未登录：引导登录
- 已登录但无权限：给出权限边界解释
- 资源不存在：正常 404 语义

把这些状态表达清楚，用户和团队都更容易理解系统行为。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv4-q1',
                question: '前端处理权限时，哪种区分最关键？',
                options: ['按钮颜色和字体大小', '未登录 与 已登录但无权限', '使用 JWT 还是 Session', '使用浅色主题还是深色主题'],
                correctAnswer: 1,
                explanation: '这两类状态对用户提示、跳转和恢复动作都完全不同。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv4-q2',
                question: '为什么角色差异化界面不应只停留在“隐藏按钮”？',
                options: ['因为按钮本来就不重要', '因为导航、页面内容和默认入口也会随角色变化', '因为后端会自动生成页面', '因为这样就不需要后端授权'],
                correctAnswer: 1,
                explanation: '角色差异会影响整个用户流，而不仅仅是某个局部操作按钮。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'fullstack-lv5',
        level: 5,
        title: 'Level 5: 支付与订阅流程',
        description: '学习订单、支付状态、Webhook 和订阅生命周期，让“钱的状态”在前后端之间保持一致。',
        topics: ['Payment', 'Order', 'Webhook', 'Subscription', 'Billing State'],
        keyConcepts: ['支付状态机', '服务端真相', '异步确认', '账单生命周期'],
        mission: '设计一个可追踪的支付流程，解释前端、后端、支付平台和 webhook 之间如何协作。',
        outcome: '能解释支付为什么必须以后端状态为准，并能说清支付成功、失败、超时和重复回调时系统该如何表现。',
        checklist: [
            '能画出支付发起、确认、回调和状态更新的完整链路',
            '能解释为什么支付结果不能只看前端跳转页面',
            '能区分一次性支付与订阅续费的状态差异',
        ],
        resources: [
            { name: 'Stripe Payment Lifecycle', url: 'https://docs.stripe.com/payments/payment-intents' },
            { name: 'Webhook Best Practices', url: 'https://docs.stripe.com/webhooks' },
        ],
        lessons: [
            {
                id: 'fullstack-lv5-l1',
                title: '1. 支付不是一个按钮，而是一条状态机',
                content: `
# 支付状态机

支付真正复杂的地方，不是“点一下支付”，而是状态会流动：

- created
- requires_payment
- processing
- succeeded
- failed
- refunded

如果没有状态机思维，支付流程很容易在前后端之间对不上。
`,
            },
            {
                id: 'fullstack-lv5-l2',
                title: '2. 为什么支付结果必须以后端为准',
                content: `
# 后端真相

用户在支付页看到“成功返回”并不等于系统就一定成功入账。

真正可靠的支付确认，通常依赖：

- 支付平台返回结果
- 后端记录订单状态
- webhook 异步确认

前端页面更像“反馈窗口”，而不是最终账务真相。
`,
            },
            {
                id: 'fullstack-lv5-l3',
                title: '3. Webhook：让异步确认落回系统',
                content: `
# Webhook

支付流程常常跨多个系统，因此前端跳转完成后，后端仍然需要一个稳定入口接收平台回调。

Webhook 的职责通常包括：

- 验证来源
- 幂等处理
- 更新支付或订阅状态
- 触发后续业务流程

没有 webhook，全栈支付链路通常只完成了一半。
`,
            },
            {
                id: 'fullstack-lv5-l4',
                title: '4. 订阅生命周期与账单变更',
                content: `
# 订阅生命周期

订阅类产品不只关心“第一次有没有支付成功”，还关心：

- 续费
- 升降级
- 宽限期
- 取消与恢复

这意味着你的前端展示、后端权限和账单状态都必须跟着生命周期一起变化。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv5-q1',
                question: '为什么支付系统通常强调“以后端状态为准”？',
                options: ['因为前端不能显示成功页', '因为支付结果往往需要服务端记录与异步回调共同确认', '因为数据库不能存订单', '因为这样就不需要用户登录'],
                correctAnswer: 1,
                explanation: '支付是跨系统状态流，前端页面只能展示结果，最终真相仍以后端和支付平台协作为准。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv5-q2',
                question: 'Webhook 在支付链路里的核心价值更接近哪项？',
                options: ['美化支付按钮样式', '把异步确认事件稳定地送回业务系统', '替代数据库持久化', '减少所有接口的状态码种类'],
                correctAnswer: 1,
                explanation: 'Webhook 是外部支付平台把关键异步状态带回你系统的重要桥梁。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'fullstack-lv6',
        level: 6,
        title: 'Level 6: 测试策略与质量防线',
        description: '学习如何把单元测试、集成测试和 E2E 测试组织成一套完整质量防线，让全栈变更不会轻易把关键业务链路打断。',
        topics: ['Unit Test', 'Integration Test', 'E2E', 'Risk Coverage', 'Regression'],
        keyConcepts: ['测试金字塔', '风险分层', '关键路径', '回归保护'],
        mission: '为一条真实全栈业务链路设计测试分层，明确哪些逻辑适合单测、哪些必须跑集成或 E2E。',
        outcome: '能根据风险和反馈速度选择合适测试层级，而不是把所有问题都交给同一种测试。',
        checklist: [
            '能区分单元测试、集成测试和 E2E 测试分别保护什么',
            '能为登录、下单或支付等关键路径设计最小测试组合',
            '能解释为什么测试不是越多越好，而是越贴近风险越有效',
        ],
        resources: [
            { name: 'Testing Trophy', url: 'https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications' },
            { name: 'Playwright Best Practices', url: 'https://playwright.dev/docs/best-practices' },
        ],
        lessons: [
            {
                id: 'fullstack-lv6-l1',
                title: '1. 先问风险，再决定测试层级',
                content: `
# 风险先行

全栈测试最常见的误区，是先选工具，再想要不要测。

更可靠的顺序应该是：

1. 哪条业务路径最容易出事故
2. 出事故后影响有多大
3. 哪种测试最适合最低成本发现这个问题

测试策略本质上是在分配验证预算，而不是堆数量。
`,
            },
            {
                id: 'fullstack-lv6-l2',
                title: '2. 单测保护纯逻辑，集成测试保护边界协作',
                content: `
# 两类保护面

单元测试适合验证：

- 纯函数
- 表单校验规则
- 数据转换逻辑

集成测试更适合验证：

- API 与数据库协作
- 页面与状态管理协作
- 认证中间件与业务处理流程

如果把边界协作问题全交给单测，通常测不出来。
`,
            },
            {
                id: 'fullstack-lv6-l3',
                title: '3. E2E 是关键路径保险，而不是全站截图收集器',
                content: `
# E2E 的位置

E2E 测试最宝贵的价值，是保护最关键的用户成功路径，例如：

- 注册并登录
- 创建内容并保存
- 发起支付并看到结果

E2E 不适合覆盖所有小细节，否则会越来越慢、越来越脆弱。
`,
            },
            {
                id: 'fullstack-lv6-l4',
                title: '4. 把质量防线嵌进日常开发流',
                content: `
# 日常开发流

成熟团队不会把测试当成“上线前临时补一下”。

更合理的做法是：

- 开发时先补核心单测
- 合并前跑关键集成测试
- 发布前或合并后跑关键 E2E

这样测试才真正成为质量防线，而不是额外负担。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv6-q1',
                question: '面对“支付成功但订单没更新”的高风险问题，最有价值的测试更可能是哪类？',
                options: ['只补几个纯函数单测', '只做视觉快照测试', '覆盖支付链路协作的集成或 E2E 测试', '完全不测，靠人工回归'],
                correctAnswer: 2,
                explanation: '这类问题通常发生在多层协作边界上，需要更贴近真实链路的验证方式。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv6-q2',
                question: '为什么 E2E 不适合“把所有页面都扫一遍”？',
                options: ['因为 E2E 不能测试表单', '因为 E2E 应该重点保护关键路径，否则成本高且脆弱', '因为 E2E 不能访问数据库', '因为 E2E 只能在本地运行'],
                correctAnswer: 1,
                explanation: 'E2E 最适合保护高价值路径，过度泛化会让测试集又慢又不稳定。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'fullstack-lv7',
        level: 7,
        title: 'Level 7: 部署、环境与 CI/CD',
        description: '把全栈应用从本地运行推进到稳定发布，理解环境变量、构建产物、发布流水线和回滚机制如何协同。',
        topics: ['Deploy', 'Environment', 'CI/CD', 'Rollback', 'Release Confidence'],
        keyConcepts: ['环境隔离', '构建一致性', '自动化发布', '回滚策略'],
        mission: '设计一条能从代码提交走到线上发布的全栈交付流水线，并解释每个环境的职责。',
        outcome: '能说明 dev、staging、production 分别承担什么角色，并能解释为什么发布必须可重复、可验证、可回滚。',
        checklist: [
            '能解释环境变量为什么不能混在代码里',
            '能画出 commit 到 build、deploy、verify 的发布路径',
            '能解释为什么可回滚比“永不出错”更现实',
        ],
        resources: [
            { name: 'Twelve-Factor App: Config', url: 'https://12factor.net/config' },
            { name: 'GitHub Actions Documentation', url: 'https://docs.github.com/en/actions' },
        ],
        lessons: [
            {
                id: 'fullstack-lv7-l1',
                title: '1. 本地能跑不等于可交付',
                content: `
# 可交付不是“我电脑上行”

全栈项目要进入真实交付阶段，必须解决两个问题：

- 产物是否能被别人稳定构建出来
- 环境差异是否会导致行为漂移

如果答案不确定，你就还没有真正具备交付能力。
`,
            },
            {
                id: 'fullstack-lv7-l2',
                title: '2. dev、staging、production 为什么不能混成一套',
                content: `
# 环境职责

三个环境通常承担不同目标：

- **dev**: 快速迭代与联调
- **staging**: 接近生产的预演与验证
- **production**: 面向真实用户的稳定运行

把环境职责混在一起，问题就会在最贵的时候暴露。
`,
            },
            {
                id: 'fullstack-lv7-l3',
                title: '3. CI/CD 不是自动部署脚本，而是交付信心系统',
                content: `
# CI/CD 的真正价值

CI/CD 不只是“自动帮你执行命令”，而是：

- 固定构建流程
- 自动跑校验
- 减少手工发布差异
- 提高每次上线的可预测性

当发布依赖个人记忆时，系统迟早会不稳定。
`,
            },
            {
                id: 'fullstack-lv7-l4',
                title: '4. 回滚能力决定你敢不敢发布',
                content: `
# 回滚能力

真正成熟的发布流程，不是“我确信这次不会出问题”，而是“就算出问题，我也能快速止损”。

所以一个可交付系统通常需要：

- 可追踪版本
- 可验证发布结果
- 可快速回退策略

回滚能力本身就是发布能力的一部分。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv7-q1',
                question: '为什么全栈应用通常需要 staging 环境？',
                options: ['因为 production 太慢', '因为 staging 可以在接近真实环境下验证发布结果', '因为 staging 不需要环境变量', '因为 staging 可以替代所有本地开发'],
                correctAnswer: 1,
                explanation: 'staging 的核心价值是用接近生产的环境提前暴露问题。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv7-q2',
                question: 'CI/CD 更准确的定位更接近下面哪项？',
                options: ['自动生成 UI 原型', '交付信心与一致性系统', '数据库备份工具', '前端 CSS 主题切换器'],
                correctAnswer: 1,
                explanation: 'CI/CD 的核心不是自动化本身，而是降低发布不确定性。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'fullstack-lv8',
        level: 8,
        title: 'Level 8: 跨端性能预算',
        description: '同时观察前端加载、网络传输和后端响应，把性能当成端到端预算，而不是只盯住单个页面或单个接口。',
        topics: ['Performance Budget', 'Latency', 'Bundle', 'Render Cost', 'Backend Response'],
        keyConcepts: ['性能预算', '关键指标', '瓶颈归因', '跨层协作'],
        mission: '为一个真实全栈产品建立端到端性能指标，说明慢到底是慢在浏览器、网络还是服务端。',
        outcome: '能从用户体验角度拆解性能问题，并给出跨前端、网络、后端的优先级优化顺序。',
        checklist: [
            '能区分加载慢、渲染慢、接口慢和交互慢分别属于哪一层问题',
            '能为关键页面设定基本性能预算',
            '能解释为什么只优化 bundle 或只优化 SQL 往往不够',
        ],
        resources: [
            { name: 'Web Vitals', url: 'https://web.dev/vitals/' },
            { name: 'Time to First Byte (TTFB)', url: 'https://developer.mozilla.org/en-US/docs/Glossary/TTFB' },
        ],
        lessons: [
            {
                id: 'fullstack-lv8-l1',
                title: '1. 用户只会感受到“快不快”，不会区分是哪层慢',
                content: `
# 用户视角

用户不会说“你的 hydration 太慢”或者“TTFB 偏高”。

用户只会感受到：

- 页面为什么打开这么慢
- 按了按钮为什么没反应
- 保存后为什么要等这么久

所以性能优化必须先回到真实体验，再往下拆归因。
`,
            },
            {
                id: 'fullstack-lv8-l2',
                title: '2. 把性能拆成浏览器、网络和服务端三段',
                content: `
# 三段归因

一个全栈请求的时间，通常可以拆成：

- 浏览器准备和渲染成本
- 网络传输成本
- 服务端处理和数据库成本

只有先分段，你才知道应该优先压 bundle、减请求、上缓存还是改查询。
`,
            },
            {
                id: 'fullstack-lv8-l3',
                title: '3. 性能预算帮助团队避免“越做越重”',
                content: `
# 性能预算

性能预算的作用，是在团队持续迭代时给出清晰边界，例如：

- 首屏 JS 不超过多少
- 关键接口在多少毫秒内返回
- 某个交互的反馈延迟不能超过多少

没有预算，性能只会在每次“先上线再说”里慢慢流失。
`,
            },
            {
                id: 'fullstack-lv8-l4',
                title: '4. 优化顺序要跟用户价值走，而不是跟技术偏好走',
                content: `
# 优先级

性能优化不是“我最熟哪一层就改哪一层”，而是：

1. 找出用户最痛的慢点
2. 找出真正主导成本的层级
3. 优先做收益最大、风险最小的改动

跨端性能的关键，不是全面撒网，而是精确归因和排序。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv8-q1',
                question: '为什么性能问题要按浏览器、网络、服务端分段归因？',
                options: ['因为这样术语更多', '因为只有分段后才能判断真正瓶颈在哪一层', '因为性能只能由前端负责', '因为数据库延迟总是最重要'],
                correctAnswer: 1,
                explanation: '分段归因能避免盲目优化，把时间用在真正主导体验的瓶颈上。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv8-q2',
                question: '性能预算最核心的团队价值更接近哪项？',
                options: ['让所有页面颜色更统一', '给持续迭代设定明确的性能边界', '替代监控系统', '让后端不再需要缓存'],
                correctAnswer: 1,
                explanation: '预算帮助团队在长期迭代中避免体验持续退化。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'fullstack-lv9',
        level: 9,
        title: 'Level 9: 生产级 SaaS Capstone',
        description: '把需求拆解、架构设计、认证、支付、测试、发布和性能这些能力真正串成一个可以演示、可部署、可维护的全栈小系统。',
        topics: ['SaaS', 'Architecture', 'Capstone', 'Delivery', 'Operations'],
        keyConcepts: ['端到端交付', '架构取舍', '可维护性', '真实运营场景'],
        mission: '规划并交付一个小型 SaaS 全栈项目，能够清楚解释功能边界、技术选型、发布路径和后续维护策略。',
        outcome: '能独立交付一个小型生产级全栈应用，并向别人讲清楚它为什么这样设计、如何验证、如何上线与扩展。',
        checklist: [
            '能定义一个有真实用户价值的 SaaS 最小版本',
            '能把前端、后端、数据、支付、监控和发布串成完整交付路径',
            '能说明系统接下来如何扩展、维护与降低风险',
        ],
        resources: [
            { name: 'SaaS Architecture Fundamentals', url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/saas/' },
            { name: 'The Twelve-Factor App', url: 'https://12factor.net/' },
        ],
        lessons: [
            {
                id: 'fullstack-lv9-l1',
                title: '1. Capstone 不是大而全，而是小而完整',
                content: `
# 小而完整

生产级 capstone 的关键不是功能尽量多，而是系统足够完整：

- 有明确用户
- 有核心场景
- 有真实数据流
- 有上线与维护考虑

一个能闭环的 SaaS 小系统，比十个散功能更能证明全栈能力。
`,
            },
            {
                id: 'fullstack-lv9-l2',
                title: '2. 用业务场景反推架构，而不是反过来',
                content: `
# 业务反推架构

SaaS 架构不是为了“看起来专业”，而是为了支撑业务：

- 谁会登录
- 谁付费
- 谁管理数据
- 哪些地方最怕出错

先把业务场景讲清楚，再决定权限模型、数据模型和服务边界，架构才不空转。
`,
            },
            {
                id: 'fullstack-lv9-l3',
                title: '3. 交付能力要覆盖开发、验证、发布和运营',
                content: `
# 完整交付

一个生产级全栈项目，至少要能回答：

- 怎么开发
- 怎么验证
- 怎么发布
- 出问题怎么发现和恢复

如果只能写功能，不能稳定交付，它还不算真正的 production-ready。
`,
            },
            {
                id: 'fullstack-lv9-l4',
                title: '4. 复盘决定你能不能从“做完”走向“做成”',
                content: `
# 复盘与演进

capstone 完成后，真正有价值的问题通常是：

- 哪些地方最脆弱
- 哪些设计以后会拖慢扩展
- 下一版应该优先补什么

能复盘、能排序、能演进，才说明你已经不只是“做出来”，而是开始具备产品化与工程化视角。
`,
            },
        ],
        quizzes: [
            {
                id: 'fullstack-lv9-q1',
                question: '为什么一个好的全栈 capstone 更强调“小而完整”？',
                options: ['因为这样就不需要数据库', '因为闭环交付比功能堆叠更能体现真实工程能力', '因为 SaaS 不能做权限系统', '因为 production 不需要监控'],
                correctAnswer: 1,
                explanation: '完整闭环更能证明你理解需求、数据、交付、验证和维护之间的关系。',
                difficulty: 'Easy',
            },
            {
                id: 'fullstack-lv9-q2',
                question: 'production-ready 的全栈项目最不应该缺少哪类能力？',
                options: ['部署与出错后的恢复思路', '页面配色选择', '动画微交互偏好', '是否使用热门框架名称'],
                correctAnswer: 0,
                explanation: '真正生产级项目必须考虑发布、监控、恢复和演进，而不只是功能展示。',
                difficulty: 'Medium',
            },
        ],
    }
];

const NETWORK_STAGES: LearningStage[] = [
    {
        id: 'network-lv0',
        level: 0,
        title: 'Level 0: HTTP 请求生命周期',
        description: '从浏览器地址栏开始，追踪一次请求如何形成、发送、到达服务端并带着响应返回，先把 Web 最基本的通信链路看清楚。',
        topics: ['HTTP', 'Request', 'Response', 'Headers', 'Status Code'],
        keyConcepts: ['请求报文', '响应报文', '方法与语义', '状态码', '首部信息'],
        mission: '画出一次 HTTP 请求从浏览器发出到页面接收响应的完整路径，并能解释关键字段的含义。',
        outcome: '能解释 URL、method、headers、status code 和 response body 在一次 HTTP 交互里分别承担什么角色。',
        checklist: [
            '能区分 request 和 response 分别携带哪些信息',
            '能解释 GET、POST、PUT、DELETE 的常见语义差异',
            '能根据状态码初步判断请求是成功、失败还是需要重定向',
        ],
        resources: [
            { name: 'MDN HTTP Overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview' },
            { name: 'HTTP Messages', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages' },
        ],
        lessons: [
            {
                id: 'network-lv0-l1',
                title: '1. 浏览器发出的不是“一个函数”，而是一段报文',
                content: `
# HTTP 报文视角

浏览器访问页面时，真正发出去的不是“我要打开这个页面”这么一句自然语言，而是一段结构化请求报文。

里面通常包括：

- method
- path
- headers
- body

只有把请求看成结构化报文，你后面理解调试、缓存、安全和性能才会更稳。
`,
            },
            {
                id: 'network-lv0-l2',
                title: '2. 响应由状态码、首部和内容共同组成',
                content: `
# 响应三件套

一次响应通常至少包含三层信息：

- **状态码**: 成功还是失败
- **headers**: 如何解析、缓存或保护内容
- **body**: 真正返回的数据或页面内容

很多调试误区来自只看 body，不看状态码和 headers。
`,
            },
            {
                id: 'network-lv0-l3',
                title: '3. 方法语义决定接口意图',
                content: `
# 方法与意图

HTTP 方法不只是语法糖，它是在表达这次请求“想做什么”。

例如：

- GET 更像读取
- POST 更像新建或触发动作
- PUT/PATCH 更像更新
- DELETE 更像移除

方法语义清晰，接口和调试都会更容易理解。
`,
            },
            {
                id: 'network-lv0-l4',
                title: '4. 先学会读一条请求，再学更复杂的网络问题',
                content: `
# 读懂一条请求

网络学习的第一步不是背很多协议缩写，而是能把一条真实请求读明白：

- 发给谁
- 带了什么
- 为什么失败或成功
- 返回内容为什么长这样

这项能力会成为后面所有网络调试的起点。
`,
            },
        ],
        quizzes: [
            {
                id: 'network-lv0-q1',
                question: '哪组信息最能代表一次 HTTP 请求报文的核心结构？',
                options: ['method、path、headers、body', 'component、state、props、effect', 'thread、queue、retry、cron', 'token、role、policy、session'],
                correctAnswer: 0,
                explanation: 'HTTP 请求本质上就是 method、path、headers 和可选 body 组成的结构化报文。',
                difficulty: 'Easy',
            },
            {
                id: 'network-lv0-q2',
                question: '为什么调试接口时不能只看 response body？',
                options: ['因为 body 一定为空', '因为状态码和 headers 也携带了成功/失败与处理方式的信息', '因为浏览器不会显示 body', '因为 body 与网络无关'],
                correctAnswer: 1,
                explanation: '真正判断请求结果往往需要结合状态码、headers 和 body 一起看。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'network-lv1',
        level: 1,
        title: 'Level 1: DNS 与域名系统',
        description: '理解为什么输入一个域名就能找到目标服务器，学会把 DNS 当成“把名字翻译成地址”的分布式系统来看。',
        topics: ['DNS', 'Resolver', 'A Record', 'CNAME', 'Propagation'],
        keyConcepts: ['递归解析', '记录类型', '缓存', 'TTL', '传播延迟'],
        mission: '解释一次域名解析是如何发生的，并能判断常见域名问题是配置错、缓存旧还是记录未传播。',
        outcome: '能读懂 A、AAAA、CNAME 等常见记录，并能解释为什么 DNS 问题经常表现得“有时好有时坏”。',
        checklist: [
            '能解释域名解析和浏览器缓存不是同一件事',
            '能区分 A record、AAAA record 和 CNAME 的作用',
            '能理解 TTL 与传播延迟为什么会影响问题排查',
        ],
        resources: [
            { name: 'DNS Explained', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/' },
            { name: 'DNS Records Overview', url: 'https://www.cloudflare.com/learning/dns/dns-records/' },
        ],
        lessons: [
            {
                id: 'network-lv1-l1',
                title: '1. 域名系统是在做名字到地址的翻译',
                content: `
# 名字翻译系统

人类更适合记域名，机器更适合找 IP。

DNS 的核心作用，就是把：

- \`app.example.com\`

翻译成：

- 某个可访问的 IP 地址

它本质上是一套分布式查询系统，而不只是一个“配置页面”。
`,
            },
            {
                id: 'network-lv1-l2',
                title: '2. 记录类型决定域名最终指向什么',
                content: `
# 常见记录

最常见的几类记录包括：

- **A / AAAA**: 直接指向 IPv4 / IPv6 地址
- **CNAME**: 指向另一个域名
- **MX**: 邮件服务相关

理解记录类型，才能知道一个域名最后到底落在什么目标上。
`,
            },
            {
                id: 'network-lv1-l3',
                title: '3. 为什么 DNS 问题常常带着缓存和延迟',
                content: `
# TTL 与传播

DNS 不是每次都从权威源头重新问一遍，很多环节都会缓存结果。

这就意味着：

- 你改了记录，不会立刻全世界同步
- 不同用户可能会在不同时间看到不同结果

这就是 DNS 问题经常“我这边好了，你那边还没好”的原因。
`,
            },
            {
                id: 'network-lv1-l4',
                title: '4. 排查 DNS 问题时，先问哪一层缓存还在生效',
                content: `
# 排查思路

当域名解析不对时，你要先区分：

- 记录本身有没有配错
- 递归解析器是不是还缓存旧值
- 本机或浏览器是不是还没刷新

如果不分层，你会在错误的地方浪费很多时间。
`,
            },
        ],
        quizzes: [
            {
                id: 'network-lv1-q1',
                question: 'CNAME 记录最接近下面哪种作用？',
                options: ['直接写入数据库', '把一个域名别名指向另一个域名', '给请求添加认证 token', '让 HTTP 自动变成 HTTPS'],
                correctAnswer: 1,
                explanation: 'CNAME 的核心是把一个名字指向另一个名字，而不是直接给出 IP。',
                difficulty: 'Easy',
            },
            {
                id: 'network-lv1-q2',
                question: '为什么 DNS 问题经常会出现“有人正常，有人还不正常”？',
                options: ['因为 DNS 只在本地机器运行', '因为不同解析层和客户端缓存可能还没过期', '因为域名只能同时被一个人访问', '因为 DNS 不支持更新'],
                correctAnswer: 1,
                explanation: 'TTL 和多层缓存让 DNS 传播天然带有时间差。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'network-lv2',
        level: 2,
        title: 'Level 2: TCP/IP 与 UDP',
        description: '理解网络连接为什么需要端口、为什么有的传输强调可靠性、有的强调实时性，把 TCP 和 UDP 放回真实场景里看。',
        topics: ['TCP', 'UDP', 'IP', 'Port', 'Latency'],
        keyConcepts: ['连接', '可靠传输', '丢包', '顺序保证', '端口复用'],
        mission: '解释一条网络连接如何建立，为什么不同业务会选择 TCP 或 UDP，以及延迟与可靠性如何取舍。',
        outcome: '能区分 TCP 和 UDP 的典型使用场景，并能把端口、延迟、丢包这些概念串起来理解。',
        checklist: [
            '能解释 IP 地址与端口组合为什么才能定位具体服务',
            '能说明 TCP 为什么更可靠但不总是最快',
            '能区分实时语音/视频与网页请求在传输诉求上的差异',
        ],
        resources: [
            { name: 'TCP vs UDP', url: 'https://www.cloudflare.com/learning/ddos/glossary/tcp-ip/' },
            { name: 'MDN TCP Basics', url: 'https://developer.mozilla.org/en-US/docs/Glossary/TCP' },
        ],
        lessons: [
            {
                id: 'network-lv2-l1',
                title: '1. IP 负责寻址，端口负责找到机器上的具体服务',
                content: `
# 地址与端口

IP 地址只说明“这台机器是谁”，但一台机器上可能跑着很多服务。

端口的作用，是进一步指向：

- Web 服务
- 数据库服务
- 消息服务

所以真正定位一条网络服务，往往需要 IP + Port 一起看。
`,
            },
            {
                id: 'network-lv2-l2',
                title: '2. TCP 用额外成本换来可靠性与顺序',
                content: `
# TCP 的价值

TCP 适合网页、接口、支付等业务，因为它通常提供：

- 顺序保证
- 重传机制
- 可靠到达

这些能力不是免费的，它们会带来握手、确认和等待的成本。
`,
            },
            {
                id: 'network-lv2-l3',
                title: '3. UDP 更轻，但你要自己接受更多不确定性',
                content: `
# UDP 的取舍

UDP 不强调连接与重传，因此更轻、更直接，也更适合：

- 实时语音
- 实时视频
- 某些游戏同步

但它的代价是：包可能丢、可能乱序，也不保证一定到达。
`,
            },
            {
                id: 'network-lv2-l4',
                title: '4. 选协议是在选“最重要的那件事”',
                content: `
# 核心取舍

如果你的业务最怕错，就更偏向可靠性；
如果你的业务最怕迟，就更偏向实时性。

TCP 和 UDP 的差别，不是“谁高级”，而是“谁更适合当前业务最重要的目标”。
`,
            },
        ],
        quizzes: [
            {
                id: 'network-lv2-q1',
                question: '为什么定位一个网络服务通常不能只看 IP，还要看端口？',
                options: ['因为一台机器上可能有多个服务同时监听', '因为 IP 不能联网', '因为端口只给前端使用', '因为 UDP 不支持 IP'],
                correctAnswer: 0,
                explanation: 'IP 定位机器，端口定位机器上的具体服务。',
                difficulty: 'Easy',
            },
            {
                id: 'network-lv2-q2',
                question: '实时语音更常使用 UDP 的核心原因更接近哪项？',
                options: ['因为 UDP 能自动加密', '因为 UDP 更强调低额外开销与实时性，即使允许少量丢包', '因为 UDP 不需要端口', '因为 UDP 一定比 TCP 更安全'],
                correctAnswer: 1,
                explanation: '实时业务通常更怕延迟而不是个别包的丢失。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'network-lv3',
        level: 3,
        title: 'Level 3: TLS 与 HTTPS',
        description: '理解为什么 HTTPS 不只是“加了个锁”，而是一套围绕证书、握手、加密与信任链建立起来的安全通信机制。',
        topics: ['TLS', 'HTTPS', 'Certificate', 'Handshake', 'Trust Chain'],
        keyConcepts: ['证书', '公钥与私钥', '握手协商', '身份验证', '信任链'],
        mission: '解释 HTTPS 建立安全连接的关键步骤，并能看懂常见证书错误与混合内容问题。',
        outcome: '能说明 HTTPS 为什么能防止窃听与篡改，并能初步判断证书错误到底是证书、域名还是信任链问题。',
        checklist: [
            '能解释 HTTP 和 HTTPS 的本质差别不只是端口不同',
            '能说明证书在验证服务端身份里的作用',
            '能理解混合内容为什么会破坏页面安全边界',
        ],
        resources: [
            { name: 'How HTTPS Works', url: 'https://howhttps.works/' },
            { name: 'MDN TLS', url: 'https://developer.mozilla.org/en-US/docs/Glossary/TLS' },
        ],
        lessons: [
            {
                id: 'network-lv3-l1',
                title: '1. HTTPS 是 HTTP 跑在 TLS 保护之上',
                content: `
# HTTPS 的结构

HTTPS 不是一种完全独立的新协议族，它更像是：

- HTTP 的语义
- 加上 TLS 的安全通道

这样浏览器和服务端才能在传输内容前，先把安全通信这件事谈妥。
`,
            },
            {
                id: 'network-lv3-l2',
                title: '2. 证书是在证明“你连到的真的是它”',
                content: `
# 证书的角色

加密本身还不够，关键还要确认对方身份。

证书的作用，是帮助浏览器判断：

- 这个站点是否真的拥有这个域名对应的身份
- 这个身份是否被信任机构签发和认可

没有身份验证，加密可能仍然连错对象。
`,
            },
            {
                id: 'network-lv3-l3',
                title: '3. TLS 握手是在协商如何安全说话',
                content: `
# 握手协商

TLS 握手阶段通常要完成几件事：

- 协商协议版本
- 协商加密套件
- 验证证书
- 建立会话密钥

只有这些都谈妥，后续 HTTP 内容才会在安全通道里传输。
`,
            },
            {
                id: 'network-lv3-l4',
                title: '4. 证书错误和混合内容是两类常见信号',
                content: `
# 常见问题

HTTPS 常见问题大致分两类：

- **证书错误**: 站点身份链路有问题
- **混合内容**: 安全页面里仍然加载了不安全资源

两者都在提醒你：页面整体安全边界已经被削弱。
`,
            },
        ],
        quizzes: [
            {
                id: 'network-lv3-q1',
                question: 'HTTPS 相比 HTTP 最核心多出来的能力更接近哪项？',
                options: ['自动生成前端组件', '在 TLS 保护下传输并验证对端身份', '自动压缩所有图片', '绕过 DNS 解析'],
                correctAnswer: 1,
                explanation: 'HTTPS 的核心价值是通过 TLS 建立更安全的身份验证与加密通道。',
                difficulty: 'Easy',
            },
            {
                id: 'network-lv3-q2',
                question: '为什么混合内容会被浏览器重点警告？',
                options: ['因为 CSS 写得不好看', '因为安全页面中加载不安全资源会破坏整体安全边界', '因为混合内容一定会让 CPU 变慢', '因为混合内容与网络无关'],
                correctAnswer: 1,
                explanation: '一个 HTTPS 页面只要继续拉入 HTTP 资源，就等于把安全链条撕开了口子。',
                difficulty: 'Medium',
            },
        ],
    },
    {
        id: 'network-lv4',
        level: 4,
        title: 'Level 4: 浏览器网络性能',
        description: '学习连接复用、HTTP/2、HTTP/3 与请求优先级，把网络性能从“请求数量”提升到“连接与调度效率”的视角。',
        topics: ['HTTP/2', 'HTTP/3', 'Multiplexing', 'Priority', 'Waterfall'],
        keyConcepts: ['连接复用', '多路复用', '队头阻塞', '优先级', '瀑布图分析'],
        mission: '通过请求瀑布图分析页面慢在哪里，并解释连接层协议为什么会影响真实加载体验。',
        outcome: '能借助 DevTools 瀑布图判断页面慢在排队、建立连接、下载还是资源调度策略。',
        checklist: [
            '能解释为什么现代协议要减少重复建连与排队成本',
            '能通过瀑布图观察请求启动顺序与阻塞关系',
            '能理解 HTTP/2 与 HTTP/3 主要是在连接层改进什么',
        ],
        resources: [
            { name: 'HTTP/2 Explained', url: 'https://developer.mozilla.org/en-US/docs/Glossary/HTTP_2' },
            { name: 'HTTP/3 Overview', url: 'https://developer.mozilla.org/en-US/docs/Glossary/HTTP_3' },
        ],
        lessons: [
            {
                id: 'network-lv4-l1',
                title: '1. 网络性能不只是“请求越少越好”',
                content: `
# 更高层的性能视角

减少请求数量当然重要，但现代页面慢很多时候不只是“请求太多”，还包括：

- 建连成本
- 排队等待
- 资源优先级不合理
- 大资源阻塞关键资源

所以网络性能分析必须看连接和调度。
`,
            },
            {
                id: 'network-lv4-l2',
                title: '2. HTTP/2 让多个请求更好地共享同一连接',
                content: `
# HTTP/2 的价值

HTTP/2 的一个核心优势，是允许多个请求在同一连接上更高效地并行传输。

这减少了：

- 重复建连成本
- 某些场景下的排队等待

也让资源调度从“每个请求各管各的”变得更协同。
`,
            },
            {
                id: 'network-lv4-l3',
                title: '3. HTTP/3 在更底层继续优化连接体验',
                content: `
# HTTP/3 的方向

HTTP/3 继续在连接层做优化，目标通常还是：

- 更快恢复
- 更少阻塞
- 在复杂网络环境下更稳

你不一定要背所有细节，但要知道它是在为真实网络条件服务。
`,
            },
            {
                id: 'network-lv4-l4',
                title: '4. DevTools 瀑布图是判断瓶颈位置的重要入口',
                content: `
# 瀑布图能力

看网络瀑布图时，你应该能分辨：

- 哪些请求启动太晚
- 哪些请求下载太久
- 哪些资源阻塞关键渲染

只有先知道慢在哪里，后面的 preload、压缩、拆分和缓存策略才有意义。
`,
            },
        ],
        quizzes: [
            {
                id: 'network-lv4-q1',
                question: '为什么现代网络性能分析不能只盯“请求数量”？',
                options: ['因为请求数量与网络完全无关', '因为建连、排队和资源优先级也会显著影响加载体验', '因为 HTTP/2 不允许多个请求', '因为图片从不影响瀑布图'],
                correctAnswer: 1,
                explanation: '真实加载性能常由连接成本、请求调度和阻塞关系共同决定。',
                difficulty: 'Easy',
            },
            {
                id: 'network-lv4-q2',
                question: 'HTTP/2 带来的关键改进更接近下面哪项？',
                options: ['让浏览器不需要 DNS', '让多个请求更高效地共享连接', '让所有接口都自动缓存一年', '让 HTML 不再需要 CSS'],
                correctAnswer: 1,
                explanation: 'HTTP/2 的核心改进之一就是更高效的多路复用与连接共享。',
                difficulty: 'Medium',
            },
        ],
    },
    createPlaceholderStage('network', 5, 'CDN 与缓存头', '学习边缘缓存、Cache-Control 和失效。', ['CDN', 'Cache-Control', 'Edge'], '设计静态资源缓存策略。', '能解释浏览器缓存和 CDN 缓存的区别。'),
    createPlaceholderStage('network', 6, '代理、反向代理与负载均衡', '理解请求转发、网关和流量分配。', ['Proxy', 'Reverse Proxy', 'Load Balancer'], '画出反向代理后的服务拓扑。', '能解释 Nginx、网关和负载均衡的角色。'),
    createPlaceholderStage('network', 7, '实时协议', '学习 WebSocket、SSE 和长轮询。', ['WebSocket', 'SSE', 'Realtime'], '实现或设计一个实时消息通道。', '能选择适合业务场景的实时通信方案。'),
    createPlaceholderStage('network', 8, '网络安全基础', '理解 CORS、CSRF、MITM、WAF 和常见攻击。', ['CORS', 'CSRF', 'MITM', 'WAF'], '分析一个 Web 网络安全链路。', '能把浏览器安全和网络安全联系起来。'),
    createPlaceholderStage('network', 9, '网络调试工具', '学习 curl、dig、traceroute、Wireshark 和 DevTools。', ['curl', 'dig', 'traceroute', 'Wireshark'], '用工具定位真实网络问题。', '能用命令和 DevTools 给网络问题下结论。')
];

export const LEARNING_TRACKS: LearningTrack[] = [
    {
        id: 'frontend',
        title: 'Frontend Engineering',
        shortTitle: 'Frontend',
        description: 'HTML, CSS, JavaScript, TypeScript, React, browser internals, security, algorithms, and frontend architecture.',
        mission: 'Build a strong frontend engineering foundation through 10 complete levels.',
        stages: ALL_STAGES
    },
    {
        id: 'backend',
        title: 'Backend Engineering',
        shortTitle: 'Backend',
        description: 'Node.js, APIs, databases, auth, caching, queues, observability, security, and backend system design.',
        mission: 'Learn how real services are designed, protected, scaled, and debugged.',
        stages: BACKEND_STAGES
    },
    {
        id: 'fullstack',
        title: 'Full Stack Product Engineering',
        shortTitle: 'Full Stack',
        description: 'End-to-end product flows that connect UI, API, database, deployment, tests, payments, and production operations.',
        mission: 'Connect frontend and backend skills into complete product delivery.',
        stages: FULLSTACK_STAGES
    },
    {
        id: 'network',
        title: 'Network and Web Infrastructure',
        shortTitle: 'Network',
        description: 'HTTP, DNS, TCP/IP, TLS, CDN, proxies, realtime protocols, network security, and debugging tools.',
        mission: 'Make the web request path visible, explainable, and debuggable.',
        stages: NETWORK_STAGES
    }
];

export const DEFAULT_TRACK_ID: LearningTrack['id'] = 'frontend';

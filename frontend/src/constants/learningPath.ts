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
    labId?: 'box-model' | 'layout-spatial' | 'flex-box' | 'grid-layout' | 'specificity' | 'event-loop' | 'closure-scope' | 'prototype-chain' | 'this-binding' | 'bundler-flow' | 'webpack-pipeline' | 'typescript-check' | 'typescript-advanced' | 'lint-format-lab' | 'ci-cd-lab' | 'virtual-dom' | 'react-hooks' | 'react-perf-lab' | 'state-mgmt' | 'component-patterns' | 'fiber-architecture' | 'web-vitals-lab' | 'resource-hints-lab' | 'media-optimization-lab' | 'code-splitting-lab' | 'crp-process' | 'web-workers' | 'http-cache' | 'xss-lab' | 'cors-lab' | 'jwt-lab' | 'csrf-lab' | 'csp-lab' | 'node-event-loop' | 'stream-lab' | 'middleware-lab' | 'big-o-lab' | 'sorting-lab' | 'tree-lab' | 'recursion-lab' | 'array-ll-lab' | 'stack-queue-lab' | 'hash-table-lab' | 'search-lab' | 'dp-lab' | 'design-patterns-lab' | 'mfe-lab' | 'solid-lab' | 'concurrency-lab' | 'deep-clone-lab' | 'reactivity-lab' | 'monitoring-lab' | 'virtual-list-lab' | 'queue-retry-lab' | 'system-design-lab' | 'transaction-lab' | 'index-query-lab';
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
    createPlaceholderStage('fullstack', 0, '需求拆解与产品边界', '把想法拆成用户流程、数据和交互边界。', ['Requirement', 'Scope', 'User Flow'], '从产品需求推导技术任务。', '能把一个模糊需求拆成可开发的前后端任务。'),
    createPlaceholderStage('fullstack', 1, '端到端功能架构', '连接 UI、API、数据库和状态流。', ['E2E Flow', 'API', 'Schema'], '设计一个完整功能闭环。', '能画出从用户点击到数据落库的完整链路。'),
    createPlaceholderStage('fullstack', 2, '数据建模到界面呈现', '从 schema 到接口再到 UI 列表和详情。', ['Schema', 'Query', 'UI State'], '实现一个数据驱动页面。', '能让数据模型、接口和界面状态互相对齐。'),
    createPlaceholderStage('fullstack', 3, '表单、校验与错误状态', '处理表单输入、服务端校验和用户反馈。', ['Form', 'Validation', 'Error State'], '构建一个可靠提交的复杂表单。', '能设计前后端一致的校验和错误展示。'),
    createPlaceholderStage('fullstack', 4, '登录态与权限界面', '把 auth 能力贯穿 UI、API 和路由。', ['Auth UI', 'Protected Route', 'RBAC'], '实现角色化的应用体验。', '能让不同角色看到正确的数据和操作。'),
    createPlaceholderStage('fullstack', 5, '支付与订阅流程', '学习订单、支付状态、Webhook 和订阅生命周期。', ['Payment', 'Webhook', 'Subscription'], '设计一个可追踪的支付流程。', '能解释支付为什么必须以后端状态为准。'),
    createPlaceholderStage('fullstack', 6, '测试策略', '组织单元测试、集成测试和 E2E 测试。', ['Unit Test', 'Integration Test', 'E2E'], '为核心业务路径补测试。', '能判断不同风险应该用哪种测试覆盖。'),
    createPlaceholderStage('fullstack', 7, '部署、环境与 CI/CD', '管理环境变量、构建、发布和回滚。', ['Deploy', 'Environment', 'CI/CD'], '把应用稳定发布到线上。', '能解释 dev、staging、production 的差异。'),
    createPlaceholderStage('fullstack', 8, '跨端性能预算', '同时优化前端加载和后端响应。', ['Performance Budget', 'Latency', 'Bundle'], '建立端到端性能指标。', '能定位性能瓶颈是在客户端、网络还是服务端。'),
    createPlaceholderStage('fullstack', 9, '生产级 SaaS Capstone', '综合实现一个真实 SaaS 小系统。', ['SaaS', 'Architecture', 'Capstone'], '完成一个可演示、可部署、可维护的全栈项目。', '能独立交付一个小型生产级全栈应用。')
];

const NETWORK_STAGES: LearningStage[] = [
    createPlaceholderStage('network', 0, 'HTTP 请求生命周期', '理解 URL 到响应的完整路径。', ['HTTP', 'Request', 'Response'], '追踪一次请求从浏览器到服务端再返回。', '能解释请求头、响应头、状态码和 body 的作用。'),
    createPlaceholderStage('network', 1, 'DNS 与域名系统', '学习域名解析、记录类型和传播。', ['DNS', 'A Record', 'CNAME'], '配置并解释一个域名解析流程。', '能判断域名问题是解析、缓存还是配置导致。'),
    createPlaceholderStage('network', 2, 'TCP/IP 与 UDP', '理解连接、端口、包、延迟和可靠性。', ['TCP', 'UDP', 'Port', 'Latency'], '解释网络连接如何建立与传输。', '能区分 TCP 和 UDP 的使用场景。'),
    createPlaceholderStage('network', 3, 'TLS 与 HTTPS', '学习证书、握手、加密和信任链。', ['TLS', 'HTTPS', 'Certificate'], '分析 HTTPS 为什么安全。', '能解释证书错误和混合内容问题。'),
    createPlaceholderStage('network', 4, '浏览器网络性能', '理解连接复用、HTTP/2、HTTP/3 和优先级。', ['HTTP/2', 'HTTP/3', 'Connection'], '优化网页请求瀑布图。', '能通过 DevTools 判断网络加载瓶颈。'),
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

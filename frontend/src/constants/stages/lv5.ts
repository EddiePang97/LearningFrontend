import type { LearningStage } from '../learningPath';

export const lv5: LearningStage = {
    id: 'lv5-security',
    level: 5,
    title: 'Level 5: 坚盾 - 安全防护',
    description: '安全是前端开发的底线。深入理解 Web 攻击手段及防御方案，构建坚不可摧的应用。',
    topics: ['XSS 防御', 'CSRF 攻防', '浏览器安全策略', '加密与认证', '安全审计'],
    keyConcepts: ['注入攻击', 'Token 机制', '同源策略', 'CSP'],
    mission: '给一个带登录和用户输入的应用做前端安全加固。',
    outcome: '能够识别常见 Web 攻击面，并在认证、输入、跨域、Cookie 和响应头层面做防护。',
    checklist: ['能解释并防御 XSS、CSRF、Clickjacking 和不安全 CORS', '能合理选择 Cookie、Token、JWT、SameSite、HttpOnly 和 Secure', '能配置 CSP、输入清洗和基础安全审计清单'],
    resources: [{ name: 'MDN: Web Security', url: 'https://developer.mozilla.org/en-US/docs/Web/Security' }],
    lessons: [
        {
            id: 'lv5-l1',
            title: '1. XSS (跨站脚本攻击)：不仅是弹窗',
            labId: 'xss-lab',
            content: `
# XSS 攻击详解

## 攻击原理
攻击者将恶意脚本植入页面，让其他用户在浏览器中执行。

## 三种类型
1. **存储型**: 恶意脚本存入数据库（如评论区）。
2. **反射型**: 脚本通过 URL 参数传递，服务器将其反射回页面。
3. **DOM 型**: 纯前端逻辑漏洞，通过修改 DOM 节点触发。

> [!IMPORTANT]
> **防御核心**: 永远不要相信用户的输入。使用编码转义和 \`DOMPurify\`。
        `
        },
        {
            id: 'lv5-l2',
            title: '2. CSRF (跨站请求伪造) 与 Token 防御',
            labId: 'csrf-lab',
            content: `
# CSRF 攻防

## 攻击场景
利用用户已登录的身份，在用户不知情的情况下发送非法请求（如转账、删帖）。

## 防御方案
- **CSRF Token**: 每一个请求都带上一个随机生成的密钥。
- **SameSite Cookie**: 设置为 \`Strict\` 或 \`Lax\`，禁止第三方站点携带 Cookie。
- **二次确认**: 敏感操作要求输入验证码。
        `
        },
        {
            id: 'lv5-l3',
            title: '3. CSP (内容安全策略) 实战配置',
            labId: 'csp-lab',
            content: `
# 什么是 CSP？

CSP 是一种额外的安全层，通过在 HTTP 响应头中声明，告诉浏览器哪些外部资源（脚本、图片、字体）是允许加载的。

## 典型策略
\`\`\`http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.com;
\`\`\`
它可以像防火墙一样，即使页面存在注入点，黑客的脚本也无法加载运行。
        `
        },
        {
            id: 'lv5-l4',
            title: '4. HTTPS 与 SSL/TLS 的通信奥秘',
            content: `
# 为什么必须 HTTPS？

## 核心价值 (CIA)
1. **Confidentiality (机密性)**: 数据加密。
2. **Integrity (完整性)**: 防止链路中途被篡改。
3. **Authentication (身份验证)**: 确保你访问的是真正的服务器。

## 握手流程
涉及公钥加密、私钥解密和最终的对称密钥生成。
        `
        },
        {
            id: 'lv5-l5',
            title: '5. 同源策略 (SOP) 与 CORS 跨域安全',
            labId: 'cors-lab',
            content: `
# 同源策略 (Same-Origin Policy)

浏览器最基础的安全基石。它限制了一个源的文档或脚本如何与另一个源的资源进行交互。

## CORS (跨源资源共享)
是绕过 SOP 的正规方式。
- **简单请求**: 直接发送。
- **预检请求 (Preflight)**: 先发一个 \`OPTIONS\` 请求，确认服务器是否允许跨域。

> [!IMPORTANT]
> **安全最佳實踐**:
> 1.  **白名單機制**: \`Access-Control-Allow-Origin\` 應明確指定允許的域名（如 \`https://client.com\`），而非使用 \`*\`。
> 2.  **動態驗證**: 對於多環境，後端應檢查請求頭 \`Origin\` 是否在信任列表中，再動態返回該域名。
        `
        },
        {
            id: 'lv5-l6',
            title: '6. JWT 认证安全：如何防范劫持？',
            labId: 'jwt-lab',
            content: `
# JSON Web Token (JWT)

## 优势与风险
- **优势**: 无状态，适合分布式系统。
- **风险**: 一旦泄露无法主动撤销。

## 安全建议
- Token 存储在 **HttpOnly** 的 Cookie 中。
- 设置较短的有效期，配合 Refresh Token 使用。
        `
        },
        {
            id: 'lv5-l7',
            title: '7. Cookie 的安全属性：HttpOnly 与 Secure',
            content: `
# 强化 Cookie 安全

1. **HttpOnly**: 禁止 JS 访问。彻底防御 XSS 偷取 Cookie。
2. **Secure**: 仅允许在 HTTPS 协议下传输。
3. **SameSite**: 见前文，防御 CSRF。

> [!TIP]
> 每一个存储敏感信息的 Cookie 都应该集齐这三个属性。
        `
        },
        {
            id: 'lv5-l8',
            title: '8. Clickjacking (点击劫持) 防护',
            content: `
# 点击劫持

## 攻击原理
通过样式将恶意站点透明化，叠加在合法站点之上，诱导用户点击。

## 防御
- **X-Frame-Options**: 设置为 \`DENY\` 或 \`SAMEORIGIN\`，禁止被嵌入 iframe。
- **CSP frame-ancestors**: 现代浏览器推荐方案。
        `
        },
        {
            id: 'lv5-l9',
            title: '9. 前端数据清洗与 Sanitization',
            content: `
# 进阶数据清洗

## 为什么 \`dangerouslySetInnerHTML\` 危险？
它直接绕过了 React 的 XSS 自动转义。

## 正确姿势
如果必须渲染富文本，务必使用 **DOMPurify** 库对 HTML 进行白名单过滤，保留安全的标签（如 \`<b>\`, \`<i>\`），去掉危险的标签（如 \`<script>\`, \`onmouseover\`）。
        `
        },
        {
            id: 'lv5-l10',
            title: '10. 安全审计：自动化工具与 Checklist',
            content: `
# 建立安全防线

- **npm audit**: 检查第三方包的已知安全漏洞。
- **Snyk**: 实时监控代码风险。

## 高级工程师的安全准则
始终假设攻击已经发生，并以此为前提建立多层防御。
        `
        }
    ],
    quizzes: [
        {
            id: 'lv5-q1',
            question: '哪种 XSS 攻击会被永久保存在服务器数据库中？',
            options: ['反射型 XSS', 'DOM 型 XSS', '存储型 XSS', '注入型 XSS'],
            correctAnswer: 2,
            explanation: '存储型 XSS 是最危险的一种，所有访问该页面的用户都会被攻击。',
            difficulty: 'Easy'
        }
    ]
};

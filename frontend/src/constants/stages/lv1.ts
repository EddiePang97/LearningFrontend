import type { LearningStage } from '../learningPath';

export const lv1: LearningStage = {
    id: 'lv1-javascript',
    level: 1,
    title: 'Level 1: 灵魂 - JavaScript 核心',
    description: '深入掌握 JavaScript 语言底层机制，从作用域、原型链到异步编程模型。',
    topics: ['作用域', '闭包', '原型链', '事件循环', 'Promise'],
    keyConcepts: ['执行上下文', '词法作用域', '异步非阻塞'],
    mission: '用原生 JavaScript 做一个带状态、事件、异步请求和本地存储的小型交互应用。',
    outcome: '能够解释 JS 执行机制，并写出可维护的函数、异步流程和对象操作代码。',
    checklist: ['能讲清作用域、闭包、this、原型链和事件循环', '能正确使用 Promise、async/await 和错误处理', '能避免常见类型转换、拷贝和内存泄漏问题'],
    resources: [{ name: 'Javascript.info', url: 'https://javascript.info/' }],
    lessons: [
        {
            id: 'lv1-l1',
            title: '1. 变量提升、暂存死区与作用域',
            content: `
# 变量提升与作用域

## var vs let/const
- **var**: 函数作用域，存在变量提升（Hoisting），可以重复声明。
- **let/const**: 块级作用域，存在**暂存死区 (TDZ)**，不可重复声明。

## 作用域链
JS 引擎查找变量时，会先在当前作用域找，找不到就去父级作用域，直到全局作用域。这就是**作用域链**。
        `
        },
        {
            id: 'lv1-l2',
            title: '2. 闭包 (Closure) 的本质与应用',
            labId: 'closure-scope',
            content: `
# 闭包 (Closure)

## 什么是闭包？
闭包是指**有权访问另一个函数作用域中变量的函数**。即使外部函数已经执行完毕，内部函数依然保留着对其词法作用域的引用。

## 常见用途
1. **数据私有化**: 创建外部无法直接访问的变量。
2. **状态保持**: 在多次函数调用间保持变量状态。

> [!CAUTION]
> 闭包会导致变量常驻内存，不当使用可能引发**内存泄漏**。
        `
        },
        {
            id: 'lv1-l3',
            title: '3. 原型与原型链 (Inheritance)',
            labId: 'prototype-chain',
            content: `
# 原型与原型链

## 核心概念
- 每个函数都有 \`prototype\` 属性。
- 每个对象都有 \`__proto__\` 指向其构造函数的 \`prototype\`。

## 原型链查找
当你访问 \`obj.foo\` 时：
1. 检查 \`obj\` 自身属性。
2. 检查 \`obj.__proto__\`。
3. 检查 \`obj.__proto__.__proto__\`，直到为 \`null\`。
        `
        },
        {
            id: 'lv1-l4',
            title: '4. this 指向与 call/apply/bind',
            labId: 'this-binding',
            content: `
# this 的四种绑定规则

1. **默认绑定**: 全局环境下指向 window（严格模式下为 undefined）。
2. **隐式绑定**: \`obj.foo()\`，this 指向 \`obj\`。
3. **显式绑定**: 使用 \`call\`, \`apply\`, \`bind\`。
4. **new 绑定**: 指向新创建的实例对象。

> [!NOTE]
> **箭头函数**没有自己的 this，它的 this 指向定义时所在的作用域。
        `
        },
        {
            id: 'lv1-l5',
            title: '5. 深拷贝、浅拷贝与类型转换',
            content: `
# 深拷贝与浅拷贝

- **浅拷贝**: 仅复制引用地址（如 \`Object.assign\`, \`展开运算符 [...]\`）。
- **深拷贝**: 彻底复制所有层级的内容（常用 \`JSON.parse(JSON.stringify(obj))\` 或 \`structuredClone\`）。

## 隐式类型转换机制
- \`[] == ![]\` 为 true 的背后逻辑：涉及原始值转换、布尔转换和数值转换的复杂链条。
        `
        },
        {
            id: 'lv1-l6',
            title: '6. Promise 规范与手写原理',
            content: `
# Promise 核心规范

- **三种状态**: Pending, Fulfilled, Rejected。状态一旦改变不可逆。
- **链式调用**: \`.then()\` 返回的是一个新的 Promise。

## 手写重点
理解如何处理异步 resolve 以及如何保证 \`then\` 的时序。
        `
        },
        {
            id: 'lv1-l7',
            title: '7. Async/Await 的异步优雅之道',
            content: `
# Async/Await

## 语法糖本质
Async/Await 是 **Generator + Promise** 的包装。它让异步代码写起来像同步代码。

## 错误处理
必须配套使用 \`try...catch\` 来捕获 await 抛出的异常。
        `
        },
        {
            id: 'lv1-l8',
            title: '8. 事件循环 (Event Loop) 深度模型',
            labId: 'event-loop',
            content: `
# 事件循环 (Event Loop)

## 任务优先级
1. **主线程执行栈**。
2. **微任务队列 (MicroTask)**: \`Promise.then\`, \`MutationObserver\`, \`process.nextTick\`。
3. **宏任务队列 (MacroTask)**: \`setTimeout\`, \`requestAnimationFrame\`, \`I/O\`。

> [!IMPORTANT]
> 执行完一个宏任务后，必须清空**当时**所有的微任务，才会进行下一次渲染。
        `
        },
        {
            id: 'lv1-l9',
            title: '9. 数组高阶函数实战技巧',
            content: `
# 数组高阶函数

## 必会三剑客
- \`map\`: 映射，生成新数组。
- \`filter\`: 过滤。
- \`reduce\`: 累加器，功能最强大，常用于聚合数据。

## 性能注意
在大数据量下，连续调用 \`filter().map()\` 会遍历两次数组，考虑优化。
        `
        },
        {
            id: 'lv1-l10',
            title: '10. JS 垃圾回收与性能优化',
            content: `
# 垃圾回收 (GC)

## 回收算法
- **引用计数**: 如果引用为 0 则回收（缺陷：无法解决循环引用）。
- **标记清除 (Mark-and-Sweep)**: 从根对象开始标记，无法触达的清除。现代浏览器主要使用此方案。

## 内存泄漏常见场景
1. 全局变量。
2. 未清除的定时器。
3. 闭包。
4. 被遗忘的 DOM 引用。
        `
        }
    ],
    quizzes: [
        {
            id: 'lv1-q1',
            question: 'typeof null 的返回结果是什么？',
            options: ['"null"', '"undefined"', '"object"', '"function"'],
            correctAnswer: 2,
            explanation: '这是 JavaScript 的一个历史遗留 bug，null 虽然是原始值但 typeof 结果为 object。',
            difficulty: 'Easy'
        },
        {
            id: 'lv1-q2',
            question: '哪种方式可以创建一个没有原型的对象？',
            options: ['{}', 'new Object()', 'Object.create(null)', 'Object.freeze({})'],
            correctAnswer: 2,
            explanation: 'Object.create(null) 创建的对象不包含任何原型链上的属性，甚至没有 toString。',
            difficulty: 'Medium'
        }
    ]
};

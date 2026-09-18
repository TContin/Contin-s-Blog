---
title: 从零做出大模型应用：一条能走通的学习路线
date: 2026-09-18
category: AI 学习
tags: ["大模型", "Python", "RAG", "项目实践"]
cover: img/AvatarIcon.jpg
excerpt: 不靠堆课程，从 Python 开始，用六个月走完理解原理、写代码、做项目和上线应用的闭环。
---

我开始学大模型时，最容易掉进两个坑：收藏一堆课程却没有作品，或者一上来就研究几十亿参数模型，最后连一个能用的小工具都没做出来。

我给自己定的路线是：**先做出东西，再逐步补原理；每学一个概念，都用代码和项目验证一次。**这篇笔记记录我的学习顺序、必须掌握的内容和项目实践，目标很简单：六个月后，我要能独立做出一个真正有人愿意使用的大模型应用。

## 先弄明白：大模型在做什么

大语言模型可以先粗略理解成一个“根据前文预测下一个 Token”的神经网络。输入“今天天气很”，它会根据训练中学到的规律，判断后面可能是“好”“热”“冷”或别的词，然后继续往下预测。

它不是一个简单的搜索框，而是从大量文本里学到了语言、知识和各种模式。训练完成后，还要经过指令微调和偏好对齐，才更像我们熟悉的聊天助手、代码助手或智能应用。

大致过程可以记成：

```text
海量文本 → 分词 → Transformer → 预测下一个 Token
       → 预训练 → 指令微调 → 偏好对齐 → 应用上线
```

### 我对大模型的脑内地图

<div class="markmap-shell">
  <div class="visual-label"><span>INTERACTIVE MAP</span><b>拖动、缩放、点击节点展开</b></div>
  <div class="markmap" id="ai-learning-map"><script type="text/template"># 大模型应用
## 原理
### Token
### Transformer
### Attention
### 训练与对齐
## 应用
### Prompt
### RAG
### 工具调用
### Agent
## 工程
### API
### 数据库
### Docker
### 评估与监控
## 作品
### 知识库
### 学习助手
### 游戏工具</script></div>
</div>

我不用一开始就把所有数学细节吃透，但要知道自己调用的东西大概是怎么来的。这样遇到回答不准、知识过时或成本太高时，我才知道应该改数据、改检索、改提示词，还是换模型。

## 学习思路：每一阶段都产出东西

我准备一直用这条循环学习：

> 学一个概念 → 手写一个小例子 → 调用真实模型 → 做一个小项目 → 写 README → 复盘问题

<div class="learning-loop">
  <div class="loop-step"><strong>01</strong><b>学概念</b><span>先搞懂它解决什么问题</span></div><i>→</i>
  <div class="loop-step"><strong>02</strong><b>写例子</b><span>用最小代码跑通</span></div><i>→</i>
  <div class="loop-step"><strong>03</strong><b>接模型</b><span>连接真实输入输出</span></div><i>→</i>
  <div class="loop-step"><strong>04</strong><b>做项目</b><span>做成自己会用的工具</span></div><i>→</i>
  <div class="loop-step"><strong>05</strong><b>复盘</b><span>记录失败，再回到 01</span></div>
</div>

我不把“看完多少视频”当成进度。对我更有用的标准是：

- 能不能用自己的话解释这个概念？
- 能不能写出一个最小版本？
- 能不能说清楚模型为什么答错？
- 能不能把项目部署出来，让别人用？

## 第一阶段：Python 和工具，2 到 4 周

我先把写程序和处理资料的能力练起来。重点学 Python 语法、函数、类、文件操作、虚拟环境、JSON、HTTP、REST API，同时熟悉 Git、Linux 基础命令和调试方法。

推荐工具：Python、NumPy、Pandas、Matplotlib、Git。

这一阶段不要只刷语法，直接做小工具：

- 把一批网页文章整理成 Markdown
- 提取 PDF 文本并生成目录
- 分析天气、股票或游戏数据
- 调用模型 API 做一个命令行聊天机器人

做完这些，你应该能独立处理文件、调用接口、保存结果，并把代码放进 GitHub。

## 第二阶段：数学和机器学习，1 到 2 个月

这里不要求我马上成为数学家，但下面这些概念必须能讲明白：向量和矩阵、概率、期望和方差、导数、梯度下降、损失函数、训练集和测试集、过拟合和正则化。

机器学习部分先掌握分类、回归、聚类，以及准确率、召回率、F1、AUC 等评估指标。工具用 scikit-learn 就够了。

建议做几个小项目：

- 手写线性回归和逻辑回归
- 鸢尾花分类
- 房价预测
- 垃圾邮件分类
- 用户流失预测

关键不是分数多高，而是你能回答：“模型错在哪里？数据有没有问题？换个特征或指标会怎样？”

## 第三阶段：深度学习和 PyTorch，1 到 2 个月

接下来我进入神经网络。先理解神经元、多层感知机、激活函数、反向传播、损失函数和优化器，再学习 PyTorch 的 Tensor、Dataset、DataLoader、GPU、模型保存和加载。

CNN 主要用于图像，RNN 和 LSTM 可以了解它们怎样处理序列，但不用在旧架构上投入太多时间。重点要放在 Attention 和 Transformer。

可以按这个顺序做项目：

1. 手写数字识别
2. 猫狗图像分类
3. 新闻文本分类
4. 情感分析
5. 一个简单的图像生成实验

每个项目都记录训练曲线、验证集表现和失败样本。只看最终准确率，很难真正知道模型学会了什么。

## 第四阶段：Transformer 和大语言模型，1 到 2 个月

Transformer 是现在大模型的核心。重点掌握这些词：Token、Tokenizer、Embedding、Self-Attention、Multi-Head Attention、位置编码、LayerNorm、残差连接、Encoder、Decoder 和 Causal Language Modeling。

一句白话解释：Attention 让模型在处理一个词时，能够关注句子里和它关系更大的其他词。

我会先用小模型理解原理，再用 Hugging Face Transformers 调用开源模型。我准备做：

- 从零实现一个迷你 GPT
- 用开源模型做文本分类
- 做本地聊天机器人
- 自动总结文章和提取结构化信息
- 做一个代码解释助手

你会接触到 Prompt Engineering、Transformers 和模型推理。先别急着训练大模型，理解数据怎么进来、模型怎么生成、输出如何评估更重要。

## 第五阶段：RAG 知识库，2 到 4 周

RAG 是个人和小团队最实用的方向之一。它的思路不是把所有资料都塞进模型，而是先从你的文档里找相关内容，再让模型根据这些内容回答。

我把 RAG 理解成“先翻资料，再回答问题”，而不是让模型凭记忆硬答：

<div class="drawflow-shell">
  <div class="visual-label"><span>INTERACTIVE FLOW</span><b>可以拖动画布，滚轮缩放流程</b></div>
  <div id="rag-flow-editor" class="drawflow"></div>
  <div class="flow-caption">我的问题进入检索流程，模型只根据找到的资料回答，并把来源带回来。</div>
</div>

```text
文档 → 切分 → 向量化 → 向量数据库
                       ↓
问题 → 检索相关内容 → 交给模型回答 → 引用来源
```

我需要掌握：Embedding、向量相似度、文档切分、混合检索、Rerank、引用来源、幻觉控制和知识库更新。

项目我会选一个自己真会用的：

- 个人资料知识库
- PDF 学习助手
- 技术文档问答
- 公司制度问答
- 法规或游戏策划资料检索

工具可以从 FAISS 或 Chroma 开始，项目变大后再考虑 Milvus、Elasticsearch、LangChain 或 LlamaIndex。无论用什么框架，都要能解释每一步在做什么。

## 第六阶段：微调、部署和 Agent，1 到 2 个月

当你知道 RAG 解决什么问题后，再学习 LoRA、QLoRA、数据清洗、指令数据格式、训练参数、量化、GPU 显存和 API 服务。

大多数个人项目不需要从零训练大模型。用开源模型加 RAG，或者对小模型做 LoRA 微调，通常成本更低，也更容易验证。

部署部分要会 Docker、Linux、FastAPI 和基础监控，了解 vLLM 这类模型服务工具。最后再学习 Function Calling 和 Agent：让模型调用搜索、数据库、代码执行或业务接口，而不是只会聊天。

我可以做这些项目：

- 微调一个中文客服模型
- 微调一个固定写作风格助手
- 具备工具调用能力的 Agent
- 部署一个可访问的模型 API

## 10 个项目，按难度往上走

1. API 聊天机器人
2. 新闻分类器
3. 情感分析系统
4. PDF 摘要工具
5. 本地模型聊天助手
6. 个人知识库 RAG
7. 多文档问答系统
8. LoRA 微调中文模型
9. 能调用工具的 Agent
10. 从零实现迷你 GPT

最后我想完成一个综合项目，例如“个人 AI 学习助手”：支持上传 PDF、自动总结、知识问答、生成错题、引用原文并保存对话记录。这个项目会同时练到前端、后端、模型调用、RAG、数据库和部署。

## 六个月可以这样安排

我把六个月拆成六个台阶，每一级都要留下一个看得见的作品：

<div class="roadmap-grid">
  <div><b>01 · 基础</b><span>Python、数学、机器学习</span><small>留下 3 个传统项目</small></div>
  <div><b>02 · 训练</b><span>PyTorch、神经网络</span><small>图像和文本分类</small></div>
  <div><b>03 · 原理</b><span>Transformer、Tokenizer</span><small>一个迷你 GPT</small></div>
  <div><b>04 · 应用</b><span>开源模型、Prompt、RAG</span><small>PDF 知识库</small></div>
  <div><b>05 · 调整</b><span>LoRA、QLoRA、数据</span><small>微调一个小模型</small></div>
  <div><b>06 · 上线</b><span>Agent、部署、包装</span><small>完整 AI 应用</small></div>
</div>

| 时间 | 学什么 | 应该留下什么 |
| --- | --- | --- |
| 第 1 个月 | Python、数学、机器学习 | 3 个传统机器学习项目 |
| 第 2 个月 | PyTorch、神经网络 | 图像分类和文本分类 |
| 第 3 个月 | Transformer、Tokenizer | 一个迷你 GPT |
| 第 4 个月 | 开源模型、Prompt、RAG | PDF 知识库 |
| 第 5 个月 | LoRA、QLoRA、数据处理 | 一个微调小模型 |
| 第 6 个月 | Agent、部署、项目包装 | 一个完整 AI 应用 |

每天时间不多也没关系。每周保证一个小产出，比偶尔投入十几个小时更容易坚持。

## 我会用的技术栈

- 编程：Python
- 深度学习：PyTorch
- 模型：Hugging Face Transformers
- 数据：NumPy、Pandas
- 接口：FastAPI
- 前端：Streamlit 或 Vue
- 数据库：PostgreSQL
- 向量库：FAISS、Chroma、Milvus
- 部署：Docker、Linux
- 模型服务：vLLM
- 版本管理：Git、GitHub

我不需要一开始全部学会。先用最简单的组合把项目跑起来，再按问题补工具。

## 最容易踩的坑

- 只看视频，不写代码
- 一开始就研究最大模型
- 只会调 API，不懂数据和评估
- 只学 Prompt，不做真实项目
- 没有记录错误和实验结果
- 不学部署，项目只能停在电脑上
- 把模型说得很自信，当成事实直接使用

学习时我可以让模型当老师，但不能把思考也外包给它。先写自己的答案，再让它指出漏洞；先做一个版本，再让它帮你找问题。重要结论要用文档、测试或真实数据验证。

## 最后：把闭环走完

如果目标是尽快做出产品，优先顺序是：

> Python → PyTorch → Transformer → RAG → 微调 → 部署

如果目标是做算法研究，再深入数学、深度学习理论、Transformer 源码、分布式训练和论文复现。

真正有用的能力不是背过多少术语，而是能完成这一圈：

> **理解原理 → 写出代码 → 训练或调用模型 → 评估效果 → 找到问题 → 改进系统 → 部署使用**

从今天开始，选一个你自己会用的资料库或小工具，先做出第一个能跑的版本。大模型的学习，往往就是从这个不完美但能用的版本开始的。

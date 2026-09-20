// 博客文章数据
const posts = [
  {
    id: 2,
    title: "代码工厂 / 深度遍历：用 visited 和 path 走完一座迷宫",
    excerpt: "从迷宫移动的例子理解 DFS：visited 负责防止重复访问，path 负责记录当前路径并在死路回溯。",
    date: "2026-09-20",
    category: "算法",
    tags: ["Python","DFS","数据结构"],
    cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=300&fit=crop",
    content: `
<p>我一开始把这段代码理解成“找一个没走过的邻居，然后一直往前走”。后来真正写出来才发现，深度优先搜索（DFS）的关键不只是前进，还包括<strong>记住走过哪里</strong>，以及在走到死路时<strong>准确地退回上一个分叉点</strong>。</p>
<h2>我的理解：这其实是两本账</h2>
<p><strong>第一本账是 visited。</strong>它记录已经发现过的节点。只要准备进入一个新节点，就先把它加入 visited。这样即使迷宫里存在环路，也不会在几个格子之间来回绕圈。</p>
<p><strong>第二本账是 path。</strong>它只记录当前这条“正在探索的路径”上，每一步是从哪个方向走出去的。它更像一叠纸条：前进一步就压一张，走到死路就拿掉最上面一张，并沿反方向退回。</p>
<div class="blog-component blog-mindmap" contenteditable="false" data-source="%23%20%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%85%88%E6%90%9C%E7%B4%A2%EF%BC%9A%E8%B5%B0%E8%BF%B7%E5%AE%AB%E6%97%B6%EF%BC%8C%E6%88%91%E6%98%AF%E6%80%8E%E4%B9%88%E5%86%B3%E5%AE%9A%E5%89%8D%E8%BF%9B%E5%92%8C%E5%9B%9E%E5%A4%B4%E7%9A%84%0A%23%23%201.%20%E5%85%88%E8%AE%B0%E4%BD%8F%E5%B7%B2%E7%BB%8F%E5%8F%91%E7%8E%B0%E7%9A%84%E8%8A%82%E7%82%B9%0A%23%23%23%20visited%EF%BC%9A%E9%98%B2%E6%AD%A2%E9%87%8D%E5%A4%8D%E8%B5%B0%E5%92%8C%E6%AD%BB%E5%BE%AA%E7%8E%AF%0A%23%23%202.%20%E8%AE%B0%E5%BD%95%E5%BD%93%E5%89%8D%E8%BF%99%E6%9D%A1%E8%B7%AF%0A%23%23%23%20path%EF%BC%9A%E4%BF%9D%E5%AD%98%E8%B5%B0%E6%9D%A5%E7%9A%84%E6%96%B9%E5%90%91%EF%BC%8C%E5%83%8F%E4%B8%80%E5%8F%A0%E5%9B%9E%E9%80%80%E8%AE%B0%E5%BD%95%0A%23%23%203.%20%E4%BC%98%E5%85%88%E5%AF%BB%E6%89%BE%E6%9C%AA%E8%AE%BF%E9%97%AE%E7%9A%84%E9%82%BB%E5%B1%85%0A%23%23%23%20%E6%89%BE%E5%88%B0%E5%B0%B1%E6%A0%87%E8%AE%B0%E3%80%81%E5%89%8D%E8%BF%9B%E3%80%81%E5%85%A5%E6%A0%88%0A%23%23%204.%20%E6%B2%A1%E6%9C%89%E6%96%B0%E9%82%BB%E5%B1%85%E5%B0%B1%E5%9B%9E%E6%BA%AF%0A%23%23%23%20%E5%87%BA%E6%A0%88%E5%B9%B6%E8%B5%B0%E5%8F%8D%E6%96%B9%E5%90%91%0A%23%23%205.%20%E6%89%BE%E5%88%B0%E7%9B%AE%E6%A0%87%E6%88%96%E5%9B%9E%E5%88%B0%E8%B5%B7%E7%82%B9%0A%23%23%23%20%E7%BB%93%E6%9D%9F%E6%9C%AC%E8%BD%AE%E6%90%9C%E7%B4%A2"><div class="component-badge">交互脑图 · 点击文章后查看</div><div class="component-placeholder">DFS 迷宫搜索</div></div>
<h2>一次移动到底做了什么</h2>
<ol><li>读取当前位置，并枚举北、南、东、西四个候选邻居。</li><li>过滤掉当前不能移动的方向。</li><li>从候选邻居里找一个不在 visited 中的节点。</li><li>先把目标节点加入 visited，再移动，并把方向压入 path。</li><li>如果四周都没有新节点，就从 path 弹出最后一个方向，执行反方向移动。</li></ol>
<blockquote>注意：这里的“所有点都遍历过了”应该更准确地说成“当前节点没有可继续探索的未访问邻居”。这时只回退一步；如果回退后仍然没有新邻居，就继续回退，直到找到新的分叉点。</blockquote>
<h2>前进和回溯的局部代码</h2>
<pre><code class="language-python">for direction, next_pos in get_neighbors(current):
    key = get_pos_key(next_pos)
    if key in visited:
        continue

    visited.add(key)
    path.append(direction)
    move(direction)
    return True

if path:
    last_direction = path.pop()
    move(get_reverse_direction(last_direction))
    return True</code></pre>
<h2>还要补充的三个细节</h2>
<h3>1. 标记时机很重要</h3><p>不能等移动完成后再加入 visited。应该在决定前进时就标记目标节点，否则两个相邻节点可能互相把对方当成“新节点”，形成重复探索。</p>
<h3>2. path 不是 visited 的替代品</h3><p>visited 是全局的“来过没有”；path 是局部的“当前这条路怎么回去”。搜索完成后，visited 可能装满整个可达区域，但 path 最终会退回为空。</p>
<h3>3. 要有终止条件</h3><p>找到宝藏时可以收获并重新初始化；如果 path 已经为空，同时当前位置也没有未访问邻居，就说明整个可达区域已经搜索完毕，应该退出循环或返回失败。</p>
<h2>完整代码</h2>
<p>下面是把这些规则合在一起后的完整版本。相比最初的写法，我把邻居获取、方向反转、初始化和单步搜索拆开了，后面调试会更容易。</p>
<pre><code class="language-python">visited = set()
path = []

def get_pos_key(pos):
    return (pos[&quot;X&quot;], pos[&quot;Y&quot;])

def get_reverse_direction(direction):
    if direction == North:
        return South
    if direction == South:
        return North
    if direction == East:
        return West
    if direction == West:
        return East

def get_neighbors(pos):
    candidates = [
        (North, {&quot;X&quot;: pos[&quot;X&quot;], &quot;Y&quot;: pos[&quot;Y&quot;] + 1}),
        (South, {&quot;X&quot;: pos[&quot;X&quot;], &quot;Y&quot;: pos[&quot;Y&quot;] - 1}),
        (East,  {&quot;X&quot;: pos[&quot;X&quot;] + 1, &quot;Y&quot;: pos[&quot;Y&quot;]}),
        (West,  {&quot;X&quot;: pos[&quot;X&quot;] - 1, &quot;Y&quot;: pos[&quot;Y&quot;]}),
    ]
    return [(direction, next_pos)
            for direction, next_pos in candidates
            if can_move(direction)]

def move_by_dfs():
    global path, visited
    current = {&quot;X&quot;: get_pos_x(), &quot;Y&quot;: get_pos_y()}

    # 先找一个还没有发现过的邻居。
    for direction, next_pos in get_neighbors(current):
        key = get_pos_key(next_pos)
        if key in visited:
            continue

        visited.add(key)       # 先标记，再移动，避免环路重复进入
        path.append(direction) # 记录从当前节点走出去的方向
        move(direction)
        return True

    # 当前节点没有新邻居：沿最近的一步原路返回。
    if path:
        last_direction = path.pop()
        move(get_reverse_direction(last_direction))
        return True

    # path 为空，说明已经回到起点且没有可探索节点。
    return False

def init_search():
    global path, visited
    path = []
    visited = { (get_pos_x(), get_pos_y()) }

init_search()
while True:
    if get_entity_type() == Entities.Treasure:
        harvest()
        init_search()
    elif not move_by_dfs():
        break</code></pre>
    `
  },
  {
    id: 1,
    title: "从零做出大模型应用：一条能走通的学习路线",
    excerpt: "不靠堆课程，从 Python 开始，用六个月走完理解原理、写代码、做项目和上线应用的闭环。",
    date: "2026-09-18",
    category: "AI 学习",
    tags: ["大模型","Python","RAG","项目实践"],
    cover: "img/AvatarIcon.jpg",
    content: `


<p>我开始学大模型时，最容易掉进两个坑：收藏一堆课程却没有作品，或者一上来就研究几十亿参数模型，最后连一个能用的小工具都没做出来。</p>
<p>我给自己定的路线是：**先做出东西，再逐步补原理；每学一个概念，都用代码和项目验证一次。**这篇笔记记录我的学习顺序、必须掌握的内容和项目实践，目标很简单：六个月后，我要能独立做出一个真正有人愿意使用的大模型应用。</p>
<h2>先弄明白：大模型在做什么</h2>
<p>大语言模型可以先粗略理解成一个“根据前文预测下一个 Token”的神经网络。输入“今天天气很”，它会根据训练中学到的规律，判断后面可能是“好”“热”“冷”或别的词，然后继续往下预测。</p>
<p>它不是一个简单的搜索框，而是从大量文本里学到了语言、知识和各种模式。训练完成后，还要经过指令微调和偏好对齐，才更像我们熟悉的聊天助手、代码助手或智能应用。</p>
<p>大致过程可以记成：</p>
<pre><code class="language-text">海量文本 → 分词 → Transformer → 预测下一个 Token
       → 预训练 → 指令微调 → 偏好对齐 → 应用上线
</code></pre>
<h3>我对大模型的脑内地图</h3>
<div class="blog-component blog-mindmap" contenteditable="false" data-source="%23%20%E5%A4%A7%E6%A8%A1%E5%9E%8B%E5%BA%94%E7%94%A8%0A%23%23%20%E5%8E%9F%E7%90%86%0A%23%23%23%20Token%0A%23%23%23%20Transformer%0A%23%23%23%20Attention%0A%23%23%23%20%E8%AE%AD%E7%BB%83%E4%B8%8E%E5%AF%B9%E9%BD%90%0A%23%23%20%E5%BA%94%E7%94%A8%0A%23%23%23%20Prompt%0A%23%23%23%20RAG%0A%23%23%23%20%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8%0A%23%23%23%20Agent%0A%23%23%20%E5%B7%A5%E7%A8%8B%0A%23%23%23%20API%0A%23%23%23%20%E6%95%B0%E6%8D%AE%E5%BA%93%0A%23%23%23%20Docker%0A%23%23%23%20%E8%AF%84%E4%BC%B0%E4%B8%8E%E7%9B%91%E6%8E%A7%0A%23%23%20%E4%BD%9C%E5%93%81%0A%23%23%23%20%E7%9F%A5%E8%AF%86%E5%BA%93%0A%23%23%23%20%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%0A%23%23%23%20%E6%B8%B8%E6%88%8F%E5%B7%A5%E5%85%B7"><div class="component-badge">交互脑图 · 双击可编辑</div><div class="component-placeholder">大模型应用</div></div>

<p>我不用一开始就把所有数学细节吃透，但要知道自己调用的东西大概是怎么来的。这样遇到回答不准、知识过时或成本太高时，我才知道应该改数据、改检索、改提示词，还是换模型。</p>
<h2>学习思路：每一阶段都产出东西</h2>
<p>我准备一直用这条循环学习：</p>
<blockquote>
<p>学一个概念 → 手写一个小例子 → 调用真实模型 → 做一个小项目 → 写 README → 复盘问题</p>
</blockquote>
<div class="learning-loop">
  <div class="loop-step"><strong>01</strong><b>学概念</b><span>先搞懂它解决什么问题</span></div><i>→</i>
  <div class="loop-step"><strong>02</strong><b>写例子</b><span>用最小代码跑通</span></div><i>→</i>
  <div class="loop-step"><strong>03</strong><b>接模型</b><span>连接真实输入输出</span></div><i>→</i>
  <div class="loop-step"><strong>04</strong><b>做项目</b><span>做成自己会用的工具</span></div><i>→</i>
  <div class="loop-step"><strong>05</strong><b>复盘</b><span>记录失败，再回到 01</span></div>
</div>

<p>我不把“看完多少视频”当成进度。对我更有用的标准是：</p>
<ul>
<li>能不能用自己的话解释这个概念？</li>
<li>能不能写出一个最小版本？</li>
<li>能不能说清楚模型为什么答错？</li>
<li>能不能把项目部署出来，让别人用？</li>
</ul>
<h2>第一阶段：Python 和工具，2 到 4 周</h2>
<p>我先把写程序和处理资料的能力练起来。重点学 Python 语法、函数、类、文件操作、虚拟环境、JSON、HTTP、REST API，同时熟悉 Git、Linux 基础命令和调试方法。</p>
<p>推荐工具：Python、NumPy、Pandas、Matplotlib、Git。</p>
<p>这一阶段不要只刷语法，直接做小工具：</p>
<ul>
<li>把一批网页文章整理成 Markdown</li>
<li>提取 PDF 文本并生成目录</li>
<li>分析天气、股票或游戏数据</li>
<li>调用模型 API 做一个命令行聊天机器人</li>
</ul>
<p>做完这些，你应该能独立处理文件、调用接口、保存结果，并把代码放进 GitHub。</p>
<h2>第二阶段：数学和机器学习，1 到 2 个月</h2>
<p>这里不要求我马上成为数学家，但下面这些概念必须能讲明白：向量和矩阵、概率、期望和方差、导数、梯度下降、损失函数、训练集和测试集、过拟合和正则化。</p>
<p>机器学习部分先掌握分类、回归、聚类，以及准确率、召回率、F1、AUC 等评估指标。工具用 scikit-learn 就够了。</p>
<p>建议做几个小项目：</p>
<ul>
<li>手写线性回归和逻辑回归</li>
<li>鸢尾花分类</li>
<li>房价预测</li>
<li>垃圾邮件分类</li>
<li>用户流失预测</li>
</ul>
<p>关键不是分数多高，而是你能回答：“模型错在哪里？数据有没有问题？换个特征或指标会怎样？”</p>
<h2>第三阶段：深度学习和 PyTorch，1 到 2 个月</h2>
<p>接下来我进入神经网络。先理解神经元、多层感知机、激活函数、反向传播、损失函数和优化器，再学习 PyTorch 的 Tensor、Dataset、DataLoader、GPU、模型保存和加载。</p>
<p>CNN 主要用于图像，RNN 和 LSTM 可以了解它们怎样处理序列，但不用在旧架构上投入太多时间。重点要放在 Attention 和 Transformer。</p>
<p>可以按这个顺序做项目：</p>
<ol>
<li>手写数字识别</li>
<li>猫狗图像分类</li>
<li>新闻文本分类</li>
<li>情感分析</li>
<li>一个简单的图像生成实验</li>
</ol>
<p>每个项目都记录训练曲线、验证集表现和失败样本。只看最终准确率，很难真正知道模型学会了什么。</p>
<h2>第四阶段：Transformer 和大语言模型，1 到 2 个月</h2>
<p>Transformer 是现在大模型的核心。重点掌握这些词：Token、Tokenizer、Embedding、Self-Attention、Multi-Head Attention、位置编码、LayerNorm、残差连接、Encoder、Decoder 和 Causal Language Modeling。</p>
<p>一句白话解释：Attention 让模型在处理一个词时，能够关注句子里和它关系更大的其他词。</p>
<p>我会先用小模型理解原理，再用 Hugging Face Transformers 调用开源模型。我准备做：</p>
<ul>
<li>从零实现一个迷你 GPT</li>
<li>用开源模型做文本分类</li>
<li>做本地聊天机器人</li>
<li>自动总结文章和提取结构化信息</li>
<li>做一个代码解释助手</li>
</ul>
<p>你会接触到 Prompt Engineering、Transformers 和模型推理。先别急着训练大模型，理解数据怎么进来、模型怎么生成、输出如何评估更重要。</p>
<h2>第五阶段：RAG 知识库，2 到 4 周</h2>
<p>RAG 是个人和小团队最实用的方向之一。它的思路不是把所有资料都塞进模型，而是先从你的文档里找相关内容，再让模型根据这些内容回答。</p>
<p>我把 RAG 理解成“先翻资料，再回答问题”，而不是让模型凭记忆硬答：</p>
<div class="blog-component blog-flow" contenteditable="false" data-nodes="%5B%7B%22title%22%3A%20%22%E6%88%91%E7%9A%84%E6%96%87%E6%A1%A3%22%2C%20%22detail%22%3A%20%22PDF%20%2F%20%E7%AC%94%E8%AE%B0%20%2F%20%E6%8A%80%E6%9C%AF%E8%B5%84%E6%96%99%22%7D%2C%20%7B%22title%22%3A%20%22%E5%88%87%E5%88%86%20%2B%20%E5%90%91%E9%87%8F%E5%8C%96%22%2C%20%22detail%22%3A%20%22Embedding%22%7D%2C%20%7B%22title%22%3A%20%22%E5%90%91%E9%87%8F%E5%BA%93%22%2C%20%22detail%22%3A%20%22%E5%8F%AF%E6%A3%80%E7%B4%A2%E7%9A%84%E8%B5%84%E6%96%99%E7%89%87%E6%AE%B5%22%7D%2C%20%7B%22title%22%3A%20%22%E6%88%91%E7%9A%84%E9%97%AE%E9%A2%98%22%2C%20%22detail%22%3A%20%22%E5%85%88%E6%8F%90%E5%87%BA%E9%97%AE%E9%A2%98%22%7D%2C%20%7B%22title%22%3A%20%22%E5%9B%9E%E7%AD%94%20%2B%20%E5%BC%95%E7%94%A8%22%2C%20%22detail%22%3A%20%22%E6%A0%B9%E6%8D%AE%E8%B5%84%E6%96%99%E4%BD%9C%E7%AD%94%22%7D%5D"><div class="component-badge">交互流程图 · 双击可编辑</div><div class="component-placeholder">我的文档 → 切分 + 向量化 → 向量库 → 我的问题 → 回答 + 引用</div></div>

<pre><code class="language-text">文档 → 切分 → 向量化 → 向量数据库
                       ↓
问题 → 检索相关内容 → 交给模型回答 → 引用来源
</code></pre>
<p>我需要掌握：Embedding、向量相似度、文档切分、混合检索、Rerank、引用来源、幻觉控制和知识库更新。</p>
<p>项目我会选一个自己真会用的：</p>
<ul>
<li>个人资料知识库</li>
<li>PDF 学习助手</li>
<li>技术文档问答</li>
<li>公司制度问答</li>
<li>法规或游戏策划资料检索</li>
</ul>
<p>工具可以从 FAISS 或 Chroma 开始，项目变大后再考虑 Milvus、Elasticsearch、LangChain 或 LlamaIndex。无论用什么框架，都要能解释每一步在做什么。</p>
<h2>第六阶段：微调、部署和 Agent，1 到 2 个月</h2>
<p>当你知道 RAG 解决什么问题后，再学习 LoRA、QLoRA、数据清洗、指令数据格式、训练参数、量化、GPU 显存和 API 服务。</p>
<p>大多数个人项目不需要从零训练大模型。用开源模型加 RAG，或者对小模型做 LoRA 微调，通常成本更低，也更容易验证。</p>
<p>部署部分要会 Docker、Linux、FastAPI 和基础监控，了解 vLLM 这类模型服务工具。最后再学习 Function Calling 和 Agent：让模型调用搜索、数据库、代码执行或业务接口，而不是只会聊天。</p>
<p>我可以做这些项目：</p>
<ul>
<li>微调一个中文客服模型</li>
<li>微调一个固定写作风格助手</li>
<li>具备工具调用能力的 Agent</li>
<li>部署一个可访问的模型 API</li>
</ul>
<h2>10 个项目，按难度往上走</h2>
<ol>
<li>API 聊天机器人</li>
<li>新闻分类器</li>
<li>情感分析系统</li>
<li>PDF 摘要工具</li>
<li>本地模型聊天助手</li>
<li>个人知识库 RAG</li>
<li>多文档问答系统</li>
<li>LoRA 微调中文模型</li>
<li>能调用工具的 Agent</li>
<li>从零实现迷你 GPT</li>
</ol>
<p>最后我想完成一个综合项目，例如“个人 AI 学习助手”：支持上传 PDF、自动总结、知识问答、生成错题、引用原文并保存对话记录。这个项目会同时练到前端、后端、模型调用、RAG、数据库和部署。</p>
<h2>六个月可以这样安排</h2>
<p>我把六个月拆成六个台阶，每一级都要留下一个看得见的作品：</p>
<div class="roadmap-grid">
  <div><b>01 · 基础</b><span>Python、数学、机器学习</span><small>留下 3 个传统项目</small></div>
  <div><b>02 · 训练</b><span>PyTorch、神经网络</span><small>图像和文本分类</small></div>
  <div><b>03 · 原理</b><span>Transformer、Tokenizer</span><small>一个迷你 GPT</small></div>
  <div><b>04 · 应用</b><span>开源模型、Prompt、RAG</span><small>PDF 知识库</small></div>
  <div><b>05 · 调整</b><span>LoRA、QLoRA、数据</span><small>微调一个小模型</small></div>
  <div><b>06 · 上线</b><span>Agent、部署、包装</span><small>完整 AI 应用</small></div>
</div>

<table>
<thead>
<tr>
<th>时间</th>
<th>学什么</th>
<th>应该留下什么</th>
</tr>
</thead>
<tbody><tr>
<td>第 1 个月</td>
<td>Python、数学、机器学习</td>
<td>3 个传统机器学习项目</td>
</tr>
<tr>
<td>第 2 个月</td>
<td>PyTorch、神经网络</td>
<td>图像分类和文本分类</td>
</tr>
<tr>
<td>第 3 个月</td>
<td>Transformer、Tokenizer</td>
<td>一个迷你 GPT</td>
</tr>
<tr>
<td>第 4 个月</td>
<td>开源模型、Prompt、RAG</td>
<td>PDF 知识库</td>
</tr>
<tr>
<td>第 5 个月</td>
<td>LoRA、QLoRA、数据处理</td>
<td>一个微调小模型</td>
</tr>
<tr>
<td>第 6 个月</td>
<td>Agent、部署、项目包装</td>
<td>一个完整 AI 应用</td>
</tr>
</tbody></table>
<p>每天时间不多也没关系。每周保证一个小产出，比偶尔投入十几个小时更容易坚持。</p>
<h2>我会用的技术栈</h2>
<ul>
<li>编程：Python</li>
<li>深度学习：PyTorch</li>
<li>模型：Hugging Face Transformers</li>
<li>数据：NumPy、Pandas</li>
<li>接口：FastAPI</li>
<li>前端：Streamlit 或 Vue</li>
<li>数据库：PostgreSQL</li>
<li>向量库：FAISS、Chroma、Milvus</li>
<li>部署：Docker、Linux</li>
<li>模型服务：vLLM</li>
<li>版本管理：Git、GitHub</li>
</ul>
<p>我不需要一开始全部学会。先用最简单的组合把项目跑起来，再按问题补工具。</p>
<h2>最容易踩的坑</h2>
<ul>
<li>只看视频，不写代码</li>
<li>一开始就研究最大模型</li>
<li>只会调 API，不懂数据和评估</li>
<li>只学 Prompt，不做真实项目</li>
<li>没有记录错误和实验结果</li>
<li>不学部署，项目只能停在电脑上</li>
<li>把模型说得很自信，当成事实直接使用</li>
</ul>
<p>学习时我可以让模型当老师，但不能把思考也外包给它。先写自己的答案，再让它指出漏洞；先做一个版本，再让它帮你找问题。重要结论要用文档、测试或真实数据验证。</p>
<h2>最后：把闭环走完</h2>
<p>如果目标是尽快做出产品，优先顺序是：</p>
<blockquote>
<p>Python → PyTorch → Transformer → RAG → 微调 → 部署</p>
</blockquote>
<p>如果目标是做算法研究，再深入数学、深度学习理论、Transformer 源码、分布式训练和论文复现。</p>
<p>真正有用的能力不是背过多少术语，而是能完成这一圈：</p>
<blockquote>
<p><strong>理解原理 → 写出代码 → 训练或调用模型 → 评估效果 → 找到问题 → 改进系统 → 部署使用</strong></p>
</blockquote>
<p>从今天开始，选一个你自己会用的资料库或小工具，先做出第一个能跑的版本。大模型的学习，往往就是从这个不完美但能用的版本开始的。</p>

    
    
    `
  }
];

// 归档数据（由 app.js 根据 posts 动态计算）
const archives = [];

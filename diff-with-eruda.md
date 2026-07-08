# @iulo/eruda 与 eruda 的差异

本文档记录了 `@iulo/eruda` 相对于上游 [liriliri/eruda](https://github.com/liriliri/eruda)（v3.4.3）的所有差异。

这些改动源自 [PR #539](https://github.com/liriliri/eruda/pull/539)（*Enhance network panel visualization and configurable display*），该 PR 由 [@iulo](https://github.com/iulo) 于 2026 年 3 月提交，因上游长期未合并，故以 `@iulo/eruda` 独立发布。

---

## 概述

本次变更集中在 **Network 面板**，包含两个主要功能：

1. **改进网络请求详情展示** — 将请求详情重构为结构化的多分区布局
2. **新增网络面板配置项** — 支持切换显示完整文件名（Full Name）和完整 URL（Full URL）

---

## 变更文件清单

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/Network/Detail.js` | 重构 | 重构请求详情渲染逻辑 |
| `src/Network/Network.js` | 增强 | 添加配置系统和 Full Name/URL 切换 |
| `src/Network/Network.scss` | 样式 | 新增配置项相关样式 |
| `package.json` | 元信息 | 包名、版本、仓库信息变更 |

---

## 详细变更

### 1. 请求详情重构 (`src/Network/Detail.js`)

#### 改动前（eruda v3.4.3）

请求详情页面仅展示三个部分：
- Post Data（原始请求体）
- Response Headers（响应头表格）
- Request Headers（请求头表格）
- Response（响应体原文）

所有渲染逻辑内联在 `show()` 方法中，代码冗余且不易维护。

#### 改动后（@iulo/eruda v3.5.0）

重构为 **6 个独立分区**，每个由专用函数生成：

| 分区 | 函数 | 说明 |
|------|------|------|
| General | `buildGeneralSection()` | 展示 Request URL、Method、Status Code、Content-Type |
| Query String Parameters | `buildQuerySection()` | 自动从 URL 中解析 query 参数并以表格展示 |
| Request Payload | `buildPayloadSection()` | 智能区分 form-urlencoded（表格展示）与其他格式（原文展示） |
| Request Headers | `buildHeadersSection()` | 请求头表格 |
| Response Headers | `buildHeadersSection()` | 响应头表格 |
| Response Body | `buildResponseSection()` | 响应体原文 |

**关键改进点：**

- **`buildGeneralSection()`**：新增展示区，类似 Chrome DevTools 的 "General" 部分，一目了然展示请求的核心元信息
- **`buildQuerySection()`**：利用 `URL` API 自动解析 URL 中的查询参数，以键值对表格展示，无需手动查看 URL
- **`buildPayloadSection()`**：智能判断 Content-Type，当请求类型为 `application/x-www-form-urlencoded` 时自动解析为键值对表格，否则以原文展示
- **辅助函数抽取**：`buildRows()`、`buildSection()`、`buildRawSection()` 实现了代码复用

```diff
- // 所有渲染逻辑内联在 show() 方法中
- let postData = ''
- if (data.data) {
-   postData = `<pre class="${c('data')}">${escape(data.data)}</pre>`
- }
- // ... 100+ 行重复的 HTML 拼接

+ // 重构为模块化的构建函数
+ ${buildGeneralSection(data)}
+ ${buildQuerySection(data)}
+ ${buildPayloadSection(data)}
+ ${buildHeadersSection('Request Headers', data.reqHeaders)}
+ ${buildHeadersSection('Response Headers', data.resHeaders)}
+ ${buildResponseSection(data)}
```

---

### 2. 网络面板配置系统 (`src/Network/Network.js`)

新增以 Settings 面板为入口的配置系统，提供两个开关选项：

#### `showFullName` — 显示完整文件名

- **默认值**: `false`
- **作用**: 开启后，网络请求列表中的 Name 列展示完整文件名而非截断版本
- **CSS 类名**: `show-full-name`

#### `showCompleteUrl` — 显示完整 URL

- **默认值**: `false`
- **作用**: 开启后，网络请求列表中的 Name 列展示完整 URL（含协议、域名、路径、查询参数）
- **CSS 类名**: `show-complete-url`
- **特殊处理**: 切换时会重新渲染所有已有的请求条目

**核心实现：**

```javascript
// 初始化配置
_initCfg() {
  const cfg = Settings.createCfg(this.name, {
    showFullName: false,
    showCompleteUrl: false,
  })

  cfg.on('change', (key, val) => {
    switch (key) {
      case 'showFullName':
        return this._updateRequestOption('show-full-name', val)
      case 'showCompleteUrl':
        return this._updateRequestOption('show-complete-url', val)
    }
  })

  settings
    .separator()
    .text('Network')
    .switch(cfg, 'showFullName', 'Show Full Name')
    .switch(cfg, 'showCompleteUrl', 'Show Complete URL')
    .separator()
}
```

**生命周期管理：**
- 在 `init()` 中调用 `_initCfg()` 注册配置项
- 在 `destroy()` 中调用 `_rmCfg()` 清理配置项
- 配置通过 `Settings.createCfg()` 持久化存储

---

### 3. 样式变更 (`src/Network/Network.scss`)

#### 新增样式

```scss
// Full Name 模式：Name 列允许换行和断词
&.show-full-name {
  .luna-data-grid .luna-data-grid-node td:first-child {
    white-space: normal;
    word-break: break-all;
  }
}

// Complete URL 模式：Name 列允许换行和断词
&.show-complete-url {
  .luna-data-grid .luna-data-grid-node td:first-child {
    white-space: normal;
    word-break: break-all;
  }
}
```

#### 修改样式

```scss
// 新增 .payload-raw 类名复用 .response / .data 的样式
.response,
.data,
.payload-raw {
  // 移除了硬编码的 margin 和 border 以适配新的分区布局
  // margin: 10px 0;          // 已注释
  // border-top: 1px solid;   // 已注释
  // border-bottom: 1px solid; // 已注释
}
```

---

## 版本对照

| 属性 | eruda | @iulo/eruda |
|------|-------|-------------|
| 包名 | `eruda` | `@iulo/eruda` |
| 版本 | 3.4.3 | 3.5.0 |
| 基础提交 | `50cc399` (release: v3.4.3) | `cf1214d` (feat: add config for network) |
| NPM | [eruda](https://www.npmjs.com/package/eruda) | [@iulo/eruda](https://www.npmjs.com/package/@iulo/eruda) |
| 仓库 | [liriliri/eruda](https://github.com/liriliri/eruda) | [iulo/eruda](https://github.com/iulo/eruda) |

---

## 安装使用

```bash
# 替换原有的 eruda
npm uninstall eruda
npm install @iulo/eruda

# 或使用 CDN
# https://unpkg.com/@iulo/eruda
```

API 保持与原版 eruda 完全一致：

```javascript
import eruda from '@iulo/eruda'
eruda.init()
```

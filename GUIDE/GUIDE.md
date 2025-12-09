# JXUFE-CSG 网站开发指南

> 仅摘录与当前改动相关的核心规范，原有内容保留在下方。

## 三列布局与侧边栏规范

布局文件：`layouts/default.vue`

### 1. 总体结构

- 使用 `lg:grid-cols-10` 的三列布局：
  - 左列：`lg:col-span-2 lg:col-start-1` —— 站点级 / 全局信息。
  - 中列：`lg:col-span-6 lg:col-start-3` —— 主内容区（各页面内容）。
  - 右列：`lg:col-span-2 lg:col-start-9` —— 当前页面上下文工具（目录、日历等）。
- 移动端（< lg）：只展示主内容；左右列通过“移动端底部卡片”展示需要在手机上也可见的信息。

### 2. 侧边栏卡片模型（SidebarCard）

统一通过 `useSidebarLayout` 组合式管理左右列的卡片：

```ts
import { useSidebarLayout } from '@/composables/useSidebarLayout'

const {
  leftCards,
  rightCards,
  mobileBottomCards,
  registerCard,
  unregisterCard,
  clearSide,
  setCardOptions,
} = useSidebarLayout()
```

#### 2.1 卡片配置类型

```ts
export interface SidebarCardConfig {
  id: string                     // 唯一 ID
  side: 'left' | 'right'         // 左侧 or 右侧
  order?: number                 // 排序，数值越小越靠上（同侧）
  sticky?: boolean               // 是否在桌面端吸顶
  showOnMobileBottom?: boolean   // 是否在移动端底部显示
  component: any                 // 要渲染的组件（不会进入 Nuxt state）
  props?: Record<string, any>    // 组件 props
}
```

#### 2.2 使用约定

- **注册卡片**：

```ts
registerCard({
  id: 'site-info',
  side: 'left',
  order: 10,
  sticky: false,
  showOnMobileBottom: true,
  component: SiteInfoCard,
})
```

- **移除卡片**：

```ts
unregisterCard('site-info')
```

- **清空某一侧所有卡片**：

```ts
clearSide('left')
```

- **更新卡片选项**（顺序 / sticky / 移动端显示 / props）：

```ts
setCardOptions('archive-toc', {
  order: 50,
  sticky: true,
  showOnMobileBottom: true,
  props: { /* 新的 props */ },
})
```

> 注意：`useSidebarLayout` 内部通过本地 `componentRegistry` 存储组件引用，`useState` 里只保存纯数据，避免 SSR 序列化函数导致 `Cannot stringify a function`。

### 3. 左右列职责

#### 3.1 左侧栏（Left Sidebar）

- 职责：展示**站点级 / 协会级信息**，例如：
  - 协会名称、联系方式（当前由 `SiteInfoCard` 承担）。
  - 其它与“整个协会/网站”相关，而非某个具体页面的内容。
- 默认行为（在 `layouts/default.vue` 中）：

```ts
registerCard({
  id: 'site-info',
  side: 'left',
  order: 10,             // 非 sticky 卡片在上方
  sticky: false,
  showOnMobileBottom: true,
  component: SiteInfoCard,
})
```

- 可以在特定路由下通过页面逻辑调整：
  - 某些页面隐藏左侧栏：`clearSide('left')` 或 `route.meta.showLeftSidebar = false`。
  - 某些页面增加额外站点信息卡片：再注册新的 `id` 为 `side: 'left'` 的卡片。

#### 3.2 右侧栏（Right Sidebar）

- 职责：展示**当前页面上下文相关工具**，例如：
  - 目录（TOC，MarkdownTOC）。
  - 日历、相关文章、页面内导航等。
- 示例：归档阅读页（`pages/archive/[para].vue`）注册 TOC 卡片：

```ts
registerCard({
  id: 'archive-toc',
  side: 'right',
  order: 50,                 // sticky 卡片建议放在同列较后位置
  sticky: true,              // 吸顶，滚动时始终可见
  showOnMobileBottom: true,  
  component: MarkdownTOC,
  props: {
    items: tocItems.value,
    markdownRenderRef: markdownRender.value,
  },
})

// TOC 更新时同步 props
tocItems.value = items
setCardOptions('archive-toc', {
  props: {
    items,
    markdownRenderRef: markdownRender.value,
  },
})
```

- 右侧仍保留一个兼容旧逻辑的容器：
  - `#right-sidebar-target` 作为 Teleport 目标；
  - `<slot name="right-sidebar">` 用于自定义右侧内容。

### 4. 卡片样式规范（MD3 风格）

所有侧边栏卡片应使用统一的卡片样式：

```vue
<div
  class="rounded-xl bg-(--md-sys-color-surface-container-lowest)
         dark:bg-(--md-sys-color-surface-container-lowest)
         shadow-center-sm text-(--md-sys-color-on-surface)"
>
  <div class="p-6">
    <!-- 卡片内容组件 -->
  </div>
</div>
```

- 左侧/右侧卡片在 `layouts/default.vue` 中统一包装：

```vue
<div
  v-for="card in leftCards"
  :key="card.id"
  :class="[
    'mt-0',
    'rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)',
    card.sticky ? 'lg:sticky lg:top-24' : 'mt-4',
  ]"
>
  <div class="p-6">
    <component :is="card.component" v-bind="card.props || {}" />
  </div>
</div>
```

### 5. sticky 与排序策略

- 默认排序规则：`order` 数值越小，卡片越靠上。
- 建议：
  - **非 sticky 卡片（普通信息）放在上方**，例如左侧的站点信息卡：`order: 10, sticky: false`。
  - **sticky 卡片（例如 TOC）放在同列较后位置**（更大的 order），避免滚动时 sticky 卡片覆盖其它卡片。
- 示例：

```ts
// 左侧：普通信息
registerCard({ id: 'site-info', side: 'left', order: 10, sticky: false, ... })

// 右侧：TOC，吸顶
registerCard({ id: 'archive-toc', side: 'right', order: 50, sticky: true, ... })
```

### 6. 移动端（竖屏）展示规则

- 默认：左右侧栏在 < lg 屏幕尺寸下隐藏；
- 对于需要在移动端底部也展示的卡片，设置 `showOnMobileBottom: true`：

```ts
registerCard({
  id: 'archive-toc',
  side: 'right',
  showOnMobileBottom: true,
  ...
})
```

布局中统一渲染：

```vue
<div class="mt-4 space-y-4 lg:hidden">
  <div v-for="card in mobileBottomCards" :key="card.id" class="rounded-xl ...">
    <div class="p-6">
      <component :is="card.component" v-bind="card.props || {}" />
    </div>
  </div>
</div>
```

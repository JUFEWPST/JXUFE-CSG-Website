# JXUFE-CSG 布局与侧边栏开发指南



## 1. 默认布局结构（`layouts/default.vue`）

### 1.1 顶层与背景

- 顶层容器：
  - 使用 `min-h-screen`，全站背景色为 `--md-sys-color-surface-container`。
- Banner：
  - 使用 `bg-(--md-sys-color-background)` 作为 Banner 背景色。
- Banner 下方是三列布局区域：
  - 三列区域容器 `bg-transparent`，让全局背景色透出。

### 1.2 三列布局

```vue
<div class="w-full max-w-[1600px] mx-auto px-2">
  <div class="grid grid-cols-1 lg:grid-cols-10 gap-4 items-start">
    <!-- 左列：lg:col-span-2 lg:col-start-1 -->
    <!-- 中列：lg:col-span-6 lg:col-start-3 -->
    <!-- 右列：lg:col-span-2 lg:col-start-9 -->
  </div>
</div>
```

- 左列 / 右列：用于放侧边卡片（站点信息、日历、目录等）。
- 中列 `<main>`：页面主体内容。
- 移动端（< lg）：只显示中列内容；侧边卡片通过“移动端底部卡片”统一渲染在主体下方。

中列在三列区内的类：

```vue
<main
  :class="['lg:col-span-6 lg:col-start-3', 'rounded-xl overflow-hidden', !isHome ? 'shadow-center-sm' : '']"
  class="min-w-0 mt-4 mb-2 md:mb-10"
>
  <slot />
</main>
```

---

## 2. 侧边栏卡片系统：`useSidebarLayout`

### 2.1 组合式 API

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

### 2.2 卡片配置类型

```ts
export interface SidebarCardConfig {
  id: string                     // 唯一 ID
  side: 'left' | 'right'         // 左侧 or 右侧
  order?: number                 // 排序：数值越小越靠前（同一侧、同 sticky 状态内）
  sticky?: boolean               // 是否在桌面端固定在视窗口（右侧目录等）
  showOnMobileBottom?: boolean   // 是否在移动端以“底部卡片”形式展示
  component: any                 // 要渲染的组件
  props?: Record<string, any>    // 传入组件的 props
}
```

内部实现要点（开发时一般不用关心）：

- 使用 `useState` 存储 **纯数据**（id / side / order / sticky / props 等）。
- 使用本地 `componentRegistry` 存放组件引用，避免 `useState` 序列化组件函数导致 SSR 报错。

### 2.3 注册 / 更新 / 移除卡片

#### 注册卡片

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

#### 更新卡片选项（顺序 / sticky / 移动端显示 / props）

```ts
setCardOptions('archive-toc', {
  order: 50,
  sticky: true,
  showOnMobileBottom: true,
  props: {
    items,
    markdownRenderRef: markdownRender.value,
  },
})
```

#### 移除 / 清空

```ts
unregisterCard('archive-toc')
clearSide('right') // 清空某一侧所有卡片
```

---

## 3. 排序与 sticky 规则（最新逻辑）

### 3.1 排序策略

在 `useSidebarLayout.ts` 中：

```ts
const leftCards = computed(() =>
  state.value.cards
    .filter((c) => c.side === 'left')
    .slice()
    // 先按 sticky 分组：非 sticky 在前，sticky 在后
    // 同组内部按 order 从小到大排序
    .sort((a, b) => {
      const stickyA = a.sticky ? 1 : 0
      const stickyB = b.sticky ? 1 : 0
      if (stickyA !== stickyB) return stickyA - stickyB
      return (a.order ?? 100) - (b.order ?? 100)
    })
    .map((c) => ({ ...c, component: componentRegistry[c.id] })),
)

const rightCards = computed(() =>
  state.value.cards
    .filter((c) => c.side === 'right')
    .slice()
    .sort((a, b) => {
      const stickyA = a.sticky ? 1 : 0
      const stickyB = b.sticky ? 1 : 0
      if (stickyA !== stickyB) return stickyA - stickyB
      return (a.order ?? 100) - (b.order ?? 100)
    })
    .map((c) => ({ ...c, component: componentRegistry[c.id] })),
)
```

**含义：**

- 同一侧中：
  - 先渲染所有 `sticky: false` 的卡片；
  - 再渲染所有 `sticky: true` 的卡片（固定卡片自然位于该列底部）。
- 在各自分组内部，用 `order` 决定上下顺序。

### 3.2 sticky 渲染方式

在 `layouts/default.vue` 中，左右两侧都拆成“上半部分 + 下半部分”两个 `<aside>`，看起来是一列，实际上是两段组合：

```vue
<!-- 左侧：非 sticky 在上，sticky 在下 -->
<aside v-if="showLeft && leftNonStickyCards.length"
  class="hidden lg:block lg:col-span-2 lg:col-start-1 self-start">
  <div v-for="card in leftNonStickyCards" :key="card.id"
    class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
    <div class="p-6">
      <component :is="card.component" v-bind="card.props || {}" />
    </div>
  </div>
</aside>

<aside v-if="showLeft && leftStickyCards.length"
  class="hidden lg:block lg:col-span-2 lg:col-start-1 self-start lg:sticky lg:top-24">
  <div v-for="card in leftStickyCards" :key="card.id"
    class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
    <div class="p-6">
      <component :is="card.component" v-bind="card.props || {}" />
    </div>
  </div>
</aside>

<!-- 右侧：非 sticky 在上，sticky 在下（例如 TOC） -->
<aside v-if="showRight && rightNonStickyCards.length"
  class="hidden lg:block lg:col-span-2 lg:col-start-9 self-start">
  <div v-for="card in rightNonStickyCards" :key="card.id"
    class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
    <div class="p-6">
      <component :is="card.component" v-bind="card.props || {}" />
    </div>
  </div>
</aside>

<aside v-if="showRight && rightStickyCards.length"
  class="hidden lg:block lg:col-span-2 lg:col-start-9 self-start lg:sticky lg:top-24">
  <div v-for="card in rightStickyCards" :key="card.id"
    class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
    <div class="p-6">
      <component :is="card.component" v-bind="card.props || {}" />
    </div>
  </div>
</aside>
```

开发者只需要：

- 通过 `sticky: true | false` 决定某个卡片是否固定在视口；
- 通过 `order` 调整同组内部顺序；
- 不需要关心 `leftNonStickyCards` / `rightStickyCards` 等计算属性的具体实现细节。

---

## 4. 默认卡片与页面示例

### 4.1 默认注册的全局卡片

在 `layouts/default.vue` 中：

```ts
// 左侧：站点信息卡
registerCard({
  id: 'site-info',
  side: 'left',
  order: 10,
  sticky: false,
  showOnMobileBottom: true,
  component: SiteInfoCard,
})

// 右侧：日历卡（除归档详情页外显示）
watch(
  () => route.path,
  (path) => {
    if (!path.startsWith('/archive/')) {
      registerCard({
        id: 'site-calendar',
        side: 'right',
        order: 10,
        sticky: false,
        showOnMobileBottom: true,
        component: CalendarCard,
      })
    } else {
      unregisterCard('site-calendar')
    }
  },
  { immediate: true },
)
```

### 4.2 归档详情页 TOC 卡片

文件：`pages/archive/[para].vue`

```ts
import MarkdownTOC from '~/components/MarkdownTOC.vue'
import { useSidebarLayout } from '@/composables/useSidebarLayout'
import { useRightSidebar } from '@/composables/useRightSidebar'

const markdownRender = ref()
const tocItems = ref<TocItem[]>([])

const { setHasContent, clearRightSidebar } = useRightSidebar()
const { registerCard, unregisterCard, setCardOptions } = useSidebarLayout()

function handleTocUpdate(items: TocItem[]) {
  tocItems.value = items
  setHasContent(items.length > 0)

  setCardOptions('archive-toc', {
    props: {
      items,
      markdownRenderRef: markdownRender.value,
    },
  })
}

onMounted(() => {
  // 注册右侧 TOC 卡片
  registerCard({
    id: 'archive-toc',
    side: 'right',
    order: 50,
    sticky: true,              // 固定在视窗口
    showOnMobileBottom: true,  // 在移动端底部展示
    component: MarkdownTOC,
    props: {
      items: tocItems.value,
      markdownRenderRef: markdownRender.value,
    },
  })
})

onUnmounted(() => {
  clearRightSidebar()
  unregisterCard('archive-toc')
})
```

效果：

- 桌面端：TOC 出现在右列底部，并固定在视窗口（sticky）。
- 移动端：TOC 以底部卡片形式展示在正文之后。

---

## 5. 移动端底部卡片

所有设置了 `showOnMobileBottom: true` 的卡片，会在 < lg 屏幕下统一渲染在页面底部：

```vue
<div class="mt-4 space-y-4 lg:hidden">
  <div v-for="card in mobileBottomCards" :key="card.id"
    class="rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
    <div class="p-6">
      <component :is="card.component" v-bind="card.props || {}" />
    </div>
  </div>
</div>
```

---

## 6. 快速实践小结

1. **要在任意页面左侧或右侧加一张卡片**：
   - 在该页面的 `setup` 中调用 `registerCard`；
   - 设定 `side`、`order`、`sticky`、`showOnMobileBottom` 和 `component`；
   - 页面卸载时用 `unregisterCard` 清理。

2. **要做一个“会跟随滚动固定在视窗”的卡片（如 TOC）**：
   - `sticky: true`；
   - 适当调大 `order`，让它在该列底部出现。

3. **要控制移动端显示**：
   - `showOnMobileBottom: true` 时，该卡片会在移动端统一渲染到页面底部。

上述就是当前三列布局和侧边栏系统的最新逻辑，其他与旧实现相关的说明已移除。

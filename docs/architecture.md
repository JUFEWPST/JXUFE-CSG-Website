# 项目开发指南

## 1. 颜色系统（MD3 tokens）

本项目使用 Material Design 3 风格的 CSS 变量作为颜色系统（不追求严格 MD3 规范，重点是统一的 token 与主题切换体验）。

### 1.1 变量来源

- 全局变量定义在：`assets/css/main.css`。
- 变量名遵循：`--md-sys-color-*`。
- 亮色与暗色主题通过 `:root` 与 `.dark` 两套变量覆盖实现。

常用 token 示例：

- 主色与容器：
    - `--md-sys-color-primary`
    - `--md-sys-color-on-primary`
    - `--md-sys-color-primary-container`
    - `--md-sys-color-on-primary-container`
- Surface 与层级：
    - `--md-sys-color-surface`
    - `--md-sys-color-on-surface`
    - `--md-sys-color-surface-container` / `-low` / `-high` / `-highest`
- 轮廓：
    - `--md-sys-color-outline`
    - `--md-sys-color-outline-variant`

### 1.2 在组件中使用

项目使用 Tailwind 的任意值语法引用 token：

```html
<div
    class="bg-(--md-sys-color-surface-container) text-(--md-sys-color-on-surface)"
>
    ...
</div>
```

常见搭配建议：

- **卡片容器**：
    - 背景：`bg-(--md-sys-color-surface-container)`（或 `-low/-high`）
    - 文本：`text-(--md-sys-color-on-surface)` / 次级 `text-(--md-sys-color-on-surface-variant)`
    - 边框：`border-(--md-sys-color-outline-variant)/50`
- **tonal 小标签（如 MemberCard 的 position）**：
    - 背景：`bg-(--md-sys-color-primary-container)`
    - 文字：`text-(--md-sys-color-primary)`

### 1.3 主题切换

- 暗色主题通过 `document.documentElement.classList.toggle('dark', ...)` 切换。
- 组件不直接写死颜色值，优先使用 token，从而自动适配亮/暗主题。

---

## 2. 默认布局结构（`layouts/default.vue`）

### 1.1 顶层与背景

- 顶层容器：使用 `min-h-screen`，全站背景色为 `--md-sys-color-surface-container`。
- Banner：使用 `bg-(--md-sys-color-background)` 作为 Banner 背景色。
- Banner 下方为三列布局区域：三列区域容器 `bg-transparent`，让全局背景色透出。

### 1.2 三列布局

```vue
<div class="w-full max-w-400 mx-auto px-2">
  <div class="grid grid-cols-1 lg:grid-cols-10 gap-4">
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
    :class="[
        'lg:col-span-6 lg:col-start-3',
        'rounded-xl overflow-hidden',
        !isHome ? 'shadow-center-sm' : '',
    ]"
    class="min-w-0 mt-4 mb-2 md:mb-10"
>
  <slot />
</main>
```

---

## 2. 侧边栏卡片系统：`useSidebarLayout`

### 2.1 组合式 API

```ts
import { useSidebarLayout } from "@/composables/useSidebarLayout";

const {
    leftCards,
    rightCards,
    mobileBottomCards,
    registerCard,
    unregisterCard,
    clearSide,
    setCardOptions,
} = useSidebarLayout();
```

### 2.2 卡片配置类型

```ts
export interface SidebarCardConfig {
    id: string; // 唯一 ID
    side: "left" | "right"; // 左侧 or 右侧
    order?: number; // 排序：数值越小越靠前（同一侧、同 sticky 状态内）
    sticky?: boolean; // 是否在桌面端固定在视窗口（右侧目录等）
    showOnMobileBottom?: boolean; // 是否在移动端以“底部卡片”形式展示
    slots?: ("left" | "right" | "mobileBottom")[]; // 统一投放位置（默认包含 side）
    scope?: "global" | "route" | "page"; // 显示范围：全局 / 当前路由 / 当前页面（含 query）
    includeRoutes?: string[]; // 路由前缀白名单
    excludeRoutes?: string[]; // 路由前缀黑名单
    mutualGroup?: string; // 互斥分组（同组仅保留一个）
    priority?: number; // 互斥优先级：越大越优先
    when?: (ctx) => boolean; // 自定义显示条件
    component: any; // 要渲染的组件
    props?: Record<string, any>; // 传入组件的 props
}
```

实现说明：

- 使用 `useState` 存储**纯数据**（id / side / order / sticky / props / route 规则 等）。
- 使用本地 `componentRegistry` 与 `ruleRegistry` 存放组件与 `when` 规则，避免 `useState` 序列化函数导致 SSR 报错。
- `scope: "page" | "route"` 会在路由变化时自动清理旧卡片，避免手动注销的历史包袱。

### 2.3 注册 / 更新 / 移除卡片

#### 注册卡片

```ts
registerCard({
    id: "site-info",
    side: "left",
    order: 10,
    sticky: false,
    showOnMobileBottom: true,
    component: SiteInfoCard,
});
```

#### 更新卡片选项（顺序 / sticky / 投放位置 / props 等）

```ts
setCardOptions("archive-toc", {
    order: 50,
    sticky: true,
    showOnMobileBottom: true,
    mutualGroup: "right-context",
    priority: 100,
    props: {
        items,
        markdownRenderRef: markdownRender.value,
    },
});
```

#### 移除 / 清空

```ts
unregisterCard("archive-toc");
clearSide("right"); // 清空某一侧所有卡片
```

---

## 3. 排序与 sticky 规则

### 3.1 排序策略

在 `useSidebarLayout.ts` 中：

```ts
const leftCards = computed(() =>
    resolvedCards.value
        .filter((c) => c.slots.includes("left"))
        .slice()
        // 先按 sticky 分组：非 sticky 在前，sticky 在后
        // 同组内部按 order 从小到大排序
        .sort((a, b) => {
            const stickyA = a.sticky ? 1 : 0;
            const stickyB = b.sticky ? 1 : 0;
            if (stickyA !== stickyB) return stickyA - stickyB;
            return (a.order ?? 100) - (b.order ?? 100);
        }),
);

const rightCards = computed(() =>
    resolvedCards.value
        .filter((c) => c.slots.includes("right"))
        .slice()
        .sort((a, b) => {
            const stickyA = a.sticky ? 1 : 0;
            const stickyB = b.sticky ? 1 : 0;
            if (stickyA !== stickyB) return stickyA - stickyB;
            return (a.order ?? 100) - (b.order ?? 100);
        }),
);
```

含义：

- 同一侧中：
    - 先渲染所有 `sticky: false` 的卡片；
    - 再渲染所有 `sticky: true` 的卡片（固定卡片自然位于该列底部）。
- 在各自分组内部：用 `order` 决定上下顺序。
- 互斥组 (`mutualGroup`) 会在解析阶段选择优先级最高的卡片参与排序渲染。

### 3.2 sticky 渲染方式

在 `layouts/default.vue` 中，左右两侧各自只有一个 `<aside>` 容器，内部包含非 sticky 和 sticky 卡片。sticky 卡片使用 `lg:sticky lg:top-32`，在距离视口顶部 8rem (128px) 时固定。

```vue
<!-- 左侧：非 sticky 在上，sticky 在下 -->
<aside
    v-if="showLeft && (leftNonStickyCards.length || leftStickyCards.length)"
    class="hidden lg:block lg:col-span-2 lg:col-start-1"
>
  <!-- 非 sticky 卡片 -->
  <div v-if="leftNonStickyCards.length">
    <div v-for="card in leftNonStickyCards" :key="card.id"
      class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
      <div class="p-6">
        <component :is="card.component" v-bind="card.props || {}" />
      </div>
    </div>
  </div>

  <!-- sticky 卡片 -->
  <div v-if="leftStickyCards.length" class="lg:sticky lg:top-32">
    <div v-for="card in leftStickyCards" :key="card.id"
      class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
      <div class="p-6">
        <component :is="card.component" v-bind="card.props || {}" />
      </div>
    </div>
  </div>
</aside>

<!-- 右侧：非 sticky 在上，sticky 在下（例如 TOC） -->
<aside
    v-if="showRight && (rightNonStickyCards.length || rightStickyCards.length)"
    class="hidden lg:block lg:col-span-2 lg:col-start-9"
>
  <!-- 非 sticky 卡片 -->
  <div v-if="rightNonStickyCards.length">
    <div v-for="card in rightNonStickyCards" :key="card.id"
      class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
      <div class="p-6">
        <component :is="card.component" v-bind="card.props || {}" />
      </div>
    </div>
  </div>

  <!-- sticky 卡片 -->
  <div v-if="rightStickyCards.length" class="lg:sticky lg:top-32">
    <div v-for="card in rightStickyCards" :key="card.id"
      class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)">
      <div class="p-6">
        <component :is="card.component" v-bind="card.props || {}" />
      </div>
    </div>
  </div>
</aside>
```

使用说明：

- 通过 `sticky: true | false` 决定某个卡片是否固定在视口；
- 通过 `order` 调整同组内部顺序。

---

## 4. 默认卡片与页面示例

### 4.1 默认注册的全局卡片

在 `layouts/default.vue` 中：

```ts
// 左侧：站点信息卡
registerCard({
    id: "site-info",
    side: "left",
    order: 10,
    sticky: false,
    showOnMobileBottom: true,
    component: SiteInfoCard,
});

// 右侧：日历卡（排除归档与 Wiki）
registerCard({
    id: "site-calendar",
    side: "right",
    order: 10,
    sticky: false,
    showOnMobileBottom: true,
    excludeRoutes: ["/archive/", "/wiki"],
    mutualGroup: "right-context",
    priority: 1,
    component: CalendarCard,
});

// 左侧：Wiki 树（仅在 /wiki 下展示）
registerCard({
    id: "wiki-tree",
    side: "left",
    order: 10,
    sticky: true,
    showOnMobileBottom: true,
    includeRoutes: ["/wiki"],
    component: WikiTree,
});
```

### 4.2 归档详情页 TOC 卡片

文件：`pages/archive/[para].vue`

```ts
import MarkdownTOC from "~/components/MarkdownTOC.vue";
import { useSidebarLayout } from "@/composables/useSidebarLayout";
import { useRightSidebar } from "@/composables/useRightSidebar";

const markdownRender = ref();
const tocItems = ref<TocItem[]>([]);

const { setHasContent, clearRightSidebar } = useRightSidebar();
const { registerCard, setCardOptions } = useSidebarLayout();

function handleTocUpdate(items: TocItem[]) {
    tocItems.value = items;
    setHasContent(items.length > 0);

    setCardOptions("archive-toc", {
        props: {
            items,
            markdownRenderRef: markdownRender.value,
        },
    });
}

onMounted(() => {
    // 注册右侧 TOC 卡片
    registerCard({
        id: "archive-toc",
        side: "right",
        order: 50,
        sticky: true, // 固定在视窗口
        showOnMobileBottom: false, // 是否在移动端底部展示
        scope: "page",
        mutualGroup: "right-context",
        priority: 100,
        component: MarkdownTOC,
        props: {
            items: tocItems.value,
            markdownRenderRef: markdownRender.value,
        },
    });
});

onUnmounted(() => {
    clearRightSidebar();
});
```

效果：

- 桌面端：TOC 出现在右列底部，并固定在视窗口（sticky）。
- 移动端：默认不展示（如需展示可配置 `showOnMobileBottom: true` 或 `slots`）。

---

## 5. 移动端底部卡片

所有设置了 `showOnMobileBottom: true` 或 `slots` 包含 `"mobileBottom"` 的卡片，会在 < lg 屏幕下统一渲染在页面底部：

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

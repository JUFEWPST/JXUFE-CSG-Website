# 开发指南

这份文档记录了项目前端的一些约定与设计思路——在动 UI 之前翻阅一遍，或许能帮你少走一些弯路哦~。

## 颜色系统：MD3 token

整套配色采用了 Material Design 3 风格的 CSS 变量体系。我们并未严格遵循规范本身，稍微进行了一些调整

变量统一集中在 `assets/css/main.css` 中定义，命名前缀为 `--md-sys-color-*`；亮色值挂载在 `:root` 下，暗色值则在 `.dark` 选择器中进行覆盖。

常用的几类变量如下：

- 主色与对应容器色：`--md-sys-color-primary`、`--md-sys-color-on-primary` 及其 `-container` 系列
- Surface：`--md-sys-color-surface`、`--md-sys-color-on-surface`，需要分层时可使用 `surface-container` 配合 `-low / -high / -highest`
- 描边：`--md-sys-color-outline` 与 `--md-sys-color-outline-variant`

### 在组件中使用

借助 Tailwind 的任意值语法直接引用：

```html
<div
    class="bg-(--md-sys-color-surface-container) text-(--md-sys-color-on-surface)"
>
    ...
</div>
```

几种常见搭配方式：

- **卡片容器**
    - 背景：`bg-(--md-sys-color-surface-container)`，需要更浅或更深时改为 `-low / -high`
    - 文本：主内容 `text-(--md-sys-color-on-surface)`、次要内容 `text-(--md-sys-color-on-surface-variant)`
    - 描边：`border-(--md-sys-color-outline-variant)/50`
- **tonal 标签**（例如 MemberCard 上的职位 chip）
    - 背景：`bg-(--md-sys-color-primary-container)`
    - 文字：`text-(--md-sys-color-primary)`

### 主题切换

暗色模式的切换方式很简单——在 `<html>` 元素上添加 `.dark` 类即可：

```js
document.documentElement.classList.toggle("dark", isDark);
```

编写组件时请勿硬编码颜色值，全部通过 token 引用。这样一来，主题切换时就不需要修改任何组件代码啦~。

---

## 默认布局：`layouts/default.vue`

页面顶层设置为 `min-h-screen`，全站背景色为 `--md-sys-color-surface-container`；Banner 独立使用 `--md-sys-color-background`，使顶部区域与正文内容形成视觉层次感；三列容器均为透明，让全局背景得以透出。

### 三列网格

```vue
<div class="w-full max-w-400 mx-auto px-2">
  <div class="grid grid-cols-1 lg:grid-cols-10 gap-4">
    <!-- 左列：lg:col-span-2 lg:col-start-1 -->
    <!-- 中列：lg:col-span-6 lg:col-start-3 -->
    <!-- 右列：lg:col-span-2 lg:col-start-9 -->
  </div>
</div>
```

- 左右两列用于挂载侧边卡片：站点信息、日历、目录等
- 中列为主页面区域 `<main>`
- 屏幕宽度小于 `lg` 时，左右两列隐藏，侧边卡片改为在主体下方依次排列（称为"移动端底部卡片"）

中列本身的实现：

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

首页不显示阴影，其余页面默认带有阴影——视觉上呈现出浮起卡片的效果。

---

## 侧边栏卡片：`useSidebarLayout`

侧边卡片采用声明式设计：在组件或页面中"注册"一张卡片，组合式函数与默认布局会自动将其放置到对应位置（左列 / 右列 / 移动端底部），路由切换时也会自动进行清理。

### API

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

### 卡片配置

```ts
export interface SidebarCardConfig {
    id: string; // 唯一标识
    side: "left" | "right"; // 默认归属列
    order?: number; // 同侧同 sticky 分组内的排序，数值越小越靠前
    sticky?: boolean; // 桌面端是否固定在视口顶部
    showOnMobileBottom?: boolean; // 移动端是否加入"底部队列"
    slots?: ("left" | "right" | "mobileBottom")[]; // 投放位置（默认使用 side 的值）
    scope?: "global" | "route" | "page"; // 显示范围
    includeRoutes?: string[]; // 路由前缀白名单
    excludeRoutes?: string[]; // 路由前缀黑名单
    mutualGroup?: string; // 互斥分组：同组仅保留一张卡片
    priority?: number; // 互斥时的优先级，数值越大越优先
    when?: (ctx) => boolean; // 自定义显示条件
    component: any; // 要渲染的组件
    props?: Record<string, any>; // 传递给组件的 props
}
```

有两个细节值得留意哦：

- 卡片的**纯数据**部分（id / side / order / sticky / props / 路由规则等）通过 `useState` 管理，可参与 SSR 序列化；组件本体与 `when` 函数则存放在本地的 `componentRegistry` 和 `ruleRegistry` 中，从而规避了"`useState` 无法存储函数"这个常见问题。
- `scope: "page" | "route"` 的卡片会在路由变化时自动清除。编写页面时无需逐一调用 `unregisterCard`，是不是很方便呢~。

### 注册 / 更新 / 移除

注册一张卡片：

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

如果需要后续修改 props、排序或 sticky 属性：

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

手动清理方式：

```ts
unregisterCard("archive-toc");
clearSide("right"); // 清空整列
```

---

## 排序与 sticky

### 排序规则

`useSidebarLayout.ts` 中负责排序的核心逻辑：

```ts
const leftCards = computed(() =>
    resolvedCards.value
        .filter((c) => c.slots.includes("left"))
        .slice()
        // sticky 卡片整体下沉，order 决定上下顺序
        .sort((a, b) => {
            const stickyA = a.sticky ? 1 : 0;
            const stickyB = b.sticky ? 1 : 0;
            if (stickyA !== stickyB) return stickyA - stickyB;
            return (a.order ?? 100) - (b.order ?? 100);
        }),
);
```

排序逻辑相当直观：

- 同一列中，先排列所有非 sticky 卡片，sticky 卡片统一排列在底部
- 各自分组内再按 `order` 值从小到大排列
- 若声明了 `mutualGroup`，则在排序之前先按 `priority` 选出胜出者，组内其余卡片不参与渲染

设计目标在于：像"右侧 TOC 始终固定在底部，其余卡片各归其位"这样的需求，仅需两行配置即可实现。

### sticky 的渲染

`layouts/default.vue` 中，左右两列各有一个 `<aside>`，内部划分为两块区域：非 sticky 卡片在上方，sticky 卡片在下方；sticky 区域外层包裹了 `lg:sticky lg:top-32`，当滚动至距视口顶部 128px 时便会固定住。

```vue
<aside
    v-if="showLeft && (leftNonStickyCards.length || leftStickyCards.length)"
    class="hidden lg:block lg:col-span-2 lg:col-start-1"
>
    <div v-if="leftNonStickyCards.length">
        <div
            v-for="card in leftNonStickyCards"
            :key="card.id"
            class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)"
        >
            <div class="p-6">
                <component :is="card.component" v-bind="card.props || {}" />
            </div>
        </div>
    </div>

    <div v-if="leftStickyCards.length" class="lg:sticky lg:top-32">
        <div
            v-for="card in leftStickyCards"
            :key="card.id"
            class="mt-4 rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)"
        >
            <div class="p-6">
                <component :is="card.component" v-bind="card.props || {}" />
            </div>
        </div>
    </div>
</aside>
```

右列结构与之对称，此处不再赘述。若要让某张卡片固定，只需为其设置 `sticky: true`；同一列中的多张 sticky 卡片会按 `order` 值决定排列顺序。

---

## 默认卡片与页面接入示例

### 全局默认卡片

`layouts/default.vue` 在挂载时注册了三张全局卡片：

```ts
// 左侧：站点信息
registerCard({
    id: "site-info",
    side: "left",
    order: 10,
    sticky: false,
    showOnMobileBottom: true,
    component: SiteInfoCard,
});

// 右侧：日历（除归档与 Wiki 页面外均显示）
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

// 左侧：Wiki 树（仅在 /wiki 路径下出现）
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

`mutualGroup: "right-context"` 的设计意图是为右列上下文预留位置——日历卡片作为默认占位方，当归档详情页的 TOC 卡片设置了更高的 priority 值时，进入归档页面后日历卡片会自动让位。

### 归档详情页：TOC 卡片

文件 `pages/archive/[para].vue`：

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
    registerCard({
        id: "archive-toc",
        side: "right",
        order: 50,
        sticky: true,
        showOnMobileBottom: false,
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

实际效果如下：

- 桌面端：TOC 出现在右列底部，并固定于视口中
- 移动端：默认不展示，如需显示可设置 `showOnMobileBottom: true` 或在 `slots` 中加入 `"mobileBottom"`

---

## 移动端底部卡片

只要某张卡片声明了 `showOnMobileBottom: true`，或者 `slots` 中包含了 `"mobileBottom"`，在屏幕宽度小于 `lg` 时，它就会被收入主体下方的"底部队列"中依次展示：

```vue
<div class="mt-4 space-y-4 lg:hidden">
    <div
        v-for="card in mobileBottomCards"
        :key="card.id"
        class="rounded-xl bg-(--md-sys-color-surface-container-lowest) dark:bg-(--md-sys-color-surface-container-lowest) shadow-center-sm text-(--md-sys-color-on-surface)"
    >
        <div class="p-6">
            <component :is="card.component" v-bind="card.props || {}" />
        </div>
    </div>
</div>
```

外层添加了 `lg:hidden`，因此该区域在大屏幕上不会出现，左右两列的功能不受影响。

---

## 页面 SEO

全站 SEO 元数据（`<title>`、OG、Twitter、canonical、JSON-LD 等）由两套组合式函数分管，**禁止在页面组件中直接调用 `useHead` / `useSeoMeta` / `setPageTitle` 拼凑标签**。

| 组合式函数 | 适用场景 | 覆盖范围 |
|-----------|---------|---------|
| `usePageMeta` | 所有静态页面 | `<title>` + OG + Twitter + canonical + keywords + robots + JSON-LD |
| `useBotMeta` | CMS 动态页面（`archive/[para]`、`wiki/[...slug]`） | 同上，但仅在服务端对爬虫 UA 渲染 |

两者互斥，一个页面只调用其中一种。

---

### `usePageMeta`：静态页面

一行调用覆盖全部 SEO 标签，内部自动处理标题注册、OG/Twitter 社交分享、结构化数据等：

```ts
import { usePageMeta } from "@/composables/usePageMeta";

usePageMeta({
    titleKey: "pages.volunteer.title",            // i18n key，用于 <title> + og:title
    descriptionKey: "pages.volunteer.meta.description",
    keywords: "江财,志愿填报,录取分数",               // 可选
    canonicalPath: "/volunteer",                    // 可选，默认取 route.path
    suffixKey: "nav.archive",                       // 可选，版块后缀
    schema: { "@type": "WebApplication", ... },     // 可选，自定义 JSON-LD；传 null 跳过
    noIndex: false,                                  // 可选，设为 true 输出 noindex
});
```

- `titleKey` 可省略（如首页），此时沿用 layout 的默认标题
- 无需手动拼接 ` - 江西财经大学网络安全协会`，layout 自动完成
- `ogLocale` 自动跟随当前语言（zh → zh_CN, en → en_US, ja → ja_JP, ko → ko_KR）
- 所有标签在 SSR 阶段即注入 HTML，爬虫无需执行 JS 即可获取完整元数据

**首页特殊处理**：首页不设置 `titleKey`，仅传入 `descriptionKey` + `canonicalPath`，标题沿用 `pages.home.meta.title`（即全站默认标题）。

---

### `useBotMeta`：CMS 动态页面

仅用于 `archive/[para].vue` 和 `wiki/[...slug].vue`——这两个页面的标题和内容来自 CMS API，在服务端渲染时需要额外请求数据才能生成 SEO 标签。

```ts
await useBotMeta(
    () => `/v1/contents/${route.params.para}`,
    {
        schema: "Article",
        type: "article",
        titleFormatter: (title) =>
            `${title} - ${t("meta.fullName")} ${t("nav.archive")}`,
    },
);
```

- 仅在服务端、且 User-Agent 匹配已知爬虫（Googlebot、Baiduspider 等 29 种）时执行
- 从 CMS API 拉取文章标题与正文，提取摘要作为 description，生成 JSON-LD Article schema
- 非爬虫请求直接跳过，由客户端渲染后再设置标题

---

### `<title>` 组装流程

无论使用 `usePageMeta` 还是 `useBotMeta`，最终的 `<title>` 标签由 `layouts/default.vue` 统一组装：

```
{pageTitle} - {meta.fullName}{suffix}
```

- **普通页面**：`时间线 - 江西财经大学网络安全协会`
- **带版块页面**：`2026新春 - 江西财经大学网络安全协会 归档`
- **首页**（无 pageTitle）：`江西财经大学网络安全协会 - 共筑网络安全 坚守网络防线`

开发时**无需在页面中手动拼接标题字符串**。

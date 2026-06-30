# UX 设计规范

这份文档定义本项目的界面设计约定。动手写 UI 之前先读一遍，让你的产出和全站保持统一的手感。

## 设计基调

本项目以 **Material Design 3** 为设计基底，取其神而不拘其形：配色、层级、圆角、动效都借鉴 MD3，但具体落地以**视觉一致**与**实现简洁**为先，按需裁剪。

三条贯穿全文的原则：

- **Token 驱动**：颜色、层级一律引用设计 token，引用即可。
- **轻量克制**：用最小的视觉变化把反馈讲清楚；动效服务于层次。
- **组件优先**：能用 `Anzu*` 组件就用，保证全站控件手感一致。

---

## 颜色：一切走 token

全套配色是 MD3 token 体系，变量前缀 `--md-sys-color-*`。主题色在运行时由种子色生成整套调色板，并支持用户换肤——**所以组件里只认 token，换肤与明暗切换都会自动生效**。

用 Tailwind 任意值语法引用：

```html
<div class="bg-(--md-sys-color-surface-container) text-(--md-sys-color-on-surface)">
```

常用搭配：

- **卡片容器**：背景 `surface-container-lowest`（需要层次再用 `-low / -high`），正文 `on-surface`，次要文字 `on-surface-variant`，描边 `outline-variant/50`
- **主操作 / 强调**：`primary` + `on-primary`
- **tonal 标签 chip**：背景 `primary-container`，文字 `primary`
- **明暗**：给 `<html>` 加 `.dark` 类即可，token 自动切换；组件写一套色值就够

---

## 交互状态：轻量叠色

这是项目对 MD3 裁剪得最明显的一处，**统一遵循以下手感**：

- **hover / active**：盖一层中性叠色 `hover:bg-black/5 dark:hover:bg-white/5`，按下加深到 `/10`。全站可点元素都用这套。
- **主按钮按压**：在实底上叠 `bg-current` 覆盖层，`hover` 透明度 `0.08`、`active` `0.12`。
- **焦点**：`focus-visible:ring-2 ring-(--md-sys-color-primary)/20`，只在键盘焦点时出现。
- **选中态**：用 `primary-container` / `secondary-container` 低饱和容器色打底，配 `primary` 文字。

---

## 组件：优先用 Anzu 组件

UI 由 `Anzu*` 组件搭建：`AnzuButton`、`AnzuInput`、`AnzuDropdown`、`AnzuNavBar`、`AnzuNotification`、`AnzuPagination`、`AnzuSelector`、`AnzuAlert` 等。新页面优先复用。

`AnzuButton` 是按钮规范基准：

- 变体：`filled`（主操作）、`tonal`、`elevated`、`outlined`、`text`（弱操作）
- 尺寸：`sm / md / lg`
- 内建 loading / success / error 状态与图标插槽

需要手写控件时，沿用上面的颜色 token 与叠色状态约定，让它和组件长在一起。

---

## 图标

- 界面图标优先用 **Heroicons**（`@heroicons/vue/24/outline`，描边风格，与全站统一）。
- 没有合适的 Heroicon 时，才退而使用内联 SVG：用 `currentColor` 取色、尺寸用 `h-* w-*`，跟随 token。
- **不要用 emoji** 充当图标、按钮符号或标题装饰；代码、界面、文档都一致适用。
- 尺寸惯例：行内图标 `h-4 w-4` 或 `h-5 w-5`；按钮图标走 `AnzuButton` 的 `#icon` 插槽。

---

## 形状与阴影

- **圆角**：控件（按钮 / 输入框 / 下拉）`rounded-lg`；卡片 / 容器 / 代码块 `rounded-xl`；图标钮 / 胶囊 / 浮动按钮 `rounded-full`。
- **阴影**：用工具类 `shadow-center-sm`（卡片默认）与 `shadow-center-md`（强调）。两者是四向均匀的柔光阴影，表达"浮起"而非方向光。
- **浮层**：下拉、菜单、通知用 `shadow-lg` + `surface-container-lowest` 背景。

---

## 动效

按交互体量分档，统一使用：

- **微交互**（hover、按压、图标）：`150–200ms`，`ease-out`
- **状态 / 明暗 / 主题色切换**：`300ms`，`transition-colors`
- **大区块 / Banner / 头部**：`500–700ms`，强调曲线 `cubic-bezier(0.25, 0.8, 0.25, 1)`
- **进出场**：`scale-95 ↔ scale-100` 配 `opacity`（下拉、菜单、弹层通用）

动效用来强化反馈与空间层次，默认从简。

---

## 视觉克制

设计时避免以下手法：

- 用边框包裹、框住元素来分区
- 强阴影、又深又重的投影
- hover 时元素上浮、抬升或放大
- 发光、光晕
- 渐变色填充

例外：`ArticleBlock`、`LinkBlock` 与导航栏菜单项有各自既定的 hover 效果，无需为上述规则改动它们。

---

## 排版与字体

- 全站字体 `HarmonyOS Sans SC`，无需在组件里再声明。
- 正文用 `on-surface`，次要 / 辅助文字用 `on-surface-variant`，弱化层级靠颜色而非缩小字号。
- 正文区（Markdown）标题用 `clamp()` 流式字号，自动适配视口。

---

## 布局：自适应三列

页面顶层背景用 `surface-container`；头部 Banner 用 `background` 形成层次；三列容器透明，让全局背景透出。

```
左列 col-span-2  |  主列（自适应）  |  右列 col-span-2
```

主列宽度**随侧栏存在与否自动伸缩**：左右都有 → 6 列；只剩一侧 → 8 列；两侧皆无 → 占满 10 列。交给布局，不用手算。

- 小于 `lg` 时左右列隐藏，侧栏卡片转为主体下方堆叠或移动端抽屉。
- 用路由 meta `showLeftSidebar` / `showRightSidebar` 可让某页隐藏某侧。
- **卡片外观统一**：`rounded-xl` + `surface-container-lowest` + `shadow-center-sm`，内边距 `p-6`。

---

## 侧边栏卡片：声明式注册

侧栏内容通过 `useSidebarLayout` 声明式"注册"，布局会自动把卡片投放到对应位置（左 / 右 / 移动端底部 / 移动端抽屉），路由切换时自动清理。

```ts
const { registerCard, setCardOptions, unregisterCard, clearSide } =
    useSidebarLayout();

registerCard({
    id: "site-info",
    side: "left",
    order: 10,
    showOnMobileBottom: true,
    component: SiteInfoCard,
});
```

`SidebarCardConfig` 关键字段：

| 字段                                    | 说明                                       |
| --------------------------------------- | ------------------------------------------ |
| `id` / `side` / `component`             | 必填：唯一标识、默认归属列、渲染组件       |
| `order`                                 | 同列排序，越小越靠上                       |
| `sticky`                                | 桌面端吸顶（吸顶卡片整体沉到列底）         |
| `scope`                                 | `global` / `route` / `page`，后两者随路由自动清除 |
| `includeRoutes` / `excludeRoutes`       | 路由前缀白 / 黑名单                        |
| `mutualGroup` / `priority`              | 互斥分组，同组按 priority 留一张           |
| `when`                                  | 运行时自定义显示条件                       |
| `showOnMobileBottom`                    | 移动端进底部堆叠                           |
| `showOnMobileDrawer` + `mobileLabelKey` | 移动端进浮层抽屉，及抽屉按钮文案           |

要点：

- 纯数据字段走 `useState`，可参与 SSR；`component` 与 `when` 存本地注册表，规避函数无法序列化的问题。
- `scope: "route" | "page"` 的卡片随路由自动清理，页面里无需手动 `unregisterCard`。
- 后续改 props / 排序用 `setCardOptions(id, { ... })`。

---

## 页面 SEO

SEO 元数据由两个组合式函数统管，**页面里不要直接写 `useHead` / `useSeoMeta` 拼标签**：

| 函数          | 场景                                                     |
| ------------- | -------------------------------------------------------- |
| `usePageMeta` | 所有静态页面                                             |
| `useBotMeta`  | CMS 动态页（`archive/[para]`、`wiki/[...slug]`），仅服务端对爬虫渲染 |

一个页面只用其中一个。标题统一由 layout 组装成 `{页面标题} - {全站名}{后缀}`，页面只传 `titleKey` 等，不用手拼字符串。

```ts
usePageMeta({
    titleKey: "pages.volunteer.title",
    descriptionKey: "pages.volunteer.meta.description",
    canonicalPath: "/volunteer",
});
```

---

## 请保留的「私货」彩蛋

下面这些是作者们特意埋的彩蛋，是项目的小特色。重构、改文案、清理代码或补 i18n 时请**原样保留**，别顺手抹平：

- **分页器「芳文跳」按钮**（`components/AnzuPagination.vue`）：跳页按钮文案是固定的「芳文跳」，属于刻意保留的彩蛋文案、并非漏翻的占位符——别替换成「跳转 / Go」，也别塞进 i18n。
- **主题色预设名**（`components/ToggleTheme.vue`）：`Miku`、`Umi`、`Nico`、`Honoka`… 这些预设名与配色是刻意的对应关系，保持原样，别改成「蓝 / 粉」之类的通用名。
- **首页 Banner 隐藏 logo**（`layouts/default.vue`）：点击首页头图在文字与隐藏图标间切换，保留这个点击交互。
- **关于页隐藏 logo**（`pages/about/index.vue`）：顶部「网安 \* 领域」是一个 `FlipToggle`，翻面会露出 `网安领域.webp` 与一句彩蛋文案，保留它的 back 面与翻转交互。

调整这些组件的布局 / 样式没问题，但以上内容请留着它们。


# AGENTS.md

欢迎，这是给代理伙伴们的项目速览与约束。想深入了解架构细节的话，可以去 [`docs/architecture.md`](docs/architecture.md) 看看；如果要贡献代码，记得先读一下 [`CONTRIBUTING.md`](CONTRIBUTING.md)。动手改 UI 之前，也拜托先看看 UX 规范哦。

## 技术栈

Nuxt 4 + Vue 3 + Tailwind CSS v4 + `@nuxtjs/i18n` + `@nuxtjs/mdc` + TypeScript

## 常用命令

- `pnpm install` —— 装依赖
- `pnpm dev` —— 开发环境，不过既然你是AI的话，这个代码还是交给人类执行吧
- `pnpm exec nuxt typecheck` —— 做类型检查
- `pnpm exec prettier --write .` —— 格式化代码

## 代码约定

- 组件文件名用 PascalCase
- 文案统一放到 `i18n/locales/*.json` 里，zh / en / ja / ko 四种语言记得同步更新
- 颜色请用 `--md-sys-color-*` token，尽全力不写硬编码颜色值
- 图标优先用 Heroicons（`@heroicons/vue/24/outline`），实在找不到合适的再用内联 SVG，不能使用 emoji
- UI 组件优先复用 `Anzu*` 系列的
- 页面 SEO 请用 `usePageMeta` / `useBotMeta`，不要在页面里直接使用 `useHead` / `useSeoMeta`
- 侧栏内容优先通过 `useSidebarLayout` 注册，不要重复手写布局

## 保留约定

`docs/architecture.md` 里提到的彩蛋和既定交互请原样保留，包括分页器的「芳文跳」、主题色预设名、首页 Banner 隐藏 logo、关于页 FlipToggle 隐藏内容这些小细节。

# AGENTS.md

本仓库的代理速览。UX 规范见 [`docs/architecture.md`](docs/architecture.md)，贡献与提交规范见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

## 技术栈

Nuxt 4 + Vue 3 + Tailwind CSS v4 + `@nuxtjs/i18n` + `@nuxtjs/mdc`。

## 命令（pnpm）

- `pnpm install` 安装，`pnpm dev` 开发
- `pnpx nuxt typecheck` 类型检查
- 提交前用 Prettier 格式化

## 约定

- 组件文件名用 PascalCase。
- 文案放 `i18n/<lang>.json`，`zh / en / ja / ko` 四语同步。
- 颜色引用 `--md-sys-color-*` token，尽量不写死色值。
- 图标优先用 Heroicons（`@heroicons/vue/24/outline`），无合适项再用内联 SVG；不使用 emoji。
- UI 优先复用 `Anzu*` 组件。

完整 UX 规范见 `docs/architecture.md`，务必参照此规范设计

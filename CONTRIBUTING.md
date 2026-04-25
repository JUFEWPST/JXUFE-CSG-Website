# JXUFE-CSG-Website 贡献指南

欢迎参与这个项目~发现了 Bug、有好想法、或者文档哪里不太对劲，都欢迎提 Issue 告诉我们。

## 提交 Issue

**Bug 报告**：描述问题现象、复现步骤和运行环境，这样排查起来会更顺利。

**功能建议**：说说你期待的效果和使用场景，说不定下个版本就能见到它了。

## 提交 Pull Request

1. Fork 本仓库，创建你的分支：`git checkout -b feat/your-feature`
2. 本地开发完成并确认无误后提交
3. 记得用 Prettier 格式化代码哦
4. PR 提交到 `main` 分支，并描述一下~

## 代码规范

项目基于 **Nuxt 4** + **Vue 3** + **Tailwind CSS v4**。代码风格用 Prettier 统一，提交前格式化一下。组件命名遵循 Nuxt 的 PascalCase 约定，国际化文本放到 `i18n/` 目录下对应的语言文件里。

```
<type>(<scope>): <description>

feat:     新功能
fix:      修复 Bug
style:    样式调整
refactor: 重构
docs:     文档变更
chore:    构建/工具链变动
```

## 更多文档

开发细节参见 [`docs/`](docs/) 目录：

- [UX开发指南](docs/architecture.md)：颜色 token、布局结构、侧边栏卡片系统

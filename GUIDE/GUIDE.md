# 规范

## 开发

```bash
git clone https://github.com/xxxxx/jxufe-csg-website.git # 你fork的或者哪里的
cd jxufe-csg-website
pnpm install # 安装依赖
pnpm dev # 预览
```

## 代码提交

### 如果你是项目成员

请先执行

```bash
git pull origin main  # 同步主分支
```

创建功能分支，然后开发并提交代码

```bash
git checkout -b feature/xxx # 分支名格式: feature/xxx, fix/xxx
git commit -m "feat: add something"
git push origin feature/xxx
```

提交请遵循原子性提交，提交信息清晰（如 feat: add login button）。

频繁推送分支到远程：

然后你需要**创建 Pull Request**

- 进入仓库页面 → 点击 Compare & pull request。

- 选择正确的分支（如 feature/user-auth → main）并填写 PR 信息

### 如果你不是项目成员

请先 fork 本项目，然后在你自的 fork 下开分支进行开发，开发完成后同步到自己仓库，在仓库页面的 Compare & pull request 提交 PR.

记得与本项目同步

## 项目开发规范

请先仔细阅读[Nuxt 文档](https://nuxtjs.org.cn/docs/4.x/getting-started/introduction)、[Vue.js 文档](https://cn.vuejs.org/)、[Tailwind CSS 文档](https://tailwind.org.cn/blog/tailwindcss-v4)
推荐阅读[阮一峰的 TypeScript 教程](https://wangdoc.com/typescript/)

- 使用 pnpm 包管理器
- 使用`组合式 API`开发组件/页面
- 组件的命名遵循 PascalCase 命名法，即所有单词的首字母大写
- 遇事不决问 AI，记得让 AI 详细解释代码为什么要这么写，要自己判断下

### 基本具体目录结构

| 目录       | 说明                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| assets     | 用于添加构建工具(webpack 或 Vite)将处理的所有网站资产，也就是不会暴露在`/`下的.一般来说包含 css、font 等 |
| components | 用于放我们开发的组件的目录                                                                               |
| layouts    | 用于放公共布局的，可以理解为把通用布局提取出来方便复用                                                   |
| composbles | 用于放公共函数的，一般是公共组合式函数                                                                   |
| pages      | 基于文件的路由,其中`index.vue`对应`/`                                                                    |
| plugins    | 用于注册插件                                                                                             |
| public     | 用作静态资产的公共服务器，也就是可以直接使用`/`访问                                                      |

具体请参阅[Nuxt 文档的目录结构介绍](https://nuxtjs.org.cn/docs/guide/directory-structure/nuxt)
其他目录/文件，能不动就不动吧，人和网站总要有个能跑

## 美学规范

利用 Tailwind CSS 的断点自适应电脑端和移动端，然后就是**相信的心就是你的魔法**

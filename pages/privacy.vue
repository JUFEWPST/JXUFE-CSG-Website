<script setup lang="ts">
import { usePageTitle } from "@/composables/usePageTitle";

const { t } = useI18n();
const { setPageTitle } = usePageTitle();

setPageTitle("pages.privacy.title");

useHead(() => ({
    title: t("pages.privacy.meta.title"),
    meta: [
        {
            name: "description",
            content: t("pages.privacy.meta.description"),
        },
    ],
}));

const contactEmail = "1834488130@qq.com";

const content = `# ${t("pages.privacy.title")}

**更新日期：2025-12-21**  
**生效日期：2025-12-21**

欢迎访问「${t("meta.fullName")}」（以下简称“本网站”）。本隐私政策旨在说明：当您访问本网站时，我们会收集哪些信息、如何使用这些信息以及您享有的权利。

> 重要说明：本网站**不提供**注册、登录、评论、发帖/投稿等功能，因此我们不会主动收集您的账号信息、密码、发布内容等。

## 1. 我们收集的信息

### 1.1 您主动提供的信息

- 当您通过邮箱等方式联系我们时，您可能会向我们提供您的邮箱地址、邮件内容及其他您自愿提供的信息。该等信息仅用于与您沟通和处理您的请求。

### 1.2 访问与设备信息（由托管/服务器产生）

当您访问本网站时，托管服务/服务器可能会在日志中记录必要的技术信息（例如：IP 地址、浏览器类型、访问时间、访问的页面、来源页面等），用于保障网站安全与稳定运行、排查故障。

> 我们不会将该等日志用于用户画像、精准广告等目的。

### 1.3 本地存储（LocalStorage / SessionStorage）

为改善浏览体验，本网站会在您的浏览器中使用以下本地存储：

- \`localStorage\`：用于保存您的**深色/浅色主题偏好**（键名示例：\`dark-theme\`）。
- \`sessionStorage\`：用于记录某些提示/公告在当前会话中是否已展示（键名示例：\`init-notice\`），以避免重复弹出。

这些信息**仅保存在您的设备本地**，不会自动上传到我们的服务器。

## 2. 我们如何使用信息

我们收集/处理信息仅用于以下目的：

- 提供网页内容与功能、提升使用体验（例如：记住主题偏好）。
- 保障网站安全与稳定运行、进行故障排查。
- 对外发布协会公告/文章等公开内容的展示（见下文“第三方服务”）。

## 3. 第三方服务与外部链接

本网站可能会请求或展示来自第三方的内容/服务：

1. **内容接口（公告/文章等）**：本网站会向 \`https://csgapi.tantanchugasuki.cn/api\` 发起请求，以获取公告等公开内容并在页面上展示。
2. **CTF 赛事信息**：侧边栏可能会从 GitHub 的公开数据源拉取赛事列表（示例：\`https://raw.githubusercontent.com/ProbiusOfficial/Hello-CTFtime/...\`）。
3. **外部链接**：本网站包含指向第三方网站（如学校官网、友链等）的链接。点击这些链接后，第三方网站的隐私政策将适用，我们建议您查阅对应政策。

我们不会向第三方出售、出租或以其他方式披露您的个人信息。但请注意，第三方服务在向您提供服务的过程中可能会根据其自身政策收集信息。

## 4. Cookie 与统计

本网站会使用**必要 Cookie**以保障基础功能正常工作：

- \`i18n_redirected\`：由本网站使用的国际化（i18n）功能设置，用于记住您的语言选择/重定向状态，从而为您提供对应语言的页面内容。

除上述必要 Cookie 外，截至本政策更新日期，本网站**未接入**第三方统计/广告 SDK（例如 Google Analytics、百度统计等），也不会通过 Cookie 进行跨站追踪或精准广告投放。

如未来因功能调整需要新增 Cookie 或引入统计服务，我们将更新本政策并在页面显著位置提示。

## 5. 您的权利与选择

- 您可以在浏览器设置中清除本网站产生的本地存储数据（LocalStorage/SessionStorage）以及 Cookie（例如 \`i18n_redirected\`），或使用无痕/隐私模式访问。
- 如果您通过邮箱等方式向我们提交了信息，且希望查询、更正、删除相关沟通内容，您可以通过下方方式联系我们。

## 6. 未成年人保护

本网站主要用于协会信息展示与内容科普。若您为未成年人，请在监护人指导下使用本网站。

## 7. 本政策的变更

我们可能会适时更新本隐私政策。更新后我们会在本页面公布新的“更新日期”。重大变更将以更显著的方式提示。

## 8. 联系我们

如您对本隐私政策有任何疑问、意见或投诉建议，请通过以下方式联系我们：

- 邮箱：${contactEmail}
`;
</script>

<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto max-w-4xl">
            <MarkdownRender :content="content" :sanitize="true" />
        </div>
    </main>
</template>

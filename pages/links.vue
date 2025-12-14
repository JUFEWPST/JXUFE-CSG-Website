<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto max-w-4xl space-y-10 sm:space-y-12">
            <section class="space-y-4">
                <h2
                    class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                >
                    {{ t("pages.links.sections.official") }}
                </h2>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
                    <LinkBlock
                        v-for="link in Links"
                        :key="link.name"
                        :link="link"
                    />
                </div>
            </section>

            <section class="space-y-4">
                <div class="space-y-2">
                    <h2
                        class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                    >
                        {{ t("pages.links.sections.intranet") }}
                    </h2>
                    <p
                        class="max-w-3xl text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base"
                    >
                        {{ t("pages.links.sections.intranetTip") }}
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
                    <LinkBlock
                        v-for="link in iLinks"
                        :key="link.name"
                        :link="link"
                    />
                </div>
            </section>

            <section class="space-y-4">
                <div class="space-y-2">
                    <h2
                        class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                    >
                        {{ t("pages.links.sections.friends") }}
                    </h2>
                    <p
                        class="max-w-3xl text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base"
                    >
                        {{ t("pages.links.disclaimer") }}
                    </p>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
                    <LinkBlock
                        v-for="link in fLinks"
                        :key="link.name"
                        :link="link"
                    />
                </div>
            </section>
        </div>
    </main>
</template>

<script lang="ts" setup>
import type { Link } from "~/types/link";
import { useI18n } from "vue-i18n";
import { computed } from "vue";
import { usePageTitle } from "@/composables/usePageTitle";

const official_icon = "/jxufe-logo.svg";
const { t } = useI18n();
const { setPageTitle } = usePageTitle();

setPageTitle("pages.links.title");

const Links = computed(() => [
    {
        name: t("pages.links.items.jxufe"),
        url: "https://www.jxufe.edu.cn/",
        icon: official_icon,
    },
    {
        name: t("pages.links.items.nic"),
        url: "https://nic.jxufe.edu.cn/",
        icon: official_icon,
    },
    {
        name: t("pages.links.items.college"),
        url: "https://cai.jxufe.edu.cn/",
        icon: official_icon,
    },
    {
        name: t("pages.links.items.zsjy"),
        url: "https://zsjy.jxufe.edu.cn/",
        icon: official_icon,
    },
    {
        name: t("pages.links.items.hello"),
        url: "http://hello.jxufe.edu.cn/",
        icon: official_icon,
    },
    {
        name: t("pages.links.items.acm"),
        url: "https://jxufe-acm.cn/",
        icon: "/avatar/程协图标.webp",
        droptext: "程协欢迎你！",
        desc: "写码码，拿奖奖，加分分，领钱钱",
    },
    {
        name: t("pages.links.items.ca"),
        url: "https://qm.qq.com/q/QPvPyzxfk6",
        icon: "/avatar/jsjxh.webp",
        droptext: "即刻入群",
        desc: "计算机协会是面向新手小白教学的，激起学计算机的兴趣，教会大家如何学好计算机，还会涉及一些AI、脚本、插件等实用的电脑小技巧。计协分为5个部门宣传部、维修部、软件部、量化部、办公室，但教学是统一教学，所以在这你会学到基础但实用的计算机技巧。由于是面向小白教学，所以会带大家一步一步学好计算机。跟上计协的教学，期末高分so easy。来加入计协，让你感受什么是科技的力量。",
        tooltip:
            "计算机协会是面向新手小白教学的，激起学计算机的兴趣，教会大家如何学好计算机，还会涉及一些AI、脚本、插件等实用的电脑小技巧。计协分为5个部门宣传部、维修部、软件部、量化部、办公室，但教学是统一教学，所以在这你会学到基础但实用的计算机技巧。由于是面向小白教学，所以会带大家一步一步学好计算机。跟上计协的教学，期末高分so easy。来加入计协，让你感受什么是科技的力量。",
    },
    {
        name: t("pages.links.items.cida"),
        url: "https://www.jxufe-tech.top",
        icon: "/avatar/数智技术协会.avif",
        droptext: "数智技术协会欢迎你！",
        desc: "《赛博孔子的故事》",
    },
]);

const iLinks = computed(() => [
    {
        name: t("pages.links.items.ctfplatform"),
        url: "http://172.28.52.11/",
        icon: "/favicon.svg",
    },
    {
        name: t("pages.links.items.cloud"),
        url: "http://172.28.52.13/",
        icon: "/favicon.svg",
    },
]);

const fLinks: Link[] = [
    { name: "秋雨样大人", url: "https://amqyy.cn/", icon: "/avatar/qyy.avif" },
    {
        name: "Heaven",
        url: "https://dearheaven.cn",
        icon: "https://pic-bed.dearheaven.cn/img/touxiang.webp",
    },
    {
        name: "woodfish",
        url: "https://www.woodfishhhh.xyz/",
        icon: "https://pic1.imgdb.cn/item/682f3d1658cb8da5c807b704.jpg",
        droptext: "我喜欢你",
        tags: ["我喜欢喝雪碧", "全栈开发（with AI）"],
    },
    {
        name: "piterの小屋",
        url: "https://npiter.de/",
        icon: "https://upload-bbs.miyoushe.com/upload/2025/01/13/363839390/3b27ef57435c87542b43e4fecdabc040_3189688091243815374.png?x-oss-process=image//resize,s_600/quality,q_80/auto-orient,0/interlace,1/format,png",
    },
];

useHead(() => ({
    title: t("pages.links.meta.title"),
    meta: [
        { name: "description", content: t("pages.links.meta.description") },
        { name: "keywords", content: t("pages.links.meta.keywords") },
    ],
}));
</script>

<style scoped></style>

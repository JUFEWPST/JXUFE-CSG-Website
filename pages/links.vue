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
import { useLinks } from "~/data/eLinks";
import { useI18n } from "vue-i18n";
import { usePageTitle } from "@/composables/usePageTitle";

const { Links, iLinks, fLinks } = useLinks();
const { t } = useI18n();
const { setPageTitle } = usePageTitle();

setPageTitle("pages.links.title");

useHead(() => ({
    title: t("pages.links.meta.title"),
    meta: [
        { name: "description", content: t("pages.links.meta.description") },
        { name: "keywords", content: t("pages.links.meta.keywords") },
    ],
}));
</script>

<style scoped></style>

<template>
    <footer
        class="border-t border-(--md-sys-color-outline-variant)/10 bg-(--md-sys-color-surface-container) py-4 text-center text-sm text-(--md-sys-color-on-surface-variant)/70 transition-colors duration-300 dark:bg-(--md-sys-color-surface-container)"
    >
        <div
            class="mx-auto max-w-5xl border-t border-dashed border-(--md-sys-color-outline-variant)/60 pt-3"
        >
            <p>
                ©
                {{
                    new Date().getFullYear() === 2025
                        ? `2025`
                        : `2025-${new Date().getFullYear()}`
                }}
                <span class="font-bold text-(--md-sys-color-primary)">
                    {{ t("meta.fullName") }}
                </span>
                All Rights Reserved.
            </p>
            <p class="mt-2">
                <NuxtLink
                    to="/privacy"
                    class="underline underline-offset-4 transition hover:text-(--md-sys-color-on-surface-variant)"
                >
                    {{ t("pages.privacy.title") }}
                </NuxtLink>
            </p>
            <p class="mt-2 text-xs">
                Built by {{ buildInfo.builder }} / {{ buildInfo.buildTime }} /
                <a
                    :href="`https://github.com/JUFEWPST/JXUFE-CSG-Website/commit/${buildInfo.commitHash}`"
                    class="text-(--md-sys-color-primary)"
                    >#{{ buildInfo.commitHashShort.toUpperCase() }}</a
                >
            </p>
        </div>
    </footer>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const runtimeConfig = useRuntimeConfig();
const buildInfo = runtimeConfig.public.buildInfo as {
    builder: string;
    buildTime: string;
    commitHash: string;
    commitHashShort: string;
};
</script>

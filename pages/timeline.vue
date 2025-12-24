<template>
    <main class="bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8">
        <div class="flex flex-col">
            <div v-for="(item, index) in timelineData" :key="index"
                class="group flex w-full min-h-20 items-center rounded-xl transition-colors hover:bg-(--md-sys-color-surface-container-highest)/50 duration-75 animate-fade-in-up"
                :style="{ animationDelay: `${index * 100}ms` }">
                <!-- date -->
                <div
                    class="w-24 shrink-0 pl-2 pr-3 text-left font-mono text-sm font-bold tracking-wide text-(--md-sys-color-on-surface-variant) md:w-28 md:text-base">
                    {{ item.date || "" }}
                </div>

                <!-- rail -->
                <div class="relative w-10 shrink-0 self-stretch md:w-12 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-[repeating-linear-gradient(to_bottom,var(--md-sys-color-outline-variant)_0px,var(--md-sys-color-outline-variant)_7px,transparent_7px,transparent_14px)]"
                    aria-hidden="true">
                    <div
                        class="absolute left-3 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent  outline-3 outline-(--md-sys-color-primary) -outline-offset-2">
                    </div>
                </div>

                <!-- content -->
                <div class="flex min-w-0 flex-1 flex-col justify-center py-3 pr-3">
                    <div
                        class="truncate text-base font-extrabold leading-snug text-(--md-sys-color-on-surface) sm:text-lg">
                        {{ item.title }}
                    </div>
                    <div v-if="item.description"
                        class="mt-0.5 line-clamp-2 text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base">
                        {{ item.description }}
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import { timelineData } from "~/data/timelineData";
import { usePageTitle } from "@/composables/usePageTitle";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { setPageTitle } = usePageTitle();

setPageTitle("pages.timeline.title");

useHead(() => ({
    title: t("pages.timeline.meta.title"),
    meta: [{ name: "description", content: t("pages.timeline.meta.description") }],
}));
</script>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
}
</style>

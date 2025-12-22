<template>
    <main
        class="box-borde bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div
            class="relative space-y-8 pl-4 sm:pl-8 before:absolute before:left-0 before:top-2 before:h-[calc(100%-1rem)] before:w-0.5 before:bg-(--md-sys-color-outline-variant) sm:before:left-2"
        >
            <div
                v-for="(item, index) in timelineData"
                :key="index"
                class="timeline-item relative animate-fade-in-up"
                :style="{ animationDelay: `${index * 100}ms` }"
            >
                <div
                    class="absolute -left-5.25 top-1.5 h-3 w-3 rounded-full bg-(--md-sys-color-primary) ring-4 ring-(--md-sys-color-surface-container-lowest) sm:-left-7.25 sm:h-4 sm:w-4"
                ></div>
                <div
                    class="rounded-xl bg-(--md-sys-color-surface-container) p-4 transition-all hover:bg-(--md-sys-color-surface-container-high) sm:p-6"
                >
                    <div
                        class="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4"
                    >
                        <span
                            class="font-mono text-sm font-bold text-(--md-sys-color-primary) sm:text-base"
                        >
                            {{ item.date }}
                        </span>
                        <h3
                            class="text-lg font-bold text-(--md-sys-color-on-surface) sm:text-xl"
                        >
                            {{ item.title }}
                        </h3>
                    </div>
                    <p
                        v-if="item.description"
                        class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant) sm:text-base"
                    >
                        {{ item.description }}
                    </p>
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
    meta: [
        { name: "description", content: t("pages.timeline.meta.description") },
    ],
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

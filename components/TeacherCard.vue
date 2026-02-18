<template>
    <div
        class="relative mx-auto w-full shrink-0 px-4 py-4 md:px-0 md:max-w-3xl"
    >
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
                <div
                    class="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-(--md-sys-color-surface-container-highest) md:h-32 md:w-32"
                >
                    <img
                        v-if="teacher.avatar"
                        :src="teacher.avatar"
                        :alt="teacher.name"
                        class="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                    />
                    <div
                        v-else
                        class="flex h-full w-full items-center justify-center"
                    >
                        <span
                            class="text-3xl font-bold text-(--md-sys-color-on-surface-variant)"
                        >
                            {{ teacher.name.charAt(0) }}
                        </span>
                    </div>
                </div>

                <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2 min-w-0">
                        <h2
                            class="min-w-0 truncate text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                            :title="teacher.name"
                        >
                            {{ teacher.name }}
                        </h2>
                        <span
                            class="shrink-0 inline-flex items-center rounded-md bg-(--md-sys-color-secondary-container) px-2 py-0.5 text-xs font-bold text-(--md-sys-color-primary)"
                        >
                            {{ teacher.role }}
                        </span>
                    </div>
                    <div class="mt-1 min-w-0">
                        <span
                            class="block text-sm font-medium text-(--md-sys-color-primary)"
                            :title="teacher.title"
                        >
                            {{ teacher.title }}
                        </span>
                    </div>
                    <div v-if="teacher.link" class="mt-2">
                        <a
                            :href="teacher.link"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-sm text-(--md-sys-color-primary) hover:underline flex items-center gap-1"
                        >
                            <span>{{
                                $t("pages.about.teacher.homepage")
                            }}</span>
                            <span
                                class="i-material-symbols-open-in-new text-xs"
                            ></span>
                        </a>
                    </div>
                </div>
            </div>

            <div class="flex flex-1 flex-col text-left min-w-0">
                <div
                    v-if="teacher.bio"
                    class="mb-4 rounded-lg border border-(--md-sys-color-outline-variant)/50 bg-(--md-sys-color-surface-container-high) p-3"
                >
                    <p
                        class="text-sm leading-relaxed text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ teacher.bio }}
                    </p>
                </div>

                <div v-if="teacher.highlights?.length" class="space-y-1">
                    <div class="flex flex-wrap gap-x-4 gap-y-1">
                        <span
                            v-for="(item, i) in teacher.highlights"
                            :key="i"
                            class="inline-flex items-center text-sm text-(--md-sys-color-on-surface-variant)/80"
                        >
                            <span
                                class="mr-1.5 h-1 w-1 rounded-full bg-(--md-sys-color-outline)"
                            ></span>
                            {{ item }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Teacher } from "~/types/teacher";

defineProps<{
    teacher: Teacher;
}>();
</script>

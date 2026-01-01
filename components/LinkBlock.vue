<template>
    <a
        target="_blank"
        class="relative flex h-35 cursor-pointer! rounded-xl px-4 py-3 transition-all duration-200 ease-out before:absolute before:inset-0 before:inset-y-0 before:z-[-1] before:origin-[var(--origin-x)_var(--origin-y)] before:scale-[0.92] before:rounded-2xl before:bg-(--md-sys-color-secondary-container)/40 before:opacity-0 before:backdrop-blur before:transition-all before:duration-200 hover:translate-x-2 hover:before:scale-100 hover:before:opacity-100 focus-visible:shadow-none! dark:before:bg-(--md-sys-color-secondary-container)/70"
        :href="link.url"
        :title="link.tooltip"
        :style="`--origin-x: ${Math.random() * 100}%; --origin-y: ${Math.random() * 100}%`"
    >
        <div class="flex h-full w-full items-stretch">
            <div class="flex items-center justify-center p-4">
                <img
                    :src="link.icon"
                    :alt="`${link.name}的图标`"
                    class="h-16 w-16 shrink-0 rounded-full object-cover"
                />
            </div>
            <div
                class="flex min-w-0 flex-1 flex-col justify-center gap-1.5 pr-4 sm:pr-5"
            >
                <div class="flex items-center gap-2">
                    <h3
                        class="truncate-2 text-base font-medium text-(--md-sys-color-on-surface) sm:text-lg"
                    >
                        {{ link.name }}
                    </h3>
                </div>
                <p
                    v-if="link.desc"
                    class="truncate text-sm leading-relaxed text-(--md-sys-color-on-surface-variant)"
                >
                    {{ link.desc }}
                </p>
                <p
                    class="mt-0.5 truncate text-xs text-(--md-sys-color-outline)"
                >
                    {{ link.url }}
                </p>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
import type { Link } from "~/types/link";
defineProps<{
    link: Link;
}>();
</script>

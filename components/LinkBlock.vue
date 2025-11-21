<template>
    <a target="_blank"
        class="transition-all rounded-xl duration-200 ease-out before:absolute before:inset-y-0 before:z-[-1] before:scale-[0.92] before:rounded-2xl before:opacity-0 before:backdrop-blur before:transition-all before:duration-200 before:[transform-origin:var(--origin-x)_var(--origin-y)] hover:before:scale-100 hover:before:opacity-100 before:bg-pink-200/60 dark:before:bg-pink-400/70 relative flex !cursor-pointer py-1 px-3 before:-inset-0  focus-visible:!shadow-none hover:translate-x-2 h-35"
        :href="link.url" :title="link.tooltip">
        <div class="flex w-full h-full items-stretch">
            <div class="flex items-center justify-center p-4">
                <img :src="link.icon" :alt="`${link.name}的图标`"
                    class="w-16 h-16 rounded-full object-cover flex-shrink-0">
            </div>
            <div class="flex flex-col justify-center flex-1 min-w-0 pr-4 sm:pr-5 gap-1.5">
                <div class="flex items-center gap-2">
                    <h3 class="font-semibold text-lg truncate-2">
                        {{ link.name }}
                    </h3>
                </div>
                <p v-if="link.desc" class="text-sm sm:text-[0.925rem] text-neutral-600 dark:text-neutral-400 truncate">
                    {{ link.desc }}
                </p>
                <p class="text-[12px] text-neutral-400 truncate mt-0.5">
                    {{ link.url }}
                </p>

            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
import type { Link } from '~/types/link';
defineProps<{
    link: Link
}>()
</script>
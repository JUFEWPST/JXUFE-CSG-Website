<template>
    <li class="list-none">
        <NuxtLink :to="linkto"
            class="transition-all rounded-xl duration-200 ease-out before:absolute before:inset-y-0 before:z-[-1] before:scale-[0.92] before:rounded-2xl before:opacity-0 before:backdrop-blur before:transition-all before:duration-200 before:[transform-origin:var(--origin-x)_var(--origin-y)] hover:before:scale-100 hover:before:opacity-100 before:bg-blue-200/40 dark:before:bg-purple-900/20 relative flex !cursor-pointer flex-col py-6 px-8 before:-inset-0  focus-visible:!shadow-none hover:translate-x-2"
            :style="`--origin-x: ${Math.random() * 100}%; --origin-y: ${Math.random() * 30}%`">
            <h2 class="relative break-words text-2xl font-medium">
                <div class="w-[calc(100%-2rem)] text-gray-800 dark:text-gray-100">{{ title }}</div>
            </h2>
            <div class="absolute top-5 right-6 w-6 h-6" v-if="istop">
                <svg t="1752824665138" class="icon text-[var(--color-primary)]" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="5292">
                    <path fill="currentColor"
                        d="M656.64 96l271.36 271.402667a36.48 36.48 0 0 1 0 51.584l-177.450667 177.450666a363.818667 363.818667 0 0 1-77.312 268.074667 36.437333 36.437333 0 0 1-28.544 13.653333 36.437333 36.437333 0 0 1-25.856-10.666666l-185.173333-185.130667-215.893333 215.893333a65.066667 65.066667 0 1 1-92.032-92.032l215.765333-215.808-185.088-185.002666a36.608 36.608 0 0 1 2.986667-54.4 363.008 363.008 0 0 1 227.413333-79.658667c13.568 0 27.136 0.682667 40.576 2.218667l177.450667-177.578667a36.437333 36.437333 0 0 1 25.898666-10.666667c9.344 0 18.688 3.541333 25.856 10.666667z"
                        p-id="5293"></path>
                </svg>
            </div>
            <div class="relative mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                <div class="relative overflow-hidden text-justify">
                    {{ abstext }}
                </div>
            </div>
            <div
                class="post-meta-bar flex select-none flex-wrap items-center justify-end gap-4 text-gray-500 dark:text-gray-400 mt-4">
                <div class="flex min-w-0 shrink grow flex-wrap gap-2 text-sm">
                    <div class="flex min-w-0 items-center space-x-1">
                        <svg width="1em" height="1em" viewBox="0 0 24 24" class="text-[var(--color-primary)]">
                            <path fill="currentColor"
                                d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7h1.5Z">
                            </path>
                        </svg>
                        <span>{{ datetime }}</span>
                    </div>

                    <!-- 标签 -->
                    <div class="flex min-w-0 items-center space-x-1" v-if="tags">
                        <svg width="1em" height="1em" viewBox="0 0 24 24"
                            class="translate-y-[0.5px] text-[var(--color-primary)]">
                            <path fill="currentColor" fill-rule="evenodd"
                                d="M10 15h4V9h-4v6Zm0 2v3a1 1 0 0 1-2 0v-3H5a1 1 0 0 1 0-2h3V9H5a1 1 0 1 1 0-2h3V4a1 1 0 1 1 2 0v3h4V4a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2h-3v6h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-4Z">
                            </path>
                        </svg>
                        <span class="min-w-0 truncate">
                            <span v-for="(tag, index) in tags" :key="tag">
                                <button
                                    class="shiro-link--underline font-normal hover:text-[var(--color-primary-pressed)] transition-colors"
                                    tabindex="0">
                                    {{ tag }}
                                </button>
                                <span v-if="index < tags.length - 1">, </span>
                            </span>
                        </span>
                    </div>
                    <div class="flex-1" />
                    <!--<div class="flex min-w-0 items-center space-x-1">
                        <svg width="1em" height="1em" viewBox="0 0 24 24" class="text-[var(--color-primary)]">
                            <path fill="currentColor"
                                d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z">
                            </path>
                        </svg>
                        <span class="min-w-0 truncate">{{ views || '无数据' }}</span>
                    </div>-->
                </div>
            </div>
        </NuxtLink>
    </li>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
    title: { type: String, required: true },
    datetime: { type: String },
    linkto: { type: String, required: true },
    abstext: { type: String },
    tags: { type: Array as () => string[] },
    views: { type: Number },
    istop: { type: Boolean, default: false }
})

</script>

<style scoped>
.shiro-link--underline {
    position: relative;
    display: inline-block;
}

.shiro-link--underline::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: currentColor;
    transition: width 0.5s ease;
}

.shiro-link--underline:hover::after {
    width: 100%;
}
</style>

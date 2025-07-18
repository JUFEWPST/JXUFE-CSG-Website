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
                        d="M618.666667 209.066667V213.333333v-4.266666zM870.4 345.6l-196.266667-196.266667h-4.266666c-12.8-12.8-34.133333-21.333333-55.466667-21.333333s-42.666667 8.533333-55.466667 25.6H554.666667v4.266667c-17.066667 21.333333-25.6 46.933333-17.066667 76.8l17.066667 59.733333L435.2 384l-128-21.333333h-4.266667c-17.066667-4.266667-38.4 0-51.2 12.8-8.533333 0-12.8 4.266667-17.066666 8.533333l-51.2 51.2c-12.8 12.8-17.066667 21.333333-17.066667 34.133333 0 12.8 4.266667 21.333333 12.8 29.866667L324.266667 640l-183.466667 183.466667c-8.533333 12.8-12.8 21.333333-12.8 34.133333 0 12.8 4.266667 21.333333 12.8 29.866667s17.066667 8.533333 29.866667 8.533333c12.8 0 21.333333-4.266667 29.866666-12.8L384 699.733333l145.066667 145.066667c8.533333 8.533333 17.066667 12.8 29.866666 12.8 12.8 0 21.333333-4.266667 29.866667-12.8l51.2-51.2c4.266667-4.266667 8.533333-8.533333 8.533333-17.066667 8.533333-17.066667 12.8-34.133333 12.8-55.466666l-21.333333-128 89.6-119.466667 59.733333 17.066667h4.266667c21.333333 4.266667 42.666667 0 59.733333-8.533334 17.066667-12.8 29.866667-25.6 38.4-51.2 8.533333-34.133333 4.266667-59.733333-21.333333-85.333333zM810.666667 405.333333l-89.6-25.6c-17.066667-4.266667-34.133333 0-42.666667 17.066667L563.2 554.666667c-8.533333 8.533333-8.533333 21.333333-8.533333 29.866666l21.333333 145.066667c-4.266667 4.266667-4.266667 8.533333-8.533333 8.533333l-12.8 17.066667L268.8 469.333333l12.8-12.8c4.266667 0 8.533333-4.266667 12.8-8.533333l145.066667 21.333333c12.8 0 21.333333 0 29.866666-8.533333L627.2 341.333333c17.066667-12.8 21.333333-25.6 17.066667-42.666666l-25.6-85.333334L810.666667 405.333333z"
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
                    <div class="flex min-w-0 items-center space-x-1">
                        <svg width="1em" height="1em" viewBox="0 0 24 24" class="text-[var(--color-primary)]">
                            <path fill="currentColor"
                                d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z">
                            </path>
                        </svg>
                        <span class="min-w-0 truncate">{{ views || '0' }}</span>
                    </div>
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

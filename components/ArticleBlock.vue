<template>
    <li class="list-none">
        <NuxtLink :to="linkto"
            class="transition-all rounded-xl duration-200 ease-out before:absolute before:inset-y-0 before:z-[-1] before:scale-[0.92] before:rounded-2xl before:opacity-40 before:backdrop-blur before:transition-all before:duration-200 before:[transform-origin:var(--origin-x)_var(--origin-y)] hover:before:scale-100 hover:before:opacity-100 before:bg-blue-200/40 dark:before:bg-purple-900/20 relative flex !cursor-pointer flex-col py-6 px-8 before:-inset-0  focus-visible:!shadow-none hover:translate-x-2"
            :style="`--origin-x: ${Math.random() * 100}%; --origin-y: ${Math.random() * 30}%`">
            <h2 class="relative break-words text-2xl font-medium">
                <div class="w-[calc(100%-2rem)] text-gray-800 dark:text-gray-100">{{ title }}</div>
            </h2>

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

                    <!-- 点赞 -->
                    <div class="flex min-w-0 items-center space-x-1">
                        <button @click.prevent="toggleLike" class="flex items-center">
                            <svg width="1em" height="1em" viewBox="0 0 24 24"
                                class="text-[var(--color-primary)] transition-transform hover:scale-110">
                                <path fill="currentColor"
                                    :d="isLiked ? 'M23 10a2 2 0 0 0-2-2h-6.32l.96-4.57c.02-.1.03-.21.03-.32c0-.41-.17-.79-.44-1.06L14.17 1L7.59 7.58C7.22 7.95 7 8.45 7 9v10a2 2 0 0 0 2 2h9a2 2 0 0 0 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z' : 'M5 9v12H1V9h4m4 12a2 2 0 0 1-2-2V9c0-.55.22-1.05.59-1.41L14.17 1l1.06 1.05c.27.27.44.65.44 1.06c0 .11-.01.22-.03.32L14.69 8H21a2 2 0 0 1 2 2v2c0 .26-.05.5-.14.73l-3.02 7.05A2 2 0 0 1 18 22H5m13-2l3-7V10h-7l1.34-6.34L9 9v10h9z'">
                                </path>
                            </svg>
                            <span class="min-w-0 truncate ml-1">{{ likes || '0' }}</span>
                        </button>
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
    likes: { type: Number }
})

const isLiked = ref(false)

const toggleLike = () => {
    isLiked.value = !isLiked.value
}
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

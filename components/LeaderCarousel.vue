<template>
    <div class="relative w-full">
        <div ref="carousel" class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <div v-for="(leader, index) in leaders" :key="index" class="w-full flex-shrink-0 px-4 py-6 md:px-8 md:py-8">
                <div class="flex flex-col md:flex-row items-center">
                    <div class="md:w-1/3 flex justify-center mb-6 md:mb-0">
                        <div class="relative">
                            <div
                                class="w-55 h-55 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg">
                                <img :src="leader.avatar" :alt="leader.name + '的头像'" class="w-full h-full object-cover"
                                    v-if="leader.avatar" />
                                <div v-else
                                    class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <div class="text-4xl font-bold text-gray-500 dark:text-gray-400">
                                        {{ leader.name.charAt(0) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="md:w-2/3 md:pl-8">
                        <div class="mb-4">
                            <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                                {{ leader.name }}
                                <span class="text-lg text-gray-600 dark:text-gray-400 ml-1">({{ leader.class }})</span>
                            </h3>
                            <div
                                class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                                {{ leader.year }} 届会长
                            </div>
                        </div>
                        <div
                            class="bg-gray-50 dark:bg-gray-700/50 w-full p-4 rounded-lg mb-4 border border-gray-200 dark:border-gray-600">
                            <p class="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                                "{{ leader.message }}"
                            </p>
                        </div>
                        <div>
                            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                个人成就
                            </h4>
                            <ul
                                class="space-y-2 bg-white/50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                                <li v-for="(achievement, i) in leader.achievements" :key="i" class="flex items-start">
                                    <span
                                        class="inline-block w-2 h-2 rounded-full bg-gray-600 dark:bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                                    <span class="text-gray-700 dark:text-gray-300">{{ achievement }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button @click="prevSlide"
            class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 w-10 h-10 rounded-full shadow flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none z-10 border border-gray-300 dark:border-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
        </button>

        <button @click="nextSlide"
            class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 w-10 h-10 rounded-full shadow flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none z-10 border border-gray-300 dark:border-gray-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        </button>
        <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button v-for="(_, index) in leaders" :key="index" @click="goToSlide(index)" :class="[
                'w-2.5 h-2.5 rounded-full transition-all duration-300',
                currentIndex === index ? 'bg-gray-700 dark:bg-gray-300 scale-125' : 'bg-gray-300 dark:bg-gray-600'
            ]"></button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Leader {
    name: string
    class: string
    year: string
    message: string
    achievements: string[]
    avatar: string // 头像图片URL
}

const props = defineProps<{
    leaders: Leader[]
}>()

const currentIndex = ref(0)
let autoSlideInterval: NodeJS.Timeout | null = null

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % props.leaders.length
}

const prevSlide = () => {
    currentIndex.value = (currentIndex.value - 1 + props.leaders.length) % props.leaders.length
}

const goToSlide = (index: number) => {
    currentIndex.value = index
}

// 自动轮播
onMounted(() => {
    autoSlideInterval = setInterval(() => {
        nextSlide()
    }, 5000)
})

onUnmounted(() => {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval)
    }
})
</script>

<style scoped>
/* 适配导航按钮位置 */
.absolute.left-0 {
    left: -0.5rem;
}

.absolute.right-0 {
    right: -0.5rem;
}

@media (min-width: 768px) {
    .absolute.left-0 {
        left: -1.5rem;
    }

    .absolute.right-0 {
        right: -1.5rem;
    }
}


img {
    transition: transform 0.3s ease;
}

img:hover {
    transform: scale(1.05);
}
</style>

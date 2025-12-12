<template>
    <div class="relative w-full">
        <div
            ref="carousel"
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
            <slot></slot>
        </div>

        <!-- 导航按钮 -->
        <button
            @click="prevSlide"
            class="absolute top-1/2 left-0 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full border border-gray-300 bg-white/80 text-gray-700 shadow transition-all duration-300 hover:scale-110 hover:bg-white focus:outline-none dark:border-gray-500 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600"
        >
            <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                ></path>
            </svg>
        </button>

        <button
            @click="nextSlide"
            class="absolute top-1/2 right-0 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full border border-gray-300 bg-white/80 text-gray-700 shadow transition-all duration-300 hover:scale-110 hover:bg-white focus:outline-none dark:border-gray-500 dark:bg-gray-700/80 dark:text-gray-300 dark:hover:bg-gray-600"
        >
            <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                ></path>
            </svg>
        </button>

        <!-- 指示器 -->
        <div
            class="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-2"
        >
            <button
                v-for="(_, index) in itemCount"
                :key="index"
                @click="goToSlide(index)"
                :class="[
                    'h-2.5 w-2.5 rounded-full transition-all duration-300',
                    currentIndex === index
                        ? 'scale-125 bg-gray-700 dark:bg-gray-300'
                        : 'bg-gray-300 dark:bg-gray-600',
                ]"
            ></button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from "vue";

const props = defineProps<{
    itemCount: number;
}>();

const currentIndex = ref(0);
let autoSlideInterval: NodeJS.Timeout | null = null;

// 提供当前索引给子组件
provide("currentSlideIndex", currentIndex);

const nextSlide = () => {
    currentIndex.value = (currentIndex.value + 1) % props.itemCount;
};

const prevSlide = () => {
    currentIndex.value =
        (currentIndex.value - 1 + props.itemCount) % props.itemCount;
};

const goToSlide = (index: number) => {
    currentIndex.value = index;
};

// 自动轮播
onMounted(() => {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
});

onUnmounted(() => {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
});
</script>

<style scoped>
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
</style>

<template>
    <div class="group w-full">
        <div class="relative w-full overflow-hidden">
            <div
                class="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.0,0,1.0)]"
                :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
            >
                <slot></slot>
            </div>
        </div>
        <div
            v-if="itemCount > 1"
            class="mt-3 flex items-center justify-center gap-2"
        >
            <button
                @click="handlePrev"
                class="flex h-6 w-10 items-center justify-center rounded-md text-(--md-sys-color-on-surface-variant) transition-all hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-0"
                aria-label="Previous slide"
            >
                <ChevronLeftIcon class="h-4 w-4" />
            </button>

            <div class="flex gap-1.5">
                <button
                    v-for="(_, index) in itemCount"
                    :key="index"
                    @click="handleGoToSlide(index)"
                    class="h-1.5 rounded-full transition-all duration-300"
                    :class="[
                        currentIndex === index
                            ? 'w-6 bg-(--md-sys-color-primary)'
                            : 'w-1.5 bg-(--md-sys-color-outline-variant) hover:bg-(--md-sys-color-outline)',
                    ]"
                    :aria-label="`Go to slide ${index + 1}`"
                ></button>
            </div>

            <button
                @click="handleNext"
                class="flex h-6 w-10 items-center justify-center rounded-md text-(--md-sys-color-on-surface-variant) transition-all hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-0"
                aria-label="Next slide"
            >
                <ChevronRightIcon class="h-4 w-4" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
    itemCount: number;
}>();

const currentIndex = ref(0);
let autoSlideInterval: ReturnType<typeof setInterval> | null = null;
let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

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

const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
};

const stopAutoSlide = () => {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
};

const pauseAutoSlide = () => {
    stopAutoSlide();
    if (resumeTimeout) {
        clearTimeout(resumeTimeout);
    }
    resumeTimeout = setTimeout(() => {
        startAutoSlide();
    }, 10000);
};

const handlePrev = () => {
    prevSlide();
    pauseAutoSlide();
};

const handleNext = () => {
    nextSlide();
    pauseAutoSlide();
};

const handleGoToSlide = (index: number) => {
    goToSlide(index);
    pauseAutoSlide();
};

onMounted(() => {
    startAutoSlide();
});

onUnmounted(() => {
    stopAutoSlide();
    if (resumeTimeout) {
        clearTimeout(resumeTimeout);
    }
});
</script>

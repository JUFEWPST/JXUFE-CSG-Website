<template>
    <div class="group relative w-full overflow-hidden">
        <div
            class="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.2,0.0,0,1.0)]"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
             <slot></slot>
        </div>
        <template v-if="itemCount > 1">
            <button
                @click="prevSlide"
                class="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-(--md-sys-color-surface-container-low)/80 text-(--md-sys-color-on-surface) backdrop-blur-sm transition-all hover:bg-(--md-sys-color-surface-container-high) disabled:opacity-0 md:left-4"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
            </button>

            <button
                @click="nextSlide"
                class="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-(--md-sys-color-surface-container-low)/80 text-(--md-sys-color-on-surface) backdrop-blur-sm transition-all hover:bg-(--md-sys-color-surface-container-high) disabled:opacity-0 md:right-4"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
            </button>
            <div class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
                <button
                    v-for="(_, index) in itemCount"
                    :key="index"
                    @click="goToSlide(index)"
                    class="h-1.5 rounded-full transition-all duration-300"
                    :class="[
                        currentIndex === index
                            ? 'w-6 bg-(--md-sys-color-primary)'
                            : 'w-1.5 bg-(--md-sys-color-outline-variant) hover:bg-(--md-sys-color-on-surface-variant)'
                    ]"
                    :aria-label="`Go to slide ${index + 1}`"
                ></button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from "vue";

const props = defineProps<{
    itemCount: number;
}>();

const currentIndex = ref(0);
let autoSlideInterval: NodeJS.Timeout | null = null;

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

onMounted(() => {
    startAutoSlide();
});

onUnmounted(() => {
    stopAutoSlide();
});
</script>

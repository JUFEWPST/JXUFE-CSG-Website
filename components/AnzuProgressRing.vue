<template>
    <div
        class="relative inline-flex items-center justify-center"
        :style="{ width: `${size}px`, height: `${size}px` }"
        role="progressbar"
        :aria-valuenow="status === 'loading' ? undefined : effectiveProgress"
        :aria-valuemin="0"
        :aria-valuemax="100"
    >
        <svg
            v-if="status === 'loading'"
            class="animate-spin-slow absolute inset-0 -rotate-90 origin-center"
            :viewBox="`0 0 ${size} ${size}`"
        >
            <circle
                class="animate-progress-material"
                :cx="size / 2"
                :cy="size / 2"
                :r="normalizedRadius"
                fill="none"
                :stroke="props.primaryColor"
                :stroke-width="strokeWidth"
                stroke-linecap="round"
            />
        </svg>
        <svg
            v-else
            class="-rotate-90"
            :width="size"
            :height="size"
            :viewBox="`0 0 ${size} ${size}`"
        >
            <circle
                :cx="size / 2"
                :cy="size / 2"
                :r="normalizedRadius"
                fill="none"
                :stroke="`${props.primaryColor}20`"
                :stroke-width="strokeWidth"
            />
            <circle
                class="transition-all duration-500 ease-out"
                :cx="size / 2"
                :cy="size / 2"
                :r="normalizedRadius"
                fill="none"
                :stroke="props.primaryColor"
                :stroke-width="strokeWidth"
                stroke-linecap="round"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
            />
        </svg>
        <div
            v-if="showContent && (status !== 'loading' || forceContent)"
            class="absolute inset-0 flex items-center justify-center"
        >
            <transition
                enter-active-class="transition-opacity duration-300"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-300"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                mode="out-in"
            >
                <div :key="status" class="flex items-center justify-center">
                    <slot name="content" :status="status" :progress="progress">
                        <svg
                            v-if="statusIcon"
                            :width="iconSize"
                            :height="iconSize"
                            fill="none"
                            :stroke="props.primaryColor"
                            stroke-width="2.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                :d="statusIcon"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                        <span
                            v-else-if="status === 'default'"
                            class="text-xs font-medium"
                            :style="{ color: props.primaryColor }"
                        >
                            {{ Math.round(progress) }}%
                        </span>
                    </slot>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    progress: {
        type: Number,
        default: 0,
        validator: (value) => value >= 0 && value <= 100,
    },
    size: {
        type: Number,
        default: 48,
    },
    status: {
        type: String,
        default: "default",
        validator: (value) =>
            ["default", "success", "error", "loading"].includes(value),
    },
    strokeWidth: {
        type: Number,
        default: 4,
    },
    showContent: {
        type: Boolean,
        default: true,
    },
    primaryColor: {
        type: String,
        default: "var(--md-sys-color-primary)",
    },
    forceContent: {
        type: Boolean,
        default: false,
    },
});

const normalizedRadius = computed(() => props.size / 2 - props.strokeWidth / 2);
const circumference = computed(() => 2 * Math.PI * normalizedRadius.value);

const effectiveProgress = computed(() => {
    if (props.status === "success") return 100;
    if (props.status === "error") return 100; 
    return props.progress;
});

const dashOffset = computed(() => {
    return circumference.value * (1 - effectiveProgress.value / 100);
});

const iconSize = computed(() => Math.max(props.size * 0.5, 20));

const statusIcon = computed(() => {
    switch (props.status) {
        case "success":
            return "M5 13l4 4L19 7";
        case "error":
            return "M6 18L18 6M6 6l12 12";
        default:
            return null;
    }
});
</script>

<style scoped>
@reference "tailwindcss";

.animate-spin-slow {
    animation: rotation 2s linear infinite;
}

.animate-progress-material {
    animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}
</style>

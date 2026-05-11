<template>
    <div
        class="relative inline-flex items-center justify-center"
        :style="{ width: `${size}px`, height: `${size}px` }"
        role="progressbar"
        :aria-valuenow="status === 'loading' ? undefined : effectiveProgress"
        :aria-valuemin="0"
        :aria-valuemax="100"
    >
        <div
            v-if="status === 'loading'"
            class="progress-ring-spinner absolute inset-0"
            :style="loadingRingStyle"
        >
            <svg
                class="progress-ring progress-ring--loading"
                :width="size"
                :height="size"
                :viewBox="`0 0 ${size} ${size}`"
            >
                <circle
                    class="progress-ring__indicator progress-ring__indicator--loading"
                    :cx="size / 2"
                    :cy="size / 2"
                    :r="normalizedRadius"
                    fill="none"
                    :stroke-width="strokeWidth"
                    pathLength="100"
                    stroke-linecap="round"
                    stroke-dasharray="5.556 94.444"
                    stroke-dashoffset="0"
                    style="stroke: var(--md-sys-color-primary)"
                />
            </svg>
        </div>
        <svg
            v-else
            class="progress-ring progress-ring--determinate"
            :width="size"
            :height="size"
            :viewBox="`0 0 ${size} ${size}`"
            :style="determinateRingStyle"
        >
            <circle
                class="progress-ring__track"
                :cx="size / 2"
                :cy="size / 2"
                :r="normalizedRadius"
                fill="none"
                :stroke-width="strokeWidth"
                pathLength="100"
                style="
                    stroke: color-mix(
                        in srgb,
                        var(--md-sys-color-primary) 18%,
                        transparent
                    );
                "
            />
            <circle
                class="progress-ring__indicator progress-ring__indicator--determinate"
                :cx="size / 2"
                :cy="size / 2"
                :r="normalizedRadius"
                fill="none"
                :stroke-width="strokeWidth"
                pathLength="100"
                stroke-linecap="round"
                stroke-dasharray="100"
                :stroke-dashoffset="dashOffset"
                style="stroke: var(--md-sys-color-primary)"
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
                            stroke-width="2.5"
                            viewBox="0 0 24 24"
                            style="stroke: var(--md-sys-color-primary)"
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
                            style="color: var(--md-sys-color-primary)"
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
    animationDuration: {
        type: Number,
        default: 1333,
    },
});

const normalizedRadius = computed(() => props.size / 2 - props.strokeWidth / 2);

const resolvedAnimationDuration = computed(() =>
    Math.max(props.animationDuration, 400),
);

const spinnerRotationDuration = computed(() =>
    Math.max(Math.round(resolvedAnimationDuration.value * 4.8), 2400),
);

const progressAnimationDuration = computed(() =>
    Math.max(Math.round(resolvedAnimationDuration.value * 0.38), 240),
);

const loadingRingStyle = computed(() => ({
    "--ring-arc-duration": `${spinnerRotationDuration.value}ms`,
    "--ring-rotation-duration": `${spinnerRotationDuration.value}ms`,
}));

const determinateRingStyle = computed(() => ({
    "--ring-progress-duration": `${progressAnimationDuration.value}ms`,
}));

const effectiveProgress = computed(() => {
    if (props.status === "success") return 100;
    if (props.status === "error") return 100;
    return props.progress;
});

const dashOffset = computed(() => 100 - effectiveProgress.value);

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

.progress-ring {
    overflow: visible;
}

.progress-ring-spinner {
    animation: ring-rotate var(--ring-rotation-duration) linear infinite;
    transform-origin: center;
}

.progress-ring--loading,
.progress-ring--determinate {
    transform: rotate(-90deg);
    transform-origin: center;
}

.progress-ring--loading {
    display: block;
}

.progress-ring__track {
    opacity: 1;
}

.progress-ring__indicator {
    transform-origin: center;
    transform-box: fill-box;
    will-change: stroke-dasharray, stroke-dashoffset, transform;
}

.progress-ring__indicator--loading {
    animation: ring-dash var(--ring-arc-duration) linear infinite;
}

@keyframes ring-rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(1080deg);
    }
}

@keyframes ring-dash {
    0% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        stroke-dasharray: 5.556 94.444;
        stroke-dashoffset: 0;
    }

    12.3519% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        stroke-dasharray: 75 25;
        stroke-dashoffset: -52.14;
    }

    24.7037% {
        animation-timing-function: linear;
        stroke-dasharray: 5.556 94.444;
        stroke-dashoffset: -173.724;
    }

    25% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        stroke-dasharray: 5.556 94.444;
        stroke-dashoffset: -177.778;
    }

    37.3519% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        stroke-dasharray: 75 25;
        stroke-dashoffset: -227.14;
    }

    49.7037% {
        animation-timing-function: linear;
        stroke-dasharray: 5.556 94.444;
        stroke-dashoffset: -348.724;
    }

    50% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        stroke-dasharray: 5.556 94.444;
        stroke-dashoffset: -355.556;
    }

    62.3519% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        stroke-dasharray: 75 25;
        stroke-dashoffset: -402.14;
    }

    74.7037% {
        animation-timing-function: linear;
        stroke-dasharray: 5.556 94.444;
        stroke-dashoffset: -523.724;
    }

    75% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        stroke-dasharray: 5.556 94.444;
        stroke-dashoffset: -527.778;
    }

    87.3519% {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        stroke-dasharray: 75 25;
        stroke-dashoffset: -577.14;
    }

    99.7037% {
        animation-timing-function: linear;
        stroke-dasharray: 5.556 94.444;
        stroke-dashoffset: -698.724;
    }

    100% {
        stroke-dasharray: 5.556 94.444;
        stroke-dashoffset: -700;
    }
}

.progress-ring__indicator--determinate {
    transition: stroke-dashoffset var(--ring-progress-duration)
        cubic-bezier(0, 0, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
    .progress-ring-spinner {
        animation-duration: calc(var(--ring-rotation-duration) * 1.5);
    }

    .progress-ring__indicator--loading {
        animation: none;
        stroke-dasharray: 28 72;
        stroke-dashoffset: -8;
    }

    .progress-ring__indicator--determinate {
        transition-duration: 0ms;
    }
}
</style>

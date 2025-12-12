<template>
    <div :class="[$style.container, sizeClass, `text-${color}`]">
        <svg
            viewBox="0 0 100 100"
            class="h-full w-full"
            :style="{ animationDuration: `${duration}ms` }"
        >
            <rect
                x="48"
                y="60"
                width="4"
                height="30"
                rx="2"
                fill="currentColor"
            />
            <path d="M48 40 L52 40 L50 35 Z" fill="currentColor" />
            <circle cx="50" cy="30" r="5" fill="currentColor" />

            <!-- 魔法星光 -->
            <g
                v-for="(star, index) in stars"
                :key="index"
                :class="[$style.star, `${$style[`star-${index}`]}`]"
            >
                <circle :cx="star.x" :cy="star.y" r="2" fill="currentColor">
                    <animate
                        attributeName="opacity"
                        values="0;1;0"
                        dur="1.5s"
                        repeatCount="indefinite"
                        :begin="`${index * 0.3}s`"
                    />
                </circle>
            </g>
        </svg>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    size: {
        type: [String, Number],
        default: "md",
    },
    color: {
        type: String,
        default: "currentColor",
    },
    duration: {
        type: Number,
        default: 1500,
    },
});

const sizeMap = {
    xs: "w-5 h-5",
    sm: "w-10 h-10",
    md: "w-20 h-20",
    lg: "w-30 h-30",
    xl: "w-40 h-40",
    "2xl": "w-50 h-50",
};

const sizeClass = computed(() => {
    return typeof props.size === "string"
        ? sizeMap[props.size] || sizeMap.md
        : `w-[${props.size}px] h-[${props.size}px]`;
});

const stars = ref([
    { x: 50, y: 15 },
    { x: 65, y: 25 },
    { x: 65, y: 45 },
    { x: 50, y: 55 },
    { x: 35, y: 45 },
    { x: 35, y: 25 },
]);
</script>

<style module>
.container {
    position: relative;
}

.container svg {
    animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.star circle {
    animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {
    0%,
    100% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }
}

.star-0 circle {
    animation-delay: 0s;
}

.star-1 circle {
    animation-delay: 0.3s;
}

.star-2 circle {
    animation-delay: 0.6s;
}

.star-3 circle {
    animation-delay: 0.9s;
}

.star-4 circle {
    animation-delay: 1.2s;
}

.star-5 circle {
    animation-delay: 1.5s;
}
</style>

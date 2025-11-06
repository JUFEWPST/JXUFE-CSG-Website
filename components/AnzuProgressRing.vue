<template>
    <div class="relative inline-block">
        <svg class="progress-ring" :width="size" :height="size" :style="svgStyle">
            <circle class="progress-ring__circle-bg" :stroke-width="strokeWidth" :cx="radius" :cy="radius"
                :r="normalizedRadius" fill="transparent" :style="bgCircleStyle" />
            <circle ref="progressCircle" class="progress-ring__circle" :stroke-width="strokeWidth"
                stroke-linecap="round" :cx="radius" :cy="radius" :r="normalizedRadius" fill="transparent"
                :style="circleStyle" :class="{ 'animate-spin': props.status === 'loading' }" />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
                <div v-if="showContent && statusIcon" class="progress-content" :style="contentStyle">
                    <slot name="content">
                        <svg class="inline-block transition-opacity duration-300" :width="iconSize" :height="iconSize"
                            fill="none" :stroke="props.primaryColor" stroke-width="2" viewBox="0 0 24 24">
                            <path :d="statusIcon" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    progress: {
        type: Number,
        default: 0,
        validator: (value) => value >= 0 && value <= 100
    },
    size: {
        type: Number,
        default: 50
    },
    status: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'success', 'error', 'loading'].includes(value)
    },
    initialStatus: {
        type: String,
        default: 'default'
    },
    animationDuration: {
        type: Number,
        default: 800
    },
    strokeWidth: {
        type: Number,
        default: 4
    },
    showContent: {
        type: Boolean,
        default: true
    },
    primaryColor: {
        type: String,
        default: '#3B82F6'
    }
})

const emit = defineEmits(['statusChange', 'animationComplete'])

const progressCircle = ref(null)

const radius = computed(() => props.size / 2)
const normalizedRadius = computed(() => Math.max(props.size / 2 - props.strokeWidth, props.size / 2.5))
const circumference = computed(() => 2 * Math.PI * normalizedRadius.value)
const effectiveProgress = computed(() => (props.status === 'success' ? 100 : props.status === 'loading' ? 60 : props.progress))
const iconSize = computed(() => Math.max(props.size / 2.5, 24))
const svgStyle = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    minWidth: '24px'
}))

const circleStyle = computed(() => ({
    stroke: props.primaryColor,
    strokeDasharray: props.status === 'loading' ? `${circumference.value * 0.6} ${circumference.value}` : `${circumference.value} ${circumference.value}`,
    strokeDashoffset: props.status === 'loading' ? 0 : circumference.value * (1 - effectiveProgress.value / 100),
    transition: props.status === 'loading' ? 'none' : `stroke-dashoffset ${props.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), stroke ${props.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    transform: props.status === 'loading' ? 'none' : `rotate(-90deg)`,
    transformOrigin: '50% 50%'
}))

const bgCircleStyle = computed(() => ({
    stroke: `${props.primaryColor}20`,
    transition: `stroke ${props.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
}))

const contentStyle = computed(() => ({
    transition: `opacity ${props.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), color ${props.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
}))

const statusIcon = computed(() => {
    return {
        default: '',
        success: 'M20 6L9 17l-5-5',
        error: 'M6 18 18 6M6 6l12 12',
        loading: ''
    }[props.status]
})

watch(() => props.status, (newStatus) => {
    emit('statusChange', newStatus)
})
</script>
<style scoped>
@reference "tailwindcss";

.progress-ring {
    @apply block bg-transparent;
}

.progress-ring__circle {
    @apply transition-all duration-300;
}

.progress-ring__circle-bg {
    @apply transition-colors duration-300;
}

.progress-content {
    @apply transition-all duration-300 font-sans;
}

.animate-spin {
    animation: spin 1.2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
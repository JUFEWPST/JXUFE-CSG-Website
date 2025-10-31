<template>
    <button ref="buttonRef" class="anzu-button" :class="[
        `anzu-button--variant-${variant}`,
        `anzu-button--status-${status}`,
    ]" :style="buttonStyles" :disabled="isDisabled" @click="handleClick">
        <AnzuProgressRing v-if="status === 'loading'" :size="24" :stroke-width="2" :status="status"
            :primary-color="textColor" :animation-duration="400" class="anzu-button__progress" />
        <svg v-else-if="status === 'success' && showIcon" width="18" height="18" fill="none" :stroke="textColor"
            stroke-width="3" viewBox="0 0 24 24" class="anzu-button__icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"
                class="anzu-button__icon-path" />
        </svg>
        <svg v-else-if="status === 'error' && showIcon" width="18" height="18" fill="none" :stroke="textColor"
            stroke-width="3" viewBox="0 0 24 24" class="anzu-button__icon">
            <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke-linecap="round"
                stroke-linejoin="round"/>
        </svg>
        <span class="anzu-button__text">
            <slot>Button</slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Props {
    status?: 'default' | 'loading' | 'success' | 'error' | 'disabled'
    primaryColor?: string
    variant?: 'filled' | 'outlined' | 'text' | 'elevated'
    showIcon?: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    status: 'default',
    primaryColor: '#6750A4',
    variant: 'filled',
    showIcon: true,
    disabled: false,
})

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const isDisabled = computed(() => props.disabled || props.status === 'disabled')

const colorPalette = computed(() => {
    const baseColor = props.primaryColor
    return {
        primary: baseColor,
        onPrimary: '#FFFFFF',
        primaryContainer: adjustAlpha(baseColor, 0.12),
        onPrimaryContainer: baseColor,
        surface: '#FFFFFF',
        onSurface: '#1C1B1F',
        surfaceVariant: adjustAlpha('#E7E0EC', 1),
        outline: adjustAlpha('#79747E', 0.5),
        outlineVariant: adjustAlpha('#DFD8E0', 1),
        disabled: adjustAlpha('#A8A29E', 0.38),
        onDisabled: adjustAlpha('#1C1B1F', 0.38),
    }
})

const effectiveColor = computed(() => {
    return isDisabled.value
        ? colorPalette.value.disabled
        : colorPalette.value.primary
})

const textColor = computed(() => {
    if (isDisabled.value) return colorPalette.value.onDisabled
    const palette = colorPalette.value
    return props.variant === 'filled' || props.variant === 'elevated'
        ? palette.onPrimary
        : palette.primary
})

const buttonStyles = computed(() => ({
    backgroundColor: baseButtonStyles.value.backgroundColor,
    color: baseButtonStyles.value.color,
    border: baseButtonStyles.value.border,
    '--primary-color': effectiveColor.value,
    '--text-color': textColor.value,
}))

const baseButtonStyles = computed(() => {
    const palette = colorPalette.value
    const commonStyles = {
        fontSize: '14px',
        fontWeight: 600,
        lineHeight: '20px',
        letterSpacing: '0.02em',
        textTransform: 'none' as const,
        position: 'relative' as const,
        overflow: 'hidden' as const,
    }

    switch (props.variant) {
        case 'filled':
            return {
                ...commonStyles,
                backgroundColor: palette.primary,
                color: palette.onPrimary,
                border: 'none',
            }
        case 'elevated':
            return {
                ...commonStyles,
                backgroundColor: palette.surface,
                color: palette.primary,
                border: 'none',
            }
        case 'outlined':
            return {
                ...commonStyles,
                backgroundColor: 'transparent',
                color: palette.primary,
                border: `1px solid ${palette.outline}`,
            }
        case 'text':
            return {
                ...commonStyles,
                backgroundColor: 'transparent',
                color: palette.primary,
                border: 'none',
            }
        default:
            return commonStyles
    }
})

function adjustAlpha(hexColor: string, alpha: number): string {
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function handleClick(event: MouseEvent): void {
    if (!isDisabled.value && props.status !== 'loading') {
        emit('click', event)
    }
}

watch(
    () => props.status,
    (newStatus) => {
        if (newStatus === 'success' || newStatus === 'error') {
            setTimeout(() => { }, 1500)
        }
    },
)
</script>

<style scoped>
@reference "tailwindcss";

.anzu-button {
    @apply relative inline-flex min-h-12 min-w-16 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-sm px-4 py-3 font-semibold outline-none select-none;
}

.anzu-button--status-disabled,
.anzu-button:disabled {
    @apply pointer-events-none cursor-not-allowed opacity-38;
}

.anzu-button__text {
    @apply relative z-10 whitespace-nowrap text-[var(--text-color)];
}

.anzu-button__icon {
    @apply relative z-10 flex-shrink-0;
}


@keyframes fadeInOut {

    0%,
    100% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }
}

@media (max-width: 600px) {
    .anzu-button {
        @apply min-h-10 px-3 py-2.5 text-sm;
    }
}

.anzu-button--variant-text,
.anzu-button--variant-outlined {
    @apply min-h-10 py-2;
}
</style>

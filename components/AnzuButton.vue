<template>
    <component :is="tag" ref="buttonRef" class="anzu-button" :class="[
        `anzu-button--variant-${effectiveVariant}`,
        `anzu-button--status-${status}`,
        buttonGroupClasses
    ]" :style="computedStyles" :disabled="isButtonDisabled" :href="href" :target="target" :rel="linkRel"
        @click="handleClick">
        <AnzuProgressRing v-if="status === 'loading'" :size="24" :stroke-width="2" :status="status"
            :primary-color="colorProps.textColor" :animation-duration="400" class="anzu-button__progress" />
        <svg v-else-if="status === 'success' && showIcon" width="18" height="18" fill="none"
            :stroke="colorProps.textColor" stroke-width="3" viewBox="0 0 24 24" class="anzu-button__icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"
                class="anzu-button__icon-path" />
        </svg>
        <svg v-else-if="status === 'error' && showIcon" width="18" height="18" fill="none"
            :stroke="colorProps.textColor" stroke-width="3" viewBox="0 0 24 24" class="anzu-button__icon">
            <path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
        <span class="anzu-button__text">
            <slot>Button</slot>
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed, watch, inject, ref } from 'vue'

interface Props {
    value?: string | number
    status?: 'default' | 'loading' | 'success' | 'error' | 'disabled'
    primaryColor?: string
    variant?: 'filled' | 'outlined' | 'text' | 'elevated'
    showIcon?: boolean
    disabled?: boolean
    href?: string
    target?: '_blank' | '_self' | '_parent' | '_top'
}

const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    status: 'default',
    variant: 'filled',
    showIcon: true,
    disabled: false,
    href: undefined,
    target: '_self'
})

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()

const buttonGroupContext = inject('buttonGroup', null)
const isSelected = computed(() => {
    if (!buttonGroupContext || props.value === undefined) {
        return false
    }

    const selected = buttonGroupContext.selectedValue?.value
    const isSelected = selected === props.value


    return isSelected
})

const effectiveVariant = computed(() => {
    if (buttonGroupContext && props.value !== undefined) {
        return isSelected.value ? 'filled' : 'outlined'
    }
    return props.variant
})

const buttonGroupClasses = computed(() => {
    if (!buttonGroupContext) return ''
    return `anzu-button--in-group-${buttonGroupContext.direction?.value}`
})

const { colorPalette, setPrimaryColor } = useColorPalette({
    primaryColor: props.primaryColor
})

const isDisabled = computed(() => props.disabled || props.status === 'disabled')

const tag = computed(() => props.href ? 'a' : 'button')

const isButtonDisabled = computed(() => tag.value === 'button' && isDisabled.value)

const linkRel = computed(() => {
    if (props.target === '_blank') {
        return 'noopener noreferrer'
    }
    return undefined
})

const colorProps = computed(() => {
    const palette = colorPalette.value

    if (isDisabled.value) {
        return {
            textColor: palette.onDisabled,
            backgroundColor: palette.disabled,
            borderColor: 'transparent'
        }
    }

    switch (effectiveVariant.value) {
        case 'filled':
            return {
                textColor: palette.onPrimary,
                backgroundColor: palette.primary,
                borderColor: 'transparent'
            }
        case 'elevated':
            return {
                textColor: palette.primary,
                backgroundColor: palette.surface,
                borderColor: 'transparent'
            }
        case 'outlined':
            return {
                textColor: palette.primary,
                backgroundColor: 'transparent',
                borderColor: palette.outline
            }
        case 'text':
            return {
                textColor: palette.primary,
                backgroundColor: 'transparent',
                borderColor: 'transparent'
            }
        default:
            return {
                textColor: palette.onSurface,
                backgroundColor: 'transparent',
                borderColor: 'transparent'
            }
    }
})

const computedStyles = computed(() => {
    const border = effectiveVariant.value === 'outlined'
        ? `1px solid ${colorProps.value.borderColor}`
        : 'none'

    const boxShadow = effectiveVariant.value === 'elevated'
        ? '0 2px 4px rgba(0, 0, 0, 0.1)'
        : 'none'

    return {
        backgroundColor: colorProps.value.backgroundColor,
        color: colorProps.value.textColor,
        border,
        boxShadow,
        '--text-color': colorProps.value.textColor,
        '--surface-color': colorPalette.value.surface,
    }
})

function handleClick(event: MouseEvent): void {
    const isAnchor = tag.value === 'a'

    if (isAnchor && (isDisabled.value || props.status === 'loading')) {
        event.preventDefault()
    }

    if (isDisabled.value || props.status === 'loading') {
        return
    }

    if (buttonGroupContext && props.value !== undefined) {
        buttonGroupContext.select(props.value)
    }

    emit('click', event)
}

watch(
    () => props.primaryColor,
    (newColor) => {
        if (newColor && newColor !== colorPalette.value.primary) {
            setPrimaryColor(newColor)
        }
    },
    { immediate: true }
)
</script>

<style scoped>
@reference "tailwindcss";

.anzu-button {
    @apply relative inline-flex min-w-16 cursor-pointer items-center justify-center gap-2 overflow-hidden px-4 py-0.5 font-medium outline-none select-none;
    text-decoration: none;
    border-radius: 0.75rem;
}

.anzu-button:disabled {
    @apply pointer-events-none cursor-not-allowed opacity-38;
}

.anzu-button__text {
    @apply relative z-10 whitespace-nowrap text-[var(--text-color)];
}

.anzu-button__icon {
    @apply relative z-10 flex-shrink-0;
}

.anzu-button--in-group-horizontal {
    @apply rounded-none border-r-0;
}

.anzu-button--in-group-horizontal:first-child {
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
}

.anzu-button--in-group-horizontal:last-child {
    border-top-right-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    border-right-width: 1px;
}

.anzu-button--in-group-vertical {
    @apply rounded-none border-b-0;
}

.anzu-button--in-group-vertical:first-child {
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
}

.anzu-button--in-group-vertical:last-child {
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    border-bottom-width: 1px;
}

@media (max-width: 600px) {
    .anzu-button {
        @apply min-h-10 px-3 py-2.5 text-sm;
    }

    .anzu-button--variant-text,
    .anzu-button--variant-outlined {
        @apply min-h-10 py-2;
    }
}
</style>

<template>
    <div class="anzu-button-group" :class="[`anzu-button-group--${direction}`, `anzu-button-group--gap-${gap}`]">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, provide, watch } from 'vue'

interface Props {
    modelValue?: string | number
    direction?: 'horizontal' | 'vertical'
    gap?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    direction: 'horizontal',
    gap: 'none',
    modelValue: undefined
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void
}>()

const selectedValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

function select(value: string | number) {
    selectedValue.value = value
}

provide('buttonGroup', {
    selectedValue,
    select,
    direction: computed(() => props.direction),
    gap: computed(() => props.gap)
})
</script>

<style scoped>
@reference "tailwindcss";

.anzu-button-group {
    @apply inline-flex;
}

.anzu-button-group--horizontal {
    @apply flex-row;
}

.anzu-button-group--vertical {
    @apply flex-col;
}

.anzu-button-group--gap-none {
    @apply gap-0;
}

.anzu-button-group--gap-sm {
    @apply gap-1;
}

.anzu-button-group--gap-md {
    @apply gap-2;
}

.anzu-button-group--gap-lg {
    @apply gap-3;
}

@media (max-width: 600px) {
    .anzu-button-group--horizontal {
        @apply flex-wrap;
    }

    .anzu-button-group--gap-md {
        @apply gap-1;
    }

    .anzu-button-group--gap-lg {
        @apply gap-2;
    }
}
</style>

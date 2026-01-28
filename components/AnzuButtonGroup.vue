<template>
    <div class="inline-flex" :class="[
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        gapClasses
    ]">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, provide } from "vue";

interface Props {
    modelValue?: string | number;
    direction?: "horizontal" | "vertical";
    gap?: "none" | "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
    direction: "horizontal",
    gap: "none",
    modelValue: undefined,
});

const emit = defineEmits<{
    (e: "update:modelValue", value: string | number | undefined): void;
}>();

const selectedValue = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
});

function select(value: string | number) {
    selectedValue.value = value;
}

const gapClasses = computed(() => {
    switch (props.gap) {
        case 'none': return 'gap-0';
        case 'sm': return 'gap-1';
        case 'md': return 'gap-2';
        case 'lg': return 'gap-3';
        default: return 'gap-0';
    }
});

const directionContext = computed(() => {
    return props.gap === 'none' ? props.direction : '';
});

provide("buttonGroup", {
    selectedValue,
    select,
    direction: directionContext,
});
</script>

<style scoped>
@reference "tailwindcss";
</style>

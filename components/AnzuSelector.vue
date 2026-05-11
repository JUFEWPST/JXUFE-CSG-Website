<template>
    <div class="flex flex-wrap items-center gap-1.5">
        <template v-for="(option, index) in options" :key="option.value">
            <button
                type="button"
                @click="handleChange(option.value)"
                class="cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium transition-[background-color,color] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-primary)/20"
                :class="[
                    modelValue === option.value
                        ? 'bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary)'
                        : 'bg-(--md-sys-color-surface-container-low) text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)',
                ]"
            >
                {{ option.label }}
            </button>
        </template>
    </div>
</template>

<script setup lang="ts">
interface Option {
    label: string | number;
    value: string | number;
}

const props = defineProps<{
    modelValue: string | number;
    options: Option[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string | number): void;
    (e: "change", value: string | number): void;
}>();

const handleChange = (value: string | number) => {
    emit("update:modelValue", value);
    emit("change", value);
};
</script>

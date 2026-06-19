<template>
    <div class="inline-flex items-center gap-1.5 overflow-x-auto">
        <template v-for="(option, index) in options" :key="option.value">
            <button
                type="button"
                @click="handleChange(option.value)"
                class="cursor-pointer rounded-lg px-2 py-1 text-[11px] font-medium transition-[background-color,color] duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-on-surface)/15"
                :class="[
                    modelValue === option.value
                        ? 'bg-(--md-sys-color-primary)/8 text-(--md-sys-color-primary)'
                        : 'bg-black/5 text-(--md-sys-color-on-surface-variant) hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10',
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

<template>
    <div class="w-full">
        <label
            v-if="label"
            class="mb-1 block text-sm font-medium text-(--md-sys-color-on-surface-variant)"
        >
            {{ label }}
        </label>
        <div class="relative">
            <input
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :name="name"
                :autocomplete="autocomplete"
                :readonly="readonly"
                class="w-full rounded-lg border bg-transparent px-3 py-2 text-sm text-(--md-sys-color-on-surface) outline-none transition-all duration-200 placeholder:text-(--md-sys-color-on-surface-variant)/50"
                :class="[
                    localError
                        ? 'border-(--md-sys-color-error) focus:border-(--md-sys-color-error) focus:ring-1 focus:ring-(--md-sys-color-error)'
                        : 'border-(--md-sys-color-outline) hover:border-(--md-sys-color-outline-variant) focus:border-(--md-sys-color-primary) focus:ring-1 focus:ring-(--md-sys-color-primary)',
                    {
                        'cursor-not-allowed opacity-50': disabled,
                        'pl-10': $slots.prefix,
                        'pr-10': $slots.suffix,
                    },
                ]"
                @input="handleInput"
                @blur="$emit('blur', $event)"
                @focus="$emit('focus', $event)"
            />
            <div
                v-if="$slots.prefix"
                class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--md-sys-color-on-surface-variant)"
            >
                <slot name="prefix" />
            </div>
            <div
                v-if="$slots.suffix"
                class="absolute top-1/2 right-3 -translate-y-1/2 text-(--md-sys-color-on-surface-variant)"
            >
                <slot name="suffix" />
            </div>
        </div>
        <div
            v-if="errorMessage"
            class="mt-1 text-xs text-(--md-sys-color-error)"
        >
            {{ errorMessage }}
        </div>
        <div
            v-else-if="hint"
            class="mt-1 text-xs text-(--md-sys-color-on-surface-variant)"
        >
            {{ hint }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface Props {
    modelValue?: string | number;
    label?: string;
    placeholder?: string;
    type?: string;
    error?: boolean | string;
    disabled?: boolean;
    hint?: string;
    name?: string;
    autocomplete?: string;
    readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: "",
    type: "text",
    error: false,
    disabled: false,
    placeholder: "",
    readonly: false,
});

const emit = defineEmits<{
    (e: "update:modelValue", value: string | number): void;
    (e: "blur", event: FocusEvent): void;
    (e: "focus", event: FocusEvent): void;
}>();

const localError = ref(props.error);

watch(
    () => props.error,
    (newVal) => {
        localError.value = newVal;
    },
);

const errorMessage = computed(() =>
    typeof localError.value === "string" ? localError.value : "",
);

const handleInput = (event: Event) => {
    localError.value = false;
    const target = event.target as HTMLInputElement;
    let value: string | number = target.value;
    if (props.type === "number" && value !== "") {
        const num = parseFloat(value);
        if (!isNaN(num)) {
            value = num;
        }
    }
    emit("update:modelValue", value);
};
</script>

<style scoped>
@reference "tailwindcss";
</style>

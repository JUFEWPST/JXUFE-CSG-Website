<template>
    <component
        :is="tag"
        ref="buttonRef"
        class="relative inline-flex h-10 min-w-16 cursor-pointer items-center justify-center gap-2 overflow-hidden px-6 text-sm font-medium transition-all duration-200 outline-none select-none"
        :class="[
            buttonGroupClasses ? '' : 'rounded-lg',

            effectiveVariant === 'filled'
                ? 'bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary)'
                : '',
            effectiveVariant === 'outlined'
                ? 'border border-(--md-sys-color-outline) bg-transparent text-(--md-sys-color-primary)'
                : '',
            effectiveVariant === 'text'
                ? 'bg-transparent text-(--md-sys-color-primary) px-3 hover:bg-(--md-sys-color-primary)/8 active:bg-(--md-sys-color-primary)/12'
                : '',
            effectiveVariant === 'elevated'
                ? 'bg-(--md-sys-color-surface-container-low) text-(--md-sys-color-primary) shadow-sm'
                : '',
            effectiveVariant === 'tonal'
                ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)'
                : '',
            buttonGroupClasses.includes('horizontal')
                ? 'rounded-none border-r-0'
                : '',
            buttonGroupClasses.includes('horizontal')
                ? 'first:rounded-l-lg last:rounded-r-lg last:border-r'
                : '',
            buttonGroupClasses.includes('vertical')
                ? 'rounded-none border-b-0'
                : '',
            buttonGroupClasses.includes('vertical')
                ? 'first:rounded-t-lg last:rounded-b-lg last:border-b'
                : '',
            isButtonDisabled
                ? 'pointer-events-none cursor-not-allowed border-transparent shadow-none'
                : '',
        ]"
        :style="[
            isButtonDisabled
                ? {
                      backgroundColor:
                          'color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent)',
                      color: 'color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent)',
                  }
                : {},
        ]"
        :disabled="isButtonDisabled"
        :href="href"
        :target="target"
        :rel="linkRel"
        @click="handleClick"
    >
        <AnzuProgressRing
            v-if="status === 'loading'"
            :size="24"
            :stroke-width="2"
            :status="status"
            :primary-color="loadingColor"
            :animation-duration="400"
            class="relative z-10 shrink-0"
        />
        <svg
            v-else-if="status === 'success' && showIcon"
            width="18"
            height="18"
            fill="none"
            :stroke="loadingColor"
            stroke-width="3"
            viewBox="0 0 24 24"
            class="relative z-10 shrink-0"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
            />
        </svg>
        <svg
            v-else-if="status === 'error' && showIcon"
            width="18"
            height="18"
            fill="none"
            :stroke="loadingColor"
            stroke-width="3"
            viewBox="0 0 24 24"
            class="relative z-10 shrink-0"
        >
            <path
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
        <span class="relative z-10">
            <slot>Button</slot>
        </span>
        <div
            v-if="effectiveVariant !== 'text'"
            class="pointer-events-none absolute inset-0 z-0 bg-current opacity-0 transition-opacity duration-200"
            :class="[
                !isButtonDisabled
                    ? 'hover:opacity-[0.08] active:opacity-[0.12]'
                    : '',
            ]"
        ></div>
    </component>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";

interface Props {
    value?: string | number;
    status?: "default" | "loading" | "success" | "error" | "disabled";
    variant?: "filled" | "outlined" | "text" | "elevated" | "tonal";
    showIcon?: boolean;
    disabled?: boolean;
    href?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
}

const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    status: "default",
    variant: "filled",
    showIcon: true,
    disabled: false,
    href: undefined,
    target: "_self",
});

const emit = defineEmits<{
    (e: "click", event: MouseEvent): void;
}>();

const buttonGroupContext = inject("buttonGroup", null) as any;
const isSelected = computed(() => {
    if (!buttonGroupContext || props.value === undefined) {
        return false;
    }
    return buttonGroupContext.selectedValue?.value === props.value;
});

const effectiveVariant = computed(() => {
    if (buttonGroupContext && props.value !== undefined) {
        return isSelected.value ? "filled" : "outlined";
    }
    return props.variant;
});

const buttonGroupClasses = computed(() => {
    if (!buttonGroupContext) return "";
    return buttonGroupContext.direction?.value || "";
});

const isDisabled = computed(
    () => props.disabled || props.status === "disabled",
);

const tag = computed(() => (props.href ? "a" : "button"));

const isButtonDisabled = computed(
    () => tag.value === "button" && isDisabled.value,
);

const linkRel = computed(() => {
    if (props.target === "_blank") {
        return "noopener noreferrer";
    }
    return undefined;
});

const loadingColor = computed(() => {
    if (isDisabled.value) return "var(--md-sys-color-on-surface)";

    switch (effectiveVariant.value) {
        case "filled":
            return "var(--md-sys-color-on-primary)";
        case "elevated":
        case "outlined":
        case "text":
            return "var(--md-sys-color-primary)";
        case "tonal":
            return "var(--md-sys-color-on-secondary-container)";
        default:
            return "currentColor";
    }
});

function handleClick(event: MouseEvent): void {
    const isAnchor = tag.value === "a";

    if (isAnchor && (isDisabled.value || props.status === "loading")) {
        event.preventDefault();
    }

    if (isDisabled.value || props.status === "loading") {
        return;
    }

    if (buttonGroupContext && props.value !== undefined) {
        buttonGroupContext.select(props.value);
    }

    emit("click", event);
}
</script>

<style scoped>
@reference "tailwindcss";
</style>

<template>
    <component
        :is="tag"
        ref="buttonRef"
        class="relative inline-flex min-w-16 cursor-pointer items-center justify-center gap-2 overflow-hidden text-sm font-medium transition-[background-color,border-color,color,box-shadow,opacity] duration-200 ease-out outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--md-sys-color-primary)/20 select-none"
        :class="[
            buttonGroupClasses ? '' : 'rounded-md',

            hasDefault
                ? sizeClasses[effectiveSize]
                : iconOnlySizeClasses[effectiveSize],

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
                ? 'first:rounded-l-md last:rounded-r-md last:border-r'
                : '',
            buttonGroupClasses.includes('vertical')
                ? 'rounded-none border-b-0'
                : '',
            buttonGroupClasses.includes('vertical')
                ? 'first:rounded-t-md last:rounded-b-md last:border-b'
                : '',
            isButtonDisabled && !isLoading
                ? 'pointer-events-none opacity-60'
                : '',
            isButtonDisabled && isLoading ? 'pointer-events-none' : '',
            !isButtonDisabled ? 'cursor-pointer' : '',
        ]"
        :disabled="isButtonDisabled"
        :href="href"
        :target="target"
        :rel="linkRel"
        @click="handleClick"
    >
        <span
            v-if="isLoading && iconPlacement === 'start'"
            class="flex shrink-0 items-center justify-center"
            :class="iconBoxClasses[effectiveSize]"
            aria-hidden="true"
        >
            <AnzuProgressRing
                :size="effectiveSize === 'sm' ? 16 : 20"
                :stroke-width="2"
                status="loading"
                :primary-color="loadingColor"
            />
        </span>

        <span
            v-else-if="hasIcon && iconPlacement === 'start'"
            class="flex shrink-0 items-center justify-center"
            :class="iconBoxClasses[effectiveSize]"
            aria-hidden="true"
        >
            <slot name="icon" />
        </span>

        <span
            v-else-if="status === 'success' && showIcon && !hasIcon"
            class="relative z-10 shrink-0"
        >
            <svg
                width="18"
                height="18"
                fill="none"
                :stroke="loadingColor"
                stroke-width="3"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                />
            </svg>
        </span>

        <span
            v-else-if="status === 'error' && showIcon && !hasIcon"
            class="relative z-10 shrink-0"
        >
            <svg
                width="18"
                height="18"
                fill="none"
                :stroke="loadingColor"
                stroke-width="3"
                viewBox="0 0 24 24"
            >
                <path
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </span>

        <span
            v-if="hasDefault"
            class="relative z-10 inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
            <slot />
        </span>

        <span
            v-if="isLoading && iconPlacement === 'end'"
            class="flex shrink-0 items-center justify-center"
            :class="iconBoxClasses[effectiveSize]"
            aria-hidden="true"
        >
            <AnzuProgressRing
                :size="effectiveSize === 'sm' ? 16 : 20"
                :stroke-width="2"
                status="loading"
                :primary-color="loadingColor"
            />
        </span>

        <span
            v-else-if="hasIcon && iconPlacement === 'end'"
            class="flex shrink-0 items-center justify-center"
            :class="iconBoxClasses[effectiveSize]"
            aria-hidden="true"
        >
            <slot name="icon" />
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
import { computed, inject, useSlots } from "vue";

type AnzuButtonVariant = "filled" | "outlined" | "text" | "elevated" | "tonal";
type AnzuButtonSize = "sm" | "md" | "lg";
type AnzuButtonIconPlacement = "start" | "end";

interface Props {
    value?: string | number;
    status?: "default" | "loading" | "success" | "error" | "disabled";
    variant?: AnzuButtonVariant;
    size?: AnzuButtonSize;
    iconPlacement?: AnzuButtonIconPlacement;
    showIcon?: boolean;
    disabled?: boolean;
    loading?: boolean;
    href?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
}

const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    status: "default",
    variant: "filled",
    size: "md",
    iconPlacement: "start",
    showIcon: true,
    disabled: false,
    loading: false,
    href: undefined,
    target: "_self",
});

const emit = defineEmits<{
    (e: "click", event: MouseEvent): void;
}>();

const slots = useSlots();
const hasIcon = computed(() => Boolean(slots.icon));
const hasDefault = computed(() => Boolean(slots.default));
const isLoading = computed(() => props.loading || props.status === "loading");
const statusIcon = computed(
    () =>
        props.status === "loading" ||
        props.status === "success" ||
        props.status === "error",
);

const sizeClasses: Record<AnzuButtonSize, string> = {
    sm: "min-h-8 gap-1.5 px-3 text-xs",
    md: "min-h-9 gap-2 px-4 text-sm",
    lg: "min-h-11 gap-3 px-6 text-base",
};

const iconOnlySizeClasses: Record<AnzuButtonSize, string> = {
    sm: "h-8 w-8 p-0 text-xs",
    md: "h-9 w-9 p-0 text-sm",
    lg: "h-11 w-11 p-0 text-base",
};

const iconBoxClasses: Record<AnzuButtonSize, string> = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-5 w-5",
};

const effectiveSize = computed(() => props.size);

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

    if (isAnchor && (isDisabled.value || isLoading.value)) {
        event.preventDefault();
    }

    if (isDisabled.value || isLoading.value) {
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

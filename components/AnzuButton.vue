<template>
    <component
        :is="tag"
        ref="buttonRef"
        class="anzu-button"
        :class="[
            `anzu-button--variant-${effectiveVariant}`,
            `anzu-button--status-${status}`,
            buttonGroupClasses,
            { 'anzu-button--disabled': isButtonDisabled },
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
            class="anzu-button__progress"
        />
        <svg
            v-else-if="status === 'success' && showIcon"
            width="18"
            height="18"
            fill="none"
            :stroke="loadingColor"
            stroke-width="3"
            viewBox="0 0 24 24"
            class="anzu-button__icon"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
                class="anzu-button__icon-path"
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
            class="anzu-button__icon"
        >
            <path
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
        <span class="anzu-button__text">
            <slot>Button</slot>
        </span>
        <div class="anzu-button__state-layer"></div>
    </component>
</template>

<script setup lang="ts">
import { computed, watch, inject } from "vue";
import { useColorPalette } from "@/composables/useColorPalette";

interface Props {
    value?: string | number;
    status?: "default" | "loading" | "success" | "error" | "disabled";
    primaryColor?: string;
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
    return `anzu-button--in-group-${buttonGroupContext.direction?.value}`;
});

const { colorPalette, setPrimaryColor } = useColorPalette();

const isValidHexColor = (color: string) =>
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color);

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

watch(
    () => props.primaryColor,
    (newColor) => {
        if (
            typeof newColor === "string" &&
            isValidHexColor(newColor) &&
            newColor !== colorPalette.value.primary
        ) {
            setPrimaryColor(newColor);
        }
    },
    { immediate: true },
);
</script>

<style scoped>
@reference "tailwindcss";

.anzu-button {
    @apply relative inline-flex h-10 min-w-[64px] cursor-pointer items-center justify-center gap-2 overflow-hidden px-6 text-sm font-medium transition-all duration-200 outline-none select-none;
    text-decoration: none;
    border-radius: 0.5rem;
}

.anzu-button__state-layer {
    @apply pointer-events-none absolute inset-0 z-0 bg-current opacity-0 transition-opacity duration-200;
}

.anzu-button:hover .anzu-button__state-layer {
    @apply opacity-[0.08];
}

.anzu-button:active .anzu-button__state-layer {
    @apply opacity-[0.12];
}

/* Variants */
.anzu-button--variant-filled {
    @apply bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary);
}

.anzu-button--variant-filled:not(.anzu-button--disabled):hover {
    @apply shadow-sm;
}

.anzu-button--variant-filled:not(.anzu-button--disabled):active {
    @apply shadow-none;
}

.anzu-button--variant-outlined {
    @apply border border-(--md-sys-color-outline) bg-transparent text-(--md-sys-color-primary);
}

.anzu-button--variant-outlined:hover {
    @apply border-(--md-sys-color-primary);
}

.anzu-button--variant-text {
    @apply bg-transparent text-(--md-sys-color-primary);
    @apply px-3;
}

.anzu-button--variant-elevated {
    @apply bg-(--md-sys-color-surface-container-low) text-(--md-sys-color-primary) shadow-sm;
}

.anzu-button--variant-elevated:not(.anzu-button--disabled):hover {
    @apply shadow-md;
}

.anzu-button--variant-elevated:not(.anzu-button--disabled):active {
    @apply shadow-sm;
}

.anzu-button--variant-tonal {
    @apply bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container);
}

/* Disabled State */
.anzu-button--disabled {
    @apply pointer-events-none cursor-not-allowed border-transparent shadow-none;
    background-color: color-mix(
        in srgb,
        var(--md-sys-color-on-surface) 12%,
        transparent
    );
    color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
}

.anzu-button__text,
.anzu-button__icon,
.anzu-button__progress {
    @apply relative z-10;
}

.anzu-button__icon {
    @apply flex-shrink-0;
}

.anzu-button--in-group-horizontal {
    @apply rounded-none border-r-0;
}

.anzu-button--in-group-horizontal:first-child {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.anzu-button--in-group-horizontal:last-child {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    border-right-width: 1px;
}

.anzu-button--in-group-vertical {
    @apply rounded-none border-b-0;
}

.anzu-button--in-group-vertical:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}

.anzu-button--in-group-vertical:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    border-bottom-width: 1px;
}
</style>

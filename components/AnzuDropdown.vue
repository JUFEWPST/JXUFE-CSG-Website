<script lang="ts" setup>
import { computed, ref } from "vue";
import { useClickAway } from "@/composables/useClickAway";

type Align = "left" | "right";

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        align?: Align;
        widthClass?: string;
        offsetClass?: string;
        panelClass?: string;
        transition?: boolean;
        openOnHover?: boolean;
        hoverCloseDelay?: number;
        bridgeHeightClass?: string;
    }>(),
    {
        align: "right",
        widthClass: "w-56",
        offsetClass: "mt-2",
        panelClass: "",
        transition: true,
        openOnHover: false,
        hoverCloseDelay: 160,
        bridgeHeightClass: "h-2",
    },
);

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const rootRef = ref<HTMLElement | null>(null);

const isOpen = computed({
    get: () => props.modelValue,
    set: (v: boolean) => emit("update:modelValue", v),
});

const close = () => {
    isOpen.value = false;
};

const open = () => {
    isOpen.value = true;
};

const toggle = () => {
    isOpen.value = !isOpen.value;
};

let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null;

const cancelHoverClose = () => {
    if (hoverCloseTimer) {
        clearTimeout(hoverCloseTimer);
        hoverCloseTimer = null;
    }
};

const scheduleHoverClose = () => {
    cancelHoverClose();
    hoverCloseTimer = setTimeout(() => {
        close();
        hoverCloseTimer = null;
    }, props.hoverCloseDelay);
};

const onMouseEnter = () => {
    cancelHoverClose();
    if (props.openOnHover) open();
};

const onMouseLeave = () => {
    if (!props.openOnHover) return;
    scheduleHoverClose();
};

useClickAway(
    rootRef,
    () => {
        close();
    },
    {
        enabled: () => isOpen.value,
    },
);

const panelBaseClass = computed(() => {
    const alignClass = props.align === "left" ? "left-0" : "right-0";

    return [
        "absolute",
        "top-full",
        alignClass,
        "z-70",
        props.offsetClass,
        props.widthClass,
        "origin-top-right",
        "overflow-hidden",
        "rounded-xl",
        "border",
        "border-(--md-sys-color-outline-variant)/50",
        "bg-(--md-sys-color-surface-container)",
        "shadow-lg",
        "ring-1",
        "ring-black/5",
        props.panelClass,
    ]
        .filter(Boolean)
        .join(" ");
});
</script>

<template>
    <div
        ref="rootRef"
        class="relative inline-block"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <slot name="trigger" :open="open" :close="close" :toggle="toggle" />
        <div
            v-if="isOpen"
            class="absolute top-full left-0 right-0"
            :class="bridgeHeightClass"
            aria-hidden="true"
        ></div>

        <transition
            v-if="transition"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform translate-y-2 opacity-0"
        >
            <div v-if="isOpen" :class="panelBaseClass" role="dialog">
                <slot name="menu" :close="close" />
            </div>
        </transition>

        <div v-else v-if="isOpen" :class="panelBaseClass" role="dialog">
            <slot name="menu" :close="close" />
        </div>
    </div>
</template>

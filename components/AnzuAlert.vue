<template>
    <div
        class="my-1 flex w-full flex-col rounded-xl bg-(--md-sys-color-surface-container) p-4 text-(--md-sys-color-on-surface-variant)"
    >
        <div
            v-if="titleText"
            class="mb-2 flex items-start font-bold text-(--md-sys-color-on-surface)"
        >
            <component
                :is="iconComponent"
                class="mt-0.5 mr-2 h-5 w-5 shrink-0"
                :class="iconColorClass"
            />
            {{ titleText }}
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from "@heroicons/vue/24/outline";

const { t } = useI18n();

interface AlertInfo {
    title?: string;
    type?: "succ" | "warn" | "info" | "error" | "plain";
}

const props = defineProps<AlertInfo>();

const titleText = computed(() => {
    if (props.title) {
        return props.title;
    }

    const typeMap: Record<string, string> = {
        succ: t("common.items.Success"),
        warn: t("common.items.Warning"),
        info: t("common.items.Info"),
        error: t("common.items.Error"),
        plain: "",
    };

    return typeMap[props.type || "plain"];
});

const iconComponent = computed(() => {
    const iconMap: Record<string, any> = {
        succ: CheckCircleIcon,
        warn: ExclamationTriangleIcon,
        info: InformationCircleIcon,
        error: XCircleIcon,
        plain: null,
    };

    return iconMap[props.type || "plain"];
});

const iconColorClass = computed(() => {
    const colorMap: Record<string, string> = {
        succ: "text-(--md-sys-color-primary)",
        warn: "text-(--md-sys-color-tertiary)",
        info: "text-(--md-sys-color-secondary)",
        error: "text-(--md-sys-color-error)",
        plain: "text-(--md-sys-color-on-surface-variant)",
    };

    return colorMap[props.type || "plain"];
});
</script>

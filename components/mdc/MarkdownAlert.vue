<template>
    <div :class="['markdown-alert', colorClass]">
        <div v-if="title" class="markdown-alert-title">
            <span v-if="iconSvg" v-html="iconSvg" />
            <span>{{ title }}</span>
        </div>
        <div class="markdown-alert-content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    type?: string;
    title?: string;
}>();

const alertTypeMap = {
    NOTE: { type: "info", title: "Note" },
    TIP: { type: "succ", title: "Tip" },
    IMPORTANT: { type: "warn", title: "Important" },
    WARNING: { type: "warn", title: "Warning" },
    CAUTION: { type: "error", title: "Caution" },
} as const;

type AlertLabel = keyof typeof alertTypeMap;
type AlertType = (typeof alertTypeMap)[AlertLabel]["type"] | "plain";

const labelIconSvgs: Record<AlertLabel, string> = {
    NOTE: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
    TIP: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v.75m0-15a5.25 5.25 0 0 0-3.975 8.682c.478.537.975 1.153 1.216 1.818h5.518c.241-.665.738-1.281 1.216-1.818A5.25 5.25 0 0 0 12 3.75Zm-1.875 14.25h3.75" /></svg>',
    IMPORTANT:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 6h.008v.008H12v-.008Z" /></svg>',
    WARNING:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>',
    CAUTION:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m6 2.25c0 5.018-3.343 9.256-7.925 10.617a1.88 1.88 0 0 1-1.15 0C6.343 21.256 3 17.018 3 12V6.108c0-.98.637-1.846 1.57-2.139l5.25-1.641c.387-.121.802-.121 1.19 0l5.25 1.64A2.24 2.24 0 0 1 21 6.108V12Z" /></svg>',
};

const iconSvgs: Record<AlertType, string> = {
    info: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
    succ: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
    plain: "",
};

const colorClassMap: Record<AlertType, string> = {
    info: "alert-info",
    succ: "alert-succ",
    warn: "alert-warn",
    error: "alert-error",
    plain: "alert-plain",
};

const normalizedType = computed(() => (props.type || "").toUpperCase());
const alertInfo = computed(() => {
    return alertTypeMap[normalizedType.value as AlertLabel];
});
const title = computed(() => props.title || alertInfo.value?.title || "");
const colorClass = computed(() => {
    const type = alertInfo.value?.type || "plain";
    return colorClassMap[type];
});
const iconSvg = computed(() => {
    const label = normalizedType.value as AlertLabel;
    const type = alertInfo.value?.type || "plain";
    return labelIconSvgs[label] || iconSvgs[type] || "";
});
</script>

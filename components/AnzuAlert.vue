<template>
    <div class="w-full rounded-xl flex flex-col p-4 my-1" :class="bgColorClass">
        <div v-if="titleText" class="font-bold mb-2 flex items-start">
            <component
                :is="iconComponent"
                class="w-5 h-5 mt-0.5 mr-2 shrink-0"
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
import { computed } from 'vue';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
} from '@heroicons/vue/24/outline';

const { t } = useI18n()

interface AlertInfo {
    title?: string
    type?: 'succ' | 'warn' | 'info' | 'error' | 'plain'
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
        plain: ''
    };

    return typeMap[props.type || 'plain'];
});

const bgColorClass = computed(() => {
    const colorMap: Record<string, string> = {
        succ: 'bg-green-200 dark:bg-green-900/20 dark:border-green-800/30',
        warn: 'bg-yellow-200 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800/30',
        info: 'bg-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30',
        error: 'bg-red-200 dark:bg-red-900/20 dark:border-red-800/30',
        plain: 'bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
    };

    return colorMap[props.type || 'plain'];
});

const iconComponent = computed(() => {
    const iconMap: Record<string, any> = {
        succ: CheckCircleIcon,
        warn: ExclamationTriangleIcon,
        info: InformationCircleIcon,
        error: XCircleIcon,
        plain: null
    };

    return iconMap[props.type || 'plain'];
});

const iconColorClass = computed(() => {
    const colorMap: Record<string, string> = {
        succ: 'text-green-600 dark:text-green-400',
        warn: 'text-yellow-600 dark:text-yellow-400',
        info: 'text-blue-600 dark:text-blue-400',
        error: 'text-red-600 dark:text-red-400',
        plain: 'text-gray-600 dark:text-gray-400'
    };

    return colorMap[props.type || 'plain'];
});
</script>

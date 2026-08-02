<template>
    <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
                <MegaphoneIcon class="h-5 w-5 text-(--md-sys-color-primary)" />
                <h2 class="text-lg font-bold text-(--md-sys-color-on-surface)">
                    {{ t("notice.title") }}
                </h2>
            </div>
            <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-full text-(--md-sys-color-on-surface-variant) transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                :aria-label="t('common.actions.reload')"
                @click="refresh"
            >
                <ArrowPathIcon
                    class="h-4 w-4"
                    :class="{ 'animate-spin-slow': loading }"
                />
            </button>
        </div>

        <div
            v-if="(!loaded || loading) && !notices.length"
            class="flex items-center justify-center py-4"
        >
            <AnzuProgressRing :size="40" status="loading" />
        </div>

        <p v-else-if="error" class="text-xs text-(--md-sys-color-error)">
            {{ t("notice.error") }}
        </p>

        <p
            v-else-if="!notices.length"
            class="text-xs text-(--md-sys-color-on-surface-variant)"
        >
            {{ t("notice.empty") }}
        </p>

        <ul v-else class="space-y-1">
            <li v-for="(notice, index) in notices" :key="index">
                <component
                    :is="notice.route ? NuxtLink : 'div'"
                    v-bind="notice.route ? { to: notice.route } : {}"
                    class="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                    <component
                        :is="iconForType(notice.type)"
                        class="h-5 w-5 shrink-0 group-hover:text-(--md-sys-color-primary)"
                        :class="iconColorClass(notice.type)"
                    />
                    <span
                        class="min-w-0 flex-1 line-clamp-2 text-sm font-medium text-(--md-sys-color-on-surface) group-hover:text-(--md-sys-color-primary)"
                    >
                        {{ notice.title }}
                    </span>
                    <ArrowTopRightOnSquareIcon
                        v-if="notice.route"
                        class="h-4 w-4 shrink-0 text-(--md-sys-color-on-surface-variant) group-hover:text-(--md-sys-color-primary)"
                    />
                </component>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { resolveComponent } from "vue";
import { useI18n } from "vue-i18n";
import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    MegaphoneIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
} from "@heroicons/vue/24/outline";
import AnzuProgressRing from "~/components/AnzuProgressRing.vue";
import { useNotice } from "~/composables/useNotice";
import { NotificationType } from "~/types/notification";

const { t } = useI18n();
const { notices, loaded, loading, error, fetch } = useNotice();
const NuxtLink = resolveComponent("NuxtLink");

const iconMap: Record<string, unknown> = {
    [NotificationType.SUCCESS]: CheckCircleIcon,
    [NotificationType.INFO]: InformationCircleIcon,
    [NotificationType.WARNING]: ExclamationTriangleIcon,
    [NotificationType.ERROR]: XCircleIcon,
};

const iconForType = (type?: string) =>
    (iconMap[type || NotificationType.INFO] as typeof InformationCircleIcon) ||
    InformationCircleIcon;

const iconColorClass = (type?: string) =>
    type === NotificationType.ERROR
        ? "text-(--md-sys-color-error)"
        : "text-(--md-sys-color-primary)";

const refresh = () => {
    void fetch(true);
};

if (import.meta.client) {
    void fetch();
}
</script>

<style scoped>
@reference "tailwindcss";

.animate-spin-slow {
    animation: spin 1.2s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>

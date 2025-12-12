<template>
    <div class="space-y-3">
        <div class="mb-1 flex items-center justify-between gap-2">
            <h3
                class="text-base font-semibold text-(--md-sys-color-on-surface) sm:text-lg"
            >
                {{ t("ctf.title") }}
            </h3>
            <button
                type="button"
                class="inline-flex items-center gap-1 text-xs text-(--md-sys-color-primary) transition-colors hover:text-(--md-sys-color-primary-container)"
                @click="refresh"
            >
                <ArrowPathIcon
                    class="h-4 w-4"
                    :class="{ 'animate-spin-slow': loading }"
                />
                <span v-if="!loading">{{ t("ctf.reload") }}</span>
            </button>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-4">
            <AnimationLoadingSpinner
                size="md"
                color="[var(--md-sys-color-primary)]"
            />
        </div>

        <div v-else-if="error" class="text-xs text-(--md-sys-color-error)">
            {{ t("ctf.error") }}
        </div>

        <div
            v-else-if="!events?.length"
            class="text-xs text-(--md-sys-color-on-surface-variant)"
        >
            {{ t("ctf.empty") }}
        </div>

        <div v-else class="space-y-2">
            <a
                v-for="event in events"
                :key="event.比赛ID + event.比赛名称"
                :href="event.比赛链接"
                target="_blank"
                rel="noopener noreferrer"
                class="group block rounded-xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-lowest) px-3 py-2.5 transition-colors hover:bg-(--md-sys-color-primary-container)"
            >
                <div class="flex items-center gap-3">
                    <div class="shrink-0">
                        <component
                            :is="iconForStatus(statusKey(event))"
                            class="h-5 w-5"
                            :class="iconColorClass(statusKey(event))"
                            :title="t(`ctf.status.${statusKey(event)}`)"
                        />
                    </div>

                    <div class="min-w-0 flex-1">
                        <p
                            class="truncate text-sm font-medium text-(--md-sys-color-on-surface) group-hover:text-(--md-sys-color-on-primary-container)"
                        >
                            {{ event.比赛名称 }}
                        </p>
                        <p
                            class="mt-0.5 truncate text-[11px] text-(--md-sys-color-on-surface-variant) group-hover:text-(--md-sys-color-on-primary-container)"
                        >
                            {{ formatStartTime(event.比赛时间) }}
                        </p>
                    </div>

                    <ArrowTopRightOnSquareIcon
                        class="h-4 w-4 shrink-0 text-(--md-sys-color-on-surface-variant) group-hover:text-(--md-sys-color-on-primary-container)"
                    />
                </div>
            </a>
        </div>

        <p class="mt-2 text-[11px] text-(--md-sys-color-on-surface-variant)">
            <i18n-t keypath="ctf.sourceLabel" tag="span">
                <template #source>
                    <a
                        href="https://github.com/ProbiusOfficial/Hello-CTFtime"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="underline hover:text-(--md-sys-color-primary)"
                    >
                        Hello-CTFTime
                    </a>
                </template>
            </i18n-t>
        </p>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useI18n } from "vue-i18n";
import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon,
    ClockIcon,
    PlayCircleIcon,
    QuestionMarkCircleIcon,
} from "@heroicons/vue/24/outline";
import AnimationLoadingSpinner from "@/components/AnimationLoadingSpinner.vue";

const { t } = useI18n();

interface RawCTFEvent {
    比赛名称: string;
    比赛时间: string;
    添加日历?: string;
    比赛形式?: string;
    比赛链接: string;
    比赛标志?: string;
    比赛权重?: string;
    赛事主办?: string;
    比赛ID: string;
    比赛状态?: string;
}

const events = ref<RawCTFEvent[] | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const statusKey = (
    e: RawCTFEvent,
): "oncoming" | "running" | "finished" | "unknown" => {
    const raw = (e.比赛状态 || "").toLowerCase();
    if (raw === "oncoming") return "oncoming";
    if (raw === "running") return "running";
    if (raw === "finished" || raw === "over" || raw === "done")
        return "finished";
    return "unknown";
};

const iconMap = {
    oncoming: ClockIcon,
    running: PlayCircleIcon,
    finished: CheckCircleIcon,
    unknown: QuestionMarkCircleIcon,
};

const iconForStatus = (
    status: "oncoming" | "running" | "finished" | "unknown",
) => iconMap[status];

const iconColorClass = (
    status: "oncoming" | "running" | "finished" | "unknown",
) => {
    switch (status) {
        case "running":
            return "text-(--md-sys-color-primary)";
        case "finished":
            return "text-(--md-sys-color-tertiary)";
        case "oncoming":
        default:
            return "text-(--md-sys-color-on-surface-variant)";
    }
};

const formatStartTime = (timeRange: string) => {
    const separator = " - ";
    const idx = timeRange.indexOf(separator);
    if (idx !== -1) {
        return timeRange.slice(0, idx).trim();
    }
    return timeRange.trim();
};

const fetchEvents = async () => {
    loading.value = true;
    error.value = null;
    try {
        const res = await fetch(
            "https://raw.githubusercontent.com/ProbiusOfficial/Hello-CTFtime/main/Global.json",
        );
        if (!res.ok) {
            throw new Error(res.statusText || `HTTP ${res.status}`);
        }
        const json = await res.json();
        if (Array.isArray(json)) {
            events.value = json.slice(0, 5);
        } else {
            events.value = [];
        }
    } catch (e) {
        console.error(e);
        error.value = (e as Error).message || "Failed to load CTF events";
        events.value = [];
    } finally {
        loading.value = false;
    }
};

const refresh = () => {
    if (!loading.value) {
        void fetchEvents();
    }
};

onMounted(() => {
    void fetchEvents();
});
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

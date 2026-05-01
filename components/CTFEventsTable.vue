<template>
    <div class="space-y-4">
        <div class="mb-2 flex items-center justify-between gap-2">
            <h3 class="text-lg font-semibold text-(--md-sys-color-on-surface)">
                {{ t("pages.ctf.events.title") }}
            </h3>
            <div class="flex items-center gap-2">
                <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors bg-(--md-sys-color-surface-container-highest) text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)"
                    @click="showAll = !showAll"
                >
                    {{
                        showAll
                            ? t("common.actions.showLess")
                            : t("common.actions.showMore")
                    }}
                </button>
                <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-md p-1.5 text-(--md-sys-color-primary) transition-colors hover:bg-(--md-sys-color-secondary-container)"
                    @click="refresh"
                    :title="t('common.actions.reload')"
                >
                    <ArrowPathIcon
                        class="h-5 w-5"
                        :class="{ 'animate-spin-slow': loading }"
                    />
                </button>
            </div>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-8">
            <AnzuProgressRing :size="48" status="loading" />
        </div>

        <div
            v-else-if="error"
            class="rounded-xl border border-(--md-sys-color-error-container) bg-(--md-sys-color-error-container) p-4"
        >
            <div class="flex items-start gap-3">
                <ExclamationTriangleIcon
                    class="h-5 w-5 shrink-0 text-(--md-sys-color-on-error-container)"
                />
                <div class="flex-1">
                    <p
                        class="text-sm font-medium text-(--md-sys-color-on-error-container)"
                    >
                        {{ t("pages.ctf.events.error") }}
                    </p>
                    <p
                        class="mt-1 text-xs text-(--md-sys-color-on-error-container/80)"
                    >
                        {{ error }}
                    </p>
                </div>
            </div>
        </div>

        <div
            v-else-if="!filteredEvents?.length"
            class="rounded-xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-lowest) p-6 text-center"
        >
            <CalendarDaysIcon
                class="mx-auto h-8 w-8 text-(--md-sys-color-on-surface-variant)"
            />
            <p
                class="mt-2 text-sm font-medium text-(--md-sys-color-on-surface)"
            >
                {{ t("pages.ctf.events.empty") }}
            </p>
            <p class="mt-1 text-xs text-(--md-sys-color-on-surface-variant)">
                {{ t("pages.ctf.events.emptyHint") }}
            </p>
        </div>

        <div
            v-else
            class="overflow-hidden rounded-xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-lowest)"
        >
            <!-- 表格头部 -->
            <div
                class="grid grid-cols-12 gap-2 border-b border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-high) px-4 py-3"
            >
                <div class="col-span-5">
                    <span
                        class="text-xs font-medium uppercase tracking-wider text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ t("pages.ctf.events.table.event") }}
                    </span>
                </div>
                <div class="col-span-3">
                    <span
                        class="text-xs font-medium uppercase tracking-wider text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ t("pages.ctf.events.table.time") }}
                    </span>
                </div>
                <div class="col-span-2">
                    <span
                        class="text-xs font-medium uppercase tracking-wider text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ t("pages.ctf.events.table.status") }}
                    </span>
                </div>
                <div class="col-span-2 text-right">
                    <span
                        class="text-xs font-medium uppercase tracking-wider text-(--md-sys-color-on-surface-variant)"
                    >
                        {{ t("pages.ctf.events.table.action") }}
                    </span>
                </div>
            </div>

            <!-- 表格内容 -->
            <div class="divide-y divide-(--md-sys-color-outline-variant/30)">
                <div
                    v-for="event in filteredEvents"
                    :key="event.比赛ID + event.比赛名称"
                    class="group grid grid-cols-12 gap-2 px-4 py-3 transition-colors hover:bg-(--md-sys-color-surface-container)"
                >
                    <!-- 赛事名称和标志 -->
                    <div class="col-span-5">
                        <div class="flex items-center gap-3">
                            <div v-if="event.比赛标志" class="shrink-0">
                                <img
                                    :src="event.比赛标志"
                                    :alt="event.比赛名称"
                                    class="h-8 w-8 rounded-md object-cover"
                                    @error="handleImageError"
                                />
                            </div>
                            <div class="min-w-0 flex-1">
                                <p
                                    class="truncate text-sm font-medium text-(--md-sys-color-on-surface) group-hover:text-(--md-sys-color-primary)"
                                >
                                    {{ event.比赛名称 }}
                                </p>
                                <div class="mt-1 flex items-center gap-2">
                                    <span
                                        v-if="event.赛事主办"
                                        class="inline-flex items-center gap-1 rounded-full bg-(--md-sys-color-surface-container-highest) px-2 py-0.5 text-[10px] font-medium text-(--md-sys-color-on-surface-variant)"
                                    >
                                        <UserGroupIcon class="h-3 w-3" />
                                        {{ event.赛事主办 }}
                                    </span>
                                    <span
                                        v-if="event.比赛形式"
                                        class="inline-flex items-center gap-1 rounded-full bg-(--md-sys-color-surface-container-highest) px-2 py-0.5 text-[10px] font-medium text-(--md-sys-color-on-surface-variant)"
                                    >
                                        <ComputerDesktopIcon class="h-3 w-3" />
                                        {{ event.比赛形式 }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 比赛时间 -->
                    <div class="col-span-3">
                        <div class="space-y-1">
                            <div class="flex items-center gap-1.5">
                                <CalendarIcon
                                    class="h-3.5 w-3.5 text-(--md-sys-color-on-surface-variant)"
                                />
                                <span
                                    class="text-xs font-medium text-(--md-sys-color-on-surface)"
                                >
                                    {{ formatDate(event.比赛时间) }}
                                </span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <ClockIcon
                                    class="h-3.5 w-3.5 text-(--md-sys-color-on-surface-variant)"
                                />
                                <span
                                    class="text-xs text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ formatDuration(event.比赛时间) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 状态 -->
                    <div class="col-span-2">
                        <div class="flex items-center gap-2">
                            <div
                                class="h-2 w-2 rounded-full"
                                :class="statusColorClass(statusKey(event))"
                            />
                            <span
                                class="text-xs font-medium"
                                :class="statusTextClass(statusKey(event))"
                            >
                                {{
                                    t(
                                        `pages.ctf.events.status.${statusKey(event)}`,
                                    )
                                }}
                            </span>
                        </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="col-span-2">
                        <div class="flex items-center justify-end gap-2">
                            <a
                                :href="event.比赛链接"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-on-primary-container)"
                                :title="t('pages.ctf.events.table.join')"
                            >
                                <ArrowTopRightOnSquareIcon
                                    class="h-3.5 w-3.5"
                                />
                                {{ t("pages.ctf.events.table.join") }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 表格底部 -->
            <div
                class="border-t border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-high) px-4 py-3"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <!-- 状态筛选 -->
                        <div class="flex items-center gap-2">
                            <button
                                v-for="status in statusFilters"
                                :key="status.key"
                                type="button"
                                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                                :class="statusFilterClass(status.key)"
                                @click="toggleStatusFilter(status.key)"
                            >
                                <div
                                    class="h-1.5 w-1.5 rounded-full"
                                    :class="statusDotClass(status.key)"
                                />
                                {{ status.label }}
                                <span
                                    class="text-(--md-sys-color-on-surface-variant)"
                                >
                                    ({{ getStatusCount(status.key) }})
                                </span>
                            </button>
                        </div>
                    </div>
                    <p class="text-xs text-(--md-sys-color-on-surface-variant)">
                        <i18n-t
                            keypath="pages.ctf.events.sourceLabel"
                            tag="span"
                        >
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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    CalendarIcon,
    CalendarDaysIcon,
    ClockIcon,
    ComputerDesktopIcon,
    ExclamationTriangleIcon,
    UserGroupIcon,
} from "@heroicons/vue/24/outline";
import AnzuProgressRing from "@/components/AnzuProgressRing.vue";

const { t, locale } = useI18n();

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
const showAll = ref(false);
const activeStatusFilters = ref<Set<string>>(new Set(["oncoming", "running"]));

// 状态筛选选项
const statusFilters = computed(() => [
    { key: "oncoming", label: t("pages.ctf.events.status.oncoming") },
    { key: "running", label: t("pages.ctf.events.status.running") },
    { key: "finished", label: t("pages.ctf.events.status.finished") },
]);

// 获取状态分类
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

// 状态颜色类
const statusColorClass = (status: string) => {
    switch (status) {
        case "running":
            return "bg-(--md-sys-color-primary)";
        case "finished":
            return "bg-(--md-sys-color-tertiary)";
        case "oncoming":
            return "bg-(--md-sys-color-secondary)";
        default:
            return "bg-(--md-sys-color-outline)";
    }
};

const statusTextClass = (status: string) => {
    switch (status) {
        case "running":
            return "text-(--md-sys-color-primary)";
        case "finished":
            return "text-(--md-sys-color-tertiary)";
        case "oncoming":
            return "text-(--md-sys-color-secondary)";
        default:
            return "text-(--md-sys-color-on-surface-variant)";
    }
};

const statusDotClass = (status: string) => {
    switch (status) {
        case "running":
            return "bg-(--md-sys-color-primary)";
        case "finished":
            return "bg-(--md-sys-color-tertiary)";
        case "oncoming":
            return "bg-(--md-sys-color-secondary)";
        default:
            return "bg-(--md-sys-color-outline)";
    }
};

// 状态筛选类
const statusFilterClass = (status: string) => {
    const isActive = activeStatusFilters.value.has(status);
    if (isActive) {
        switch (status) {
            case "running":
                return "bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container)";
            case "finished":
                return "bg-(--md-sys-color-tertiary-container) text-(--md-sys-color-on-tertiary-container)";
            case "oncoming":
                return "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)";
            default:
                return "bg-(--md-sys-color-surface-container-highest) text-(--md-sys-color-on-surface)";
        }
    }
    return "bg-(--md-sys-color-surface-container-lowest) text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-low)";
};

// 获取状态数量
const getStatusCount = (status: string) => {
    if (!events.value) return 0;
    return events.value.filter((event) => statusKey(event) === status).length;
};

// 切换状态筛选
const toggleStatusFilter = (status: string) => {
    if (activeStatusFilters.value.has(status)) {
        activeStatusFilters.value.delete(status);
        // 确保至少有一个筛选器被选中
        if (activeStatusFilters.value.size === 0) {
            activeStatusFilters.value.add("oncoming");
        }
    } else {
        activeStatusFilters.value.add(status);
    }
};

// 筛选事件
const filteredEvents = computed(() => {
    if (!events.value) return null;

    let filtered = events.value.filter((event) =>
        activeStatusFilters.value.has(statusKey(event)),
    );

    // 按状态排序：进行中 -> 未开始 -> 已结束
    filtered.sort((a, b) => {
        const statusA = statusKey(a);
        const statusB = statusKey(b);

        const statusOrder = {
            running: 0,
            oncoming: 1,
            finished: 2,
            unknown: 3,
        };
        return statusOrder[statusA] - statusOrder[statusB];
    });

    // 限制显示数量
    if (!showAll.value) {
        filtered = filtered.slice(0, 5);
    }

    return filtered;
});

// 格式化日期
const formatDate = (timeRange: string) => {
    const separator = " - ";
    const idx = timeRange.indexOf(separator);
    if (idx !== -1) {
        const startDate = timeRange.slice(0, idx).trim();
        return new Intl.DateTimeFormat(locale.value, {
            month: "short",
            day: "numeric",
        }).format(new Date(startDate));
    }
    return timeRange.trim();
};

// 格式化持续时间
const formatDuration = (timeRange: string) => {
    const separator = " - ";
    const idx = timeRange.indexOf(separator);
    if (idx !== -1) {
        const startStr = timeRange.slice(0, idx).trim();
        const endStr = timeRange.slice(idx + separator.length).trim();

        try {
            const startDate = new Date(startStr);
            const endDate = new Date(endStr);
            const diffDays = Math.ceil(
                (endDate.getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24),
            );

            if (diffDays === 1) return t("pages.ctf.events.duration.day");
            return t("pages.ctf.events.duration.days", { days: diffDays });
        } catch {
            return t("pages.ctf.events.duration.days", { days: "?" });
        }
    }
    return t("pages.ctf.events.duration.single");
};

// 图片加载错误处理
const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;
    img.style.display = "none";
};

// 添加到日历
// 获取事件数据
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
            events.value = json;
        } else {
            events.value = [];
        }
    } catch (e) {
        console.error(e);
        error.value = (e as Error).message || "Failed to load World CTF events";
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

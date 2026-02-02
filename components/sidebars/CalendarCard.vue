<template>
    <div v-if="isClientReady" class="flex flex-col gap-3">
        <!-- Header: 当前月份与切换 -->
        <div class="flex items-center justify-between">
            <div class="flex flex-col items-start">
                <span class="text-xs text-(--md-sys-color-on-surface-variant)">
                    {{ currentYear }}
                </span>
                <span
                    class="text-lg font-semibold text-(--md-sys-color-on-surface)"
                >
                    {{ currentMonth + 1 }} {{ t("calendar.monthSuffix") }}
                </span>
            </div>
            <div class="flex items-center gap-1">
                <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-full text-(--md-sys-color-on-surface-variant) transition-colors hover:bg-(--md-sys-color-surface-container-high)"
                    @click="gotoPrevMonth"
                    :aria-label="t('calendar.actions.prevMonth')"
                >
                    ‹
                </button>
                <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-full text-(--md-sys-color-on-surface-variant) transition-colors hover:bg-(--md-sys-color-surface-container-high)"
                    @click="gotoNextMonth"
                    :aria-label="t('calendar.actions.nextMonth')"
                >
                    ›
                </button>
            </div>
        </div>

        <!-- 星期标题 -->
        <div
            class="grid grid-cols-7 text-center text-xs text-(--md-sys-color-on-surface-variant)"
        >
            <div v-for="w in weekdays" :key="w" class="py-1">
                {{ w }}
            </div>
        </div>

        <!-- 日期栅格 -->
        <div class="grid grid-cols-7 gap-y-1 text-xs">
            <div
                v-for="(cell, index) in calendarCells"
                :key="index"
                class="flex h-9 items-center justify-center"
            >
                <div
                    v-if="cell"
                    :class="dayClasses(cell)"
                    :title="dayTitle(cell)"
                >
                    <span>{{ cell.date.getDate() }}</span>
                    <span
                        v-if="cell.events.length"
                        class="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-(--md-sys-color-primary)"
                    />
                </div>
            </div>
        </div>

        <!-- 图例 -->
        <div
            class="mt-1 flex flex-wrap gap-2 text-[11px] text-(--md-sys-color-on-surface-variant)"
        >
            <div class="flex items-center gap-1">
                <span
                    class="h-3 w-3 rounded border border-(--md-sys-color-primary)/40 bg-(--md-sys-color-secondary-container)"
                />
                <span>{{ t("calendar.legend.holiday") }}</span>
            </div>
            <div class="flex items-center gap-1">
                <span
                    class="h-3 w-3 rounded border border-(--md-sys-color-primary)/60"
                />
                <span>{{ t("calendar.legend.workdayAdjusted") }}</span>
            </div>
            <div class="flex items-center gap-1">
                <span
                    class="h-3 w-3 rounded bg-(--md-sys-color-primary-container)"
                />
                <span>{{ t("calendar.legend.today") }}</span>
            </div>
            <div class="flex items-center gap-1">
                <span
                    class="h-3 w-3 rounded border border-dashed border-(--md-sys-color-outline-variant)"
                />
                <span>{{ t("calendar.legend.examWeek") }}</span>
            </div>
            <div class="flex items-center gap-1">
                <span
                    class="h-3 w-3 rounded-full bg-(--md-sys-color-primary)"
                />
                <span>{{ t("calendar.legend.event") }}</span>
            </div>
        </div>

        <!-- 今日状态卡片 -->
        <div
            class="mt-1 rounded-lg border border-(--md-sys-color-outline-variant)/60 bg-(--md-sys-color-surface-container-lowest) px-3 py-2 text-xs text-(--md-sys-color-on-surface-variant)"
        >
            <div class="flex items-center justify-between">
                <span class="font-medium text-(--md-sys-color-on-surface)">
                    {{ t("calendar.todayPrefix") }}{{ todayStatus.label }}
                </span>
                <span class="text-[11px] text-(--md-sys-color-primary)">
                    {{ today ? formatDateDisplay(today) : "--" }}
                </span>
            </div>
            <div v-if="todayStatus.detail" class="mt-0.5 truncate text-[11px]">
                {{ todayStatus.detail }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
    calendarConfig as defaultCalendarConfig,
    type CalendarConfig,
    type CalendarOverride,
    type CalendarExamWeek,
} from "@/data/calendarConfig";

interface CalendarDayMeta {
    date: Date;
    isToday: boolean;
    isWeekend: boolean;
    isHoliday: boolean;
    isOfficialHoliday: boolean;
    isWorkdayOverride: boolean;
    isExamWeek: boolean;
    events: CalendarOverride[];
}

const props = defineProps<{
    config?: CalendarConfig;
}>();

const { t } = useI18n();

const config = computed<CalendarConfig>(
    () => props.config ?? defaultCalendarConfig,
);

// 仅在客户端 mounted 后初始化，避免 SSR 使用服务端时间导致不一致
const isClientReady = ref(false);
const today = ref<Date | null>(null);

// 当前展示的年月
const currentYear = ref(0);
const currentMonth = ref(0); // 0-11

onMounted(() => {
    const now = new Date();
    today.value = now;
    currentYear.value = now.getFullYear();
    currentMonth.value = now.getMonth();
    isClientReady.value = true;
});

function formatDateDisplay(d: Date): string {
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${m}-${day}`;
}

const weekdays = computed(() => [
    t("calendar.weekdays.mon"),
    t("calendar.weekdays.tue"),
    t("calendar.weekdays.wed"),
    t("calendar.weekdays.thu"),
    t("calendar.weekdays.fri"),
    t("calendar.weekdays.sat"),
    t("calendar.weekdays.sun"),
]);

function formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function getOverridesMap(
    overrides: CalendarOverride[],
): Record<string, CalendarOverride[]> {
    const map: Record<string, CalendarOverride[]> = {};

    for (const o of overrides) {
        const key = o.date;
        const list = map[key] ?? (map[key] = []);
        list.push(o);
    }

    return map;
}

const overridesMap = computed(() => getOverridesMap(config.value.overrides));

function isInExamWeeks(
    dateStr: string,
    examWeeks?: CalendarExamWeek[],
): boolean {
    if (!examWeeks || examWeeks.length === 0) return false;
    return examWeeks.some(
        (week) => dateStr >= week.start && dateStr <= week.end,
    );
}

function buildMonthCells(
    year: number,
    month: number,
    todayStr: string,
): (CalendarDayMeta | null)[] {
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const jsWeekDay = firstDay.getDay(); // 0=Sun
    const mondayFirstIndex = jsWeekDay === 0 ? 6 : jsWeekDay - 1; // 0..6, 0=Mon

    const cells: (CalendarDayMeta | null)[] = [];

    // 前置空格
    for (let i = 0; i < mondayFirstIndex; i++) {
        cells.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dateStr = formatDate(date);
        const overrides = overridesMap.value[dateStr] ?? [];

        const jsDay = date.getDay(); // 0=Sun,6=Sat
        const isWeekend = jsDay === 0 || jsDay === 6;

        let isHoliday = false;
        let isOfficialHoliday = false;
        let isWorkdayOverride = false;

        const isWeekendHoliday =
            config.value.defaultWeekendIsHoliday && isWeekend;
        if (isWeekendHoliday) {
            isHoliday = true;
        }

        for (const o of overrides) {
            if (o.type === "holiday") {
                isHoliday = true;
                isOfficialHoliday = true;
                isWorkdayOverride = false;
            } else if (o.type === "workday") {
                isHoliday = false;
                isWorkdayOverride = true;
            }
        }

        const events = overrides.filter((o) => o.type === "event");
        const isExamWeek = isInExamWeeks(dateStr, config.value.examWeeks);

        cells.push({
            date,
            isToday: !!todayStr && dateStr === todayStr,
            isWeekend,
            isHoliday,
            isOfficialHoliday,
            isWorkdayOverride,
            isExamWeek,
            events,
        });
    }

    while (cells.length < 42) {
        cells.push(null);
    }

    return cells;
}

const todayStr = computed(() => (today.value ? formatDate(today.value) : ""));

const calendarCells = computed(() => {
    if (!isClientReady.value) {
        // 保持 6x7 栅格占位，避免布局跳动
        return Array.from(
            { length: 42 },
            () => null,
        ) as (CalendarDayMeta | null)[];
    }

    return buildMonthCells(
        currentYear.value,
        currentMonth.value,
        todayStr.value,
    );
});

interface TodayStatus {
    label: string;
    detail?: string;
}

const todayStatus = computed<TodayStatus>(() => {
    if (!today.value) {
        return { label: "", detail: "" };
    }

    const todayStrValue = formatDate(today.value);
    const overrides = overridesMap.value[todayStrValue] ?? [];
    const jsDay = today.value.getDay();
    const isWeekend = jsDay === 0 || jsDay === 6;

    let isHoliday = false;
    let isOfficialHoliday = false;
    let isWorkdayOverride = false;

    const isWeekendHoliday = config.value.defaultWeekendIsHoliday && isWeekend;
    if (isWeekendHoliday) {
        isHoliday = true;
    }

    for (const o of overrides) {
        if (o.type === "holiday") {
            isHoliday = true;
            isOfficialHoliday = true;
            isWorkdayOverride = false;
        } else if (o.type === "workday") {
            isHoliday = false;
            isWorkdayOverride = true;
        }
    }

    const events = overrides.filter((o) => o.type === "event");
    const inExamWeek = isInExamWeeks(todayStrValue, config.value.examWeeks);

    const examWeeks = config.value.examWeeks ?? [];
    const lastExamEnd = examWeeks.reduce((latest, week) => {
        if (!latest) return week.end;
        return week.end > latest ? week.end : latest;
    }, "");

    let label = "";
    const tags: string[] = [];

    if (isHoliday && !isWorkdayOverride) {
        label = t("calendar.status.holiday");
    } else if (inExamWeek) {
        label = t("calendar.status.examWeek");
    } else if (lastExamEnd && todayStrValue > lastExamEnd) {
        label = t("calendar.status.vacation");
    } else if (isWorkdayOverride) {
        label = t("calendar.status.workdayAdjusted");
    } else if (isWeekend) {
        label = t("calendar.status.weekend");
    } else {
        label = t("calendar.status.classDay");
    }

    if (inExamWeek) tags.push(t("calendar.tags.examWeek"));
    if (isHoliday && !isWorkdayOverride) tags.push(t("calendar.tags.holiday"));
    if (isWorkdayOverride) tags.push(t("calendar.tags.workdayAdjusted"));
    for (const e of events) {
        if (e.name) tags.push(e.name);
    }

    return {
        label,
        detail: tags.join(" / "),
    };
});

function dayClasses(day: CalendarDayMeta): string {
    const classes = [
        "w-8 h-8 rounded-lg flex items-center justify-center text-[13px] select-none transition-colors duration-150",
    ];

    if (day.isToday) {
        if (day.isHoliday) {
            classes.push(
                "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-primary) border-2 border-(--md-sys-color-primary)",
            );
        } else if (day.isWorkdayOverride) {
            classes.push(
                "bg-(--md-sys-color-surface-container-low) text-(--md-sys-color-on-surface) border-2 border-(--md-sys-color-primary)",
            );
        } else if (day.isExamWeek && !day.isOfficialHoliday) {
            classes.push(
                "bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container) border-2 border-(--md-sys-color-primary)",
            );
        } else {
            classes.push(
                "bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container) border-2 border-(--md-sys-color-primary)",
            );
        }
    } else if (day.isExamWeek && !day.isOfficialHoliday) {
        classes.push(
            "border border-dashed border-(--md-sys-color-outline-variant) text-(--md-sys-color-on-surface)",
        );
    } else if (day.isHoliday) {
        classes.push(
            "bg-(--md-sys-color-secondary-container) border border-(--md-sys-color-primary)/30 text-(--md-sys-color-primary)",
        );
    } else if (day.isWorkdayOverride) {
        classes.push(
            "border border-(--md-sys-color-primary)/60 text-(--md-sys-color-on-surface)",
        );
    } else {
        classes.push(
            "text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)",
        );
    }

    return classes.join(" ");
}

function dayTitle(day: CalendarDayMeta): string {
    const parts: string[] = [];

    parts.push(formatDate(day.date));

    if (day.isHoliday) parts.push(t("calendar.tags.holiday"));
    if (day.isWorkdayOverride) parts.push(t("calendar.tags.workdayAdjusted"));
    if (day.isExamWeek) parts.push(t("calendar.tags.examWeek"));
    for (const e of day.events) {
        if (e.name) parts.push(e.name);
    }

    return parts.join(" · ");
}

function gotoPrevMonth() {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
    } else {
        currentMonth.value -= 1;
    }
}

function gotoNextMonth() {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
    } else {
        currentMonth.value += 1;
    }
}
</script>

<template>
    <div class="min-h-screen bg-(--md-sys-color-surface)">
        <div
            class="border-b border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-lowest)"
        >
            <div class="px-4 py-8 sm:px-6 lg:px-8">
                <div class="flex flex-col gap-3">
                    <p
                        class="text-xs font-semibold uppercase tracking-[0.28em] text-(--md-sys-color-primary)"
                    >
                        Hello-CTFTime
                    </p>
                    <h1
                        class="text-3xl font-bold tracking-tight text-(--md-sys-color-on-surface) sm:text-4xl"
                    >
                        {{ t("ctf.page.title") }}
                    </h1>
                    <p
                        class="max-w-3xl text-base text-(--md-sys-color-on-surface-variant) sm:text-lg"
                    >
                        {{ t("ctf.page.subtitle") }}
                    </p>
                </div>
            </div>
        </div>

        <div class="px-4 py-6 sm:px-6 lg:px-8">
            <div
                v-if="loading"
                class="flex flex-col items-center justify-center rounded-3xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-lowest) py-20"
            >
                <AnzuProgressRing :size="64" status="loading" />
                <p
                    class="mt-4 text-lg text-(--md-sys-color-on-surface-variant)"
                >
                    {{ t("ctf.page.loading") }}
                </p>
            </div>

            <div
                v-else-if="error"
                class="rounded-3xl border border-(--md-sys-color-error-container) bg-(--md-sys-color-error-container) p-6"
            >
                <div class="flex items-start gap-4">
                    <ExclamationTriangleIcon
                        class="h-6 w-6 shrink-0 text-(--md-sys-color-on-error-container)"
                    />
                    <div class="flex-1">
                        <h2
                            class="text-lg font-semibold text-(--md-sys-color-on-error-container)"
                        >
                            {{ t("ctf.error") }}
                        </h2>
                        <p
                            class="mt-2 text-sm text-(--md-sys-color-on-error-container/80)"
                        >
                            {{ error }}
                        </p>
                        <button
                            type="button"
                            class="mt-4 inline-flex items-center gap-2 rounded-lg bg-(--md-sys-color-on-error-container) px-4 py-2 text-sm font-medium text-(--md-sys-color-error-container) transition-opacity hover:opacity-90"
                            @click="refresh"
                        >
                            <ArrowPathIcon class="h-4 w-4" />
                            {{ t("ctf.page.retry") }}
                        </button>
                    </div>
                </div>
            </div>

            <div
                v-else-if="!matchedEvents.length"
                class="rounded-3xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-lowest) p-12 text-center"
            >
                <CalendarDaysIcon
                    class="mx-auto h-12 w-12 text-(--md-sys-color-on-surface-variant)"
                />
                <h2
                    class="mt-4 text-xl font-semibold text-(--md-sys-color-on-surface)"
                >
                    {{ t("ctf.empty") }}
                </h2>
                <p class="mt-2 text-(--md-sys-color-on-surface-variant)">
                    {{ t("ctf.emptyHint") }}
                </p>
                <button
                    type="button"
                    class="mt-6 inline-flex items-center gap-2 rounded-lg bg-(--md-sys-color-primary) px-4 py-2 text-sm font-medium text-(--md-sys-color-on-primary) transition-colors hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-on-primary-container)"
                    @click="refresh"
                >
                    <ArrowPathIcon class="h-4 w-4" />
                    {{ t("ctf.page.refresh") }}
                </button>
            </div>

            <div
                v-else
                class="overflow-hidden rounded-2xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-lowest)"
            >
                <div
                    class="border-b border-(--md-sys-color-outline-variant) px-4 py-4 sm:px-5"
                >
                    <div
                        class="grid gap-3 xl:grid-cols-[1fr_auto_1fr] xl:items-center"
                    >
                        <div
                            class="flex flex-col gap-3 xl:max-w-[26rem] xl:justify-start"
                        >
                            <div class="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors"
                                    :class="regionFilterClass('foreign')"
                                    @click="toggleRegionFilter('foreign')"
                                >
                                    {{ t("ctf.page.region.foreign") }}
                                </button>
                                <button
                                    type="button"
                                    class="inline-flex items-center rounded-2xl border px-4 py-2 text-sm font-semibold transition-colors"
                                    :class="regionFilterClass('domestic')"
                                    @click="toggleRegionFilter('domestic')"
                                >
                                    {{ t("ctf.page.region.domestic") }}
                                </button>
                            </div>

                            <div class="flex flex-wrap gap-2">
                                <button
                                    v-for="status in statusFilters"
                                    :key="status.key"
                                    type="button"
                                    class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                                    :class="statusFilterClass(status.key)"
                                    @click="toggleStatusFilter(status.key)"
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full"
                                        :class="statusDotClass(status.key)"
                                    />
                                    {{ status.label }}
                                    <span class="text-[11px] opacity-75">
                                        {{ getStatusCount(status.key) }}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div class="text-center">
                            <p
                                class="text-xs font-medium tracking-[0.12em] text-(--md-sys-color-on-surface-variant)"
                            >
                                {{ t("ctf.page.title") }}
                            </p>
                            <h2
                                class="mt-1 text-2xl font-bold text-(--md-sys-color-on-surface) sm:text-3xl"
                            >
                                {{ displayedMonthLabel }}
                            </h2>
                            <p
                                class="mt-1 text-xs text-(--md-sys-color-on-surface-variant)"
                            >
                                {{
                                    monthEvents.length
                                        ? t("ctf.page.monthSummary", {
                                              count: monthEvents.length,
                                          })
                                        : t("ctf.page.monthEmpty")
                                }}
                            </p>
                        </div>

                        <div
                            class="flex flex-wrap items-center gap-2 xl:justify-end"
                        >
                            <button
                                type="button"
                                class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--md-sys-color-outline-variant) text-(--md-sys-color-primary) transition-colors hover:bg-(--md-sys-color-surface-container-high)"
                                :title="t('calendar.actions.prevMonth')"
                                @click="gotoPrevMonth"
                            >
                                <ChevronLeftIcon class="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--md-sys-color-outline-variant) text-(--md-sys-color-primary) transition-colors hover:bg-(--md-sys-color-surface-container-high)"
                                :title="t('calendar.actions.nextMonth')"
                                @click="gotoNextMonth"
                            >
                                <ChevronRightIcon class="h-5 w-5" />
                            </button>

                            <div
                                class="inline-flex items-center rounded-2xl border border-(--md-sys-color-outline-variant) p-1"
                            >
                                <button
                                    type="button"
                                    class="rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors"
                                    :class="viewToggleClass('calendar')"
                                    @click="viewMode = 'calendar'"
                                >
                                    {{ t("ctf.page.view.calendar") }}
                                </button>
                                <button
                                    type="button"
                                    class="rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors"
                                    :class="viewToggleClass('list')"
                                    @click="viewMode = 'list'"
                                >
                                    {{ t("ctf.page.view.list") }}
                                </button>
                            </div>

                            <button
                                type="button"
                                class="inline-flex items-center gap-2 rounded-xl bg-(--md-sys-color-primary) px-3.5 py-2 text-sm font-medium text-(--md-sys-color-on-primary) transition-colors hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-on-primary-container)"
                                :disabled="loading"
                                @click="refresh"
                            >
                                <ArrowPathIcon
                                    class="h-4 w-4"
                                    :class="{ 'animate-spin': loading }"
                                />
                                {{ t("ctf.reload") }}
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="viewMode === 'calendar'" class="p-3 sm:p-4">
                    <div class="overflow-x-auto">
                        <div class="min-w-[860px]">
                            <div
                                class="grid grid-cols-7 border-l border-t border-(--md-sys-color-outline-variant)"
                            >
                                <div
                                    v-for="weekday in weekdays"
                                    :key="weekday"
                                    class="border-b border-r border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-high) px-2 py-2 text-center text-xs font-semibold text-(--md-sys-color-primary) sm:text-sm"
                                >
                                    {{ weekday }}
                                </div>

                                <div
                                    v-for="cell in calendarCells"
                                    :key="cell.key"
                                    class="border-b border-r border-(--md-sys-color-outline-variant) px-2 py-2"
                                    :class="calendarCellClass(cell)"
                                >
                                    <div class="flex items-start justify-end">
                                        <span
                                            class="text-[11px] font-semibold sm:text-sm"
                                            :class="
                                                calendarDayNumberClass(cell)
                                            "
                                        >
                                            {{ cell.date.getDate()
                                            }}{{ daySuffix }}
                                        </span>
                                    </div>

                                    <div class="mt-2 space-y-1">
                                        <a
                                            v-for="event in cell.visibleEvents"
                                            :key="`${cell.key}-${event.比赛ID}`"
                                            :href="event.比赛链接"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="flex h-7 items-center gap-1.5 overflow-hidden rounded-md border px-2 text-[12px] transition-colors hover:brightness-98"
                                            :class="
                                                calendarEventClass(
                                                    event.parsedStatus,
                                                )
                                            "
                                            :title="calendarEventTitle(event)"
                                        >
                                            <span
                                                class="shrink-0 font-semibold"
                                            >
                                                {{
                                                    formatCalendarEventTime(
                                                        event.parsedStart,
                                                    )
                                                }}
                                            </span>
                                            <span class="truncate">
                                                {{ event.比赛名称 }}
                                            </span>
                                        </a>

                                        <button
                                            v-if="cell.hiddenCount > 0"
                                            type="button"
                                            class="inline-flex h-6 items-center rounded-md px-1.5 text-[11px] font-medium text-(--md-sys-color-primary) transition-colors hover:bg-(--md-sys-color-surface-container-high)"
                                            @click="viewMode = 'list'"
                                        >
                                            {{
                                                t("ctf.page.moreEvents", {
                                                    count: cell.hiddenCount,
                                                })
                                            }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else-if="monthEvents.length" class="overflow-x-auto">
                    <table class="min-w-full table-fixed border-collapse">
                        <thead
                            class="bg-(--md-sys-color-surface-container-high)"
                        >
                            <tr>
                                <th
                                    scope="col"
                                    class="w-[34%] px-4 py-2.5 text-left text-[11px] font-semibold tracking-[0.18em] text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ t("ctf.table.event") }}
                                </th>
                                <th
                                    scope="col"
                                    class="w-[14%] px-4 py-2.5 text-left text-[11px] font-semibold tracking-[0.18em] text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ t("ctf.table.start") }}
                                </th>
                                <th
                                    scope="col"
                                    class="w-[14%] px-4 py-2.5 text-left text-[11px] font-semibold tracking-[0.18em] text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ t("ctf.table.end") }}
                                </th>
                                <th
                                    scope="col"
                                    class="w-[10%] px-4 py-2.5 text-left text-[11px] font-semibold tracking-[0.18em] text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ t("ctf.table.duration") }}
                                </th>
                                <th
                                    scope="col"
                                    class="w-[10%] px-4 py-2.5 text-left text-[11px] font-semibold tracking-[0.18em] text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ t("ctf.table.status") }}
                                </th>
                                <th
                                    scope="col"
                                    class="w-[18%] px-4 py-2.5 text-right text-[11px] font-semibold tracking-[0.18em] text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ t("ctf.table.action") }}
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            class="divide-y divide-(--md-sys-color-outline-variant/40)"
                        >
                            <tr
                                v-for="event in monthEvents"
                                :key="event.比赛ID + event.比赛名称"
                                class="transition-colors hover:bg-(--md-sys-color-surface-container)"
                            >
                                <td class="px-4 py-2.5">
                                    <div class="flex items-center gap-3">
                                        <div
                                            v-if="event.比赛标志"
                                            class="h-8 w-8 shrink-0 overflow-hidden rounded-md border border-(--md-sys-color-outline-variant/50)"
                                        >
                                            <img
                                                :src="event.比赛标志"
                                                :alt="event.比赛名称"
                                                class="h-full w-full object-cover"
                                                @error="handleImageError"
                                            />
                                        </div>
                                        <div
                                            v-else
                                            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-dashed border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container)"
                                        >
                                            <CalendarDaysIcon
                                                class="h-4 w-4 text-(--md-sys-color-on-surface-variant)"
                                            />
                                        </div>

                                        <div class="min-w-0 flex-1">
                                            <a
                                                :href="event.比赛链接"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="block truncate text-sm font-semibold text-(--md-sys-color-on-surface) transition-colors hover:text-(--md-sys-color-primary)"
                                            >
                                                {{ event.比赛名称 }}
                                            </a>
                                            <p
                                                v-if="eventMetaText(event)"
                                                class="mt-0.5 truncate text-xs text-(--md-sys-color-on-surface-variant)"
                                            >
                                                {{ eventMetaText(event) }}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td
                                    class="px-4 py-2.5 text-sm text-(--md-sys-color-on-surface)"
                                >
                                    {{ formatListDateTime(event.parsedStart) }}
                                </td>

                                <td
                                    class="px-4 py-2.5 text-sm text-(--md-sys-color-on-surface)"
                                >
                                    {{ formatListDateTime(event.parsedEnd) }}
                                </td>

                                <td
                                    class="px-4 py-2.5 text-sm text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ formatDurationFromEvent(event) }}
                                </td>

                                <td class="px-4 py-2.5">
                                    <span
                                        class="inline-flex items-center gap-2 text-xs font-semibold text-(--md-sys-color-on-surface)"
                                    >
                                        <span
                                            class="h-2 w-2 rounded-full"
                                            :class="
                                                statusDotClass(
                                                    event.parsedStatus,
                                                )
                                            "
                                        />
                                        {{
                                            t(
                                                `ctf.status.${event.parsedStatus}`,
                                            )
                                        }}
                                    </span>
                                </td>

                                <td class="px-4 py-2.5">
                                    <div
                                        class="flex items-center justify-end gap-2"
                                    >
                                        <a
                                            :href="event.比赛链接"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-1.5 rounded-md bg-(--md-sys-color-primary) px-3 py-1.5 text-xs font-semibold text-(--md-sys-color-on-primary) transition-colors hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-on-primary-container)"
                                        >
                                            <ArrowTopRightOnSquareIcon
                                                class="h-3.5 w-3.5"
                                            />
                                            {{ t("ctf.table.join") }}
                                        </a>
                                        <button
                                            v-if="event.添加日历"
                                            type="button"
                                            class="inline-flex items-center justify-center rounded-md border border-(--md-sys-color-outline-variant) p-1.5 text-(--md-sys-color-on-surface-variant) transition-colors hover:bg-(--md-sys-color-surface-container-highest) hover:text-(--md-sys-color-on-surface)"
                                            :title="
                                                t('ctf.table.addToCalendar')
                                            "
                                            @click="addToCalendar(event)"
                                        >
                                            <CalendarDaysIcon
                                                class="h-3.5 w-3.5"
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    v-else
                    class="px-4 py-16 text-center text-(--md-sys-color-on-surface-variant) sm:px-6"
                >
                    {{ t("ctf.page.monthEmpty") }}
                </div>

                <div
                    class="flex flex-col gap-3 border-t border-(--md-sys-color-outline-variant) px-4 py-4 text-sm text-(--md-sys-color-on-surface-variant) sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                >
                    <span>
                        {{
                            t("ctf.page.totalEvents", {
                                count: matchedEvents.length,
                            })
                        }}
                    </span>
                    <i18n-t keypath="ctf.sourceLabel" tag="span">
                        <template #source>
                            <a
                                href="https://github.com/ProbiusOfficial/Hello-CTFtime"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="font-medium text-(--md-sys-color-primary) hover:underline"
                            >
                                Hello-CTFTime
                            </a>
                        </template>
                    </i18n-t>
                </div>
            </div>

            <div
                class="mt-8 rounded-2xl border border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-lowest) p-6"
            >
                <h2
                    class="text-lg font-semibold text-(--md-sys-color-on-surface)"
                >
                    {{ t("ctf.page.about.title") }}
                </h2>
                <div
                    class="mt-4 space-y-3 text-sm leading-6 text-(--md-sys-color-on-surface-variant)"
                >
                    <p>{{ t("ctf.page.about.description1") }}</p>
                    <p>{{ t("ctf.page.about.description2") }}</p>
                    <p>{{ t("ctf.page.about.description3") }}</p>
                </div>
                <div class="mt-6">
                    <a
                        href="https://github.com/ProbiusOfficial/Hello-CTFtime"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 text-sm font-medium text-(--md-sys-color-primary) hover:underline"
                    >
                        <InformationCircleIcon class="h-4 w-4" />
                        {{ t("ctf.page.about.learnMore") }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
    ArrowPathIcon,
    ArrowTopRightOnSquareIcon,
    CalendarDaysIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
} from "@heroicons/vue/24/outline";
import AnzuProgressRing from "@/components/AnzuProgressRing.vue";

type EventStatus = "oncoming" | "running" | "finished" | "unknown";
type EventRegion = "domestic" | "foreign";
type ViewMode = "calendar" | "list";

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
    比赛详情?: string;
    地区?: EventRegion;
}

interface RawDomesticCTFEvent {
    id?: string | number;
    name?: string;
    link?: string;
    status?: string;
    type?: string;
    comp_time_start?: string;
    comp_time_end?: string;
    organizer?: string;
    readmore?: string;
}

interface RawDomesticResponse {
    success?: boolean;
    data?: {
        result?: RawDomesticCTFEvent[];
    };
}

interface ParsedCTFEvent extends RawCTFEvent {
    parsedStart: Date;
    parsedEnd: Date | null;
    parsedEffectiveEnd: Date;
    parsedStatus: EventStatus;
    parsedRegion: EventRegion;
}

interface CalendarCell {
    key: string;
    date: Date;
    inCurrentMonth: boolean;
    isToday: boolean;
    visibleEvents: ParsedCTFEvent[];
    hiddenCount: number;
}

const TIME_SEPARATOR = " - ";
const CALENDAR_EVENT_LIMIT = 3;
const GLOBAL_SOURCE_URL =
    "https://raw.githubusercontent.com/ProbiusOfficial/Hello-CTFtime/main/Global.json";
const DOMESTIC_SOURCE_URL =
    "https://raw.githubusercontent.com/ProbiusOfficial/Hello-CTFtime/main/CN.json";

const { locale, t } = useI18n();

definePageMeta({
    showLeftSidebar: false,
    showRightSidebar: false,
});

useHead({
    title: t("ctf.page.meta.title"),
    meta: [
        {
            name: "description",
            content: t("ctf.page.meta.description"),
        },
    ],
});

const events = ref<RawCTFEvent[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const viewMode = ref<ViewMode>("calendar");
const regionFilter = ref<EventRegion | "all">("all");
const monthCursor = ref(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
);
const activeStatusFilters = ref<Set<EventStatus>>(
    new Set(["oncoming", "running", "finished"]),
);

const displayLocale = computed(() => {
    const currentLocale = locale.value.toLowerCase();

    if (currentLocale.startsWith("en")) return "en-US";
    if (currentLocale.startsWith("ja")) return "ja-JP";
    if (currentLocale.startsWith("ko")) return "ko-KR";
    return "zh-CN";
});

const daySuffix = computed(() => (locale.value.startsWith("zh") ? "日" : ""));

const weekdays = computed(() => [
    t("calendar.weekdays.sun"),
    t("calendar.weekdays.mon"),
    t("calendar.weekdays.tue"),
    t("calendar.weekdays.wed"),
    t("calendar.weekdays.thu"),
    t("calendar.weekdays.fri"),
    t("calendar.weekdays.sat"),
]);

const statusFilters = computed(() => [
    { key: "running" as EventStatus, label: t("ctf.status.running") },
    { key: "oncoming" as EventStatus, label: t("ctf.status.oncoming") },
    { key: "finished" as EventStatus, label: t("ctf.status.finished") },
]);

const padDateSegment = (value: string | number) =>
    String(value).padStart(2, "0");

const normalizeDomesticDateText = (value?: string) => {
    if (!value) return "";

    const trimmed = value.trim();
    const chineseDateMatch = trimmed.match(
        /^(\d{4})[年/-](\d{1,2})[月/-](\d{1,2})日?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
    );

    if (!chineseDateMatch) return trimmed;

    const [, year, month, day, hour, minute, second] = chineseDateMatch;
    const normalizedTime = `${padDateSegment(hour)}:${minute}${
        second ? `:${second}` : ""
    }`;

    return `${year}-${padDateSegment(month)}-${padDateSegment(day)} ${normalizedTime}`;
};

const normalizeDateInput = (value: string) => {
    return value
        .trim()
        .replace(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2}(?::\d{2})?)/, "$1T$2")
        .replace(
            /\s*UTC([+-]\d{1,2})(?::?(\d{2}))?$/i,
            (_, hours: string, minutes?: string) => {
                const sign = hours.startsWith("-") ? "-" : "+";
                const normalizedHours = hours
                    .replace(/[+-]/, "")
                    .padStart(2, "0");
                return `${sign}${normalizedHours}:${minutes ?? "00"}`;
            },
        );
};

const parseDate = (value: string) => {
    if (!value) return null;

    const parsed = new Date(normalizeDateInput(value));
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed;
};

const formatDayKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, amount: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
};

const startOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

const isExactMidnight = (date: Date) =>
    date.getHours() === 0 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 0 &&
    date.getMilliseconds() === 0;

const getEventWindow = (timeRange: string) => {
    const separatorIndex = timeRange.indexOf(TIME_SEPARATOR);

    if (separatorIndex === -1) {
        const startDate = parseDate(timeRange.trim());

        return {
            startDate,
            endDate: null,
        };
    }

    const startText = timeRange.slice(0, separatorIndex).trim();
    const endText = timeRange
        .slice(separatorIndex + TIME_SEPARATOR.length)
        .trim();

    return {
        startDate: parseDate(startText),
        endDate: parseDate(endText),
    };
};

const deriveStatusFromTime = (startDate: Date, endDate: Date | null) => {
    const now = Date.now();
    const effectiveEnd = endDate ?? startDate;

    if (now < startDate.getTime()) return "oncoming";
    if (now <= effectiveEnd.getTime()) return "running";
    return "finished";
};

const statusKey = (
    event: RawCTFEvent,
    startDate: Date,
    endDate: Date | null,
): EventStatus => {
    const rawStatus = (event.比赛状态 || "").toLowerCase();

    if (rawStatus === "未开始" || rawStatus === "即将开始") return "oncoming";
    if (rawStatus === "oncoming") return "oncoming";
    if (rawStatus === "进行中" || rawStatus === "正在进行") return "running";
    if (rawStatus === "running") return "running";
    if (
        rawStatus === "已结束" ||
        rawStatus === "已经结束" ||
        rawStatus === "finished" ||
        rawStatus === "over" ||
        rawStatus === "done"
    ) {
        return "finished";
    }

    return deriveStatusFromTime(startDate, endDate);
};

const regionKey = (event: RawCTFEvent): EventRegion => {
    return event.地区 ?? "foreign";
};

const parsedEvents = computed<ParsedCTFEvent[]>(() => {
    return events.value
        .map((event) => {
            const { startDate, endDate } = getEventWindow(event.比赛时间);
            if (!startDate) return null;

            const effectiveEnd = endDate
                ? isExactMidnight(endDate)
                    ? new Date(endDate.getTime() - 1)
                    : endDate
                : startDate;

            return {
                ...event,
                parsedStart: startDate,
                parsedEnd: endDate,
                parsedEffectiveEnd: effectiveEnd,
                parsedStatus: statusKey(event, startDate, endDate),
                parsedRegion: regionKey(event),
            };
        })
        .filter((event): event is ParsedCTFEvent => event !== null);
});

const eventSortValue = (status: EventStatus) => {
    switch (status) {
        case "running":
            return 0;
        case "oncoming":
            return 1;
        case "finished":
            return 2;
        default:
            return 3;
    }
};

const matchesRegionFilter = (event: ParsedCTFEvent) => {
    return (
        regionFilter.value === "all" ||
        event.parsedRegion === regionFilter.value
    );
};

const matchedEvents = computed(() => {
    return [...parsedEvents.value]
        .filter(
            (event) =>
                activeStatusFilters.value.has(event.parsedStatus) &&
                matchesRegionFilter(event),
        )
        .sort((leftEvent, rightEvent) => {
            const statusDelta =
                eventSortValue(leftEvent.parsedStatus) -
                eventSortValue(rightEvent.parsedStatus);
            if (statusDelta !== 0) return statusDelta;

            return (
                leftEvent.parsedStart.getTime() -
                rightEvent.parsedStart.getTime()
            );
        });
});

const monthStart = computed(() => startOfMonth(monthCursor.value));
const nextMonthStart = computed(
    () =>
        new Date(
            monthCursor.value.getFullYear(),
            monthCursor.value.getMonth() + 1,
            1,
        ),
);

const monthEvents = computed(() => {
    return matchedEvents.value
        .filter(
            (event) =>
                event.parsedEffectiveEnd.getTime() >=
                    monthStart.value.getTime() &&
                event.parsedStart.getTime() < nextMonthStart.value.getTime(),
        )
        .sort(
            (leftEvent, rightEvent) =>
                leftEvent.parsedStart.getTime() -
                rightEvent.parsedStart.getTime(),
        );
});

const eventsByDay = computed<Record<string, ParsedCTFEvent[]>>(() => {
    const map: Record<string, ParsedCTFEvent[]> = {};

    for (const event of matchedEvents.value) {
        let cursor = startOfDay(event.parsedStart);
        const lastDay = startOfDay(event.parsedEffectiveEnd);

        while (cursor.getTime() <= lastDay.getTime()) {
            const key = formatDayKey(cursor);
            const list = map[key] ?? (map[key] = []);
            list.push(event);
            cursor = addDays(cursor, 1);
        }
    }

    for (const key of Object.keys(map)) {
        map[key]?.sort((leftEvent, rightEvent) => {
            const startDelta =
                leftEvent.parsedStart.getTime() -
                rightEvent.parsedStart.getTime();
            if (startDelta !== 0) return startDelta;

            return leftEvent.比赛名称.localeCompare(rightEvent.比赛名称);
        });
    }

    return map;
});

const todayKey = computed(() => formatDayKey(new Date()));

const calendarCells = computed<CalendarCell[]>(() => {
    const firstDay = new Date(
        monthCursor.value.getFullYear(),
        monthCursor.value.getMonth(),
        1,
    );
    const leadingDays = firstDay.getDay();
    const gridStart = addDays(firstDay, -leadingDays);

    return Array.from({ length: 42 }, (_, index) => {
        const date = addDays(gridStart, index);
        const dayEvents = eventsByDay.value[formatDayKey(date)] ?? [];

        return {
            key: formatDayKey(date),
            date,
            inCurrentMonth: date.getMonth() === monthCursor.value.getMonth(),
            isToday: formatDayKey(date) === todayKey.value,
            visibleEvents: dayEvents.slice(0, CALENDAR_EVENT_LIMIT),
            hiddenCount: Math.max(0, dayEvents.length - CALENDAR_EVENT_LIMIT),
        };
    });
});

const displayedMonthLabel = computed(() => {
    return new Intl.DateTimeFormat(displayLocale.value, {
        year: "numeric",
        month: "long",
    }).format(monthCursor.value);
});

const formatListDateTime = (date: Date | null) => {
    if (!date) return "--";

    return new Intl.DateTimeFormat(displayLocale.value, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
};

const formatCalendarEventTime = (date: Date) => {
    return new Intl.DateTimeFormat(displayLocale.value, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
};

const formatDurationFromEvent = (event: ParsedCTFEvent) => {
    const endDate = event.parsedEnd ?? event.parsedStart;
    const diffMilliseconds = endDate.getTime() - event.parsedStart.getTime();

    if (diffMilliseconds <= 0) return t("ctf.page.duration.single");

    const totalHours = Math.max(
        1,
        Math.round(diffMilliseconds / (1000 * 60 * 60)),
    );

    if (totalHours < 24) {
        return t("ctf.page.duration.hours", { hours: totalHours });
    }

    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;

    if (remainingHours === 0) {
        if (days === 1) return t("ctf.page.duration.day");
        return t("ctf.page.duration.days", { days });
    }

    return t("ctf.page.duration.dayHours", {
        days,
        hours: remainingHours,
    });
};

const eventMetaText = (event: RawCTFEvent) => {
    return [
        event.赛事主办,
        event.比赛形式,
        event.比赛权重 ? `W:${event.比赛权重}` : null,
    ]
        .filter(Boolean)
        .join(" / ");
};

const calendarEventTitle = (event: ParsedCTFEvent) => {
    return [
        event.比赛名称,
        `${t("ctf.table.start")}: ${formatListDateTime(event.parsedStart)}`,
        `${t("ctf.table.end")}: ${formatListDateTime(event.parsedEnd)}`,
        `${t("ctf.table.duration")}: ${formatDurationFromEvent(event)}`,
    ].join("\n");
};

const statusDotClass = (status: EventStatus) => {
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

const statusBadgeClass = (status: EventStatus) => {
    switch (status) {
        case "running":
            return "bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container)";
        case "finished":
            return "bg-(--md-sys-color-tertiary-container) text-(--md-sys-color-on-tertiary-container)";
        case "oncoming":
            return "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)";
        default:
            return "bg-(--md-sys-color-surface-container-highest) text-(--md-sys-color-on-surface-variant)";
    }
};

const statusFilterClass = (status: EventStatus) => {
    if (activeStatusFilters.value.has(status)) {
        return `${statusBadgeClass(status)} border-transparent`;
    }

    return "border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-highest)";
};

const regionFilterClass = (region: EventRegion) => {
    if (regionFilter.value === region) {
        return "border-(--md-sys-color-primary) bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) shadow-sm";
    }

    return "border-(--md-sys-color-primary)/35 bg-(--md-sys-color-surface) text-(--md-sys-color-primary) hover:bg-(--md-sys-color-surface-container-high)";
};

const viewToggleClass = (mode: ViewMode) => {
    return viewMode.value === mode
        ? "bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) shadow-sm"
        : "text-(--md-sys-color-primary) hover:bg-(--md-sys-color-surface-container-high)";
};

const calendarCellClass = (cell: CalendarCell) => {
    if (cell.isToday) {
        return "min-h-[7.5rem] bg-(--md-sys-color-secondary-container/45)";
    }

    if (!cell.inCurrentMonth) {
        return "min-h-[7.5rem] bg-(--md-sys-color-surface-container-low)";
    }

    return "min-h-[7.5rem] bg-(--md-sys-color-surface-container-lowest)";
};

const calendarDayNumberClass = (cell: CalendarCell) => {
    if (cell.isToday) {
        return "text-(--md-sys-color-primary)";
    }

    if (!cell.inCurrentMonth) {
        return "text-(--md-sys-color-on-surface-variant/60)";
    }

    return "text-(--md-sys-color-on-surface)";
};

const calendarEventClass = (status: EventStatus) => {
    switch (status) {
        case "running":
            return "border-(--md-sys-color-primary) bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container)";
        case "finished":
            return "border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface-container-high) text-(--md-sys-color-on-surface-variant)";
        case "oncoming":
            return "border-(--md-sys-color-primary)/40 bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface)";
        default:
            return "border-(--md-sys-color-outline-variant) bg-(--md-sys-color-surface) text-(--md-sys-color-on-surface-variant)";
    }
};

const getStatusCount = (status: EventStatus) => {
    return parsedEvents.value.filter(
        (event) => event.parsedStatus === status && matchesRegionFilter(event),
    ).length;
};

const toggleStatusFilter = (status: EventStatus) => {
    if (activeStatusFilters.value.has(status)) {
        activeStatusFilters.value.delete(status);

        if (activeStatusFilters.value.size === 0) {
            activeStatusFilters.value.add("oncoming");
        }

        return;
    }

    activeStatusFilters.value.add(status);
};

const toggleRegionFilter = (region: EventRegion) => {
    regionFilter.value = regionFilter.value === region ? "all" : region;
};

const gotoPrevMonth = () => {
    monthCursor.value = new Date(
        monthCursor.value.getFullYear(),
        monthCursor.value.getMonth() - 1,
        1,
    );
};

const gotoNextMonth = () => {
    monthCursor.value = new Date(
        monthCursor.value.getFullYear(),
        monthCursor.value.getMonth() + 1,
        1,
    );
};

const handleImageError = (event: Event) => {
    const image = event.target as HTMLImageElement;
    image.style.display = "none";
};

const addToCalendar = (event: RawCTFEvent) => {
    if (!event.添加日历) return;
    window.open(event.添加日历, "_blank");
};

const createDomesticTimeRange = (
    startText?: string,
    endText?: string,
): string | null => {
    const normalizedStart = normalizeDomesticDateText(startText);
    const normalizedEnd = normalizeDomesticDateText(endText);

    if (!normalizedStart) return null;
    if (!normalizedEnd) return normalizedStart;

    return `${normalizedStart}${TIME_SEPARATOR}${normalizedEnd}`;
};

const normalizeGlobalEvents = (payload: unknown): RawCTFEvent[] => {
    if (!Array.isArray(payload)) return [];

    return payload
        .filter(
            (item): item is RawCTFEvent =>
                !!item &&
                typeof item === "object" &&
                "比赛名称" in item &&
                "比赛时间" in item &&
                "比赛链接" in item,
        )
        .map((event) => ({
            ...event,
            地区: "foreign" as EventRegion,
        }));
};

const normalizeDomesticEvents = (payload: unknown): RawCTFEvent[] => {
    const response = payload as RawDomesticResponse;
    const result = response?.data?.result;

    if (!Array.isArray(result)) return [];

    return result
        .map((event, index) => {
            const eventName = event.name?.trim();
            const eventLink = event.link?.trim();
            const timeRange = createDomesticTimeRange(
                event.comp_time_start,
                event.comp_time_end,
            );

            if (!eventName || !eventLink || !timeRange) {
                return null;
            }

            return {
                比赛名称: eventName,
                比赛时间: timeRange,
                比赛形式: event.type?.trim(),
                比赛链接: eventLink,
                赛事主办: event.organizer?.trim(),
                比赛ID: `cn-${event.id ?? index}-${eventName}`,
                比赛状态: event.status?.trim(),
                比赛详情: event.readmore?.trim(),
                地区: "domestic" as EventRegion,
            };
        })
        .filter((event): event is RawCTFEvent => event !== null);
};

const fetchJson = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(response.statusText || `HTTP ${response.status}`);
    }

    return response.json() as Promise<T>;
};

const fetchEvents = async () => {
    loading.value = true;
    error.value = null;

    try {
        const [globalPayload, domesticPayload] = await Promise.all([
            fetchJson<unknown>(GLOBAL_SOURCE_URL),
            fetchJson<unknown>(DOMESTIC_SOURCE_URL),
        ]);

        events.value = [
            ...normalizeDomesticEvents(domesticPayload),
            ...normalizeGlobalEvents(globalPayload),
        ];
    } catch (fetchError) {
        console.error(fetchError);
        error.value = (fetchError as Error).message || t("ctf.page.fetchError");
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

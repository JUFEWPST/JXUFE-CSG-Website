<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto max-w-5xl space-y-6">
            <div
                v-if="loading"
                class="flex min-h-72 flex-col items-center justify-center gap-4 text-center text-(--md-sys-color-on-surface-variant)"
            >
                <AnzuProgressRing :size="56" status="loading" />
                <p class="text-sm sm:text-base">
                    {{ t("pages.ctf.events.loading") }}
                </p>
            </div>

            <div
                v-else-if="error"
                class="space-y-4 rounded-xl bg-(--md-sys-color-error-container)/60 p-5 text-(--md-sys-color-on-error-container)"
            >
                <div class="flex items-start gap-3">
                    <ExclamationTriangleIcon class="mt-0.5 h-5 w-5 shrink-0" />
                    <div class="space-y-2">
                        <p class="font-semibold">
                            {{ t("pages.ctf.events.error") }}
                        </p>
                        <p class="text-sm opacity-80">{{ error }}</p>
                    </div>
                </div>
                <AnzuButton
                    variant="filled"
                    class="h-9! min-w-0! px-4!"
                    @click="refresh"
                    >{{ t("common.actions.reload") }}</AnzuButton
                >
            </div>

            <section v-else class="space-y-5">
                <header
                    class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
                >
                    <div class="flex flex-wrap items-center gap-2 sm:gap-4">
                        <AnzuSelector
                            v-model="regionFilter"
                            :options="[
                                {
                                    label: t('pages.ctf.events.filters.all'),
                                    value: 'all',
                                },
                                {
                                    label: t(
                                        'pages.ctf.events.filters.domestic',
                                    ),
                                    value: 'domestic',
                                },
                                {
                                    label: t(
                                        'pages.ctf.events.filters.foreign',
                                    ),
                                    value: 'foreign',
                                },
                            ]"
                        />

                        <!-- 分割线 -->
                        <div
                            class="h-4 w-px bg-(--md-sys-color-outline-variant)/40"
                        />

                        <AnzuSelector
                            v-model="viewMode"
                            :options="[
                                {
                                    label: t('pages.ctf.events.view.calendar'),
                                    value: 'calendar',
                                },
                                {
                                    label: t('pages.ctf.events.view.list'),
                                    value: 'list',
                                },
                            ]"
                        />
                    </div>

                    <div
                        class="flex flex-wrap items-center gap-3 lg:justify-end"
                    >
                        <div
                            v-if="viewMode === 'calendar'"
                            class="flex items-center gap-2"
                        >
                            <AnzuButton
                                variant="text"
                                class="h-9! w-9! min-w-9! px-0!"
                                :aria-label="t('calendar.actions.prevMonth')"
                                @click="gotoPrevMonth"
                            >
                                <ChevronLeftIcon class="h-4 w-4" />
                            </AnzuButton>
                            <p
                                class="min-w-32 text-center text-base font-semibold text-(--md-sys-color-on-surface)"
                            >
                                {{ displayedMonthLabel }}
                            </p>
                            <AnzuButton
                                variant="text"
                                class="h-9! w-9! min-w-9! px-0!"
                                :aria-label="t('calendar.actions.nextMonth')"
                                @click="gotoNextMonth"
                            >
                                <ChevronRightIcon class="h-4 w-4" />
                            </AnzuButton>
                        </div>
                        <AnzuButton
                            variant="text"
                            class="h-9! min-w-0! px-4!"
                            :disabled="loading"
                            @click="refresh"
                        >
                            <ArrowPathRoundedSquareIcon
                                class="h-4 w-4"
                                :class="{ 'animate-spin': loading }"
                            />
                            {{ t("common.actions.reload") }}
                        </AnzuButton>
                    </div>
                </header>

                <div class="text-sm text-(--md-sys-color-on-surface-variant)">
                    <span>{{ summaryText }}</span>
                </div>

                <p
                    class="mt-2 text-[11px] text-(--md-sys-color-on-surface-variant)"
                >
                    <i18n-t keypath="pages.ctf.events.sourceLabel" tag="span">
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

                <div v-if="viewMode === 'calendar'" class="space-y-4">
                    <div
                        class="grid grid-cols-7 border border-(--md-sys-color-outline-variant)/60 sm:hidden"
                    >
                        <div
                            v-for="(weekday, weekdayIndex) in compactWeekdays"
                            :key="`compact-${weekdayIndex}`"
                            class="border-b border-r border-(--md-sys-color-outline-variant)/60 px-1 py-1.5 text-center text-[10px] font-medium text-(--md-sys-color-on-surface-variant) last:border-r-0"
                        >
                            {{ weekday }}
                        </div>
                        <div
                            v-for="cell in calendarCells"
                            :key="`mobile-${cell.key}`"
                            class="border-b border-r border-(--md-sys-color-outline-variant)/60"
                            :class="mobileCalendarCellClass(cell)"
                        >
                            <button
                                v-if="cell.eventCount > 0"
                                type="button"
                                class="flex h-full w-full flex-col p-2 text-left"
                                @click="openMobileDaySheet(cell.date)"
                            >
                                <div
                                    class="flex items-start justify-between gap-1"
                                >
                                    <span
                                        class="text-sm font-semibold leading-none"
                                        :class="calendarDayNumberClass(cell)"
                                    >
                                        {{ cell.date.getDate() }}
                                    </span>
                                    <span
                                        class="shrink-0 rounded-full bg-(--md-sys-color-surface-container-highest) px-1.5 text-[10px] leading-4 text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ cell.eventCount }}
                                    </span>
                                </div>
                                <div class="mt-2 space-y-2">
                                    <div class="flex items-center gap-1.5">
                                        <span
                                            v-for="(
                                                event, eventIndex
                                            ) in cell.visibleEvents"
                                            :key="`mobile-dot-${cell.key}-${eventIndex}`"
                                            class="h-2 w-2 rounded-full"
                                            :class="
                                                statusDotClass(
                                                    event.parsedStatus,
                                                )
                                            "
                                        />
                                    </div>
                                    <p
                                        class="text-xs font-medium leading-4 text-(--md-sys-color-primary)"
                                    >
                                        {{
                                            t(
                                                "pages.ctf.events.summary.dayEventsShort",
                                                {
                                                    count: cell.eventCount,
                                                },
                                            )
                                        }}
                                    </p>
                                </div>
                            </button>
                            <div v-else class="p-2">
                                <div
                                    class="flex items-start justify-between gap-1"
                                >
                                    <span
                                        class="text-sm font-semibold leading-none"
                                        :class="calendarDayNumberClass(cell)"
                                    >
                                        {{ cell.date.getDate() }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="hidden overflow-hidden border border-(--md-sys-color-outline-variant)/60 sm:block"
                    >
                        <div
                            class="grid grid-cols-7 border-b border-(--md-sys-color-outline-variant)/60"
                        >
                            <div
                                v-for="weekday in weekdays"
                                :key="weekday"
                                class="border-r border-(--md-sys-color-outline-variant)/60 px-2 py-2 text-center text-xs font-medium text-(--md-sys-color-on-surface-variant) last:border-r-0"
                            >
                                {{ weekday }}
                            </div>
                        </div>
                        <div
                            v-for="week in calendarWeeks"
                            :key="week.key"
                            class="relative grid grid-cols-7 border-b border-(--md-sys-color-outline-variant)/60 last:border-b-0"
                        >
                            <div
                                v-for="(cell, dayIndex) in week.days"
                                :key="cell.key"
                                class="relative border-r border-(--md-sys-color-outline-variant)/60 p-2 last:border-r-0"
                                :class="calendarCellClass(cell)"
                                :style="desktopCalendarRowStyle(week)"
                            >
                                <div class="flex justify-end">
                                    <span
                                        class="text-xs font-medium sm:text-sm"
                                        :class="calendarDayNumberClass(cell)"
                                        >{{ cell.date.getDate() }}</span
                                    >
                                </div>
                                <div
                                    class="mt-1.5"
                                    :style="desktopCalendarSpacerStyle(week)"
                                />
                                <button
                                    v-if="
                                        (week.hiddenCounts?.[dayIndex] || 0) > 0
                                    "
                                    type="button"
                                    class="text-xs font-medium text-(--md-sys-color-primary) underline-offset-4 hover:underline"
                                    @click="openListForDay(cell.date)"
                                >
                                    {{
                                        t(
                                            "pages.ctf.events.summary.moreEvents",
                                            {
                                                count:
                                                    week.hiddenCounts?.[
                                                        dayIndex
                                                    ] || 0,
                                            },
                                        )
                                    }}
                                </button>
                            </div>
                            <div class="pointer-events-none absolute inset-0">
                                <a
                                    v-for="segment in week.segments"
                                    :key="segment.key"
                                    :href="segment.event.比赛链接"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="pointer-events-auto absolute flex h-6 items-center px-2 text-[11px] font-medium leading-4 transition-opacity hover:opacity-85"
                                    :class="
                                        desktopCalendarSegmentClass(segment)
                                    "
                                    :style="
                                        desktopCalendarSegmentStyle(segment)
                                    "
                                    :title="calendarEventTitle(segment.event)"
                                >
                                    <span class="truncate">{{
                                        segment.event.比赛名称
                                    }}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="!monthEvents.length"
                        class="py-12 text-center text-sm text-(--md-sys-color-on-surface-variant)"
                    >
                        <p
                            class="text-base font-medium text-(--md-sys-color-on-surface)"
                        >
                            {{ t("pages.ctf.events.empty") }}
                        </p>
                        <p class="mt-2">
                            {{ t("pages.ctf.events.summary.monthEmpty") }}
                        </p>
                    </div>
                </div>

                <div v-else class="space-y-4">
                    <div v-if="matchedEvents.length" class="space-y-4">
                        <div class="hidden lg:block overflow-x-auto">
                            <table
                                class="min-w-full table-fixed border-collapse"
                            >
                                <thead>
                                    <tr
                                        class="border-b border-(--md-sys-color-outline-variant)/60 text-left"
                                    >
                                        <th
                                            class="w-[42%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-(--md-sys-color-on-surface-variant)"
                                        >
                                            {{
                                                t(
                                                    "pages.ctf.events.table.event",
                                                )
                                            }}
                                        </th>
                                        <th
                                            class="w-[20%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-(--md-sys-color-on-surface-variant)"
                                        >
                                            {{
                                                t("pages.ctf.events.table.time")
                                            }}
                                        </th>
                                        <th
                                            class="w-[12%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-(--md-sys-color-on-surface-variant)"
                                        >
                                            {{
                                                t(
                                                    "pages.ctf.events.table.duration",
                                                )
                                            }}
                                        </th>
                                        <th
                                            class="w-[8%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-(--md-sys-color-on-surface-variant)"
                                        >
                                            {{
                                                t(
                                                    "pages.ctf.events.table.status",
                                                )
                                            }}
                                        </th>
                                        <th
                                            class="w-[18%] px-3 py-2 text-right text-[11px] font-medium tracking-[0.14em] text-(--md-sys-color-on-surface-variant)"
                                        >
                                            {{
                                                t(
                                                    "pages.ctf.events.table.action",
                                                )
                                            }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="divide-y divide-(--md-sys-color-outline-variant)/40"
                                >
                                    <tr
                                        v-for="event in paginatedEvents"
                                        :key="event.比赛ID"
                                        class="transition-colors hover:bg-(--md-sys-color-surface-container)/45"
                                    >
                                        <td class="px-3 py-3 align-top">
                                            <a
                                                :href="event.比赛链接"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="block truncate text-sm font-semibold text-(--md-sys-color-on-surface) underline-offset-4 hover:text-(--md-sys-color-primary) hover:underline"
                                                >{{ event.比赛名称 }}</a
                                            >
                                            <p
                                                v-if="eventMetaText(event)"
                                                class="mt-1 truncate text-xs text-(--md-sys-color-on-surface-variant)"
                                            >
                                                {{ eventMetaText(event) }}
                                            </p>
                                        </td>
                                        <td
                                            class="px-3 py-3 text-sm text-(--md-sys-color-on-surface)"
                                        >
                                            <div class="space-y-1">
                                                <p>
                                                    {{
                                                        formatTableDateRange(
                                                            event,
                                                        )
                                                    }}
                                                </p>
                                                <p
                                                    class="text-xs text-(--md-sys-color-on-surface-variant)"
                                                >
                                                    {{
                                                        t(
                                                            `pages.ctf.events.status.${event.parsedStatus}`,
                                                        )
                                                    }}
                                                </p>
                                            </div>
                                        </td>
                                        <td
                                            class="px-3 py-3 text-sm text-(--md-sys-color-on-surface-variant)"
                                        >
                                            {{ formatDurationFromEvent(event) }}
                                        </td>
                                        <td class="px-3 py-3">
                                            <span
                                                class="inline-flex items-center justify-center"
                                            >
                                                <span
                                                    class="h-2.5 w-2.5 rounded-full"
                                                    :class="
                                                        statusDotClass(
                                                            event.parsedStatus,
                                                        )
                                                    "
                                                />
                                            </span>
                                        </td>
                                        <td class="px-3 py-3">
                                            <div
                                                class="flex items-center justify-end gap-2"
                                            >
                                                <AnzuButton
                                                    variant="filled"
                                                    class="h-9! min-w-24! shrink-0 whitespace-nowrap px-4! text-sm!"
                                                    :href="event.比赛链接"
                                                    target="_blank"
                                                >
                                                    <ArrowUpRightIcon
                                                        class="h-4 w-4"
                                                    />
                                                    {{
                                                        t(
                                                            "pages.ctf.events.table.join",
                                                        )
                                                    }}
                                                </AnzuButton>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="space-y-3 lg:hidden">
                            <article
                                v-for="event in paginatedEvents"
                                :key="`${event.比赛ID}-mobile`"
                                class="py-4 border-b border-(--md-sys-color-outline-variant)/40 last:border-0"
                            >
                                <div class="space-y-2">
                                    <a
                                        :href="event.比赛链接"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="block text-base font-semibold text-(--md-sys-color-on-surface) underline-offset-4 hover:text-(--md-sys-color-primary) hover:underline"
                                    >
                                        {{ event.比赛名称 }}
                                    </a>
                                    <p
                                        v-if="eventMetaText(event)"
                                        class="text-xs text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ eventMetaText(event) }}
                                    </p>
                                </div>

                                <div
                                    class="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-(--md-sys-color-on-surface-variant)"
                                >
                                    <div class="space-y-0.5">
                                        <p class="font-medium">
                                            {{
                                                t(
                                                    "pages.ctf.events.table.start",
                                                )
                                            }}
                                        </p>
                                        <p
                                            class="text-(--md-sys-color-on-surface)"
                                        >
                                            {{
                                                formatListDateTime(
                                                    event.parsedStart,
                                                )
                                            }}
                                        </p>
                                    </div>
                                    <div class="space-y-0.5">
                                        <p class="font-medium">
                                            {{
                                                t("pages.ctf.events.table.end")
                                            }}
                                        </p>
                                        <p
                                            class="text-(--md-sys-color-on-surface)"
                                        >
                                            {{
                                                formatListDateTime(
                                                    event.parsedEnd,
                                                )
                                            }}
                                        </p>
                                    </div>
                                    <div class="space-y-0.5">
                                        <p class="font-medium">
                                            {{
                                                t(
                                                    "pages.ctf.events.table.duration",
                                                )
                                            }}
                                        </p>
                                        <p
                                            class="text-(--md-sys-color-on-surface)"
                                        >
                                            {{ formatDurationFromEvent(event) }}
                                        </p>
                                    </div>
                                    <div class="space-y-0.5">
                                        <p class="font-medium">
                                            {{
                                                t(
                                                    "pages.ctf.events.table.status",
                                                )
                                            }}
                                        </p>
                                        <span
                                            class="inline-flex items-center gap-2 text-(--md-sys-color-on-surface)"
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
                                                    `pages.ctf.events.status.${event.parsedStatus}`,
                                                )
                                            }}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    class="mt-4 flex items-center justify-end gap-2"
                                >
                                    <AnzuButton
                                        variant="filled"
                                        class="h-10! min-w-24! shrink-0 whitespace-nowrap px-4!"
                                        :href="event.比赛链接"
                                        target="_blank"
                                    >
                                        <ArrowUpRightIcon class="h-4 w-4" />
                                        {{ t("pages.ctf.events.table.join") }}
                                    </AnzuButton>
                                </div>
                            </article>
                        </div>
                    </div>

                    <div
                        v-else
                        class="py-12 text-center text-sm text-(--md-sys-color-on-surface-variant)"
                    >
                        <p
                            class="text-base font-medium text-(--md-sys-color-on-surface)"
                        >
                            {{ t("pages.ctf.events.empty") }}
                        </p>
                        <p class="mt-2">
                            {{ t("pages.ctf.events.emptyHint") }}
                        </p>
                    </div>

                    <div class="flex justify-center">
                        <AnzuPagination
                            v-if="matchedEvents.length && totalPages > 1"
                            :total-pages="totalPages"
                            :current-page="currentPage"
                            :loading="loading"
                        />
                    </div>
                </div>
            </section>
        </div>
    </main>
    <Teleport to="body">
        <div
            v-if="mobileDaySheetOpen"
            class="fixed inset-0 z-50 sm:hidden"
            aria-modal="true"
            role="dialog"
        >
            <button
                type="button"
                class="absolute inset-0 bg-black/35"
                :aria-label="t('common.actions.close')"
                @click="closeMobileDaySheet"
            />
            <div
                class="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-(--md-sys-color-surface-container-lowest) px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4 shadow-2xl"
            >
                <div class="flex items-start justify-between gap-3">
                    <div class="space-y-1">
                        <p
                            class="text-base font-semibold text-(--md-sys-color-on-surface)"
                        >
                            {{ selectedMobileDayLabel }}
                        </p>
                        <p
                            class="text-sm text-(--md-sys-color-on-surface-variant)"
                        >
                            {{
                                t("pages.ctf.events.sheet.daySummary", {
                                    count: selectedMobileDayEvents.length,
                                })
                            }}
                        </p>
                    </div>
                    <AnzuButton
                        variant="text"
                        class="h-9! w-9! min-w-9! shrink-0 px-0!"
                        :aria-label="t('common.actions.close')"
                        @click="closeMobileDaySheet"
                    >
                        <XMarkIcon class="h-4 w-4" />
                    </AnzuButton>
                </div>

                <div
                    class="mt-4"
                    v-if="selectedMobileDay && selectedMobileDayEvents.length"
                >
                    <AnzuButton
                        variant="text"
                        class="h-9! min-w-0! px-4!"
                        @click="
                            openListForDay(selectedMobileDay, {
                                closeMobileSheet: true,
                            })
                        "
                    >
                        {{ t("pages.ctf.events.sheet.openList") }}
                    </AnzuButton>
                </div>

                <div
                    class="mt-4 space-y-3"
                    v-if="selectedMobileDayEvents.length"
                >
                    <article
                        v-for="event in selectedMobileDayEvents"
                        :key="`sheet-${event.比赛ID}`"
                        class="py-4 border-b border-(--md-sys-color-outline-variant)/40 last:border-0"
                    >
                        <div class="space-y-2">
                            <div class="flex items-start justify-between gap-3">
                                <div class="space-y-1">
                                    <p
                                        class="text-base font-semibold text-(--md-sys-color-on-surface)"
                                    >
                                        {{ event.比赛名称 }}
                                    </p>
                                    <p
                                        v-if="eventMetaText(event)"
                                        class="text-xs text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ eventMetaText(event) }}
                                    </p>
                                </div>
                                <span
                                    class="inline-flex items-center gap-2 rounded-full bg-(--md-sys-color-surface-container-high) px-2.5 py-1 text-xs font-medium text-(--md-sys-color-on-surface)"
                                >
                                    <span
                                        class="h-2 w-2 rounded-full"
                                        :class="
                                            statusDotClass(event.parsedStatus)
                                        "
                                    />
                                    {{
                                        t(
                                            `pages.ctf.events.status.${event.parsedStatus}`,
                                        )
                                    }}
                                </span>
                            </div>
                            <div
                                class="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-(--md-sys-color-on-surface-variant)"
                            >
                                <div class="space-y-0.5">
                                    <p class="font-medium">
                                        {{ t("pages.ctf.events.table.start") }}
                                    </p>
                                    <p class="text-(--md-sys-color-on-surface)">
                                        {{
                                            formatListDateTime(
                                                event.parsedStart,
                                            )
                                        }}
                                    </p>
                                </div>
                                <div class="space-y-0.5">
                                    <p class="font-medium">
                                        {{ t("pages.ctf.events.table.end") }}
                                    </p>
                                    <p class="text-(--md-sys-color-on-surface)">
                                        {{
                                            formatListDateTime(event.parsedEnd)
                                        }}
                                    </p>
                                </div>
                                <div class="space-y-0.5">
                                    <p class="font-medium">
                                        {{
                                            t("pages.ctf.events.table.duration")
                                        }}
                                    </p>
                                    <p class="text-(--md-sys-color-on-surface)">
                                        {{ formatDurationFromEvent(event) }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4 flex items-center justify-end gap-2">
                            <AnzuButton
                                variant="filled"
                                class="h-10! min-w-24! shrink-0 whitespace-nowrap px-4!"
                                :href="event.比赛链接"
                                target="_blank"
                            >
                                <ArrowUpRightIcon class="h-4 w-4" />
                                {{ t("pages.ctf.events.table.join") }}
                            </AnzuButton>
                        </div>
                    </article>
                </div>

                <div
                    v-else
                    class="py-12 mt-6 p-5 text-center text-sm text-(--md-sys-color-on-surface-variant)"
                >
                    {{ t("pages.ctf.events.sheet.empty") }}
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "#imports";
import { useI18n } from "vue-i18n";
import {
    ArrowPathRoundedSquareIcon,
    ArrowUpRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
} from "@heroicons/vue/24/outline";
import AnzuButton from "@/components/AnzuButton.vue";
import AnzuButtonGroup from "@/components/AnzuButtonGroup.vue";
import AnzuSelector from "@/components/AnzuSelector.vue";
import AnzuPagination from "@/components/AnzuPagination.vue";
import AnzuProgressRing from "@/components/AnzuProgressRing.vue";

definePageMeta({
    alias: "/ctf",
});

type EventStatus = "oncoming" | "running" | "finished" | "unknown";
type EventRegion = "domestic" | "foreign";
type ViewMode = "calendar" | "list";
type RawCTFEvent = {
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
};
type RawDomesticCTFEvent = {
    id?: string | number;
    name?: string;
    link?: string;
    status?: string;
    type?: string;
    comp_time_start?: string;
    comp_time_end?: string;
    organizer?: string;
    readmore?: string;
};
type RawDomesticResponse = { data?: { result?: RawDomesticCTFEvent[] } };
type ParsedCTFEvent = RawCTFEvent & {
    parsedStart: Date;
    parsedEnd: Date | null;
    parsedEffectiveEnd: Date;
    parsedStatus: EventStatus;
    parsedRegion: EventRegion;
};
type CalendarCell = {
    key: string;
    date: Date;
    inCurrentMonth: boolean;
    isToday: boolean;
    visibleEvents: ParsedCTFEvent[];
    hiddenCount: number;
    eventCount: number;
};
type CalendarWeekSegment = {
    key: string;
    event: ParsedCTFEvent;
    lane: number;
    startCol: number;
    endCol: number;
    startsInWeek: boolean;
    endsInWeek: boolean;
};
type CalendarWeek = {
    key: string;
    days: CalendarCell[];
    segments: CalendarWeekSegment[];
    hiddenCounts: number[];
    maxRows: number;
};

const TIME_SEPARATOR = " - ";
const CALENDAR_EVENT_LIMIT = 4;
const DESKTOP_CALENDAR_LANE_LIMIT = 3;
const LIST_PAGE_SIZE = 20;
const GLOBAL_SOURCE_URL =
    "https://raw.githubusercontent.com/ProbiusOfficial/Hello-CTFtime/main/Global.json";
const DOMESTIC_SOURCE_URL =
    "https://raw.githubusercontent.com/ProbiusOfficial/Hello-CTFtime/main/CN.json";

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const events = ref<RawCTFEvent[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const viewMode = ref<ViewMode>("calendar");
const regionFilter = ref<EventRegion | "all">("all");
const selectedMobileDay = ref<Date | null>(null);
const monthCursor = ref(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
);

usePageMeta({
    titleKey: "pages.ctf.title",
    descriptionKey: "pages.ctf.meta.description",
    canonicalPath: "/ctf-event",
});

const displayLocale = computed(() =>
    locale.value.toLowerCase().startsWith("en")
        ? "en-US"
        : locale.value.toLowerCase().startsWith("ja")
          ? "ja-JP"
          : locale.value.toLowerCase().startsWith("ko")
            ? "ko-KR"
            : "zh-CN",
);
const weekdays = computed(() => [
    t("calendar.weekdays.sun"),
    t("calendar.weekdays.mon"),
    t("calendar.weekdays.tue"),
    t("calendar.weekdays.wed"),
    t("calendar.weekdays.thu"),
    t("calendar.weekdays.fri"),
    t("calendar.weekdays.sat"),
]);
const compactWeekdays = computed(() =>
    Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(displayLocale.value, {
            weekday: "narrow",
        }).format(new Date(2024, 0, 7 + index)),
    ),
);
const pad = (value: string | number) => String(value).padStart(2, "0");
const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, amount: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
};
const diffInDays = (start: Date, end: Date) =>
    Math.round(
        (startOfDay(start).getTime() - startOfDay(end).getTime()) / 86400000,
    );
const startOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);
const formatDayKey = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const isExactMidnight = (date: Date) =>
    date.getHours() === 0 &&
    date.getMinutes() === 0 &&
    date.getSeconds() === 0 &&
    date.getMilliseconds() === 0;

const normalizeDomesticDateText = (value?: string) => {
    if (!value) return "";
    const trimmed = value.trim();
    const match = trimmed.match(
        /^(\d{4})[年/-](\d{1,2})[月/-](\d{1,2})日?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/,
    );
    if (!match) return trimmed;
    const year = match[1]!;
    const month = match[2]!;
    const day = match[3]!;
    const hour = match[4]!;
    const minute = match[5]!;
    const second = match[6];
    return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${minute}${second ? `:${pad(second)}` : ""}`;
};

const normalizeDateInput = (value: string) =>
    value
        .trim()
        .replace(/^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}:\d{2}(?::\d{2})?)/, "$1T$2")
        .replace(
            /\s*UTC([+-]\d{1,2})(?::?(\d{2}))?$/i,
            (_, hours: string, minutes?: string) =>
                `${hours.startsWith("-") ? "-" : "+"}${hours.replace(/[+-]/, "").padStart(2, "0")}:${minutes ?? "00"}`,
        );
const parseDate = (value: string) => {
    const parsed = new Date(normalizeDateInput(value));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};
const getEventWindow = (timeRange: string) => {
    const index = timeRange.indexOf(TIME_SEPARATOR);
    if (index === -1)
        return { startDate: parseDate(timeRange.trim()), endDate: null };
    return {
        startDate: parseDate(timeRange.slice(0, index).trim()),
        endDate: parseDate(
            timeRange.slice(index + TIME_SEPARATOR.length).trim(),
        ),
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
    if (
        rawStatus === "未开始" ||
        rawStatus === "即将开始" ||
        rawStatus === "oncoming"
    )
        return "oncoming";
    if (
        rawStatus === "进行中" ||
        rawStatus === "正在进行" ||
        rawStatus === "running"
    )
        return "running";
    if (["已结束", "已经结束", "finished", "over", "done"].includes(rawStatus))
        return "finished";
    return deriveStatusFromTime(startDate, endDate);
};

const parsedEvents = computed<ParsedCTFEvent[]>(() =>
    events.value
        .map((event) => {
            const { startDate, endDate } = getEventWindow(event.比赛时间);
            if (!startDate) return null;
            return {
                ...event,
                parsedStart: startDate,
                parsedEnd: endDate,
                parsedEffectiveEnd: endDate
                    ? isExactMidnight(endDate)
                        ? new Date(endDate.getTime() - 1)
                        : endDate
                    : startDate,
                parsedStatus: statusKey(event, startDate, endDate),
                parsedRegion: event.地区 ?? "foreign",
            };
        })
        .filter((event): event is ParsedCTFEvent => event !== null),
);

const eventSortValue = (status: EventStatus) =>
    status === "running"
        ? 0
        : status === "oncoming"
          ? 1
          : status === "finished"
            ? 2
            : 3;
const matchedEvents = computed(() =>
    [...parsedEvents.value]
        .filter(
            (event) =>
                regionFilter.value === "all" ||
                event.parsedRegion === regionFilter.value,
        )
        .sort(
            (a, b) =>
                eventSortValue(a.parsedStatus) -
                    eventSortValue(b.parsedStatus) ||
                a.parsedStart.getTime() - b.parsedStart.getTime(),
        ),
);
const monthStart = computed(() => startOfMonth(monthCursor.value));
const nextMonthStart = computed(
    () =>
        new Date(
            monthCursor.value.getFullYear(),
            monthCursor.value.getMonth() + 1,
            1,
        ),
);
const monthEvents = computed(() =>
    matchedEvents.value.filter(
        (event) =>
            event.parsedEffectiveEnd.getTime() >= monthStart.value.getTime() &&
            event.parsedStart.getTime() < nextMonthStart.value.getTime(),
    ),
);
const eventsByDay = computed<Record<string, ParsedCTFEvent[]>>(() => {
    const map: Record<string, ParsedCTFEvent[]> = {};
    for (const event of matchedEvents.value) {
        let cursor = startOfDay(event.parsedStart);
        const lastDay = startOfDay(event.parsedEffectiveEnd);
        while (cursor.getTime() <= lastDay.getTime()) {
            const key = formatDayKey(cursor);
            (map[key] ??= []).push(event);
            cursor = addDays(cursor, 1);
        }
    }
    for (const key of Object.keys(map))
        map[key]?.sort(
            (a, b) =>
                a.parsedStart.getTime() - b.parsedStart.getTime() ||
                a.比赛名称.localeCompare(b.比赛名称),
        );
    return map;
});

const todayKey = computed(() => formatDayKey(new Date()));
const calendarCells = computed<CalendarCell[]>(() => {
    const firstDay = new Date(
        monthCursor.value.getFullYear(),
        monthCursor.value.getMonth(),
        1,
    );
    const gridStart = addDays(firstDay, -firstDay.getDay());
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
            eventCount: dayEvents.length,
        };
    });
});
const calendarWeeks = computed<CalendarWeek[]>(() =>
    Array.from({ length: 6 }, (_, weekIndex) => {
        const days = calendarCells.value.slice(
            weekIndex * 7,
            weekIndex * 7 + 7,
        );
        const weekStart = startOfDay(days[0]!.date);
        const weekEnd = startOfDay(days[6]!.date);
        const weekAfterEnd = addDays(weekEnd, 1);
        const laneEndColumns = Array.from(
            { length: DESKTOP_CALENDAR_LANE_LIMIT },
            () => -1,
        );
        const hiddenCounts = Array.from({ length: 7 }, () => 0);
        const segments: CalendarWeekSegment[] = [];

        const overlappingEvents = matchedEvents.value
            .filter(
                (event) =>
                    event.parsedEffectiveEnd.getTime() >= weekStart.getTime() &&
                    event.parsedStart.getTime() < weekAfterEnd.getTime(),
            )
            .sort(
                (a, b) =>
                    a.parsedStart.getTime() - b.parsedStart.getTime() ||
                    b.parsedEffectiveEnd.getTime() -
                        a.parsedEffectiveEnd.getTime() ||
                    a.比赛名称.localeCompare(b.比赛名称),
            );

        for (const event of overlappingEvents) {
            const segmentStartDate =
                startOfDay(event.parsedStart).getTime() > weekStart.getTime()
                    ? startOfDay(event.parsedStart)
                    : weekStart;
            const segmentEndDate =
                startOfDay(event.parsedEffectiveEnd).getTime() <
                weekEnd.getTime()
                    ? startOfDay(event.parsedEffectiveEnd)
                    : weekEnd;
            const startCol = diffInDays(segmentStartDate, weekStart);
            const endCol = diffInDays(segmentEndDate, weekStart);
            const lane = laneEndColumns.findIndex(
                (endColInLane) => startCol > endColInLane,
            );

            if (lane === -1) {
                for (let col = startCol; col <= endCol; col += 1) {
                    hiddenCounts[col]! += 1;
                }
                continue;
            }

            laneEndColumns[lane] = endCol;
            segments.push({
                key: `${days[0]!.key}-${event.比赛ID}-${lane}-${startCol}-${endCol}`,
                event,
                lane,
                startCol,
                endCol,
                startsInWeek:
                    startOfDay(event.parsedStart).getTime() >=
                    weekStart.getTime(),
                endsInWeek:
                    startOfDay(event.parsedEffectiveEnd).getTime() <=
                    weekEnd.getTime(),
            });
        }

        return {
            key: `week-${days[0]!.key}`,
            days,
            segments,
            hiddenCounts,
            maxRows: Math.max(
                segments.length
                    ? Math.max(...segments.map((segment) => segment.lane + 1))
                    : 0,
                1,
            ),
        };
    }),
);

const displayedMonthLabel = computed(() =>
    new Intl.DateTimeFormat(displayLocale.value, {
        year: "numeric",
        month: "long",
    }).format(monthCursor.value),
);
const summaryText = computed(() =>
    viewMode.value === "calendar"
        ? monthEvents.value.length
            ? t("pages.ctf.events.summary.monthEvents", {
                  count: monthEvents.value.length,
              })
            : t("pages.ctf.events.summary.monthEmpty")
        : t("pages.ctf.events.summary.totalEvents", {
              count: matchedEvents.value.length,
          }),
);
const totalPages = computed(() =>
    Math.max(1, Math.ceil(matchedEvents.value.length / LIST_PAGE_SIZE)),
);
const currentPage = computed(() => {
    const raw = Array.isArray(route.query.page)
        ? route.query.page[0]
        : route.query.page;
    const page = Number(raw || 1);
    return !Number.isFinite(page) || page < 1
        ? 1
        : Math.min(page, totalPages.value);
});
const selectedMobileDayKey = computed(() =>
    selectedMobileDay.value ? formatDayKey(selectedMobileDay.value) : "",
);
const mobileDaySheetOpen = computed(() => !!selectedMobileDay.value);
const selectedMobileDayEvents = computed(() =>
    selectedMobileDayKey.value
        ? (eventsByDay.value[selectedMobileDayKey.value] ?? [])
        : [],
);
const selectedMobileDayLabel = computed(() =>
    selectedMobileDay.value
        ? new Intl.DateTimeFormat(displayLocale.value, {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
          }).format(selectedMobileDay.value)
        : "",
);
const paginatedEvents = computed(() =>
    matchedEvents.value.slice(
        (currentPage.value - 1) * LIST_PAGE_SIZE,
        currentPage.value * LIST_PAGE_SIZE,
    ),
);
const formatListDateTime = (date: Date | null) =>
    date
        ? new Intl.DateTimeFormat(displayLocale.value, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
          }).format(date)
        : "--";
const formatTableDate = (date: Date | null) =>
    date
        ? new Intl.DateTimeFormat(displayLocale.value, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
          }).format(date)
        : "--";
const formatTableDateRange = (event: ParsedCTFEvent) => {
    const startLabel = formatTableDate(event.parsedStart);
    const endLabel = formatTableDate(event.parsedEnd);
    if (!event.parsedEnd || startLabel === endLabel) return startLabel;
    return `${startLabel} - ${endLabel}`;
};
const formatDurationFromEvent = (event: ParsedCTFEvent) => {
    const endDate = event.parsedEnd ?? event.parsedStart;
    const hours = Math.max(
        1,
        Math.round((endDate.getTime() - event.parsedStart.getTime()) / 36e5),
    );
    if (endDate.getTime() - event.parsedStart.getTime() <= 0)
        return t("pages.ctf.events.duration.single");
    if (hours < 24) return t("pages.ctf.events.duration.hours", { hours });
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (!remainingHours)
        return days === 1
            ? t("pages.ctf.events.duration.day")
            : t("pages.ctf.events.duration.days", { days });
    return t("pages.ctf.events.duration.dayHours", {
        days,
        hours: remainingHours,
    });
};

const eventMetaText = (event: RawCTFEvent) =>
    [
        event.赛事主办,
        event.比赛形式,
        event.比赛权重 ? `W:${event.比赛权重}` : null,
    ]
        .filter(Boolean)
        .join(" / ");
const calendarEventTitle = (event: ParsedCTFEvent) =>
    [
        event.比赛名称,
        `${t("pages.ctf.events.table.start")}: ${formatListDateTime(event.parsedStart)}`,
        `${t("pages.ctf.events.table.end")}: ${formatListDateTime(event.parsedEnd)}`,
        `${t("pages.ctf.events.table.duration")}: ${formatDurationFromEvent(event)}`,
    ].join("\n");
const desktopCalendarRowStyle = (week: CalendarWeek) => ({
    minHeight: `${3.4 + week.maxRows * 1.8 + (week.hiddenCounts.some((count) => count > 0) ? 1.4 : 0.35)}rem`,
});
const desktopCalendarSpacerStyle = (week: CalendarWeek) => ({
    height: `${week.maxRows * 1.8}rem`,
});
const desktopCalendarSegmentStyle = (segment: CalendarWeekSegment) => ({
    left: `calc(${segment.startCol} * 100% / 7 + 0.3rem)`,
    width: `calc(${segment.endCol - segment.startCol + 1} * 100% / 7 - 0.6rem)`,
    top: `${2 + segment.lane * 1.8}rem`,
});
const desktopCalendarSegmentClass = (segment: CalendarWeekSegment) => [
    calendarEventClass(segment.event.parsedStatus),
    segment.startsInWeek ? "rounded-l-md" : "rounded-l-none",
    segment.endsInWeek ? "rounded-r-md" : "rounded-r-none",
    "border border-(--md-sys-color-outline-variant)/40",
];
const statusDotClass = (status: EventStatus) =>
    status === "running"
        ? "bg-(--md-sys-color-primary)"
        : status === "finished"
          ? "bg-(--md-sys-color-tertiary)"
          : status === "oncoming"
            ? "bg-(--md-sys-color-secondary)"
            : "bg-(--md-sys-color-outline)";
const calendarCellClass = (cell: CalendarCell) =>
    cell.isToday
        ? "min-h-[5.5rem] bg-(--md-sys-color-surface-container-high) sm:min-h-[6.75rem]"
        : cell.inCurrentMonth
          ? "min-h-[5.5rem] bg-(--md-sys-color-surface-container-lowest) sm:min-h-[6.75rem]"
          : "min-h-[5.5rem] bg-(--md-sys-color-surface-container) sm:min-h-[6.75rem]";
const mobileCalendarCellClass = (cell: CalendarCell) =>
    cell.isToday
        ? "min-h-[5.25rem] bg-(--md-sys-color-surface-container-high)"
        : cell.inCurrentMonth
          ? "min-h-[5.25rem] bg-(--md-sys-color-surface-container-lowest)"
          : "min-h-[5.25rem] bg-(--md-sys-color-surface-container)";
const calendarDayNumberClass = (cell: CalendarCell) =>
    cell.isToday
        ? "text-(--md-sys-color-primary)"
        : cell.inCurrentMonth
          ? "text-(--md-sys-color-on-surface)"
          : "text-(--md-sys-color-on-surface-variant) opacity-70";
const calendarEventClass = (status: EventStatus) =>
    status === "running"
        ? "bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container)"
        : status === "finished"
          ? "bg-(--md-sys-color-surface-container-high) text-(--md-sys-color-on-surface-variant)"
          : status === "oncoming"
            ? "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)"
            : "bg-(--md-sys-color-surface-container) text-(--md-sys-color-on-surface-variant)";

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
const openMobileDaySheet = (date: Date) => {
    selectedMobileDay.value = new Date(date);
};
const closeMobileDaySheet = () => {
    selectedMobileDay.value = null;
};
const openListForDay = async (
    date: Date,
    options?: { closeMobileSheet?: boolean },
) => {
    viewMode.value = "list";
    if (options?.closeMobileSheet) closeMobileDaySheet();
    const dayStart = startOfDay(date).getTime();
    const dayEnd = addDays(startOfDay(date), 1).getTime();
    const targetIndex = matchedEvents.value.findIndex(
        (event) =>
            event.parsedEffectiveEnd.getTime() >= dayStart &&
            event.parsedStart.getTime() < dayEnd,
    );
    await router.push({
        path: route.path,
        query: {
            ...route.query,
            page:
                targetIndex === -1
                    ? 1
                    : Math.floor(targetIndex / LIST_PAGE_SIZE) + 1,
        },
    });
};
watch([viewMode, regionFilter, monthCursor], () => {
    if (selectedMobileDay.value) closeMobileDaySheet();
});

// 页面切换后自动上滑
watch(
    () => route.query.page,
    () => {
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    },
);

const createDomesticTimeRange = (startText?: string, endText?: string) => {
    const normalizedStart = normalizeDomesticDateText(startText);
    const normalizedEnd = normalizeDomesticDateText(endText);
    if (!normalizedStart) return null;
    return normalizedEnd
        ? `${normalizedStart}${TIME_SEPARATOR}${normalizedEnd}`
        : normalizedStart;
};

const normalizeGlobalEvents = (payload: unknown): RawCTFEvent[] =>
    Array.isArray(payload)
        ? payload
              .filter(
                  (item): item is RawCTFEvent =>
                      !!item &&
                      typeof item === "object" &&
                      "比赛名称" in item &&
                      "比赛时间" in item &&
                      "比赛链接" in item,
              )
              .map((event) => ({ ...event, 地区: "foreign" as EventRegion }))
        : [];
const normalizeDomesticEvents = (payload: unknown): RawCTFEvent[] => {
    const result = (payload as RawDomesticResponse)?.data?.result;
    if (!Array.isArray(result)) return [];
    return result
        .map((event, index) => {
            const eventName = event.name?.trim();
            const eventLink = event.link?.trim();
            const timeRange = createDomesticTimeRange(
                event.comp_time_start,
                event.comp_time_end,
            );
            if (!eventName || !eventLink || !timeRange) return null;
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
            } as RawCTFEvent;
        })
        .filter((event): event is RawCTFEvent => event !== null);
};

const fetchJson = async <T,>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok)
        throw new Error(response.statusText || `HTTP ${response.status}`);
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
        error.value =
            (fetchError as Error).message || t("pages.ctf.events.fetchError");
        events.value = [];
    } finally {
        loading.value = false;
    }
};

const refresh = () => {
    if (!loading.value) void fetchEvents();
};
onMounted(() => {
    void fetchEvents();
});
</script>

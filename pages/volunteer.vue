<template>
    <main
        class="box-border bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto max-w-5xl space-y-6">
            <div
                v-if="configLoading"
                class="flex min-h-72 flex-col items-center justify-center gap-4 text-center text-(--md-sys-color-on-surface-variant)"
            >
                <AnzuProgressRing :size="56" status="loading" />
                <p class="text-sm sm:text-base">
                    {{ t("pages.volunteer.loading") }}
                </p>
            </div>

            <div
                v-else-if="configError"
                class="space-y-4 rounded-xl bg-(--md-sys-color-error-container)/60 p-5 text-(--md-sys-color-on-error-container)"
            >
                <div class="flex items-start gap-3">
                    <ExclamationTriangleIcon class="mt-0.5 h-5 w-5 shrink-0" />
                    <div class="space-y-2">
                        <p class="font-semibold">
                            {{ t("pages.volunteer.error") }}
                        </p>
                        <p class="text-sm opacity-80">{{ configError }}</p>
                    </div>
                </div>
                <AnzuButton
                    variant="filled"
                    class="h-9! min-w-0! px-4!"
                    @click="fetchConfig"
                >
                    {{ t("common.actions.reload") }}
                </AnzuButton>
            </div>

            <section v-else class="space-y-8">
                <div class="flex flex-col gap-8">
                    <div class="flex flex-col gap-3">
                        <label
                            class="text-xl font-bold text-(--md-sys-color-on-surface) sm:text-2xl"
                        >
                            {{ t("pages.volunteer.filters.dataSource") }}
                        </label>
                        <AnzuSelector
                            v-model="dataSource"
                            :options="dataSources"
                            @change="
                                (val) => switchDataSource(val as DataSource)
                            "
                        />
                    </div>
                    <div class="flex flex-col gap-6">
                        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div class="flex flex-col gap-2">
                                <label
                                    class="text-sm font-medium text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ t("pages.volunteer.filters.year") }}
                                </label>
                                <AnzuComboBox
                                    v-model="selectedYear"
                                    :items="availableYears"
                                    :placeholder="
                                        t('pages.volunteer.placeholder.year')
                                    "
                                    :search-placeholder="
                                        t('pages.volunteer.placeholder.year')
                                    "
                                    :empty-text="t('common.items.empty')"
                                    menu-width-class="w-full"
                                    class="w-full"
                                    @change="onYearChange"
                                />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label
                                    class="text-sm font-medium text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ t("pages.volunteer.filters.province") }}
                                </label>
                                <AnzuComboBox
                                    v-model="selectedProvince"
                                    :items="availableProvinces"
                                    :placeholder="
                                        t(
                                            'pages.volunteer.placeholder.province',
                                        )
                                    "
                                    :search-placeholder="
                                        t(
                                            'pages.volunteer.placeholder.province',
                                        )
                                    "
                                    :empty-text="t('common.items.empty')"
                                    menu-width-class="w-full"
                                    class="w-full"
                                    @change="onProvinceChange"
                                />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label
                                    class="text-sm font-medium text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{
                                        dataSource === "plan"
                                            ? t(
                                                  "pages.volunteer.filters.planType",
                                              )
                                            : t(
                                                  "pages.volunteer.filters.category",
                                              )
                                    }}
                                </label>
                                <AnzuComboBox
                                    v-if="dataSource === 'plan'"
                                    v-model="selectedPlanType"
                                    :items="availablePlanTypes"
                                    :placeholder="
                                        t(
                                            'pages.volunteer.placeholder.planType',
                                        )
                                    "
                                    :search-placeholder="
                                        t(
                                            'pages.volunteer.placeholder.planType',
                                        )
                                    "
                                    :empty-text="t('common.items.empty')"
                                    menu-width-class="w-full"
                                    class="w-full"
                                />
                                <AnzuComboBox
                                    v-else
                                    v-model="selectedCategory"
                                    :items="availableCategories"
                                    :placeholder="
                                        t(
                                            'pages.volunteer.placeholder.category',
                                        )
                                    "
                                    :search-placeholder="
                                        t(
                                            'pages.volunteer.placeholder.category',
                                        )
                                    "
                                    :empty-text="t('common.items.empty')"
                                    menu-width-class="w-full"
                                    class="w-full"
                                />
                            </div>
                        </div>
                        <div
                            v-if="dataSource !== 'plan'"
                            class="grid grid-cols-1 gap-6 sm:grid-cols-3"
                        >
                            <div class="flex flex-col gap-2">
                                <label
                                    class="text-sm font-medium text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ t("pages.volunteer.filters.yourScore") }}
                                </label>
                                <AnzuInput
                                    v-model.number="userScore"
                                    type="number"
                                    min="0"
                                    max="750"
                                    class="w-full"
                                    :placeholder="
                                        t('pages.volunteer.placeholder.score')
                                    "
                                />
                            </div>

                            <div
                                v-if="dataSource === 'ranking'"
                                class="flex flex-col gap-2"
                            >
                                <label
                                    class="text-sm font-medium text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{
                                        t("pages.volunteer.filters.yourRanking")
                                    }}
                                </label>
                                <AnzuInput
                                    v-model.number="userRanking"
                                    type="number"
                                    min="1"
                                    class="w-full"
                                    :placeholder="
                                        t('pages.volunteer.placeholder.ranking')
                                    "
                                />
                            </div>
                        </div>
                        <div class="flex items-center justify-end gap-2 pt-2">
                            <AnzuButton variant="text" @click="resetFilters">
                                <template #icon>
                                    <ArrowPathIcon class="h-4 w-4" />
                                </template>
                                {{
                                    t("pages.volunteer.filters.reset") || "重置"
                                }}
                            </AnzuButton>
                            <AnzuButton
                                variant="filled"
                                :disabled="!canQuery"
                                :loading="dataLoading"
                                @click="queryData"
                            >
                                <template #icon>
                                    <MagnifyingGlassIcon class="h-4 w-4" />
                                </template>
                                {{ t("pages.volunteer.filters.query") }}
                            </AnzuButton>
                        </div>
                    </div>
                </div>

                <AnzuAlert
                    type="info"
                    :title="t('pages.volunteer.sourceAlert.title')"
                >
                    <div class="leading-relaxed whitespace-pre-line opacity-90">
                        <i18n-t
                            v-if="
                                dataSource === 'zsjy' || dataSource === 'plan'
                            "
                            :keypath="
                                dataSource === 'zsjy'
                                    ? 'pages.volunteer.dataSource.zsjyDescription'
                                    : 'pages.volunteer.dataSource.planDescription'
                            "
                            tag="span"
                        >
                            <template #link>
                                <a
                                    href="https://zsjy.jxufe.edu.cn/"
                                    target="_blank"
                                    class="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-600 hover:decoration-primary"
                                    >{{
                                        $t(
                                            "pages.volunteer.dataSource.zsjyLinkText",
                                        )
                                    }}</a
                                >
                            </template>
                        </i18n-t>
                        <span v-else>
                            {{ currentSourceDescription }}
                        </span>
                    </div>
                </AnzuAlert>

                <div
                    v-if="!hasQueried"
                    class="flex min-h-48 flex-col items-center justify-center gap-2 py-12 text-center"
                >
                    <MagnifyingGlassIcon
                        class="h-10 w-10 text-(--md-sys-color-on-surface-variant) opacity-40"
                    />
                    <p class="text-sm text-(--md-sys-color-on-surface-variant)">
                        {{ t("pages.volunteer.selectHint") }}
                    </p>
                </div>

                <div
                    v-else-if="dataLoading"
                    class="flex min-h-48 flex-col items-center justify-center gap-4 text-center text-(--md-sys-color-on-surface-variant)"
                >
                    <AnzuProgressRing :size="48" status="loading" />
                    <p class="text-sm">
                        {{ t("pages.volunteer.loading") }}
                    </p>
                </div>

                <div
                    v-else-if="dataError"
                    class="space-y-4 rounded-xl bg-(--md-sys-color-error-container)/60 p-5 text-(--md-sys-color-on-error-container)"
                >
                    <div class="flex items-start gap-3">
                        <ExclamationTriangleIcon
                            class="mt-0.5 h-5 w-5 shrink-0"
                        />
                        <div class="space-y-2">
                            <p class="font-semibold">
                                {{ t("pages.volunteer.fetchError") }}
                            </p>
                            <p class="text-sm opacity-80">{{ dataError }}</p>
                        </div>
                    </div>
                    <AnzuButton
                        variant="filled"
                        class="h-9! min-w-0! px-4!"
                        @click="queryData"
                    >
                        {{ t("common.actions.reload") }}
                    </AnzuButton>
                </div>

                <div v-else-if="results.length === 0" class="space-y-4">
                    <div
                        class="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl bg-(--md-sys-color-surface-container) py-12 text-center"
                    >
                        <p
                            class="text-base font-medium text-(--md-sys-color-on-surface)"
                        >
                            {{ t("pages.volunteer.empty") }}
                        </p>
                        <p
                            class="text-sm text-(--md-sys-color-on-surface-variant)"
                        >
                            {{ t("pages.volunteer.emptyHint") }}
                        </p>
                    </div>
                </div>

                <div v-else class="space-y-4">
                    <div
                        class="flex flex-wrap items-center gap-4 text-sm text-(--md-sys-color-on-surface-variant)"
                    >
                        <span>{{ summaryText }}</span>
                        <span
                            v-if="userScore"
                            class="font-medium text-(--md-sys-color-primary)"
                        >
                            {{
                                t("pages.volunteer.scoreHint", {
                                    score: userScore,
                                })
                            }}
                        </span>
                        <span
                            v-if="userRanking && dataSource === 'ranking'"
                            class="font-medium text-(--md-sys-color-primary)"
                        >
                            {{
                                t("pages.volunteer.rankingHint", {
                                    ranking: userRanking,
                                })
                            }}
                        </span>
                    </div>
                    <div
                        v-if="dataSource !== 'plan'"
                        class="hidden overflow-x-auto lg:block"
                    >
                        <table class="min-w-full table-fixed border-collapse">
                            <thead>
                                <tr
                                    class="border-b border-(--md-sys-color-outline-variant)/60 text-left"
                                >
                                    <th
                                        class="px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                        :class="
                                            dataSource === 'ranking'
                                                ? 'w-[22%]'
                                                : showMatchCol
                                                  ? 'w-[26%]'
                                                  : 'w-[30%]'
                                        "
                                    >
                                        {{ t("pages.volunteer.table.major") }}
                                    </th>
                                    <th
                                        class="cursor-pointer select-none px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap transition-colors hover:text-(--md-sys-color-primary)"
                                        :class="[
                                            sortKey === 'maxScore'
                                                ? 'text-(--md-sys-color-primary)'
                                                : 'text-(--md-sys-color-on-surface-variant)',
                                            dataSource === 'ranking'
                                                ? 'w-[8%]'
                                                : 'w-[10%]',
                                        ]"
                                        @click="toggleSort('maxScore')"
                                    >
                                        {{
                                            t("pages.volunteer.table.maxScore")
                                        }}
                                        <span
                                            v-if="sortKey === 'maxScore'"
                                            class="ml-0.5"
                                            >{{
                                                sortDir === "desc" ? "↓" : "↑"
                                            }}</span
                                        >
                                    </th>
                                    <th
                                        class="cursor-pointer select-none px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap transition-colors hover:text-(--md-sys-color-primary)"
                                        :class="[
                                            sortKey === 'minScore'
                                                ? 'text-(--md-sys-color-primary)'
                                                : 'text-(--md-sys-color-on-surface-variant)',
                                            dataSource === 'ranking'
                                                ? 'w-[8%]'
                                                : 'w-[10%]',
                                        ]"
                                        @click="toggleSort('minScore')"
                                    >
                                        {{
                                            t("pages.volunteer.table.minScore")
                                        }}
                                        <span
                                            v-if="sortKey === 'minScore'"
                                            class="ml-0.5"
                                            >{{
                                                sortDir === "desc" ? "↓" : "↑"
                                            }}</span
                                        >
                                    </th>
                                    <th
                                        v-if="dataSource === 'ranking'"
                                        class="w-[8%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{
                                            t(
                                                "pages.volunteer.table.maxRanking",
                                            )
                                        }}
                                    </th>
                                    <th
                                        v-if="dataSource === 'ranking'"
                                        class="w-[8%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{
                                            t(
                                                "pages.volunteer.table.minRanking",
                                            )
                                        }}
                                    </th>
                                    <th
                                        v-if="showMatchCol"
                                        class="px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                        :class="
                                            dataSource === 'ranking'
                                                ? 'w-[12%]'
                                                : 'w-[14%]'
                                        "
                                    >
                                        {{ t("pages.volunteer.table.match") }}
                                    </th>
                                    <th
                                        class="w-[10%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{
                                            t("pages.volunteer.table.category")
                                        }}
                                    </th>
                                    <th
                                        class="w-[10%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ t("pages.volunteer.table.batch") }}
                                    </th>
                                    <th
                                        class="px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ t("pages.volunteer.table.notes") }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                class="divide-y divide-(--md-sys-color-outline-variant)/40"
                            >
                                <tr
                                    v-for="(row, idx) in paginatedResults"
                                    :key="row._id || idx"
                                    class="transition-colors hover:bg-(--md-sys-color-surface-container)/45"
                                >
                                    <td
                                        class="px-3 py-4 text-sm font-medium text-(--md-sys-color-on-surface)"
                                    >
                                        {{ row.E }}
                                    </td>
                                    <td
                                        class="px-3 py-4 text-sm font-medium tabular-nums text-(--md-sys-color-primary)"
                                    >
                                        {{ row.F }}
                                    </td>
                                    <td
                                        class="px-3 py-4 text-sm font-medium tabular-nums text-(--md-sys-color-secondary)"
                                    >
                                        {{ row.G }}
                                    </td>
                                    <td
                                        v-if="dataSource === 'ranking'"
                                        class="px-3 py-4 text-sm font-medium tabular-nums text-(--md-sys-color-primary)"
                                    >
                                        {{ row.I }}
                                    </td>
                                    <td
                                        v-if="dataSource === 'ranking'"
                                        class="px-3 py-4 text-sm font-medium tabular-nums text-(--md-sys-color-secondary)"
                                    >
                                        {{ row.J }}
                                    </td>
                                    <td v-if="showMatchCol" class="px-3 py-4">
                                        <span
                                            class="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                                            :class="matchBadgeClass(row)"
                                        >
                                            {{ matchLabel(row) }}
                                        </span>
                                    </td>
                                    <td
                                        class="px-3 py-4 text-sm whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ row.D }}
                                    </td>
                                    <td
                                        class="px-3 py-4 text-sm whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ row.C }}
                                    </td>
                                    <td
                                        class="px-3 py-4 text-sm text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ row.H }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="hidden overflow-x-auto lg:block">
                        <table class="min-w-full table-fixed border-collapse">
                            <thead>
                                <tr
                                    class="border-b border-(--md-sys-color-outline-variant)/60 text-left"
                                >
                                    <th
                                        class="w-[30%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ t("pages.volunteer.table.major") }}
                                    </th>
                                    <th
                                        class="w-[12%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{
                                            t("pages.volunteer.table.majorCode")
                                        }}
                                    </th>
                                    <th
                                        class="w-[22%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{
                                            t("pages.volunteer.table.planType")
                                        }}
                                    </th>
                                    <th
                                        class="w-[12%] px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{
                                            t("pages.volunteer.table.planCount")
                                        }}
                                    </th>
                                    <th
                                        class="px-3 py-2 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ t("pages.volunteer.table.notes") }}
                                    </th>
                                </tr>
                            </thead>
                            <tbody
                                class="divide-y divide-(--md-sys-color-outline-variant)/40"
                            >
                                <tr
                                    v-for="(row, idx) in paginatedResults"
                                    :key="row._id || idx"
                                    class="transition-colors hover:bg-(--md-sys-color-surface-container)/45"
                                >
                                    <td
                                        class="px-3 py-4 text-sm font-medium text-(--md-sys-color-on-surface)"
                                    >
                                        {{ row.C }}
                                    </td>
                                    <td
                                        class="px-3 py-4 text-sm tabular-nums text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ row.D }}
                                    </td>
                                    <td
                                        class="px-3 py-4 text-sm whitespace-nowrap text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ row.F }}
                                    </td>
                                    <td
                                        class="px-3 py-4 text-sm font-semibold tabular-nums text-(--md-sys-color-primary)"
                                    >
                                        {{ row.G }}
                                    </td>
                                    <td
                                        class="px-3 py-4 text-sm text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ row.H }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div
                        v-if="dataSource !== 'plan'"
                        class="space-y-3 lg:hidden"
                    >
                        <article
                            v-for="(row, idx) in paginatedResults"
                            :key="row._id || `mobile-${idx}`"
                            class="py-3"
                        >
                            <div class="flex items-start justify-between gap-2">
                                <div class="space-y-1">
                                    <p
                                        class="text-base font-semibold text-(--md-sys-color-on-surface)"
                                    >
                                        {{ row.E }}
                                    </p>
                                    <p
                                        class="text-xs text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{ row.C }} · {{ row.D }}
                                        <span v-if="row.H"> · {{ row.H }}</span>
                                    </p>
                                </div>
                                <span
                                    v-if="showMatchCol"
                                    class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                                    :class="matchBadgeClass(row)"
                                >
                                    {{ matchLabel(row) }}
                                </span>
                            </div>
                            <div
                                class="mt-3 grid gap-x-3 gap-y-2 text-sm"
                                :class="
                                    dataSource === 'ranking'
                                        ? 'grid-cols-2'
                                        : 'grid-cols-2'
                                "
                            >
                                <div>
                                    <p
                                        class="text-xs text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{
                                            t("pages.volunteer.table.maxScore")
                                        }}
                                    </p>
                                    <p
                                        class="text-lg font-semibold tabular-nums text-(--md-sys-color-on-surface)"
                                    >
                                        {{ row.F }}
                                    </p>
                                </div>
                                <div>
                                    <p
                                        class="text-xs text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{
                                            t("pages.volunteer.table.minScore")
                                        }}
                                    </p>
                                    <p
                                        class="text-lg font-semibold tabular-nums text-(--md-sys-color-on-surface)"
                                    >
                                        {{ row.G }}
                                    </p>
                                </div>
                                <template v-if="dataSource === 'ranking'">
                                    <div>
                                        <p
                                            class="text-xs text-(--md-sys-color-on-surface-variant)"
                                        >
                                            {{
                                                t(
                                                    "pages.volunteer.table.maxRanking",
                                                )
                                            }}
                                        </p>
                                        <p
                                            class="text-base font-semibold tabular-nums text-(--md-sys-color-on-surface)"
                                        >
                                            {{ row.J }}
                                        </p>
                                    </div>
                                    <div>
                                        <p
                                            class="text-xs text-(--md-sys-color-on-surface-variant)"
                                        >
                                            {{
                                                t(
                                                    "pages.volunteer.table.minRanking",
                                                )
                                            }}
                                        </p>
                                        <p
                                            class="text-base font-semibold tabular-nums text-(--md-sys-color-on-surface)"
                                        >
                                            {{ row.I }}
                                        </p>
                                    </div>
                                </template>
                            </div>
                        </article>
                    </div>
                    <div v-else class="space-y-3 lg:hidden">
                        <article
                            v-for="(row, idx) in paginatedResults"
                            :key="row._id || `mobile-plan-${idx}`"
                            class="rounded-xl bg-(--md-sys-color-surface-container) p-4"
                        >
                            <div class="space-y-1">
                                <p
                                    class="text-base font-semibold text-(--md-sys-color-on-surface)"
                                >
                                    {{ row.C }}
                                </p>
                                <p
                                    class="text-xs text-(--md-sys-color-on-surface-variant)"
                                >
                                    {{ row.F }}
                                    <span v-if="row.D"> · {{ row.D }}</span>
                                    <span v-if="row.E"> · {{ row.E }}</span>
                                </p>
                            </div>
                            <div class="mt-3 flex items-end justify-between">
                                <div>
                                    <p
                                        class="text-xs text-(--md-sys-color-on-surface-variant)"
                                    >
                                        {{
                                            t("pages.volunteer.table.planCount")
                                        }}
                                    </p>
                                    <p
                                        class="text-2xl font-semibold tabular-nums text-(--md-sys-color-on-surface)"
                                    >
                                        {{ row.G }}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div class="flex justify-center">
                        <AnzuPagination
                            v-if="totalPages > 1"
                            :total-pages="totalPages"
                            :current-page="currentPage"
                            :loading="dataLoading"
                        />
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "#imports";
import { useI18n } from "vue-i18n";
import {
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
} from "@heroicons/vue/24/outline";
import AnzuAlert from "@/components/AnzuAlert.vue";
import AnzuButton from "@/components/AnzuButton.vue";
import AnzuButtonGroup from "@/components/AnzuButtonGroup.vue";
import AnzuComboBox from "@/components/AnzuComboBox.vue";
import AnzuInput from "@/components/AnzuInput.vue";
import AnzuPagination from "@/components/AnzuPagination.vue";
import AnzuProgressRing from "@/components/AnzuProgressRing.vue";

const PAGE_SIZE = 20;
const MAX_PAGES = 20;

type DataSource = "zsjy" | "ranking" | "plan";
type AllFilterItem = Record<string, string>;
type EnrollRow = Record<string, string> & { _id?: string };
type MatchStatus = "safe" | "match" | "reach" | "far";

interface ConfigData {
    detail: Record<string, unknown>;
    filter: Record<string, string[]>;
    all_filter: AllFilterItem[];
}

interface EnrollResponse {
    code: number;
    data: {
        head: AllFilterItem[];
        list: EnrollRow[];
        total: number;
    };
    msg: string;
}

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
usePageMeta({
    titleKey: "pages.volunteer.title",
    descriptionKey: "pages.volunteer.meta.description",
    keywords:
        "江西财经大学录取分数,江财志愿填报,高考志愿查询,江财招生,江财录取位次,江西财经大学分数线",
    canonicalPath: "/volunteer",
    schema: {
        "@type": "WebApplication",
        applicationCategory: "EducationalApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
        author: {
            "@type": "Organization",
            name: t("meta.fullName"),
            url: (useRuntimeConfig().public.siteUrl as string).replace(
                /\/+$/,
                "",
            ),
        },
    },
});

const configLoading = ref(false);
const configError = ref<string | null>(null);
const filterOptions = ref<Record<string, string[]>>({});
const allFilter = ref<AllFilterItem[]>([]);

const planFilterOptions = ref<Record<string, string[]>>({});
const planAllFilter = ref<AllFilterItem[]>([]);

const selectedYear = ref<string | null>(null);
const selectedProvince = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);
const selectedPlanType = ref<string | null>(null);
const userScore = ref<number | string | undefined>(undefined);
const userRanking = ref<number | string | undefined>(undefined);

const sortKey = ref<"maxScore" | "minScore" | null>(null);
const sortDir = ref<"asc" | "desc">("desc");

const dataLoading = ref(false);
const dataError = ref<string | null>(null);
const rawResults = ref<EnrollRow[]>([]);
const hasQueried = ref(false);
const dataSource = ref<DataSource>("zsjy");
const rankingCache = ref<EnrollRow[] | null>(null);
const rankingCacheLoading = ref(false);

const dataSources = computed<{ label: string; value: DataSource }[]>(() => [
    {
        label: t("pages.volunteer.dataSource.zsjy"),
        value: "zsjy",
    },
    {
        label: t("pages.volunteer.dataSource.ranking"),
        value: "ranking",
    },
    {
        label: t("pages.volunteer.dataSource.plan"),
        value: "plan",
    },
]);

const currentSourceDescription = computed(() => {
    if (dataSource.value === "ranking")
        return t("pages.volunteer.dataSource.rankingDescription");
    return "";
});

const availablePlanTypes = computed(() => {
    const base = planFilterOptions.value["F"] || [];
    if (!selectedYear.value || !selectedProvince.value) return base;
    const types = new Set<string>();
    for (const f of planAllFilter.value) {
        if (
            f["A"] === selectedYear.value &&
            f["B"] === selectedProvince.value &&
            f["F"]
        ) {
            types.add(f["F"]);
        }
    }
    return Array.from(types).sort();
});

const switchDataSource = async (src: DataSource) => {
    if (src === dataSource.value) return;
    dataSource.value = src;
    rawResults.value = [];
    hasQueried.value = false;
    dataError.value = null;
    sortKey.value = null;
    selectedCategory.value = null;
    selectedPlanType.value = null;
    await nextTick();
    selectedYear.value = "2025";
    selectedProvince.value = src === "plan" ? "江西" : "江西省";
};

const parseScore = (row: EnrollRow, key: string): number => {
    const v = parseInt(row[key] || "", 10);
    return Number.isFinite(v) ? v : 0;
};

const getMatchStatus = (row: EnrollRow): MatchStatus => {
    if (
        userRanking.value !== undefined &&
        userRanking.value !== "" &&
        dataSource.value === "ranking"
    ) {
        const bestRank = Math.min(parseScore(row, "I"), parseScore(row, "J"));
        const worstRank = Math.max(parseScore(row, "I"), parseScore(row, "J"));
        if (worstRank === 0) return "far";
        const r = Number(userRanking.value);
        if (r <= bestRank) return "safe";
        if (r <= worstRank) return "match";
        if (r <= Math.round(worstRank * 1.05)) return "reach";
        return "far";
    }
    if (userScore.value === undefined || userScore.value === "") return "far";
    const s = Number(userScore.value);
    const minS = parseScore(row, "G");
    const maxS = parseScore(row, "F");
    if (s >= maxS) return "safe";
    if (s >= minS) return "match";
    if (s >= minS - 5) return "reach";
    return "far";
};

const results = computed(() => {
    const rows = [...rawResults.value];
    if (sortKey.value) {
        const key = sortKey.value === "maxScore" ? "F" : "G";
        const dir = sortDir.value === "desc" ? -1 : 1;
        rows.sort((a, b) => (parseScore(a, key) - parseScore(b, key)) * dir);
    } else if (
        (userRanking.value !== undefined &&
            userRanking.value !== "" &&
            dataSource.value === "ranking") ||
        (userScore.value !== undefined && userScore.value !== "")
    ) {
        rows.sort((a, b) => {
            const aStatus = getMatchStatus(a);
            const bStatus = getMatchStatus(b);
            const order: Record<MatchStatus, number> = {
                match: 0,
                reach: 1,
                safe: 2,
                far: 3,
            };
            const oa = order[aStatus];
            const ob = order[bStatus];
            if (oa !== ob) return oa - ob;

            if (
                userRanking.value !== undefined &&
                userRanking.value !== "" &&
                dataSource.value === "ranking"
            ) {
                const r = Number(userRanking.value);
                const aWorst = Math.max(parseScore(a, "I"), parseScore(a, "J"));
                const bWorst = Math.max(parseScore(b, "I"), parseScore(b, "J"));
                return Math.abs(r - aWorst) - Math.abs(r - bWorst);
            }

            const s = Number(userScore.value);
            const aMin = parseScore(a, "G");
            const bMin = parseScore(b, "G");
            return Math.abs(s - aMin) - Math.abs(s - bMin);
        });
    }
    return rows;
});

const toggleSort = (key: "maxScore" | "minScore") => {
    if (sortKey.value === key) {
        if (sortDir.value === "desc") {
            sortDir.value = "asc";
        } else {
            sortKey.value = null;
        }
    } else {
        sortKey.value = key;
        sortDir.value = "desc";
    }
};

const currentFilterOptions = computed(() =>
    dataSource.value === "plan" ? planFilterOptions.value : filterOptions.value,
);

const currentAllFilter = computed(() =>
    dataSource.value === "plan" ? planAllFilter.value : allFilter.value,
);

const availableYears = computed(() =>
    (currentFilterOptions.value["A"] || [])
        .map((v) => v)
        .sort()
        .reverse(),
);

const availableProvinces = computed(() => {
    if (!selectedYear.value) return currentFilterOptions.value["B"] || [];
    const provinces = new Set<string>();
    for (const f of currentAllFilter.value) {
        if (f["A"] === selectedYear.value && f["B"]) {
            provinces.add(f["B"]);
        }
    }
    return Array.from(provinces).sort();
});

const availableCategories = computed(() => {
    const base = currentFilterOptions.value["D"] || [];
    if (!selectedYear.value || !selectedProvince.value) return base;
    const cats = new Set<string>();
    for (const f of currentAllFilter.value) {
        if (
            f["A"] === selectedYear.value &&
            f["B"] === selectedProvince.value &&
            f["D"]
        ) {
            cats.add(f["D"]);
        }
    }
    return Array.from(cats).sort();
});

const canQuery = computed(() => selectedYear.value && selectedProvince.value);

const showMatchCol = computed(
    () =>
        dataSource.value !== "plan" &&
        !!(
            (userScore.value !== undefined && userScore.value !== "") ||
            (userRanking.value !== undefined &&
                userRanking.value !== "" &&
                dataSource.value === "ranking")
        ),
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

const totalPages = computed(() =>
    Math.max(1, Math.ceil(results.value.length / PAGE_SIZE)),
);

const paginatedResults = computed(() =>
    results.value.slice(
        (currentPage.value - 1) * PAGE_SIZE,
        currentPage.value * PAGE_SIZE,
    ),
);

const summaryText = computed(() =>
    t("pages.volunteer.summary", { count: results.value.length }),
);

const matchBadgeClass = (row: EnrollRow) => {
    const s = getMatchStatus(row);
    switch (s) {
        case "safe":
            return "bg-(--md-sys-color-tertiary-container) text-(--md-sys-color-on-tertiary-container)";
        case "match":
            return "bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container)";
        case "reach":
            return "bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)";
        default:
            return "";
    }
};

const matchLabel = (row: EnrollRow): string => {
    if (
        userRanking.value !== undefined &&
        userRanking.value !== "" &&
        dataSource.value === "ranking"
    ) {
        const s = getMatchStatus(row);
        const bestRank = Math.min(parseScore(row, "I"), parseScore(row, "J"));
        const worstRank = Math.max(parseScore(row, "I"), parseScore(row, "J"));
        const r = Number(userRanking.value);
        const diffNum = s === "safe" ? bestRank - r : worstRank - r;
        const diffStr = diffNum > 0 ? `+${diffNum}` : `${diffNum}`;
        return `${t(`pages.volunteer.status.${s}`)} ${diffStr}`;
    }
    if (userScore.value === undefined || userScore.value === "") return "";
    const s = getMatchStatus(row);
    const minS = parseScore(row, "G");
    const maxS = parseScore(row, "F");
    const score = Number(userScore.value);
    const diffNum = s === "safe" ? score - maxS : score - minS;
    const diffStr = diffNum > 0 ? `+${diffNum}` : `${diffNum}`;
    return `${t(`pages.volunteer.status.${s}`)} ${diffStr}`;
};

const fetchConfig = async () => {
    configLoading.value = true;
    configError.value = null;
    try {
        const [scoreResp, planResp] = await Promise.all([
            $fetch<{
                code: number;
                data: ConfigData;
                msg: string;
            }>(
                "https://job-web-api.jobpi.cn/enroll/config/v2/2658?sch_school_id=30285",
            ),
            $fetch<{
                code: number;
                data: ConfigData;
                msg: string;
            }>(
                "https://job-web-api.jobpi.cn/enroll/config/v2/1974?sch_school_id=30285",
            ),
        ]);
        if (scoreResp.code !== 200) {
            throw new Error(scoreResp.msg || "Score config fetch failed");
        }
        if (planResp.code !== 200) {
            throw new Error(planResp.msg || "Plan config fetch failed");
        }
        filterOptions.value = scoreResp.data.filter;
        allFilter.value = scoreResp.data.all_filter;
        planFilterOptions.value = planResp.data.filter;
        planAllFilter.value = planResp.data.all_filter;
        selectedYear.value = "2025";
        selectedProvince.value = "江西省";
    } catch (err) {
        console.error(err);
        configError.value =
            (err as Error).message || t("pages.volunteer.fetchError");
    } finally {
        configLoading.value = false;
    }
};

const queryData = async () => {
    if (!canQuery.value) return;

    const filterObj: Record<string, string> = {
        A: selectedYear.value!,
        B: selectedProvince.value!,
    };
    if (dataSource.value === "plan") {
        if (selectedPlanType.value) {
            filterObj["F"] = selectedPlanType.value;
        }
    } else {
        if (selectedCategory.value) {
            filterObj["D"] = selectedCategory.value;
        }
    }

    dataLoading.value = true;
    dataError.value = null;
    rawResults.value = [];
    sortKey.value = null;
    hasQueried.value = true;

    try {
        let allRows: EnrollRow[] = [];

        if (dataSource.value === "ranking") {
            if (!rankingCache.value) {
                rankingCacheLoading.value = true;
                try {
                    rankingCache.value = await $fetch<EnrollRow[]>(
                        "https://csec.jxufe.edu.cn/nozomi/f/%E6%80%BB%E5%BD%95%E5%8F%96%E6%95%B0%E6%8D%AE",
                    );
                } finally {
                    rankingCacheLoading.value = false;
                }
            }
            allRows = (rankingCache.value || []).filter((row) => {
                for (const [key, val] of Object.entries(filterObj)) {
                    if (val && row[key] !== val) return false;
                }
                return true;
            });
        } else if (dataSource.value === "plan") {
            let page = 1;
            let total = 0;

            while (page <= MAX_PAGES) {
                const params = new URLSearchParams({
                    sch_school_id: "30285",
                    filter_column: JSON.stringify(filterObj),
                    page: String(page),
                    page_size: "100",
                });
                const resp = await $fetch<EnrollResponse>(
                    `https://job-web-api.jobpi.cn/enroll/1974?${params}`,
                );
                if (resp.code !== 200) {
                    throw new Error(resp.msg || "Data fetch failed");
                }
                allRows = allRows.concat(resp.data.list);
                total = resp.data.total;
                if (allRows.length >= total || resp.data.list.length === 0)
                    break;
                page += 1;
            }
        } else {
            let page = 1;
            let total = 0;

            while (page <= MAX_PAGES) {
                const params = new URLSearchParams({
                    sch_school_id: "30285",
                    filter_column: JSON.stringify(filterObj),
                    page: String(page),
                    page_size: "100",
                });
                const resp = await $fetch<EnrollResponse>(
                    `https://job-web-api.jobpi.cn/enroll/2658?${params}`,
                );
                if (resp.code !== 200) {
                    throw new Error(resp.msg || "Data fetch failed");
                }
                allRows = allRows.concat(resp.data.list);
                total = resp.data.total;
                if (allRows.length >= total || resp.data.list.length === 0)
                    break;
                page += 1;
            }
        }

        rawResults.value = allRows;

        const targetPage = Math.min(
            currentPage.value,
            Math.max(1, Math.ceil(allRows.length / PAGE_SIZE)),
        );
        if (targetPage !== currentPage.value) {
            await router.push({
                path: route.path,
                query: { ...route.query, page: targetPage },
            });
        }
    } catch (err) {
        console.error(err);
        dataError.value =
            (err as Error).message || t("pages.volunteer.fetchError");
    } finally {
        dataLoading.value = false;
    }
};

const resetFilters = () => {
    selectedYear.value = "2025";
    selectedProvince.value = dataSource.value === "plan" ? "江西" : "江西省";
    selectedCategory.value = null;
    selectedPlanType.value = null;
    userScore.value = undefined;
    userRanking.value = undefined;
    sortKey.value = null;
    rawResults.value = [];
    hasQueried.value = false;
    dataError.value = null;
};

const onYearChange = () => {
    if (
        selectedProvince.value &&
        !availableProvinces.value.includes(selectedProvince.value)
    ) {
        selectedProvince.value = null;
    }
    if (dataSource.value === "plan") {
        if (
            selectedPlanType.value &&
            !availablePlanTypes.value.includes(selectedPlanType.value)
        ) {
            selectedPlanType.value = null;
        }
    } else {
        if (
            selectedCategory.value &&
            !availableCategories.value.includes(selectedCategory.value)
        ) {
            selectedCategory.value = null;
        }
    }
};

const onProvinceChange = () => {
    if (dataSource.value === "plan") {
        if (
            selectedPlanType.value &&
            !availablePlanTypes.value.includes(selectedPlanType.value)
        ) {
            selectedPlanType.value = null;
        }
    } else {
        if (
            selectedCategory.value &&
            !availableCategories.value.includes(selectedCategory.value)
        ) {
            selectedCategory.value = null;
        }
    }
};

watch(
    () => route.query.page,
    () => {
        requestAnimationFrame(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    },
);

onMounted(() => {
    fetchConfig();
});
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Header: 当前月份与切换 -->
    <div class="flex items-center justify-between">
      <div class="flex flex-col items-start">
        <span class="text-xs text-(--md-sys-color-on-surface-variant)">
          {{ currentYear }}
        </span>
        <span class="text-lg font-semibold text-(--md-sys-color-on-surface)">
          {{ currentMonth + 1 }} 月
        </span>
      </div>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="w-7 h-7 rounded-full flex items-center justify-center text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high) transition-colors"
          @click="gotoPrevMonth"
          aria-label="上一月"
        >
          ‹
        </button>
        <button
          type="button"
          class="w-7 h-7 rounded-full flex items-center justify-center text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high) transition-colors"
          @click="gotoNextMonth"
          aria-label="下一月"
        >
          ›
        </button>
      </div>
    </div>

    <!-- 星期标题 -->
    <div class="grid grid-cols-7 text-center text-xs text-(--md-sys-color-on-surface-variant)">
      <div v-for="w in weekdays" :key="w" class="py-1">
        {{ w }}
      </div>
    </div>

    <!-- 日期栅格 -->
    <div class="grid grid-cols-7 text-xs">
      <div
        v-for="(cell, index) in calendarCells"
        :key="index"
        class="h-8 flex items-center justify-center"
      >
        <div
          v-if="cell"
          :class="dayClasses(cell)"
          :title="dayTitle(cell)"
        >
          <span>{{ cell.date.getDate() }}</span>
          <span
            v-if="cell.events.length"
            class="ml-0.5 w-1.5 h-1.5 rounded-full bg-(--md-sys-color-primary) inline-block"
          />
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="flex flex-wrap gap-2 mt-1 text-[11px] text-(--md-sys-color-on-surface-variant)">
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-(--md-sys-color-error-container) border border-(--md-sys-color-error)/40" />
        <span>节假日</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded border border-(--md-sys-color-primary)/60" />
        <span>调休上课</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-(--md-sys-color-primary-container)" />
        <span>今天</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="w-3 h-3 rounded-full bg-(--md-sys-color-primary)" />
        <span>活动</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  calendarConfig as defaultCalendarConfig,
  type CalendarConfig,
  type CalendarOverride,
} from '@/data/calendarConfig'

interface CalendarDayMeta {
  date: Date
  isToday: boolean
  isWeekend: boolean
  isHoliday: boolean
  isWorkdayOverride: boolean
  events: CalendarOverride[]
}

const props = defineProps<{
  config?: CalendarConfig
}>()

const config = computed<CalendarConfig>(() => props.config ?? defaultCalendarConfig)

// 当前展示的年月
const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth()) // 0-11

const weekdays = ['一', '二', '三', '四', '五', '六', '日']

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getOverridesMap(overrides: CalendarOverride[]): Record<string, CalendarOverride[]> {
  const map: Record<string, CalendarOverride[]> = {}
  for (const o of overrides) {
    if (!map[o.date]) map[o.date] = []
    map[o.date].push(o)
  }
  return map
}

const overridesMap = computed(() => getOverridesMap(config.value.overrides))

function buildMonthCells(year: number, month: number): (CalendarDayMeta | null)[] {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const jsWeekDay = firstDay.getDay() // 0=Sun
  const mondayFirstIndex = jsWeekDay === 0 ? 6 : jsWeekDay - 1 // 0..6, 0=Mon

  const cells: (CalendarDayMeta | null)[] = []

  // 前置空格
  for (let i = 0; i < mondayFirstIndex; i++) {
    cells.push(null)
  }

  const todayStr = formatDate(today)

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const dateStr = formatDate(date)
    const overrides = overridesMap.value[dateStr] ?? []

    const jsDay = date.getDay() // 0=Sun,6=Sat
    const isWeekend = jsDay === 0 || jsDay === 6

    let isHoliday = false
    let isWorkdayOverride = false

    // 基于配置判断节假日/工作日
    if (config.value.defaultWeekendIsHoliday && isWeekend) {
      isHoliday = true
    }

    for (const o of overrides) {
      if (o.type === 'holiday') {
        isHoliday = true
        isWorkdayOverride = false
      } else if (o.type === 'workday') {
        isHoliday = false
        isWorkdayOverride = true
      }
    }

    const events = overrides.filter((o) => o.type === 'event')

    cells.push({
      date,
      isToday: dateStr === todayStr,
      isWeekend,
      isHoliday,
      isWorkdayOverride,
      events,
    })
  }

  while (cells.length < 42) {
    cells.push(null)
  }

  return cells
}

const calendarCells = computed(() => buildMonthCells(currentYear.value, currentMonth.value))

function dayClasses(day: CalendarDayMeta): string {
  const classes = [
    'w-8 h-8 rounded-lg flex items-center justify-center text-[13px] select-none transition-colors duration-150',
  ]

  if (day.isToday) {
    classes.push('bg-(--md-sys-color-primary-container) text-(--md-sys-color-on-primary-container) font-semibold')
  } else if (day.isHoliday) {
    classes.push('bg-(--md-sys-color-error-container) text-(--md-sys-color-on-error-container)')
  } else if (day.isWorkdayOverride) {
    classes.push('border border-(--md-sys-color-primary)/60 text-(--md-sys-color-on-surface)')
  } else {
    classes.push('text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-surface-container-high)')
  }

  return classes.join(' ')
}

function dayTitle(day: CalendarDayMeta): string {
  const parts: string[] = []

  if (day.isHoliday) parts.push('节假日')
  if (day.isWorkdayOverride) parts.push('调休上课')
  for (const e of day.events) {
    if (e.name) parts.push(e.name)
  }

  return parts.join(' / ')
}

function gotoPrevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

function gotoNextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}
</script>

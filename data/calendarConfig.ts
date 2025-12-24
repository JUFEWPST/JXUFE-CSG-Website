export type CalendarOverrideType = 'holiday' | 'workday' | 'event'

export interface CalendarOverride {
  // 日期（ISO 字符串，始终使用 YYYY-MM-DD 本地日期，不带时区） 
  date: string
  // 类型：节假日 / 调休上班 / 活动 
  type: CalendarOverrideType
  // 名称：例如 “国庆节”、“校运会” 等 
  name?: string
  // 详细描述
  description?: string
}

export interface CalendarExamWeek {
  // 期末周起始日期（含），YYYY-MM-DD 
  start: string
  // 期末周结束日期（含），YYYY-MM-DD 
  end: string
  // 名称
  name?: string
}

export interface CalendarConfig {
  // 是否默认周末放假
  defaultWeekendIsHoliday: boolean
  // 特殊日期配置：节假日 / 调休上班 / 活动等 
  overrides: CalendarOverride[]
  // 期末周范围
  examWeeks?: CalendarExamWeek[]
}



export interface SemesterCalendarConfig {
  // 学期 ID
  id: string
  // 学期名称标签 
  label: string
  // 学期内是否默认周末放假
  defaultWeekendIsHoliday?: boolean
  overrides: CalendarOverride[]
  examWeeks?: CalendarExamWeek[]
}



function createRange(
  start: string,
  end: string,
  type: Exclude<CalendarOverrideType, 'workday'>,
  name: string,
): CalendarOverride[] {
  const result: CalendarOverride[] = []
  let current = new Date(start)
  const endDate = new Date(end)

  while (current <= endDate) {
    const y = current.getFullYear()
    const m = String(current.getMonth() + 1).padStart(2, '0')
    const d = String(current.getDate()).padStart(2, '0')
    result.push({ date: `${y}-${m}-${d}`, type, name })
    current.setDate(current.getDate() + 1)
  }

  return result
}

export const semesterCalendarConfigs: SemesterCalendarConfig[] = [
  {
    id: '2025-2026-1',
    label: '2025-2026 学年第一学期',
    defaultWeekendIsHoliday: true,
    overrides: [
      // 国庆节 8 天假期
      ...createRange('2025-10-01', '2025-10-08', 'holiday', '国庆节假期'),

      { date: '2025-09-28', type: 'workday', name: '调休上课' },
      { date: '2025-10-11', type: 'workday', name: '调休上课' },

      ...createRange('2025-10-16', '2025-10-18', 'event', '校运会'),

      { date: '2026-01-01', type: 'holiday', name: '元旦假期' },

      ...createRange('2026-01-15', '2026-02-28', 'holiday', '寒假'),
    ],
    examWeeks: [
      {
        start: '2025-12-20',
        end: '2026-01-14',
        name: '期末周',
      },
    ],
  },
  {
    id: '2025-2026-2',
    label: '2025-2026 学年第二学期',
    defaultWeekendIsHoliday: true,
    overrides: [
      { date: '2026-03-01', type: 'event', name: '学生报到注册' },
      // 本科生正式上课
      { date: '2026-03-02', type: 'event', name: '本科生正式上课' },
      ...createRange('2026-04-04', '2026-04-06', 'holiday', '清明节假期'),
      ...createRange('2026-04-25', '2026-04-26', 'event', '期中考试'),
      ...createRange('2026-05-01', '2026-05-05', 'holiday', '劳动节假期'),
      {
        date: '2026-05-09',
        type: 'workday',
        name: '调休上课（补第 10 周周一课程）',
      },

      { date: '2026-06-18', type: 'event', name: '本科生课程结束' },

      ...createRange('2026-06-19', '2026-06-21', 'holiday', '端午节假期'),

      { date: '2026-07-06', type: 'event', name: '暑假开始' },
    ],
    examWeeks: [
      {
        start: '2026-06-22',
        end: '2026-07-05',
        name: '期末周',
      },
    ],
  },

]

export const calendarConfig: CalendarConfig = {
  defaultWeekendIsHoliday: true,
  overrides: semesterCalendarConfigs.flatMap((s) => s.overrides),
  examWeeks: semesterCalendarConfigs.flatMap((s) => s.examWeeks ?? []),
}

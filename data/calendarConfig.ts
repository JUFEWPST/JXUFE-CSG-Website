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



export const semesterCalendarConfigs: SemesterCalendarConfig[] = [
  {
    id: '2025-2026-1',
    label: '2025-2026 学年第一学期',
    defaultWeekendIsHoliday: true,
    overrides: [
      // 国庆节 8 天假期
      { date: '2025-10-01', type: 'holiday', name: '国庆节假期' },
      { date: '2025-10-02', type: 'holiday', name: '国庆节假期' },
      { date: '2025-10-03', type: 'holiday', name: '国庆节假期' },
      { date: '2025-10-04', type: 'holiday', name: '国庆节假期' },
      { date: '2025-10-05', type: 'holiday', name: '国庆节假期' },
      { date: '2025-10-06', type: 'holiday', name: '国庆节假期' },
      { date: '2025-10-07', type: 'holiday', name: '国庆节假期' },
      { date: '2025-10-08', type: 'holiday', name: '国庆节假期' },

      // 国庆调休上课
      { date: '2025-09-28', type: 'workday', name: '调休上课' },
      { date: '2025-10-18', type: 'workday', name: '调休上课' },

      // 运动会
      { date: '2025-10-16', type: 'event', name: '校运会' },
      { date: '2025-10-17', type: 'event', name: '校运会' },
      { date: '2025-10-18', type: 'event', name: '校运会' },

      // 元旦假期
      { date: '2026-01-01', type: 'holiday', name: '元旦假期' },
    ],
    examWeeks: [
      {
        start: '2025-12-20',
        end: '2026-01-14',
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

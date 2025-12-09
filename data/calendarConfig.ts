export type CalendarOverrideType = 'holiday' | 'workday' | 'event'

export interface CalendarOverride {
  /** 日期（ISO 字符串，始终使用 YYYY-MM-DD 本地日期，不带时区） */
  date: string
  /** 类型：节假日 / 调休上班 / 活动 */
  type: CalendarOverrideType
  /** 名称：例如 “国庆节”、“校运会” 等 */
  name?: string
  /** 详细描述，可选 */
  description?: string
}

export interface CalendarConfig {
  /** 是否默认周末放假（true 表示周六日视为休息日） */
  defaultWeekendIsHoliday: boolean
  /** 特殊日期配置：节假日 / 调休 / 活动等 */
  overrides: CalendarOverride[]
}

/**
 * 校历配置示例
 *
 * - 默认周末放假：`defaultWeekendIsHoliday: true`
 * - `overrides` 用于：
 *   - 补班：将周末标记为 `type: 'workday'`
 *   - 工作日放假：将工作日标记为 `type: 'holiday'`
 *   - 活动：使用 `type: 'event'` 并配置 name/description
 *
 * 你可以根据实际校历修改此文件，或在运行时通过接口加载后合并。
 */
export const calendarConfig: CalendarConfig = {
  defaultWeekendIsHoliday: true,
  overrides: [
    // 示例：元旦放假（假设 2026-01-01）
    {
      date: '2026-01-01',
      type: 'holiday',
      name: '元旦假期',
    },
    // 示例：某次活动
    {
      date: '2026-03-15',
      type: 'event',
      name: '校运会',
      description: '全校运动会，下午停课',
    },
    // 示例：周末调休上班
    {
      date: '2026-02-07',
      type: 'workday',
      name: '调休上课',
      description: '为节假日调休补班',
    },
  ],
}

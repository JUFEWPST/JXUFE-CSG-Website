import { computed, watch } from 'vue'
import { useRoute } from '#imports'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export type SidebarSide = 'left' | 'right'
export type SidebarCardScope = 'global' | 'route' | 'page'
export type SidebarCardSlot = 'left' | 'right' | 'mobileBottom' | 'mobileDrawer'

export interface SidebarResolveContext {
  route: RouteLocationNormalizedLoaded
}

// 对外暴露的卡片配置
export interface SidebarCardConfig {
  id: string
  side: SidebarSide
  /** 数值越小越靠上 */
  order?: number
  /** 是否在桌面端吸顶 */
  sticky?: boolean
  /** 是否在移动端底部展示 */
  showOnMobileBottom?: boolean
  /** 是否在移动端浮层抽屉展示 */
  showOnMobileDrawer?: boolean
  /** 统一投放位置（默认包含 side，可选追加 mobileBottom） */
  slots?: SidebarCardSlot[]
  /** 显示范围：全局 / 当前路由 / 当前页面（含 query） */
  scope?: SidebarCardScope
  /** 路由前缀白名单：匹配其一即可展示 */
  includeRoutes?: string[]
  /** 路由前缀黑名单：匹配其一即隐藏 */
  excludeRoutes?: string[]
  /** 互斥分组：同组仅保留一个 */
  mutualGroup?: string
  /** 互斥优先级：越大越优先 */
  priority?: number
  /** 自定义显示条件（运行时判断） */
  when?: (ctx: SidebarResolveContext) => boolean
  /** 移动端抽屉按钮标题（i18n key） */
  mobileLabelKey?: string
  /** 移动端抽屉按钮标题（直传文案） */
  mobileLabel?: string
  /** 实际渲染的组件 */
  component: any
  /** 传递给组件的 props */
  props?: Record<string, any>
}

interface InternalSidebarCard {
  id: string
  side: SidebarSide
  order?: number
  sticky?: boolean
  showOnMobileBottom?: boolean
  showOnMobileDrawer?: boolean
  slots?: SidebarCardSlot[]
  scope?: SidebarCardScope
  includeRoutes?: string[]
  excludeRoutes?: string[]
  mutualGroup?: string
  priority?: number
  ownerRoutePath?: string
  ownerRouteFullPath?: string
  mobileLabelKey?: string
  mobileLabel?: string
  props?: Record<string, any>
}

// 本地组件 / 运行时规则注册表（避免 useState 序列化函数导致 SSR 报错）
const componentRegistry: Record<string, any> = {}
const ruleRegistry: Record<string, { when?: (ctx: SidebarResolveContext) => boolean }> = {}

const SIDEBAR_STATE_KEY = 'sidebar_cards_state'

export const useSidebarLayout = () => {
  const route = useRoute()
  const state = useState<{ cards: InternalSidebarCard[] }>(SIDEBAR_STATE_KEY, () => ({
    cards: [],
  }))

  const registerCard = (config: SidebarCardConfig) => {
    const index = state.value.cards.findIndex((c) => c.id === config.id)

    // 更新/注册组件到本地注册表
    if (config.component) {
      componentRegistry[config.id] = config.component
    }
    if (config.when) {
      ruleRegistry[config.id] = { when: config.when }
    }

    const scope = config.scope ?? 'global'
    const ownerRoutePath = scope === 'route' ? route.path : undefined
    const ownerRouteFullPath = scope === 'page' ? route.fullPath : undefined

    const base: InternalSidebarCard = {
      id: config.id,
      side: config.side,
      order: config.order ?? 100,
      sticky: config.sticky ?? false,
      showOnMobileBottom: config.showOnMobileBottom ?? false,
      showOnMobileDrawer: config.showOnMobileDrawer ?? false,
      slots: config.slots,
      scope,
      includeRoutes: config.includeRoutes,
      excludeRoutes: config.excludeRoutes,
      mutualGroup: config.mutualGroup,
      priority: config.priority,
      mobileLabelKey: config.mobileLabelKey,
      mobileLabel: config.mobileLabel,
      ownerRoutePath,
      ownerRouteFullPath,
      props: config.props,
    }

    if (index !== -1) {
      state.value.cards[index] = { ...state.value.cards[index], ...base }
    } else {
      state.value.cards.push(base)
    }
  }

  const unregisterCard = (id: string) => {
    state.value.cards = state.value.cards.filter((c) => c.id !== id)
    delete componentRegistry[id]
    delete ruleRegistry[id]
  }

  const clearSide = (side: SidebarSide) => {
    const idsToRemove = state.value.cards.filter((c) => c.side === side).map((c) => c.id)
    state.value.cards = state.value.cards.filter((c) => c.side !== side)
    idsToRemove.forEach((id) => {
      delete componentRegistry[id]
      delete ruleRegistry[id]
    })
  }

  const setCardOptions = (
    id: string,
    options: Partial<SidebarCardConfig>,
  ) => {
    const index = state.value.cards.findIndex((c) => c.id === id)
    if (index !== -1) {
      const card = state.value.cards[index]
      if (!card) return
      if (options.component) {
        componentRegistry[id] = options.component
      }
      if (options.when) {
        ruleRegistry[id] = { when: options.when }
      }
      // 只更新可序列化的选项
      Object.assign(card, {
        side: options.side ?? card.side,
        order: options.order ?? card.order,
        sticky: options.sticky ?? card.sticky,
        showOnMobileBottom: options.showOnMobileBottom ?? card.showOnMobileBottom,
        showOnMobileDrawer: options.showOnMobileDrawer ?? card.showOnMobileDrawer,
        slots: options.slots ?? card.slots,
        scope: options.scope ?? card.scope,
        includeRoutes: options.includeRoutes ?? card.includeRoutes,
        excludeRoutes: options.excludeRoutes ?? card.excludeRoutes,
        mutualGroup: options.mutualGroup ?? card.mutualGroup,
        priority: options.priority ?? card.priority,
        mobileLabelKey: options.mobileLabelKey ?? card.mobileLabelKey,
        mobileLabel: options.mobileLabel ?? card.mobileLabel,
        props: options.props ?? card.props,
      })
    }
  }

  const matchRoutePrefix = (path: string, prefixes?: string[]) => {
    if (!prefixes || !prefixes.length) return true
    return prefixes.some((prefix) => path.startsWith(prefix))
  }

  const isScopeActive = (card: InternalSidebarCard) => {
    const scope = card.scope ?? 'global'
    if (scope === 'global') return true
    if (scope === 'route') return card.ownerRoutePath === route.path
    if (scope === 'page') return card.ownerRouteFullPath === route.fullPath
    return true
  }

  const resolveSlots = (card: InternalSidebarCard): SidebarCardSlot[] => {
    if (card.slots && card.slots.length) return card.slots
    const slots: SidebarCardSlot[] = [card.side]
    if (card.showOnMobileBottom) slots.push('mobileBottom')
    if (card.showOnMobileDrawer) slots.push('mobileDrawer')
    return slots
  }

  const isHigherPriority = (candidate: InternalSidebarCard, current: InternalSidebarCard) => {
    const priorityA = candidate.priority ?? 0
    const priorityB = current.priority ?? 0
    if (priorityA !== priorityB) return priorityA > priorityB
    const orderA = candidate.order ?? 100
    const orderB = current.order ?? 100
    return orderA < orderB
  }

  const resolvedCards = computed(() => {
    const ctx: SidebarResolveContext = { route }

    const filtered = state.value.cards
      .filter((c) => isScopeActive(c))
      .filter((c) => matchRoutePrefix(route.path, c.includeRoutes))
      .filter((c) => !c.excludeRoutes || !matchRoutePrefix(route.path, c.excludeRoutes))
      .filter((c) => {
        const rule = ruleRegistry[c.id]
        if (rule?.when) return rule.when(ctx)
        return true
      })
      .filter((c) => !!componentRegistry[c.id])

    const grouped = new Map<string, InternalSidebarCard>()
    const ungrouped: InternalSidebarCard[] = []

    filtered.forEach((card) => {
      if (!card.mutualGroup) {
        ungrouped.push(card)
        return
      }
      const existing = grouped.get(card.mutualGroup)
      if (!existing || isHigherPriority(card, existing)) {
        grouped.set(card.mutualGroup, card)
      }
    })

    const combined = [...ungrouped, ...grouped.values()]
    return combined.map((c) => ({
      ...c,
      slots: resolveSlots(c),
      component: componentRegistry[c.id],
    }))
  })

  const leftCards = computed(() =>
    resolvedCards.value
      .filter((c) => c.slots.includes('left'))
      .slice()
      // 非 sticky 卡片在前，sticky 卡片在后；同类型再按 order 排序
      .sort((a, b) => {
        const stickyA = a.sticky ? 1 : 0
        const stickyB = b.sticky ? 1 : 0
        if (stickyA !== stickyB) return stickyA - stickyB
        return (a.order ?? 100) - (b.order ?? 100)
      }),
  )

  const rightCards = computed(() =>
    resolvedCards.value
      .filter((c) => c.slots.includes('right'))
      .slice()
      // 非 sticky 卡片在前，sticky 卡片在后；同类型再按 order 排序
      .sort((a, b) => {
        const stickyA = a.sticky ? 1 : 0
        const stickyB = b.sticky ? 1 : 0
        if (stickyA !== stickyB) return stickyA - stickyB
        return (a.order ?? 100) - (b.order ?? 100)
      }),
  )

  const mobileBottomCards = computed(() =>
    resolvedCards.value
      .filter((c) => c.slots.includes('mobileBottom'))
      .slice()
      .sort((a, b) => (a.order ?? 100) - (b.order ?? 100)),
  )

  const mobileDrawerCards = computed(() =>
    resolvedCards.value
      .filter((c) => c.slots.includes('mobileDrawer'))
      .slice()
      .sort((a, b) => (a.order ?? 100) - (b.order ?? 100)),
  )

  const pruneScopedCards = () => {
    const beforeIds = state.value.cards.map((c) => c.id)
    state.value.cards = state.value.cards.filter((c) => {
      const scope = c.scope ?? 'global'
      if (scope === 'page') return c.ownerRouteFullPath === route.fullPath
      if (scope === 'route') return c.ownerRoutePath === route.path
      return true
    })
    const afterIds = new Set(state.value.cards.map((c) => c.id))
    beforeIds.forEach((id) => {
      if (!afterIds.has(id)) {
        delete componentRegistry[id]
        delete ruleRegistry[id]
      }
    })
  }

  watch(
    () => route.fullPath,
    () => {
      pruneScopedCards()
    },
  )

  return {
    leftCards,
    rightCards,
    mobileBottomCards,
    mobileDrawerCards,
    registerCard,
    unregisterCard,
    clearSide,
    setCardOptions,
  }
}

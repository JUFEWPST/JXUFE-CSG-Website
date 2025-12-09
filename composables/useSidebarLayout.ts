import { computed } from 'vue'

export type SidebarSide = 'left' | 'right'

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
  props?: Record<string, any>
}

// 本地组件注册表
const componentRegistry: Record<string, any> = {}

const SIDEBAR_STATE_KEY = 'sidebar_cards_state'

export const useSidebarLayout = () => {
  const state = useState<{ cards: InternalSidebarCard[] }>(SIDEBAR_STATE_KEY, () => ({
    cards: [],
  }))

  const registerCard = (config: SidebarCardConfig) => {
    const index = state.value.cards.findIndex((c) => c.id === config.id)

    // 更新/注册组件到本地注册表
    if (config.component) {
      componentRegistry[config.id] = config.component
    }

    const base: InternalSidebarCard = {
      id: config.id,
      side: config.side,
      order: config.order ?? 100,
      sticky: config.sticky ?? false,
      showOnMobileBottom: config.showOnMobileBottom ?? false,
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
  }

  const clearSide = (side: SidebarSide) => {
    const idsToRemove = state.value.cards.filter((c) => c.side === side).map((c) => c.id)
    state.value.cards = state.value.cards.filter((c) => c.side !== side)
    idsToRemove.forEach((id) => {
      delete componentRegistry[id]
    })
  }

  const setCardOptions = (
    id: string,
    options: Partial<Pick<InternalSidebarCard, 'order' | 'sticky' | 'showOnMobileBottom' | 'props'>>,
  ) => {
    const index = state.value.cards.findIndex((c) => c.id === id)
    if (index !== -1) {
      const card = state.value.cards[index]
      if (!card) return
      // 只更新可变选项
      Object.assign(card, options)
    }
  }

  const leftCards = computed(() =>
    state.value.cards
      .filter((c) => c.side === 'left')
      .slice()
      .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
      .map((c) => ({ ...c, component: componentRegistry[c.id] })),
  )

  const rightCards = computed(() =>
    state.value.cards
      .filter((c) => c.side === 'right')
      .slice()
      .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
      .map((c) => ({ ...c, component: componentRegistry[c.id] })),
  )

  const mobileBottomCards = computed(() =>
    state.value.cards
      .filter((c) => c.showOnMobileBottom)
      .slice()
      .sort((a, b) => (a.order ?? 100) - (b.order ?? 100))
      .map((c) => ({ ...c, component: componentRegistry[c.id] })),
  )

  return {
    leftCards,
    rightCards,
    mobileBottomCards,
    registerCard,
    unregisterCard,
    clearSide,
    setCardOptions,
  }
}

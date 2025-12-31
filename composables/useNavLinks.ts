
export interface NavChildLink {
    path: string
    label: string
}

export interface BaseNavLink {
    path: string
    label: string
    defaultPath?: string
    /**
     * 如果为 true，该入口将默认固定在“更多”菜单中（不参与顶部可见区域的宽度计算）。
     */
    alwaysInMore?: boolean
}

export interface NavLinkWithChildren extends BaseNavLink {
    children: NavChildLink[]
}

export type NavLink = BaseNavLink | NavLinkWithChildren

export const useNavLinks = (): NavLink[] => {
    return [
        {
            path: '/',
            label: 'nav.home'
        },
        {
            path: '/archive',
            label: 'nav.archive'
        },
        {
            path: '/about',
            defaultPath: '/about',
            label: 'nav.about',
            children: [
                { path: '/about', label: 'nav.aboutChildren.index' },
                { path: '/about/teacher', label: 'nav.aboutChildren.teacher' },
                { path: '/about/leaders', label: 'nav.aboutChildren.leaders' },
                { path: '/about/members', label: 'nav.aboutChildren.members' },
                { path: '/about/excellent', label: 'nav.aboutChildren.excellent' }
            ]
        },
        {
            path: '/links',
            label: 'nav.links'
        },
        {
            path: '/timeline',
            label: 'nav.timeline',
            alwaysInMore: true
        }
    ]
}

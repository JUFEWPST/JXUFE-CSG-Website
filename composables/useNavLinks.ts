
export interface NavChildLink {
    path: string
    label: string
}

export interface BaseNavLink {
    path: string
    label: string
    icon: string
    color: string
    defaultPath?: string
}

export interface NavLinkWithChildren extends BaseNavLink {
    children: NavChildLink[]
}

export type NavLink = BaseNavLink | NavLinkWithChildren

export const useNavLinks = (): NavLink[] => {
    return [
        { path: '/', label: 'nav.home', icon: '✧', color: 'pink' },
        { path: '/archive', label: 'nav.archive', icon: '✦', color: 'blue' },
        {
            path: '/about',
            defaultPath: '/about',
            label: 'nav.about',
            icon: '✧',
            color: 'purple',
            children: [
                { path: '/about', label: 'nav.aboutChildren.index' },
                { path: '/about/leaders', label: 'nav.aboutChildren.leaders' },
                { path: '/about/members', label: 'nav.aboutChildren.members' },
                { path: '/about/excellent', label: 'nav.aboutChildren.excellent' }
            ]
        },
        { path: '/links', label: 'nav.links', icon: '✦', color: 'yellow' }
    ]
}

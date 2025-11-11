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

export const useNavLinks = (): NavLink[] => ([
    { path: '/', label: '首页', icon: '✧', color: 'pink' },
    { path: '/archive', label: '归档', icon: '✦', color: 'blue' },
    {
        path: '/about',
        defaultPath: '/about',
        label: '关于协会',
        icon: '✧',
        color: 'purple',
        children: [
            { path: '/about', label: '协会简介' },
            { path: '/about/leaders', label: '历届负责人' },
            { path: '/about/members', label: '历届成员' },
            { path: '/about/excellent', label: '优秀成员' }
        ]
    },
    { path: '/links', label: '相关链接', icon: '✦', color: 'yellow' }
])

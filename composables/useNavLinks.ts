import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue'
import {
    HomeIcon,
    ArchiveBoxIcon,
    UserGroupIcon,
    LinkIcon,
    ClockIcon,
    BookOpenIcon,
} from "@heroicons/vue/24/outline";
export interface NavChildLink {
    path: string
    label: string
}

export interface BaseNavLink {
    path: string
    label: string
    defaultPath?: string
    alwaysInMore?: boolean
    icon?: FunctionalComponent<HTMLAttributes & VNodeProps>
}

export interface NavLinkWithChildren extends BaseNavLink {
    children: NavChildLink[]
}

export type NavLink = BaseNavLink | NavLinkWithChildren

export const useNavLinks = (): NavLink[] => {
    return [
        {
            path: '/',
            label: 'nav.home',
            icon: HomeIcon
        },
        {
            path: '/archive',
            label: 'nav.archive',
            icon: ArchiveBoxIcon
        },
        {
            path: '/wiki',
            label: 'nav.wiki',
            icon: BookOpenIcon
        },
        {
            path: '/about',
            defaultPath: '/about',
            label: 'nav.about',
            icon: UserGroupIcon,
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
            label: 'nav.links',
            icon: LinkIcon
        },
        {
            path: '/timeline',
            label: 'nav.timeline',
            alwaysInMore: true,
            icon: ClockIcon
        }
    ]
}

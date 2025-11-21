import { reactive } from 'vue'
import type { NavLinkWithChildren } from './useNavLinks'

type DropdownStates = Record<string, boolean>

interface DropdownController {
    states: DropdownStates
    open: (path: string) => void
    close: (path: string) => void
    toggle: (path: string) => void
    closeAll: () => void
}

export const useDropdownController = (links: NavLinkWithChildren[]): DropdownController => {
    const states = reactive<DropdownStates>(
        links.reduce((acc, link) => {
            acc[link.path] = false
            return acc
        }, {} as DropdownStates)
    )

    const open = (path: string) => {
        states[path] = true
    }

    const close = (path: string) => {
        states[path] = false
    }

    const toggle = (path: string) => {
        states[path] = !states[path]
    }

    const closeAll = () => {
        Object.keys(states).forEach(key => {
            states[key] = false
        })
    }

    return {
        states,
        open,
        close,
        toggle,
        closeAll
    }
}

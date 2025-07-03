import { ref, onMounted, watchEffect } from 'vue'

export default function useTheme() {
    const isDark = ref(false)
    const isClient = () => typeof window !== 'undefined'

    const initTheme = () => {
        if (!isClient()) return

        const savedTheme = localStorage.getItem('dark-theme')
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        isDark.value = savedTheme ? savedTheme === 'dark' : systemDark
        updateHtmlClass()
    }

    const updateHtmlClass = () => {
        if (!isClient()) return
        document.documentElement.classList.toggle('dark', isDark.value)
    }

    const toggleTheme = () => {
        isDark.value = !isDark.value
        if (isClient()) {
            localStorage.setItem('dark-theme', isDark.value ? 'dark' : 'light')
        }
        updateHtmlClass()
    }

    const watchSystemTheme = () => {
        if (!isClient()) return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handler = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('dark-theme')) {
                isDark.value = e.matches
                updateHtmlClass()
            }
        }

        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }
    if (import.meta.client) {
        onMounted(() => {
            initTheme()
            const cleanup = watchSystemTheme()
            return () => cleanup?.()
        })

        watchEffect(() => {
            updateHtmlClass()
        })
    }

    return { isDark, toggleTheme }
}
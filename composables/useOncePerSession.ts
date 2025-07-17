export const useOncePerSession = (key: string, fn: () => void) => {
    onMounted(() => {
        const isClient = () => typeof window !== 'undefined'
        if (!isClient()) return
        const hasRun = sessionStorage.getItem(key)
        if (!hasRun) {
            fn()
            sessionStorage.setItem(key, 'executed')
        }
    })
}
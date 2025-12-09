export const useRightSidebar = () => {
    const hasContent = useState('right-sidebar-has-content', () => false)

    const setHasContent = (value: boolean) => {
        hasContent.value = value
    }

    const clearRightSidebar = () => {
        hasContent.value = false
    }

    return { hasContent, setHasContent, clearRightSidebar }
}

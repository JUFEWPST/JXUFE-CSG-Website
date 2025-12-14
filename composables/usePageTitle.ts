export const usePageTitle = () => {
    const titleKey = useState<string>('page_title_key', () => '')

    const setPageTitle = (key: string) => {
        titleKey.value = key
    }

    return {
        titleKey,
        setPageTitle
    }
}

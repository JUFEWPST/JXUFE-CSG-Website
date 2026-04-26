import { useI18n } from "vue-i18n";

export const usePageTitle = () => {
    const titleKey = useState<string>("page_title_key", () => "");
    const titleRaw = useState<string>("page_title_raw", () => "");
    const titleSuffixKey = useState<string>("page_title_suffix_key", () => "");

    const { t } = useI18n();

    const setPageTitle = (key: string, raw?: string, suffixKey?: string) => {
        titleKey.value = key;
        titleRaw.value = raw || "";
        titleSuffixKey.value = suffixKey || "";
    };

    const displayTitle = computed(() => {
        if (titleRaw.value) return titleRaw.value;
        if (titleKey.value) return t(titleKey.value);
        return "";
    });

    const displaySuffix = computed(() => {
        if (titleSuffixKey.value) return ` ${t(titleSuffixKey.value)}`;
        return "";
    });

    return {
        titleKey,
        titleRaw,
        displayTitle,
        displaySuffix,
        setPageTitle,
    };
};

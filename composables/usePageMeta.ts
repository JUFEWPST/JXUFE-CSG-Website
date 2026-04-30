import { usePageTitle } from "./usePageTitle";

export interface PageMetaOptions {
    titleKey?: string;
    titleOverride?: string;
    descriptionKey: string;
    suffixKey?: string;
    keywords?: string;
    canonicalPath?: string;
    schema?: Record<string, unknown> | null;
    noIndex?: boolean;
}

export function usePageMeta(options: PageMetaOptions) {
    const { t, locale, locales } = useI18n();
    const config = useRuntimeConfig();
    const route = useRoute();
    const { setPageTitle } = usePageTitle();

    const siteUrl = ((config.public.siteUrl as string) || "").replace(
        /\/+$/,
        "",
    );
    const canonicalPath = options.canonicalPath ?? route.path;
    const url = `${siteUrl}${canonicalPath}`;
    const ogLocale = computed(() => {
        const current = (locales.value as { code: string; iso: string }[]).find(
            (l) => l.code === locale.value,
        );
        return (current?.iso ?? "zh-CN").replace("-", "_");
    });

    if (options.titleKey) {
        setPageTitle(options.titleKey, options.titleOverride, options.suffixKey);
    } else {
        setPageTitle("", options.titleOverride, options.suffixKey);
    }

    const pageTitle = computed(() => {
        if (options.titleOverride) return options.titleOverride;
        if (options.titleKey) return t(options.titleKey);
        return t("pages.home.meta.title");
    });
    const ogTitle = computed(
        () => `${pageTitle.value} - ${t("meta.fullName")}`,
    );
    const description = computed(() => t(options.descriptionKey));

    useSeoMeta({
        ogType: "website",
        ogTitle,
        ogDescription: description,
        ogUrl: () => url,
        ogSiteName: () => t("meta.fullName"),
        ogLocale,
        twitterCard: "summary",
        twitterTitle: ogTitle,
        twitterDescription: description,
    });

    useHead(() => {
        const headConfig: Record<string, unknown> = {
            meta: [
                { name: "description", content: description.value },
                {
                    name: "robots",
                    content: options.noIndex
                        ? "noindex, follow"
                        : "index, follow",
                },
            ],
            link: [{ rel: "canonical", href: url }],
        };

        if (options.keywords) {
            (headConfig.meta as Record<string, unknown>[]).push({
                name: "keywords",
                content: options.keywords,
            });
        }

        if (options.schema !== null) {
            const baseSchema: Record<string, unknown> = {
                "@context": "https://schema.org",
                "@type": "WebPage",
                name: ogTitle.value,
                description: description.value,
                url,
            };

            const merged = options.schema
                ? { ...baseSchema, ...options.schema }
                : baseSchema;
            headConfig.script = [
                {
                    type: "application/ld+json",
                    innerHTML: JSON.stringify(merged),
                },
            ];
        }

        return headConfig;
    });
}

const BOT_UA_PATTERNS: RegExp[] = [
    /Googlebot/i,
    /Bingbot/i,
    /Baiduspider/i,
    /YandexBot/i,
    /DuckDuckBot/i,
    /Sogou/i,
    /YisouSpider/i,
    /360Spider/i,
    /HaosouSpider/i,
    /Bytespider/i,
    /PetalBot/i,
    /Applebot/i,
    /Twitterbot/i,
    /facebookexternalhit/i,
    /facebot/i,
    /LinkedInBot/i,
    /WhatsApp/i,
    /TelegramBot/i,
    /Slackbot/i,
    /Discordbot/i,
    /WeChat/i,
    /MicroMessenger/i,
    /Weibo/i,
    /AhrefsBot/i,
    /SemrushBot/i,
    /MJ12bot/i,
    /SeznamBot/i,
    /ia_archiver/i,
];

const isBotUA = (ua: string | null | undefined): boolean => {
    if (!ua) return false;
    return BOT_UA_PATTERNS.some((p) => p.test(ua));
};

const stripMarkdown = (input: string): string =>
    input
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`\n]+`/g, " ")
        .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
        .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
        .replace(/<[^>]+>/g, " ")
        .replace(/[#>*_~\-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const buildExcerpt = (
    content: string | null | undefined,
    max = 160,
): string => {
    if (!content) return "";
    const cleaned = stripMarkdown(content);
    if (cleaned.length <= max) return cleaned;
    return `${cleaned.slice(0, max).trimEnd()}…`;
};

const encodePath = (path: string): string =>
    path
        .split("/")
        .map((seg) => {
            if (!seg) return seg;
            try {
                return encodeURIComponent(decodeURIComponent(seg));
            } catch {
                return encodeURIComponent(seg);
            }
        })
        .join("/");

interface CmsEnvelope<T> {
    code: number;
    message?: string;
    data: T;
}

interface ContentResponse {
    title?: string;
    slug?: string;
    data?: {
        title?: string;
        body?: string;
        content?: string;
        publish_time?: string;
        publisher?: string;
        [key: string]: unknown;
    };
    tags?: { name: string }[];
}

export interface UseBotMetaOptions {
    schema?: "Article" | "TechArticle" | "WebPage" | "CollectionPage";
    type?: "website" | "article";
    siteName?: string;
    locale?: string;
    titleFormatter?: (title: string) => string;
}

export async function useBotMeta(
    endpointFactory: () => string | null,
    options: UseBotMetaOptions = {},
) {
    if (import.meta.client) return;

    const event = useRequestEvent();
    const uaHeader = event?.node?.req?.headers["user-agent"];
    const ua = Array.isArray(uaHeader) ? uaHeader[0] : uaHeader;
    if (!isBotUA(ua)) return;

    const endpoint = endpointFactory();
    if (!endpoint) return;
    const nuxtApp = useNuxtApp();
    const config = useRuntimeConfig();
    const apiBase =
        (config.public.apiBase as string) ||
        "https://csec.jxufe.edu.cn/nozomi";
    const siteUrl = (
        (config.public.siteUrl as string) || "https://csec.jxufe.edu.cn"
    ).replace(/\/+$/, "");
    const route = useRoute();
    const routePath = route.path;

    let payload: ContentResponse | null = null;
    try {
        const res = await $fetch<CmsEnvelope<ContentResponse>>(
            `${apiBase}${endpoint}`,
            { headers: { Accept: "application/json" } },
        );
        if (res?.code === 200 && res.data) {
            payload = res.data;
        }
    } catch {
        return;
    }

    if (!payload) return;

    const rawTitle = payload.data?.title || payload.title || "";
    const title = options.titleFormatter
        ? options.titleFormatter(rawTitle)
        : rawTitle;
    const description = buildExcerpt(
        payload.data?.body || payload.data?.content || "",
    );
    const tags = (payload.tags ?? []).map((t) => t.name);
    const author = payload.data?.publisher;
    const publishedAt = payload.data?.publish_time;
    const schema = options.schema ?? "Article";
    const ogType = options.type ?? "article";
    const siteName = options.siteName ?? "江西财经大学网络安全协会";
    const ogLocale = (options.locale ?? "zh_CN").replace("-", "_");
    const url = `${siteUrl}${encodePath(routePath)}`;

    const seoPayload: Record<string, unknown> = {
        ogType,
        ogUrl: url,
        ogSiteName: siteName,
        ogLocale,
        twitterCard: "summary_large_image",
    };
    if (title) {
        seoPayload.title = title;
        seoPayload.ogTitle = title;
        seoPayload.twitterTitle = title;
    }
    if (description) {
        seoPayload.description = description;
        seoPayload.ogDescription = description;
        seoPayload.twitterDescription = description;
    }
    if (publishedAt) seoPayload.articlePublishedTime = publishedAt;
    if (author) seoPayload.articleAuthor = author;
    if (tags.length) seoPayload.articleTag = tags;

    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": schema,
        headline: title,
        name: title,
        description,
        url,
        inLanguage: options.locale ?? "zh-CN",
        author: author
            ? { "@type": "Person", name: author }
            : { "@type": "Organization", name: siteName },
        isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    };
    if (publishedAt) jsonLd.datePublished = publishedAt;
    if (tags.length) jsonLd.keywords = tags.join(", ");

    nuxtApp.runWithContext(() => {
        useSeoMeta(seoPayload);
        useHead(
            {
                title,
                link: [{ rel: "canonical", href: url }],
                script: [
                    {
                        type: "application/ld+json",
                        innerHTML: JSON.stringify(jsonLd),
                    },
                ],
            },
            { tagPriority: "high" },
        );
    });
}

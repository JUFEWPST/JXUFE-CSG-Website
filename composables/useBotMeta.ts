import { isbot } from "isbot";
import { getApiLocale } from "~/utils/i18n";

// 微信/QQ 内置浏览器不是爬虫，但分享卡片需要爬虫级元数据
const INAPP_BROWSER_PATTERNS: RegExp[] = [/MicroMessenger/i, /MQQBrowser/i];

const isBotUA = (ua: string | null | undefined): boolean => {
    if (!ua) return false;
    return isbot(ua) || INAPP_BROWSER_PATTERNS.some((p) => p.test(ua));
};

const stripMarkdown = (input: string): string =>
    input
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`\n]+`/g, " ")
        .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
        .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
        .replace(/<[^>]+>/g, " ")
        .replace(/[#>*_~-]+/g, " ")
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

type Dict = Record<string, unknown>;

/**
 * 归一化 CMS 内容对象：详情 { id, data: { title, body, ... }, tags }、
 * wiki 容器页 { content: null, treeNode }、列表接口返回数组。
 */
interface NormalizedContent {
    title: string;
    description: string;
    author?: string;
    publishedAt?: string;
    tags: string[];
}

const normalizeContent = (payload: unknown): NormalizedContent | null => {
    if (!payload || typeof payload !== "object") return null;
    if (Array.isArray(payload)) return null;

    const root = payload as Dict;
    // wiki：正文在 content 下，容器页标题在 treeNode
    const content =
        root.content && typeof root.content === "object"
            ? (root.content as Dict)
            : root;
    const data =
        content.data && typeof content.data === "object"
            ? (content.data as Dict)
            : {};

    const getStr = (...keys: unknown[]): string => {
        for (const k of keys) {
            if (typeof k === "string" && k.trim()) return k.trim();
        }
        return "";
    };

    const title = getStr(
        data.title,
        content.title,
        root.title,
        root.treeNode && typeof root.treeNode === "object"
            ? ((root.treeNode as Dict).title as string)
            : undefined,
    );
    const body = getStr(data.body, data.content, content.body);
    const author =
        getStr(data.publisher, data.author, content.publisher) || undefined;
    const publishedAt =
        getStr(data.publish_time, data.published_at, content.publish_time) ||
        undefined;
    const rawTags = content.tags ?? root.tags;
    const tags = Array.isArray(rawTags)
        ? rawTags
              .map((t) =>
                  t && typeof t === "object"
                      ? ((t as Dict).name as string)
                      : String(t ?? ""),
              )
              .filter(Boolean)
        : [];

    return { title, description: body, author, publishedAt, tags };
};

export interface UseBotMetaOptions {
    schema?: "Article" | "TechArticle" | "WebPage" | "CollectionPage";
    type?: "website" | "article";
    siteName?: string;
    locale?: string;
    titleFormatter?: (title: string) => string;
    ogImage?: string;
}

/**
 * 仅服务端对爬虫渲染 SEO 元数据。
 * payloadFactory 提供 useAsyncData 已取回的内容对象（或 null）。
 */
export async function useBotMeta(
    payloadFactory: () => unknown | Promise<unknown>,
    options: UseBotMetaOptions = {},
) {
    if (import.meta.client) return;

    // 依赖 Nuxt 上下文的调用必须在第一个 await 之前同步完成：
    // 页面 setup 在 await 后续跑时，嵌套 await 会丢失 Vue 实例上下文
    const nuxtApp = useNuxtApp();
    const config = useRuntimeConfig();
    const route = useRoute();

    const event = useRequestEvent();
    const uaHeader = event?.node?.req?.headers["user-agent"];
    const ua = Array.isArray(uaHeader) ? uaHeader[0] : uaHeader;
    if (!isBotUA(ua)) return;

    const payload = await payloadFactory();
    const normalized = normalizeContent(payload);
    if (!normalized) return;

    const siteUrl = (
        (config.public.siteUrl as string) || "https://csec.jxufe.edu.cn"
    ).replace(/\/+$/, "");
    const url = `${siteUrl}${encodePath(route.path)}`;

    const rawTitle = normalized.title;
    const title = options.titleFormatter
        ? options.titleFormatter(rawTitle)
        : rawTitle;
    const description = buildExcerpt(normalized.description);
    const siteName = options.siteName ?? "江西财经大学网络安全协会";
    const canonicalLocale = getApiLocale(options.locale ?? "zh");
    const ogLocale = canonicalLocale.replace("-", "_");
    const schema = options.schema ?? "Article";
    const ogType = options.type ?? "article";

    const seoPayload: Record<string, unknown> = {
        ogType,
        ogUrl: url,
        ogSiteName: siteName,
        ogLocale,
        ogImage: options.ogImage,
        twitterCard: "summary_large_image",
        twitterImage: options.ogImage,
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
    if (normalized.publishedAt)
        seoPayload.articlePublishedTime = normalized.publishedAt;
    if (normalized.author) seoPayload.articleAuthor = normalized.author;
    if (normalized.tags.length) seoPayload.articleTag = normalized.tags;

    const articleLike = schema === "Article" || schema === "TechArticle";
    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": schema,
        headline: rawTitle || title,
        name: rawTitle || title,
        description,
        url,
        inLanguage: canonicalLocale,
        author: normalized.author
            ? { "@type": "Person", name: normalized.author }
            : { "@type": "Organization", name: siteName },
        isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    };
    if (normalized.publishedAt) jsonLd.datePublished = normalized.publishedAt;
    if (normalized.tags.length) jsonLd.keywords = normalized.tags.join(", ");

    nuxtApp.runWithContext(() => {
        useSeoMeta(seoPayload);
        useHead(
            {
                title,
                link: [{ rel: "canonical", href: url }],
                // 文章类 schema 仅在存在正文时输出
                script:
                    articleLike && !description
                        ? []
                        : [
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

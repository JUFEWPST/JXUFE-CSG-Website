import type { WikiTreeNode } from "~/types/wiki";

interface ArchiveEntry {
    slug?: string;
    path?: string;
    data?: {
        publish_time?: string;
        updated_at?: string;
    };
}

interface ApiEnvelope<T> {
    code: number;
    message?: string;
    data: T;
    meta?: {
        current_page?: number;
        total_pages?: number;
    };
}

interface SitemapUrl {
    loc: string;
    lastmod?: string;
    changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
    priority?: number;
}

const STATIC_ROUTES: SitemapUrl[] = [
    { loc: "/", changefreq: "weekly", priority: 1.0 },
    { loc: "/archive", changefreq: "weekly", priority: 0.7 },
    { loc: "/wiki", changefreq: "weekly", priority: 0.7 },
    { loc: "/timeline", changefreq: "monthly", priority: 0.5 },
    { loc: "/ctf-event", changefreq: "weekly", priority: 0.6 },
    { loc: "/links", changefreq: "monthly", priority: 0.4 },
    { loc: "/about", changefreq: "monthly", priority: 0.8 },
    { loc: "/about/teacher", changefreq: "yearly", priority: 0.6 },
    { loc: "/about/leaders", changefreq: "monthly", priority: 0.5 },
    { loc: "/about/members", changefreq: "monthly", priority: 0.7 },
    { loc: "/about/excellent", changefreq: "monthly", priority: 0.6 },
    { loc: "/privacy", changefreq: "yearly", priority: 0.2 },
];

const escapeXml = (value: string): string =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

const encodePath = (path: string): string =>
    path
        .split("/")
        .map((seg) => (seg ? encodeURIComponent(seg) : seg))
        .join("/");

const toIsoDate = (input?: string): string | undefined => {
    if (!input) return undefined;
    const t = Date.parse(input);
    if (!Number.isFinite(t)) return undefined;
    return new Date(t).toISOString();
};

const fetchEnvelope = async <T>(
    url: string,
): Promise<ApiEnvelope<T> | null> => {
    try {
        const res = await $fetch<ApiEnvelope<T>>(url, {
            headers: { Accept: "application/json" },
        });
        if (!res || typeof res !== "object" || res.code !== 200) return null;
        return res;
    } catch {
        return null;
    }
};

const collectArchives = async (apiBase: string): Promise<SitemapUrl[]> => {
    const result: SitemapUrl[] = [];
    const seen = new Set<string>();
    const pageSize = 100;
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
        const envelope = await fetchEnvelope<ArchiveEntry[]>(
            `${apiBase}/v1/contents?type_slug=archive&fields=publish_time&sort_order=desc&page=${page}&page_size=${pageSize}`,
        );
        if (!envelope) break;

        const entries = Array.isArray(envelope.data) ? envelope.data : [];
        for (const entry of entries) {
            const slug = entry?.slug || entry?.path?.split("/").pop();
            if (!slug || seen.has(slug)) continue;
            seen.add(slug);
            result.push({
                loc: `/archive/${slug}`,
                lastmod:
                    toIsoDate(entry?.data?.updated_at) ||
                    toIsoDate(entry?.data?.publish_time),
                changefreq: "monthly",
                priority: 0.6,
            });
        }

        totalPages = envelope.meta?.total_pages ?? 1;
        page += 1;
        if (page > 50) break;
    }

    return result;
};

const collectWikiPaths = async (apiBase: string): Promise<SitemapUrl[]> => {
    const envelope = await fetchEnvelope<WikiTreeNode>(
        `${apiBase}/v1/tree?root=wiki&depth=0`,
    );
    if (!envelope || !envelope.data) return [];

    const result: SitemapUrl[] = [];
    const seen = new Set<string>();
    const walk = (node: WikiTreeNode) => {
        if (!node) return;
        if (!node.is_container && node.path) {
            if (!seen.has(node.path)) {
                seen.add(node.path);
                result.push({
                    loc: `/${node.path}`,
                    changefreq: "monthly",
                    priority: 0.5,
                });
            }
        }
        if (Array.isArray(node.children)) {
            for (const child of node.children) {
                walk(child as WikiTreeNode);
            }
        }
    };

    walk(envelope.data);
    return result;
};

const renderSitemap = (siteUrl: string, urls: SitemapUrl[]): string => {
    const lines: string[] = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ];
    for (const url of urls) {
        const loc = `${siteUrl}${encodePath(url.loc)}`;
        lines.push("  <url>");
        lines.push(`    <loc>${escapeXml(loc)}</loc>`);
        if (url.lastmod) {
            lines.push(`    <lastmod>${url.lastmod}</lastmod>`);
        }
        if (url.changefreq) {
            lines.push(`    <changefreq>${url.changefreq}</changefreq>`);
        }
        if (typeof url.priority === "number") {
            lines.push(`    <priority>${url.priority.toFixed(1)}</priority>`);
        }
        lines.push("  </url>");
    }
    lines.push("</urlset>");
    return lines.join("\n");
};

export default defineCachedEventHandler(
    async (event) => {
        const config = useRuntimeConfig();
        const apiBase =
            (config.public.apiBase as string) ||
            "https://csec.jxufe.edu.cn/nozomi";
        const siteUrl = (
            (config.public.siteUrl as string) || "https://csec.jxufe.edu.cn"
        ).replace(/\/+$/, "");

        const [archives, wikis] = await Promise.all([
            collectArchives(apiBase),
            collectWikiPaths(apiBase),
        ]);

        const urls = [...STATIC_ROUTES, ...archives, ...wikis];
        const xml = renderSitemap(siteUrl, urls);

        setResponseHeader(
            event,
            "Content-Type",
            "application/xml; charset=utf-8",
        );
        return xml;
    },
    {
        maxAge: 60 * 30,
        swr: true,
        getKey: () => "sitemap-xml",
    },
);

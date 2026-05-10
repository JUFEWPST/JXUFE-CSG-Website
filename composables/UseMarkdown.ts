import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import type { MDCParserResult, TocLink } from "@nuxtjs/mdc";
import type { TocItem } from "~/types/tocitems";
import transformMarkdownAlerts from "~/utils/markdown-alerts";
import transformBilibiliEmbeds from "~/utils/markdown-bilibili";
import transformGithubCardEmbeds from "~/utils/markdown-github-card";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [
        ...(defaultSchema.tagNames || []),
        "iframe",
        "video",
        "button",
        "svg",
        "path",
        "rect",
        "polyline",
        "circle",
        "line",
    ],
    attributes: {
        ...defaultSchema.attributes,
        iframe: ["src", "allow", "allowfullscreen", "frameborder", "scrolling"],
        video: ["src", "controls", "preload", "playsinline", "className", "data-md-video"],
        button: ["className", "dataCode", "title"],
        svg: ["xmlns", "width", "height", "viewBox", "fill", "stroke", "strokeWidth", "strokeLinecap", "strokeLinejoin"],
        path: ["d"],
        rect: ["x", "y", "width", "height", "rx", "ry"],
        polyline: ["points"],
        circle: ["cx", "cy", "r"],
        line: ["x1", "y1", "x2", "y2"],
        a: [...(defaultSchema.attributes?.a || []), "target", "rel"],
        img: [...(defaultSchema.attributes?.img || []), "dataMdZoomable", "dataMdImgGroup", "dataMdImgIndex", "loading"],
        "*": [
            ...(defaultSchema.attributes?.["*"] || []),
            "className",
            "style",
            "data*",
        ],
    },
    protocols: {
        ...defaultSchema.protocols,
        src: [...(defaultSchema.protocols?.src || ["http", "https"])],
    },
};

const flattenTocLinks = (links: TocLink[] = []): TocItem[] => {
    const items: TocItem[] = [];

    for (const link of links) {
        items.push({
            id: link.id,
            text: link.text,
            level: link.depth,
        });

        if (link.children && link.children.length > 0) {
            items.push(...flattenTocLinks(link.children));
        }
    }

    return items;
};

const prepareMarkdown = (content: string, sanitize = true): string => {
    const normalized = content.replace(/\r\n/g, "\n");

    return transformGithubCardEmbeds(
        transformBilibiliEmbeds(transformMarkdownAlerts(normalized)),
    );
};

export const useMarkdown = (): {
    prepareMarkdown: (content: string, sanitize?: boolean) => string;
    parseMdcMarkdown: (
        content: string,
        sanitize?: boolean,
    ) => Promise<MDCParserResult>;
    extractTocItems: (result: MDCParserResult | null) => TocItem[];
} => {
    const parseMdcMarkdown = (
        content: string,
        sanitize = true,
    ): Promise<MDCParserResult> => {
        const preparedContent = prepareMarkdown(content, sanitize);

        const rehypePlugins: Record<string, unknown> = {};
        if (sanitize) {
            rehypePlugins["rehype-sanitize"] = {
                instance: rehypeSanitize,
                options: sanitizeSchema,
            };
        }

        return parseMarkdown(preparedContent, {
            rehype: {
                plugins: rehypePlugins as Record<string, false | object>,
            },
            toc: {
                depth: 6,
                searchDepth: 6,
            },
        });
    };

    const extractTocItems = (result: MDCParserResult | null): TocItem[] => {
        if (!result || !result.toc || !result.toc.links) {
            return [];
        }

        return flattenTocLinks(result.toc.links);
    };

    return {
        prepareMarkdown,
        parseMdcMarkdown,
        extractTocItems,
    };
};

import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import type { MDCParserResult, TocLink } from "@nuxtjs/mdc";
import type { TocItem } from "~/types/tocitems";
import transformMarkdownAlerts from "~/utils/markdown-alerts";
import transformBilibiliEmbeds from "~/utils/markdown-bilibili";
import transformGithubCardEmbeds from "~/utils/markdown-github-card";

const SCRIPT_TAG_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gis;
const STYLE_TAG_REGEX = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gis;
const INLINE_EVENT_ATTR_REGEX =
    /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const DANGEROUS_PROTOCOL_REGEX =
    /(href|src)\s*=\s*(["'])\s*(javascript:|data:text\/html)/gi;

const sanitizeMarkdownContent = (content: string): string => {
    return content
        .replace(SCRIPT_TAG_REGEX, "")
        .replace(STYLE_TAG_REGEX, "")
        .replace(INLINE_EVENT_ATTR_REGEX, "")
        .replace(DANGEROUS_PROTOCOL_REGEX, "$1=$2#");
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
    const safeContent = sanitize ? sanitizeMarkdownContent(normalized) : normalized;

    return transformGithubCardEmbeds(
        transformBilibiliEmbeds(transformMarkdownAlerts(safeContent)),
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

        return parseMarkdown(preparedContent, {
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

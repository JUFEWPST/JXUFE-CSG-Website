import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import type { MDCParserResult } from "@nuxtjs/mdc";
import transformMarkdownAlerts from "~/utils/markdown-alerts";
import transformBilibiliEmbeds from "~/utils/markdown-bilibili";
import transformGithubCardEmbeds from "~/utils/markdown-github-card";
import transformMarkdownImageSize from "~/utils/markdown-image-size";

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

const prepareMarkdown = (content: string, sanitize = true): string => {
    const normalized = content.replace(/\r\n/g, "\n");

    const transformed = transformMarkdownImageSize(
        transformGithubCardEmbeds(
            transformBilibiliEmbeds(transformMarkdownAlerts(normalized)),
        ),
    );

    return sanitize ? sanitizeMarkdownContent(transformed) : transformed;
};

export const useMarkdown = (): {
    prepareMarkdown: (content: string, sanitize?: boolean) => string;
    parseMdcMarkdown: (
        content: string,
        sanitize?: boolean,
    ) => Promise<MDCParserResult>;
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

    return {
        prepareMarkdown,
        parseMdcMarkdown,
    };
};

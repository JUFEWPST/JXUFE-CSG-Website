import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import type { MDCParserResult } from "@nuxtjs/mdc";
import transformMarkdownAlerts from "~/utils/markdown-alerts";
import transformBilibiliEmbeds from "~/utils/markdown-bilibili";
import transformGithubCardEmbeds from "~/utils/markdown-github-card";
import transformMarkdownImageSize from "~/utils/markdown-image-size";

const prepareMarkdown = (content: string): string => {
    const normalized = content.replace(/\r\n/g, "\n");

    return transformMarkdownImageSize(
        transformGithubCardEmbeds(
            transformBilibiliEmbeds(transformMarkdownAlerts(normalized)),
        ),
    );
};

export const useMarkdown = (): {
    prepareMarkdown: (content: string) => string;
    parseMdcMarkdown: (
        content: string,
        sanitize?: boolean,
    ) => Promise<MDCParserResult>;
} => {
    const parseMdcMarkdown = (
        content: string,
        sanitize = true,
    ): Promise<MDCParserResult> => {
        const preparedContent = prepareMarkdown(content);

        return parseMarkdown(preparedContent, {
            rehype: {
                options: {
                    allowDangerousHtml: !sanitize,
                },
            },
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

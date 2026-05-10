import { transformOutsideFencedBlocks } from "~/utils/markdown-preprocess";

const BILIBILI_REGEX = /@\[bilibili\]\(([^)]+)\)/g;

const extractBilibiliIdentifier = (content: string): string | null => {
    const idMatch = content.trim().match(/(BV[a-zA-Z0-9]+)|(av[0-9]+)/);
    if (!idMatch || !idMatch[0]) {
        return null;
    }

    return idMatch[0];
};

const transformBilibiliEmbeds = (content: string): string => {
    return transformOutsideFencedBlocks(content, (segment) => {
        return segment.replace(
            BILIBILI_REGEX,
            (matched, rawContent: string) => {
                const identifier = extractBilibiliIdentifier(rawContent);

                if (!identifier) {
                    return matched;
                }

                return `::bilibili-embed{identifier="${identifier}"}\n::`;
            },
        );
    });
};

export default transformBilibiliEmbeds;

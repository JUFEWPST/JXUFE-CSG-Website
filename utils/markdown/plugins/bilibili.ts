import type { MarkdownPlugin } from "../plugin";

const BILIBILI_REGEX = /@\[bilibili\]\(([^)]+)\)/g;

const extractIdentifier = (content: string): string | null => {
    const idMatch = content.trim().match(/(BV[a-zA-Z0-9]+)|(av[0-9]+)/);
    return idMatch && idMatch[0] ? idMatch[0] : null;
};

const transform = (segment: string): string =>
    segment.replace(BILIBILI_REGEX, (matched, rawContent: string) => {
        const identifier = extractIdentifier(rawContent);
        if (!identifier) return matched;
        return `::bilibili-embed{identifier="${identifier}"}\n::`;
    });

export const bilibiliPlugin: MarkdownPlugin = {
    name: "bilibili",
    transform,
    components: ["bilibili-embed"],
};

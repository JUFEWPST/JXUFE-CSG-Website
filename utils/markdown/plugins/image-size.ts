import type { MarkdownPlugin } from "../plugin";

const IMG_SIZE_SUFFIX_REGEX =
    /!\[([^\]]*)\]\(([^)\s]+)\s+=(\d+%?)?(?:x(\d+%?))?\)/g;
const IMG_SIZE_ALT_REGEX =
    /!\[([^\]|]*)\|(\d+%?)?(?:x(\d+%?))?\]\(([^)\s]+)\)/g;

const buildAttr = (width?: string, height?: string): string => {
    if (width && height) return `{width="${width}" height="${height}"}`;
    if (width) return `{width="${width}"}`;
    if (height) return `{height="${height}"}`;
    return "";
};

const transform = (segment: string): string => {
    let processed = segment.replace(
        IMG_SIZE_ALT_REGEX,
        (match, alt, width, height, url) => {
            if (!width && !height) return match;
            return `![${alt}](${url})${buildAttr(width, height)}`;
        },
    );

    processed = processed.replace(
        IMG_SIZE_SUFFIX_REGEX,
        (match, alt, url, width, height) => {
            if (!width && !height) return match;
            return `![${alt}](${url})${buildAttr(width, height)}`;
        },
    );

    return processed;
};

export const imageSizePlugin: MarkdownPlugin = {
    name: "image-size",
    transform,
};

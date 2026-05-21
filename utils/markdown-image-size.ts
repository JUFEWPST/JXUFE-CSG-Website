import { transformOutsideFencedBlocks } from "~/utils/markdown-preprocess";

/**
 * 转换图片语法以支持宽度/缩放设置
 * 支持语法:
 * 1. 管道符式: ![alt|widthxheight](url)
 * 2. 等号后缀式: ![alt](url =widthxheight)
 * 3. MDC原生式: ![alt](url){width="width" height="height"}
 */

const IMG_SIZE_SUFFIX_REGEX = /!\[([^\]]*)\]\(([^)\s]+)\s+=(\d+%?)?(?:x(\d+%?))?\)/g;
const IMG_SIZE_ALT_REGEX = /!\[([^\]|]*)\|(\d+%?)?(?:x(\d+%?))?\]\(([^)\s]+)\)/g;

export default function transformMarkdownImageSize(content: string): string {
    return transformOutsideFencedBlocks(content, (segment) => {
        let processed = segment.replace(
            IMG_SIZE_ALT_REGEX,
            (match, alt, width, height, url) => {
                if (!width && !height) return match;
                let attrStr = "";
                if (width && height) {
                    attrStr = `{width="${width}" height="${height}"}`;
                } else if (width) {
                    attrStr = `{width="${width}"}`;
                } else if (height) {
                    attrStr = `{height="${height}"}`;
                }
                return `![${alt}](${url})${attrStr}`;
            },
        );

        processed = processed.replace(
            IMG_SIZE_SUFFIX_REGEX,
            (match, alt, url, width, height) => {
                if (!width && !height) return match;
                let attrStr = "";
                if (width && height) {
                    attrStr = `{width="${width}" height="${height}"}`;
                } else if (width) {
                    attrStr = `{width="${width}"}`;
                } else if (height) {
                    attrStr = `{height="${height}"}`;
                }
                return `![${alt}](${url})${attrStr}`;
            },
        );

        return processed;
    });
}

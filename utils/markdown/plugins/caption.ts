import type { MarkdownPlugin } from "../plugin";

const IMAGE_CAPTION_LINE =
    /^!\[([^\]]*)\]\(\s*([^)\s]+)\s+"([^"]*)"\s*\)$/;

const escapeMdcAttr = (value: string): string =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

const transform = (segment: string): string =>
    segment
        .split("\n")
        .map((line) => {
            const match = line.trim().match(IMAGE_CAPTION_LINE);
            if (!match) return line;

            const alt = escapeMdcAttr(match[1] || "");
            const src = match[2] || "";
            const caption = escapeMdcAttr(match[3] || "");
            return `::md-figure{src="${src}" alt="${alt}" caption="${caption}"}\n::`;
        })
        .join("\n");

export const captionPlugin: MarkdownPlugin = {
    name: "caption",
    transform,
    components: ["md-figure"],
};

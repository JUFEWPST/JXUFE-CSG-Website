import type { MarkdownPlugin } from "../plugin";

const alertTypeMap = {
    NOTE: { type: "info", title: "Note" },
    TIP: { type: "succ", title: "Tip" },
    IMPORTANT: { type: "important", title: "Important" },
    WARNING: { type: "warn", title: "Warning" },
    CAUTION: { type: "error", title: "Caution" },
} as const;

type AlertLabel = keyof typeof alertTypeMap;

const ALERT_MARKER_REGEX =
    /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s+(?:"([^"]+)"|(.+)))?\s*$/;
const BLOCKQUOTE_LINE_REGEX = /^>\s?(.*)$/;

const escapeMdcAttr = (value: string): string =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");

const transform = (segment: string): string => {
    const lines = segment.split("\n");
    const output: string[] = [];

    for (let index = 0; index < lines.length; index += 1) {
        const line = lines[index] || "";
        const alertMatch = line.match(ALERT_MARKER_REGEX);

        if (!alertMatch) {
            output.push(line);
            continue;
        }

        const label = alertMatch[1] as AlertLabel;
        const config = alertTypeMap[label];
        const customTitle = (alertMatch[2] || alertMatch[3] || "").trim();
        const title = customTitle || config.title;
        const blockLines: string[] = [];

        index += 1;
        while (index < lines.length) {
            const currentLine = lines[index] || "";
            const blockquoteMatch = currentLine.match(BLOCKQUOTE_LINE_REGEX);

            if (!blockquoteMatch) {
                index -= 1;
                break;
            }

            blockLines.push(blockquoteMatch[1] || "");
            index += 1;
        }

        output.push(
            `::markdown-alert{type="${config.type}" title="${escapeMdcAttr(title)}"}`,
            ...blockLines,
            "::",
        );
    }

    return output.join("\n");
};

export const alertsPlugin: MarkdownPlugin = {
    name: "alerts",
    transform,
    components: ["markdown-alert"],
};

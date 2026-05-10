import { transformOutsideFencedBlocks } from "~/utils/markdown-preprocess";

const ALERT_MARKER_REGEX =
    /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s+(?:"([^"]+)"|(.+)))?\s*$/;
const BLOCKQUOTE_LINE_REGEX = /^\s*>\s?(.*)$/;

const alertTypeMap = {
    NOTE: { type: "info", title: "Note" },
    TIP: { type: "succ", title: "Tip" },
    IMPORTANT: { type: "warn", title: "Important" },
    WARNING: { type: "warn", title: "Warning" },
    CAUTION: { type: "error", title: "Caution" },
} as const;

type AlertLabel = keyof typeof alertTypeMap;
type AlertType = (typeof alertTypeMap)[AlertLabel]["type"] | "plain";

const labelIconSvgs: Record<AlertLabel, string> = {
    NOTE: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
    TIP: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v.75m0-15a5.25 5.25 0 0 0-3.975 8.682c.478.537.975 1.153 1.216 1.818h5.518c.241-.665.738-1.281 1.216-1.818A5.25 5.25 0 0 0 12 3.75Zm-1.875 14.25h3.75" /></svg>',
    IMPORTANT:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 6h.008v.008H12v-.008Z" /></svg>',
    WARNING:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>',
    CAUTION:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m6 2.25c0 5.018-3.343 9.256-7.925 10.617a1.88 1.88 0 0 1-1.15 0C6.343 21.256 3 17.018 3 12V6.108c0-.98.637-1.846 1.57-2.139l5.25-1.641c.387-.121.802-.121 1.19 0l5.25 1.64A2.24 2.24 0 0 1 21 6.108V12Z" /></svg>',
};

const iconSvgs: Record<AlertType, string> = {
    info: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
    succ: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
    warn: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="alert-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
    plain: "",
};

const colorClassMap: Record<AlertType, string> = {
    info: "alert-info",
    succ: "alert-succ",
    warn: "alert-warn",
    error: "alert-error",
    plain: "alert-plain",
};

const normalizeAlertLabel = (value: string) => value.toUpperCase().trim();

const escapeMdcAttr = (value: string): string => {
    return value.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

const transformMarkdownAlerts = (content: string): string => {
    return transformOutsideFencedBlocks(content, (segment) => {
        const lines = segment.split("\n");
        const output: string[] = [];
        let index = 0;

        while (index < lines.length) {
            const line = lines[index]!;
            const match = line.match(ALERT_MARKER_REGEX);

            if (!match) {
                output.push(line);
                index += 1;
                continue;
            }

            const label = normalizeAlertLabel(match[1]!) as AlertLabel;
            const customTitle = match[2] || match[3] || "";
            const config = alertTypeMap[label];
            const title = customTitle || config.title;

            const blockLines: string[] = [];

            index += 1;

            while (index < lines.length) {
                const nextLine = lines[index]!;
                const quoteMatch = nextLine.match(BLOCKQUOTE_LINE_REGEX);
                if (!quoteMatch) {
                    break;
                }
                blockLines.push(quoteMatch[1] ?? "");
                index += 1;
            }

            output.push(
                `::markdown-alert{type="${config.type}" title="${escapeMdcAttr(title)}"}\n${blockLines.join("\n")}\n::`,
            );
        }

        return output.join("\n");
    });
};

const extractAlertLabel = (blockquote: HTMLElement): AlertLabel | null => {
    const marker = blockquote.querySelector<HTMLElement>("span[data-md-alert]");
    if (marker) {
        const label = marker.getAttribute("data-md-alert") || "";
        marker.remove();
        return normalizeAlertLabel(label) as AlertLabel;
    }

    const firstParagraph = blockquote.querySelector("p");
    const text = firstParagraph?.textContent || "";
    const match = text.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
    if (match) {
        const label = normalizeAlertLabel(match[1]!) as AlertLabel;
        if (firstParagraph) {
            firstParagraph.textContent = text.replace(match[0], "").trimStart();
        }
        return label;
    }

    return null;
};

export const decorateMarkdownAlerts = (root: HTMLElement) => {
    const blockquotes = Array.from(root.querySelectorAll("blockquote"));

    blockquotes.forEach((blockquote) => {
        const label = extractAlertLabel(blockquote);
        if (!label) return;

        const config = alertTypeMap[label];
        const type = config?.type || "plain";
        const wrapper = document.createElement("div");
        wrapper.className = `markdown-alert ${colorClassMap[type]}`;

        if (config?.title) {
            const titleEl = document.createElement("div");
            titleEl.className = "markdown-alert-title";
            const icon = labelIconSvgs[label] || iconSvgs[type];
            titleEl.innerHTML = `${icon}<span></span>`;
            const titleText = titleEl.querySelector("span");
            if (titleText) {
                titleText.textContent = config.title;
            }
            wrapper.appendChild(titleEl);
        }

        const contentEl = document.createElement("div");
        contentEl.className = "markdown-alert-content";
        while (blockquote.firstChild) {
            contentEl.appendChild(blockquote.firstChild);
        }

        wrapper.appendChild(contentEl);
        blockquote.replaceWith(wrapper);
    });
};

export default transformMarkdownAlerts;

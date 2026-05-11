<template>
    <div
        class="code-block-wrapper"
        :class="{ 'has-line-numbers': showLineNumbers }"
    >
        <div class="code-block-toolbar">
            <span class="code-block-lang">{{ languageDisplay }}</span>
            <button
                class="code-copy-btn"
                type="button"
                title="复制代码"
                :data-code="encodedCode"
                data-code-encoding="uri"
            >
                <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </button>
        </div>

        <pre :class="preClasses"><slot /></pre>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    code?: string;
    language?: string | null;
    filename?: string | null;
    highlights?: number[];
    meta?: string | null;
    class?: string | null;
}>();

const parseHighlightLines = (meta: string): Set<number> => {
    const highlightLines = new Set<number>();
    const match = meta.match(/\{([^}]+)\}/);
    if (!match || !match[1]) return highlightLines;

    const ranges = match[1].split(",").map((part) => part.trim());
    for (const range of ranges) {
        if (!range) continue;
        const [startStr, endStr] = range
            .split("-")
            .map((value) => value.trim());
        const start = Number(startStr);
        const end = endStr ? Number(endStr) : start;
        if (Number.isNaN(start) || Number.isNaN(end)) continue;

        const from = Math.min(start, end);
        const to = Math.max(start, end);
        for (let line = from; line <= to; line += 1) {
            highlightLines.add(line);
        }
    }

    return highlightLines;
};

const hasLineNumbers = (meta: string): boolean => {
    return /(^|\s)(line-numbers|ln)(\s|$)/.test(meta) || /\{[^}]+\}/.test(meta);
};

const highlightLines = computed(() => {
    const lines = new Set<number>(props.highlights || []);
    const metaHighlights = parseHighlightLines(props.meta || "");

    for (const line of metaHighlights) {
        lines.add(line);
    }

    return lines;
});

const showLineNumbers = computed(() => {
    return hasLineNumbers(props.meta || "") || highlightLines.value.size > 0;
});

const languageDisplay = computed(
    () => props.language || props.filename || "纯文本",
);
const encodedCode = computed(() => encodeURIComponent(props.code || ""));
const preClasses = computed(() => {
    return [
        props.class || "",
        props.language ? `language-${props.language}` : "",
        showLineNumbers.value ? "has-line-numbers" : "",
    ]
        .filter(Boolean)
        .join(" ");
});
</script>

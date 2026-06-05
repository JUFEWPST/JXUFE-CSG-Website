import type { MarkdownPlugin } from "../plugin";
import {
    SENTINELS,
    wrapSentinel,
    decorateSentinel,
    idempotentDecorator,
} from "../sentinel";

const HIGHLIGHT_REGEX = /==([^=]+)==/g;
const PAIR = SENTINELS.highlight;

const transform = (segment: string): string =>
    segment.replace(HIGHLIGHT_REGEX, (_m, text: string) =>
        wrapSentinel(PAIR, text),
    );

const decorate = idempotentDecorator((root) =>
    decorateSentinel(root, PAIR, (text) => {
        const el = document.createElement("mark");
        el.textContent = text;
        return el;
    }),
);

export const highlightPlugin: MarkdownPlugin = {
    name: "highlight",
    transform,
    decorate,
};

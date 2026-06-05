import type { MarkdownPlugin } from "../plugin";
import {
    SENTINELS,
    wrapSentinel,
    decorateSentinel,
    idempotentDecorator,
} from "../sentinel";

const SUPERSCRIPT_REGEX = /\^([^\^\s]+)\^/g;
const SUBSCRIPT_REGEX = /(?<!~)~(?!~)([^~\s]+)~(?!~)/g;

const transform = (segment: string): string =>
    segment
        .replace(SUPERSCRIPT_REGEX, (_m, text: string) =>
            wrapSentinel(SENTINELS.superscript, text),
        )
        .replace(SUBSCRIPT_REGEX, (_m, text: string) =>
            wrapSentinel(SENTINELS.subscript, text),
        );

const buildTag =
    (tag: "sup" | "sub") =>
    (text: string): Node => {
        const el = document.createElement(tag);
        el.textContent = text;
        return el;
    };

const decorate = idempotentDecorator((root) => {
    decorateSentinel(root, SENTINELS.superscript, buildTag("sup"));
    decorateSentinel(root, SENTINELS.subscript, buildTag("sub"));
});

export const subSupPlugin: MarkdownPlugin = {
    name: "sub-sup",
    transform,
    decorate,
};

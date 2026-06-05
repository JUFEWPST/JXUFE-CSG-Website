import katex from "katex";
import "katex/dist/katex.min.css";
import type { MarkdownPlugin } from "../plugin";
import {
    SENTINELS,
    wrapSentinel,
    decorateSentinel,
    idempotentDecorator,
} from "../sentinel";

const BLOCK_MATH_REGEX = /\$\$\s*\n?([\s\S]*?)\n?\s*\$\$/g;
const INLINE_MATH_REGEX = /(?<![a-zA-Z0-9$])\$([^\s$](?:[^$]*[^\s$])?)\$(?![0-9])/g;
const PAIR = SENTINELS.inlineMath;

const encodeBlockTex = (tex: string): string =>
    encodeURIComponent(tex.trim()).replace(/~/g, "%7E");

const transform = (segment: string): string => {
    let result = segment.replace(
        BLOCK_MATH_REGEX,
        (_m, tex: string) =>
            `\n::katex{tex="${encodeBlockTex(tex)}" display="true"}\n::\n`,
    );

    result = result.replace(INLINE_MATH_REGEX, (_m, tex: string) =>
        wrapSentinel(PAIR, tex.trim()),
    );

    return result;
};

const decorate = idempotentDecorator((root) =>
    decorateSentinel(root, PAIR, (tex) => {
        const span = document.createElement("span");
        span.className = "katex-inline";
        try {
            span.innerHTML = katex.renderToString(tex, {
                displayMode: false,
                throwOnError: false,
                trust: true,
            });
        } catch {
            const code = document.createElement("code");
            code.className = "math-error";
            code.textContent = tex;
            span.appendChild(code);
        }
        return span;
    }),
);

export const mathPlugin: MarkdownPlugin = {
    name: "math",
    transform,
    decorate,
    components: ["katex"],
};

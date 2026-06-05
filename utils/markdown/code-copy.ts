import type { MarkdownDecorator } from "./plugin";

const COPIED_CLASS = "copied";
const COPIED_DURATION_MS = 2000;

const decodeCode = (raw: string, encoding: string): string => {
    if (encoding !== "uri") return raw;
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
};

/** 代码块复制：事件委托在 container 上，监听 .code-copy-btn 点击。 */
export const createMarkdownCodeCopyController = (
    container: HTMLElement,
): MarkdownDecorator => {
    const copiedTimers = new WeakMap<HTMLButtonElement, number>();

    const flashCopied = (button: HTMLButtonElement) => {
        button.classList.add(COPIED_CLASS);
        const prev = copiedTimers.get(button);
        if (prev !== undefined) clearTimeout(prev);
        const timer = window.setTimeout(() => {
            button.classList.remove(COPIED_CLASS);
            copiedTimers.delete(button);
        }, COPIED_DURATION_MS);
        copiedTimers.set(button, timer);
    };

    const copyToClipboard = async (text: string): Promise<boolean> => {
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                console.warn("clipboard API 失败，尝试降级方案:", error);
            }
        }

        try {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            const ok = document.execCommand("copy");
            document.body.removeChild(textarea);
            return ok;
        } catch (error) {
            console.error("复制失败:", error);
            return false;
        }
    };

    const handleClick = (event: Event) => {
        const target = event.target as Element | null;
        if (!target) return;

        const button = target.closest(
            ".code-copy-btn",
        ) as HTMLButtonElement | null;
        if (!button || !container.contains(button)) return;

        const encodedCode = button.getAttribute("data-code") || "";
        if (!encodedCode) return;

        const encoding = button.getAttribute("data-code-encoding") || "";
        const code = decodeCode(encodedCode, encoding);

        copyToClipboard(code).then((ok) => {
            if (ok) flashCopied(button);
        });
    };

    container.addEventListener("click", handleClick);

    return {
        refresh: () => {},
        destroy: () => {
            container.removeEventListener("click", handleClick);
        },
    };
};

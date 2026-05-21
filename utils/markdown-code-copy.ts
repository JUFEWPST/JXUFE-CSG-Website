export interface MarkdownCodeCopyController {
    destroy: () => void;
    refresh: () => void;
}

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

export const createMarkdownCodeCopyController = (
    container: HTMLElement,
): MarkdownCodeCopyController => {
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

        navigator.clipboard
            .writeText(code)
            .then(() => flashCopied(button))
            .catch((error) => {
                console.error("复制失败:", error);
            });
    };

    container.addEventListener("click", handleClick);

    return {
        refresh: () => {
        },
        destroy: () => {
            container.removeEventListener("click", handleClick);
        },
    };
};

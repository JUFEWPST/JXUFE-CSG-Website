/** 行内特性的哨兵编码与渲染后 DOM 装饰基础设施。 */

export type SentinelPair = readonly [open: string, close: string];

export const SENTINELS = {
    inlineMath: ["\uE000", "\uE001"],
    highlight: ["\uE002", "\uE003"],
    superscript: ["\uE004", "\uE005"],
    subscript: ["\uE006", "\uE007"],
} as const satisfies Record<string, SentinelPair>;

const encodePayload = (value: string): string =>
    encodeURIComponent(value).replace(
        /[*_~!()]/g,
        (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
    );

const decodePayload = (value: string): string => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

/** transform 侧：把内容包进哨兵对。 */
export const wrapSentinel = (pair: SentinelPair, payload: string): string =>
    `${pair[0]}${encodePayload(payload)}${pair[1]}`;

const isSkippableAncestor = (node: Node, root: HTMLElement): boolean => {
    let parent = (node as ChildNode).parentElement;
    while (parent && parent !== root) {
        const tag = parent.tagName;
        if (
            tag === "PRE" ||
            tag === "CODE" ||
            parent.classList.contains("katex")
        ) {
            return true;
        }
        parent = parent.parentElement;
    }
    return false;
};

/** 渲染后：把 root 内某哨兵对替换为 build(decoded) 产出的节点。 */
export const decorateSentinel = (
    root: HTMLElement,
    pair: SentinelPair,
    build: (decoded: string) => Node,
): void => {
    const [open, close] = pair;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const text = node.nodeValue;
            if (!text || !text.includes(open)) return NodeFilter.FILTER_REJECT;
            return isSkippableAncestor(node, root)
                ? NodeFilter.FILTER_REJECT
                : NodeFilter.FILTER_ACCEPT;
        },
    });

    const targets: Text[] = [];
    let current = walker.nextNode();
    while (current) {
        targets.push(current as Text);
        current = walker.nextNode();
    }

    const matcher = new RegExp(`${open}([^${close}]*)${close}`, "g");

    for (const textNode of targets) {
        const value = textNode.nodeValue || "";
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        matcher.lastIndex = 0;

        while ((match = matcher.exec(value)) !== null) {
            if (match.index > lastIndex) {
                fragment.appendChild(
                    document.createTextNode(value.slice(lastIndex, match.index)),
                );
            }
            fragment.appendChild(build(decodePayload(match[1] || "")));
            lastIndex = matcher.lastIndex;
        }

        if (lastIndex < value.length) {
            fragment.appendChild(document.createTextNode(value.slice(lastIndex)));
        }

        textNode.parentNode?.replaceChild(fragment, textNode);
    }
};

/** 把纯函数型装饰器包装成统一的 Decorator 工厂。 */
export const idempotentDecorator =
    (run: (root: HTMLElement) => void) =>
    (root: HTMLElement) => {
        run(root);
        return {
            refresh: () => run(root),
            destroy: () => {},
        };
    };

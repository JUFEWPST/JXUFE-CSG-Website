import slugify from "slugify";

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

type SlugifyConfig = Parameters<typeof slugify>[1];

export const DEFAULT_SLUGIFY_CONFIG: SlugifyConfig = {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
    locale: "zh",
    trim: true,
};

/** 从渲染后的 DOM 提取标题生成 TOC（自定义 slugify，id 写回 DOM 节点）。 */
export const extractHeadingItems = (
    root: HTMLElement,
    config: SlugifyConfig = DEFAULT_SLUGIFY_CONFIG,
): TocItem[] => {
    const headings = root.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const usedIds = new Set<string>();
    const items: TocItem[] = [];

    headings.forEach((heading, index) => {
        if (!heading.id) {
            const textContent = heading.textContent || "";
            const baseSlug = slugify(textContent, config) || `heading-${index}`;

            let slug = baseSlug;
            let counter = 2;
            while (usedIds.has(slug)) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            heading.id = slug;
        }

        usedIds.add(heading.id);
        items.push({
            id: heading.id,
            text: heading.textContent || "",
            level: parseInt(heading.tagName.substring(1)),
        });
    });

    return items;
};

export const tocItemsEqual = (a: TocItem[], b: TocItem[]): boolean => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        const itemA = a[i];
        const itemB = b[i];
        if (!itemA || !itemB) return false;
        if (
            itemA.id !== itemB.id ||
            itemA.text !== itemB.text ||
            itemA.level !== itemB.level
        ) {
            return false;
        }
    }
    return true;
};

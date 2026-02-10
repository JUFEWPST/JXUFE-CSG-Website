<template>
    <div class="relative">
        <div
            class="max-h-[calc(100vh-7rem)] overflow-y-auto text-(--md-sys-color-on-surface-variant) transition-all duration-300 ease-in-out"
            id="toc-container"
            aria-labelledby="toc-title"
            role="navigation"
        >
            <div v-if="items.length" class="mb-2 flex items-center">
                <h2 id="toc-title" class="text-lg font-bold">
                    {{ t("common.items.toc") }}
                </h2>
            </div>

            <ul class="m-0 list-none space-y-1 p-0">
                <li
                    v-for="item in items"
                    :key="item.id"
                    class="my-0.5 min-w-0 overflow-hidden leading-snug text-ellipsis"
                    :style="{ paddingLeft: getIndent(item.level) }"
                >
                    <a
                        @click="scrollTo(item.id)"
                        :class="getLinkClasses(item)"
                        :style="{ fontSize: getLevelFontSize(item.level) }"
                        :title="item.text"
                        :aria-current="
                            activeId === item.id ? 'location' : undefined
                        "
                    >
                        {{ item.text }}
                    </a>
                </li>
            </ul>
            <div
                v-if="items.length === 0"
                class="mt-2 text-sm text-(--md-sys-color-on-surface-variant) italic"
            >
                目录为空 | Empty TOC
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import slugify from "slugify";
import type { TocItem } from "~/types/tocitems";

const HEADING_SELECTOR = "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]";
const ALL_HEADINGS_SELECTOR = "h1, h2, h3, h4, h5, h6";
const { t } = useI18n();

const props = defineProps<{
    items: TocItem[];
    markdownRenderRef: { $el: HTMLElement };
}>();

function getHeadingSelector() {
    if (!props.markdownRenderRef) {
        return [];
    }
    return props.markdownRenderRef.$el.querySelectorAll(HEADING_SELECTOR);
}

const activeId = ref("");

// 计算当前文章中最小的level
const minLevel = computed(() => {
    if (!props.items.length) return 1;
    return Math.min(...props.items.map((item) => item.level));
});

// 根据相对层级计算缩进
const getIndent = (level: number) => {
    return `${(level - minLevel.value) * 0.75}rem`;
};

const getLinkClasses = (item: TocItem) => {
    const baseClasses =
        "block py-1.5 px-2 md:px-3 no-underline rounded-lg text-sm transition-colors cursor-pointer whitespace-normal wrap-break-word";
    const activeClasses =
        activeId.value === item.id
            ? "bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) font-medium"
            : "text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-primary)";

    return `${baseClasses} ${activeClasses}`;
};

const getLevelFontSize = (level: number) => {
    const relativeLevel = level - minLevel.value;
    const fontSizes: Record<number, string> = {
        0: "0.9rem", // 最大标题
        1: "0.875rem", // 二级标题
        2: "0.85rem", // 三级标题
        3: "0.825rem", // 四级标题
        4: "0.8rem", // 五级标题
        5: "0.8rem", // 六级标题
    };
    return fontSizes[relativeLevel] || "0.8rem";
};

async function scrollTo(idOrText: string) {
    if (!idOrText) return;
    let element = document.getElementById(idOrText);

    if (!element) {
        const headings = Array.from(
            document.querySelectorAll(ALL_HEADINGS_SELECTOR),
        ) as HTMLElement[];
        const matchedHeading = headings.find((heading) => {
            const headingText = heading.textContent?.trim() || "";
            return (
                headingText === idOrText ||
                heading.id === slugify(idOrText, { lower: true }) ||
                headingText.includes(idOrText)
            );
        });

        if (matchedHeading) {
            if (!matchedHeading.id) {
                matchedHeading.id = slugify(matchedHeading.textContent || "", {
                    lower: true,
                    strict: true,
                    locale: "zh",
                });
            }
            element = matchedHeading;
        }
    }

    if (element) {
        const headerHeight =
            document.querySelector("header")?.offsetHeight || 80;
        const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
        const targetPosition = elementPosition - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
        });

        activeId.value = element.id;
    } else {
        console.warn(`无法定位到目标元素: ${idOrText}`);
    }
}

function handleScroll() {
    const headings = getHeadingSelector();
    let current = "";
    let closestDistance = Infinity;

    headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const distance = Math.abs(rect.top - 100);

        if (rect.top <= 120 && distance < closestDistance) {
            closestDistance = distance;
            current = heading.id;
        }
    });

    if (current) {
        activeId.value = current;
    }
}

const scrollHandler = () => handleScroll();

onMounted(() => {
    window.addEventListener("scroll", scrollHandler, { passive: true });
    handleScroll();
});

onUnmounted(() => {
    window.removeEventListener("scroll", scrollHandler);
});
</script>

<template>
    <div class="markdown-container">
        <div
            class="markdown-wrapper"
            v-html="renderedContent"
            ref="markdownRef"
            :style="{ '--md-heading-base-level': headingSizeLevel.toString() }"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useMarkdown } from "~/composables/UseMarkdown";
import {
    createMarkdownImageViewerController,
    type MarkdownImageViewerController,
} from "~/utils/markdown-it-image-viewer";
import {
    createMarkdownVideoPlayerController,
    type MarkdownVideoPlayerController,
} from "~/utils/markdown-it-video-player";
import "~/assets/css/markdown.css";
import "~/assets/css/atom-one.css";
import "katex/dist/katex.min.css";
import type { TocItem } from "~/types/tocitems";
import slugify from "slugify";
const { md, renderMarkdown } = useMarkdown();
const props = defineProps<{
    content: string | "";
    sanitize?: boolean;
}>();
const emit = defineEmits<{
    (e: "toc-updated", items: TocItem[]): void;
}>();

const markdownRef = ref<HTMLElement | null>(null);
const tocItems = ref<TocItem[]>([]);
const headingSizeLevel = ref(1);
const slugifyConfig = {
    lower: true, // 转换为小写
    strict: true, // 移除特殊字符
    remove: /[*+~.()'"!:@]/g, // 额外要移除的字符
    locale: "zh", // 支持中文
    trim: true, // 移除前后空格
};
const renderedContent = computed(() => {
    try {
        return props.sanitize !== false
            ? renderMarkdown(props.content)
            : md.render(props.content);
    } catch (error) {
        console.error("Markdown 渲染出错:", error);
        return "<p>Markdown 渲染出错，请稍后重试。</p>";
    }
});
watch(
    () => props.content,
    (newContent) => {
        if (newContent) {
            nextTick(() => {
                extractHeadings();
                imageViewerController?.refresh();
                videoPlayerController?.refresh();
            });
        }
    },
    { immediate: true },
);

function extractHeadings() {
    if (!markdownRef.value) return;

    const headings = markdownRef.value.querySelectorAll(
        "h1, h2, h3, h4, h5, h6",
    );
    const items: TocItem[] = [];
    const usedIds = new Set<string>();

    headings.forEach((heading, index) => {
        if (!heading.id) {
            const textContent = heading.textContent || "";
            const baseSlug =
                slugify(textContent, slugifyConfig) || `heading-${index}`;

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

    headingSizeLevel.value = items.length
        ? Math.min(...items.map((item) => item.level))
        : 1;
    tocItems.value = items;
    emit("toc-updated", items);
}

defineExpose({
    tocItems: tocItems as Ref<TocItem[]>,
});
let imageViewerController: MarkdownImageViewerController | null = null;
let videoPlayerController: MarkdownVideoPlayerController | null = null;

const handleCopyClick = async (event: Event) => {
    if (!markdownRef.value) return;

    const target = event.target as Element | null;
    const button = target?.closest(
        ".code-copy-btn",
    ) as HTMLButtonElement | null;
    if (!button || !markdownRef.value.contains(button)) return;

    const code = button.getAttribute("data-code");
    if (!code) return;

    try {
        await navigator.clipboard.writeText(code);
        button.classList.add("copied");
        setTimeout(() => {
            button.classList.remove("copied");
        }, 2000);
    } catch (err) {
        console.error("复制失败:", err);
    }
};

onMounted(() => {
    nextTick(() => {
        extractHeadings();
        imageViewerController?.refresh();
        videoPlayerController?.refresh();
    });
    if (markdownRef.value) {
        imageViewerController = createMarkdownImageViewerController(
            markdownRef.value,
        );
        videoPlayerController = createMarkdownVideoPlayerController(
            markdownRef.value,
        );
        markdownRef.value.addEventListener("click", handleCopyClick);
    }
});

onUnmounted(() => {
    if (markdownRef.value) {
        markdownRef.value.removeEventListener("click", handleCopyClick);
    }
    imageViewerController?.destroy();
    imageViewerController = null;
    videoPlayerController?.destroy();
    videoPlayerController = null;
});
</script>

<style scoped>
.markdown-container {
    width: 100%;
    max-width: 100%;
}
</style>

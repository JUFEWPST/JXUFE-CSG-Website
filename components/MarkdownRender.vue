<template>
    <div class="markdown-container">
        <div
            class="markdown-wrapper"
            v-html="renderedContent"
            ref="markdownRef"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from "vue";
import mediumZoom from "medium-zoom";
import { useMarkdown } from "~/composables/UseMarkdown";
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
                setupCodeCopy();
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

    headings.forEach((heading, index) => {
        if (!heading.id) {
            const textContent = heading.textContent || "";
            heading.id = slugify(textContent, slugifyConfig);
            if (!heading.id) {
                const randomSuffix = Math.random().toString(36).slice(2, 6);
                heading.id = `heading-${index}-${randomSuffix}`;
            }
        }

        items.push({
            id: heading.id,
            text: heading.textContent || "",
            level: parseInt(heading.tagName.substring(1)),
        });
    });

    tocItems.value = items;
    emit("toc-updated", items);
}

defineExpose({
    tocItems: tocItems as Ref<TocItem[]>,
});

// 代码复制功能
function setupCodeCopy() {
    if (!markdownRef.value) return;

    const copyButtons = markdownRef.value.querySelectorAll(".code-copy-btn");
    copyButtons.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const button = e.currentTarget as HTMLButtonElement;
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
        });
    });
}

onMounted(() => {
    nextTick(() => {
        extractHeadings();
        setupCodeCopy();
    });
    if (markdownRef.value) {
        const zoom = mediumZoom(markdownRef.value.querySelectorAll("img"));
    }
});
</script>

<style scoped>
.markdown-container {
    width: 100%;
    max-width: 100%;
}
</style>

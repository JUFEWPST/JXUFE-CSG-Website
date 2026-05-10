<template>
    <div class="markdown-container">
        <div
            ref="markdownRoot"
            class="w-full max-w-full"
            @click="handleCopyClick"
        >
            <MDCRenderer
                v-if="renderPayload"
                :body="renderPayload.body"
                :data="renderPayload.data"
                :components="rendererComponents"
                prose
                tag="div"
                class="markdown-wrapper"
                :style="{
                    '--md-heading-base-level': headingSizeLevel.toString(),
                }"
            />

            <div
                v-else-if="parsing"
                class="flex items-center justify-center py-20"
                role="status"
                aria-label="Markdown rendering"
            >
                <AnzuProgressRing
                    status="loading"
                    :show-content="false"
                    :size="44"
                />
            </div>

            <p v-else-if="errorMessage" class="markdown-error">
                {{ errorMessage }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MDCParserResult } from "@nuxtjs/mdc";
import type { DefineComponent } from "vue";
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import { useMarkdown } from "~/composables/UseMarkdown";
import AnzuProgressRing from "~/components/AnzuProgressRing.vue";
import BilibiliEmbed from "~/components/mdc/BilibiliEmbed.vue";
import AnzuAlert from "~/components/AnzuAlert.vue";
import ProsePre from "~/components/prose/ProsePre.vue";
import ProseH1 from "~/components/prose/ProseH1.vue";
import ProseH2 from "~/components/prose/ProseH2.vue";
import ProseH3 from "~/components/prose/ProseH3.vue";
import ProseH4 from "~/components/prose/ProseH4.vue";
import ProseH5 from "~/components/prose/ProseH5.vue";
import ProseH6 from "~/components/prose/ProseH6.vue";
import GithubCard from "~/components/GithubCard.vue";
import {
    createMarkdownImageViewerController,
    type MarkdownImageViewerController,
    decorateMarkdownImages,
} from "~/utils/markdown-image-viewer";
import {
    createMarkdownVideoPlayerController,
    type MarkdownVideoPlayerController,
    decorateMarkdownVideoEmbeds,
} from "~/utils/markdown-video-player";
import "~/assets/css/markdown.css";
import type { TocItem } from "~/types/tocitems";
import slugify from "slugify";
const { parseMdcMarkdown } = useMarkdown();
const props = defineProps<{
    content: string | "";
    sanitize?: boolean;
}>();
const emit = defineEmits<{
    (e: "toc-updated", items: TocItem[]): void;
}>();

const markdownRoot = ref<HTMLElement | null>(null);
const parsedContent = ref<MDCParserResult | null>(null);
const errorMessage = ref("");
const parsing = ref(false);
const tocItems = ref<TocItem[]>([]);
const rendererComponents: Record<string, DefineComponent<any, any, any>> = {
    pre: ProsePre as unknown as DefineComponent<any, any, any>,
    h1: ProseH1 as unknown as DefineComponent<any, any, any>,
    h2: ProseH2 as unknown as DefineComponent<any, any, any>,
    h3: ProseH3 as unknown as DefineComponent<any, any, any>,
    h4: ProseH4 as unknown as DefineComponent<any, any, any>,
    h5: ProseH5 as unknown as DefineComponent<any, any, any>,
    h6: ProseH6 as unknown as DefineComponent<any, any, any>,
    "markdown-alert": AnzuAlert as unknown as DefineComponent<any, any, any>,
    "bilibili-embed": BilibiliEmbed as unknown as DefineComponent<any, any, any>,
    "github-card": GithubCard as unknown as DefineComponent<any, any, any>,
};
const renderPayload = computed(() => {
    if (!parsedContent.value) {
        return null;
    }

    return {
        body: parsedContent.value.body,
        data: parsedContent.value.data,
    };
});
const headingSizeLevel = computed(() => {
    if (tocItems.value.length === 0) return 1;
    return Math.min(...tocItems.value.map((item) => item.level));
});
const slugifyConfig = {
    lower: true, // 转换为小写
    strict: true, // 移除特殊字符
    remove: /[*+~.()'"!:@]/g, // 额外要移除的字符
    locale: "zh", // 支持中文
    trim: true, // 移除前后空格
};
const extractHeadingItems = (): TocItem[] => {
    if (!markdownRoot.value) return [];

    const headings = markdownRoot.value.querySelectorAll(
        "h1, h2, h3, h4, h5, h6",
    );
    const usedIds = new Set<string>();
    const items: TocItem[] = [];

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

    return items;
};

let renderRequestId = 0;

const updateParsedContent = (content: string): Promise<void> => {
    const requestId = (renderRequestId += 1);

    if (!content.trim()) {
        parsedContent.value = null;
        tocItems.value = [];
        errorMessage.value = "";
        parsing.value = false;
        emit("toc-updated", []);
        return Promise.resolve();
    }

    errorMessage.value = "";
    parsing.value = true;

    return parseMdcMarkdown(content, props.sanitize !== false)
        .then((result) => {
            if (requestId !== renderRequestId) return;
            parsedContent.value = result;
        })
        .catch((error) => {
            if (requestId !== renderRequestId) return;
            console.error("Markdown 渲染出错:", error);
            parsedContent.value = null;
            tocItems.value = [];
            emit("toc-updated", []);
            errorMessage.value = "Markdown 渲染出错，请稍后重试。";
        })
        .finally(() => {
            if (requestId === renderRequestId) {
                parsing.value = false;
            }
        });
};

const syncMarkdownDom = () => {
    const root = markdownRoot.value;
    if (!root) return;

    const items = extractHeadingItems();
    tocItems.value = items;
    emit("toc-updated", items);

    decorateMarkdownVideoEmbeds(root);
    decorateMarkdownImages(root);

    const hasImages = root.querySelector("img[data-md-zoomable='true']");
    if (hasImages) {
        if (!imageViewerController) {
            imageViewerController = createMarkdownImageViewerController(root);
        } else {
            imageViewerController.refresh();
        }
    } else if (imageViewerController) {
        imageViewerController.destroy();
        imageViewerController = null;
    }

    const hasVideos = root.querySelector(
        ".md-video-player[data-md-video='true']",
    );
    if (hasVideos) {
        if (!videoPlayerController) {
            videoPlayerController = createMarkdownVideoPlayerController(root);
        } else {
            videoPlayerController.refresh();
        }
    } else if (videoPlayerController) {
        videoPlayerController.destroy();
        videoPlayerController = null;
    }
};

watch(
    () => parsedContent.value,
    async (value) => {
        if (!value) return;
        await nextTick();
        syncMarkdownDom();
        // MDC 可能需要额外渲染周期，延迟再次同步
        setTimeout(() => syncMarkdownDom(), 100);
    },
);

defineExpose({
    tocItems,
    markdownRoot,
});
let imageViewerController: MarkdownImageViewerController | null = null;
let videoPlayerController: MarkdownVideoPlayerController | null = null;

const handleCopyClick = (event: Event): void => {
    const target = event.target as Element | null;
    if (!target) return;

    const button = target.closest(".code-copy-btn") as HTMLButtonElement | null;
    if (!button) return;

    const encodedCode = button.getAttribute("data-code") || "";
    const codeEncoding = button.getAttribute("data-code-encoding") || "";

    if (!encodedCode) return;

    let code = encodedCode;
    if (codeEncoding === "uri") {
        try {
            code = decodeURIComponent(encodedCode);
        } catch {
            code = encodedCode;
        }
    }

    navigator.clipboard
        .writeText(code)
        .then(() => {
            button.classList.add("copied");
            setTimeout(() => {
                button.classList.remove("copied");
            }, 2000);
        })
        .catch((error) => {
            console.error("复制失败:", error);
        });
};

watch(
    () => [props.content, props.sanitize],
    ([content]) => {
        updateParsedContent(String(content || "")).catch((error) => {
            console.error("Markdown 更新失败:", error);
        });
    },
    { immediate: true },
);

onUnmounted(() => {
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

<template>
    <div class="markdown-container">
        <div ref="markdownRoot" class="w-full max-w-full">
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
import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch,
    type DefineComponent,
} from "vue";
import {
    useMarkdown,
    markdownPlugins,
    markdownComponents,
} from "~/composables/UseMarkdown";
import AnzuProgressRing from "~/components/AnzuProgressRing.vue";
import {
    collectDecorators,
    assertComponentsBound,
    type MarkdownDecorator,
} from "~/utils/markdown/plugin";
import { extractHeadingItems, tocItemsEqual } from "~/utils/markdown/toc";
import type { TocItem } from "~/types/tocitems";
import "~/assets/css/markdown.css";

const props = defineProps<{
    content: string | "";
    sanitize?: boolean;
}>();

const emit = defineEmits<{
    (e: "toc-updated", items: TocItem[]): void;
}>();

const { parseMdcMarkdown } = useMarkdown();
const markdownRoot = ref<HTMLElement | null>(null);
const parsedContent = ref<MDCParserResult | null>(null);
const tocItems = ref<TocItem[]>([]);
const errorMessage = ref("");
const parsing = ref(false);

const rendererComponents = markdownComponents as Record<
    string,
    string | DefineComponent<any, any, any>
>;
const decoratorFactories = collectDecorators(markdownPlugins);
const decorators = new Map<string, MarkdownDecorator>();

if (import.meta.dev) {
    assertComponentsBound(markdownPlugins, markdownComponents);
}

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

const destroyDecorators = () => {
    for (const decorator of decorators.values()) {
        decorator.destroy();
    }
    decorators.clear();
};

const syncMarkdownDom = () => {
    const root = markdownRoot.value;
    if (!root) return;

    for (const factory of decoratorFactories) {
        const existing = decorators.get(factory.name);
        if (existing) {
            existing.refresh();
        } else {
            decorators.set(factory.name, factory.create(root));
        }
    }

    const items = extractHeadingItems(root);
    if (!tocItemsEqual(items, tocItems.value)) {
        tocItems.value = items;
        emit("toc-updated", items);
    }
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

let domSyncTimer: ReturnType<typeof setTimeout> | null = null;
let resizeObserver: ResizeObserver | null = null;

const clearDomSyncResources = () => {
    if (domSyncTimer !== null) {
        clearTimeout(domSyncTimer);
        domSyncTimer = null;
    }
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
};

onMounted(() => {
    resizeObserver = new ResizeObserver(() => {
        if (domSyncTimer) clearTimeout(domSyncTimer);
        domSyncTimer = setTimeout(() => {
            syncMarkdownDom();
            domSyncTimer = null;
        }, 100);
    });

    if (markdownRoot.value) {
        resizeObserver.observe(markdownRoot.value);
    }
});

onUnmounted(() => {
    clearDomSyncResources();
    destroyDecorators();
});

watch(
    () => parsedContent.value,
    async (value) => {
        if (!value) {
            tocItems.value = [];
            emit("toc-updated", []);
            destroyDecorators();
            return;
        }
        await nextTick();
        syncMarkdownDom();
    },
);

defineExpose({
    tocItems,
    markdownRoot,
});
</script>

<style scoped>
.markdown-container {
    width: 100%;
    max-width: 100%;
}
</style>

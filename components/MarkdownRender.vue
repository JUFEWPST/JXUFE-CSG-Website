<template>
  <div class="markdown-container">
    <div class="markdown-wrapper" v-html="renderedContent" ref="markdownRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue';
import { md, renderMarkdown } from '~/composables/markdown';
import '~/assets/css/github-markdown.css';
import '~/assets/css/atom-one.css'
import type { TocItem } from '~/types/tocitems';
const props = defineProps<{
  content: string | "";
  sanitize?: boolean;
}>();
const emit = defineEmits<{
  (e: 'toc-updated', items: TocItem[]): void;
}>();

const markdownRef = ref<HTMLElement | null>(null);
const tocItems = ref<TocItem[]>([]);

const renderedContent = computed(() => {
  try {
    return props.sanitize !== false
      ? renderMarkdown(props.content)
      : md.render(props.content);
  } catch (error) {
    console.error('Markdown 渲染出错:', error);
    return '<p>Markdown 渲染出错，请稍后重试。</p>';
  }
});
watch(() => props.content, (newContent) => {
  if (newContent) {
    nextTick(extractHeadings);
  }
}, { immediate: true });

function extractHeadings() {
  if (!markdownRef.value) return;

  const headings = markdownRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const items: { id: string, text: string, level: number }[] = [];

  headings.forEach((heading) => {
    if (!heading.id) {
      heading.id = heading.textContent
        ?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '') || '';
    }

    items.push({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1))
    });
  });

  tocItems.value = items;
  emit('toc-updated', items);
}

defineExpose({
  tocItems: tocItems as Ref<TocItem[]>
});

onMounted(() => {
  nextTick(() => {
    extractHeadings();
  });
});
</script>

<style scoped>
.markdown-container {
  width: 100%;
  max-width: 100%;
}

.markdown-wrapper {
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
}
</style>

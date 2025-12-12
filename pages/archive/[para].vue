<template>
  <main class="bg-(--md-sys-color-surface-container-lowest) px-4 py-2 box-border">
    <div class="min-h-1/2 box-border">
      <div v-if="loading" class="flex justify-center h-1/2 items-center">
        <AnimationLoadingSpinner size="xl2" color="[var(--anzu-accent-hover)]"></AnimationLoadingSpinner>
      </div>
      <div v-if="error" class="m-2 flex justify-center">
        <ErrorDisplay :error-data="error"></ErrorDisplay>
      </div>
      <article v-if="archive" class="mb-2 box-border p-2 max-w-screen">
        <header class="mb-8">
          <h1 class="text-2xl sm:text-3xl font-bold leading-tight mb-2">
            {{ archive?.title }}
          </h1>
          <div class="flex items-center gap-2 text-xs sm:text-sm text-(--md-sys-color-on-surface-variant) mb-2">
            <div v-if="archive.publisher" class="flex items-center">
              {{ archive.publisher }}
            </div>
            <div class="flex items-center">
              {{ new Date(archive.createdAt).toLocaleString() }}
            </div>
          </div>
          <div v-if="archive.tags?.tags?.length" class="flex justify-center flex-wrap gap-2 mb-6">
            <TagList :tags="archive.tags.tags"></TagList>
          </div>
          <hr class="border-(--md-sys-color-outline-variant) mb-6">
        </header>
        <div class="flex flex-col lg:flex-row box-border max-w-screen mt-1">
          <!-- 文章内容 -->
          <MarkdownRender ref="markdownRender" :content="archive.content" @toc-updated="handleTocUpdate"
            class="flex-1 overflow-hidden box-border">
          </MarkdownRender>
        </div>

      </article>
    </div>
  </main>
</template>

<script lang="ts" setup>
import MarkdownRender from '~/components/MarkdownRender.vue'
import MarkdownTOC from '~/components/MarkdownTOC.vue'
import { computed, onMounted, ref, onUnmounted, watch } from 'vue'
import { useRoute } from '#imports'
import type { ArchiveData } from '~/types/archives'
import type { TocItem } from '~/types/tocitems'
import { useApi } from '#imports'
import { useRightSidebar } from '@/composables/useRightSidebar';
import { usePageTitle } from '@/composables/usePageTitle';
import { useSidebarLayout } from '@/composables/useSidebarLayout';

const route = useRoute()
const markdownRender = ref();
const tocItems = ref<TocItem[]>([]);

const { setHasContent, clearRightSidebar } = useRightSidebar()
const { registerCard, unregisterCard, setCardOptions } = useSidebarLayout()

const para = computed(() => route.params.para)
const {
  data: archive,
  loading,
  error,
  get,
} = useApi<ArchiveData>();
const pageTitle = computed(() => {
  return archive.value?.title ? `${archive.value.title} - 江西财经大学网络安全协会
  ` : '加载中...'
})
function handleTocUpdate(items: TocItem[]) {
  tocItems.value = items;
  setHasContent(items.length > 0);

  // 更新 TOC 侧边卡片的 props，保证目录跟随最新内容
  setCardOptions('archive-toc', {
    props: {
      items,
      markdownRenderRef: markdownRender.value,
    },
  })
}
useHead({
  title: pageTitle,
})
const navTitleBox = useState('navTitleBox', () => ({
  title: '',
  subtitle: ''
}))
const { setPageTitle } = usePageTitle()
setPageTitle('')

onMounted(() => {
  get(`/archives/${para.value}`)

  // 注册归档阅读页右侧 TOC 卡片
  registerCard({
    id: 'archive-toc',
    side: 'right',
    order: 50,
    sticky: true,
    showOnMobileBottom: true,
    component: MarkdownTOC,
    props: {
      items: tocItems.value,
      markdownRenderRef: markdownRender.value,
    },
  })
})
watch(archive, (newVal) => {
  if (newVal) {
    navTitleBox.value = {
      title: newVal.title,
      subtitle: `${newVal.publisher || ''}   ${new Date(newVal.publishedAt).toLocaleString()}`
    }
  }
}, { immediate: true })
// 离开页面时清除数据
onUnmounted(() => {
  clearRightSidebar()
  unregisterCard('archive-toc')
  navTitleBox.value = { title: '', subtitle: '' }
})
</script>

<style scoped></style>

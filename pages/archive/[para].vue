<template>
  <main class="relative min-h-[70vh]">
    <div v-if="archive" style="--to-height: 200px"
      class="absolute top-0 left-0 right-0 dark:hidden
              bg-gradient-to-b from-purple-200 to-transparent opacity-70 z-[-2] h-50 animate-[expand_0.5s_ease-in-out_forwards]">
    </div>
    <div class="pt-15 min-h-1/2 box-border">
      <div v-if="loading" class="flex justify-center h-1/2 items-center">
        <AnimationLoadingSpinner size="xl2" color="[var(--color-accent-hover)]"></AnimationLoadingSpinner>
      </div>
      <div v-if="error" class="m-2 flex justify-center">
        <ErrorDisplay :error-data="error"></ErrorDisplay>
      </div>
      <article v-if="archive" class="mt-15 mb-2 mx-5 sm:mx-10 md:mx-15 box-border p-2 max-w-screen">
        <header class="mb-8">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2">
            {{ archive?.title }}
          </h1>

          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
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
          <hr class="border-gray-200 dark:border-gray-700 mb-6">
        </header>
        <div class="flex flex-row box-border max-w-screen mt-1">
          <!-- 文章内容 -->
          <MarkdownRender ref="markdownRender" :content="archive.content" @toc-updated="handleTocUpdate"
            class="flex-1 max-w-[calc(100%-18rem)] overflow-hidden box-border">
          </MarkdownRender>

          <!-- 目录 -->
          <MarkdownTOC class="hidden md:block ml-2 sticky top-20 self-start" :items="tocItems"
            :markdown-render-ref="markdownRender">
          </MarkdownTOC>
        </div>

      </article>
    </div>
  </main>
</template>

<script lang="ts" setup>
import MarkdownRender from '~/components/MarkdownRender.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ArchiveData } from '~/types/archives'
import type { TocItem } from '~/types/tocitems'
import { useApi } from '#imports'
const route = useRoute()
const markdownRender = ref();
const tocItems = ref<TocItem[]>([]);
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
  // console.log('Received TOC items:', items);
  tocItems.value = items;
}
useHead({
  title: pageTitle,
})
onMounted(() => {
  get(`/archives/${para.value}`)
})

// 联动标题相关
const navTitleBox = useState('navTitleBox', () => ({
  title: '',
  subtitle: ''
}))

// 在获取数据后更新信息
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
  navTitleBox.value = { title: '', subtitle: '' }
})
</script>

<style scoped></style>
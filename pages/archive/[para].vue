<template>
  <div class="relative min-h-[70vh]">
    <div class="min-h-1/2 box-border">
      <div v-if="loading" class="flex justify-center h-1/2 items-center">
        <AnimationLoadingSpinner size="xl2" color="[var(--anzu-accent-hover)]"></AnimationLoadingSpinner>
      </div>
      <div v-if="error" class="m-2 flex justify-center">
        <ErrorDisplay :error-data="error"></ErrorDisplay>
      </div>
      <article v-if="archive" class="mb-2 box-border p-2 max-w-screen">
        <header class="mb-8">

          <div class="flex items-center gap-2 text-sm text-(--md-sys-color-on-surface-variant) mb-2">
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
  </div>
</template>

<script lang="ts" setup>
import MarkdownRender from '~/components/MarkdownRender.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ArchiveData } from '~/types/archives'
import type { TocItem } from '~/types/tocitems'
import { useApi } from '#imports'
import { usePageTitle } from '@/composables/usePageTitle';

const { setPageTitle } = usePageTitle()
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

// 在获取数据后更新信息
watch(archive, (newVal) => {
  if (newVal) {
    setPageTitle(newVal.title)
  }
}, { immediate: true })

// 离开页面时清除数据
onUnmounted(() => {
  setPageTitle('')
})
</script>

<style scoped></style>

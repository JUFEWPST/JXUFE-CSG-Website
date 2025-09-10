<template>
  <main class=" relative">
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
      <article v-if="archive" class="mt-15 mb-2 mx-auto box-border p-2 max-w-screen">
        <div class="mb-1">
          <h1 class="text-2xl md:text-3xl lg:text-4xl sm:mx-20 md:mx-30 lg:mx-40 font-bold text-center leading-tight">
            {{ archive?.title }}
          </h1>
          <div class=" text-sm text-gray-400 dark:text-gray-200 font-light flex justify-center flex-wrap mx-1 gap-x-4">
            <span>创建于:{{ new Date(archive.createdAt).toLocaleString() }}</span>
            <span>更新于:{{ new Date(archive.updatedAt).toLocaleString() }}</span>
            <span v-if="archive.publisher">发布者:{{ archive.publisher }} </span>
            <div v-if="archive.tags?.tags?.length">
              <TagList :tags="archive.tags.tags"></TagList>
            </div>
          </div>
        </div>
        <hr class="text-gray-200">
        </hr>
        <div class="flex flex-row box-border ml-0 sm:ml-5 md:ml-20 max-w-screen mt-1">
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
      subtitle: `更新于:${new Date(newVal.publishedAt).toLocaleString()} 发布者:${newVal.publisher || ''}`
    }
  }
}, { immediate: true })

// 离开页面时清除数据
onUnmounted(() => {
  navTitleBox.value = { title: '', subtitle: '' }
})
</script>

<style scoped></style>
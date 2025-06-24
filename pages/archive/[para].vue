<template>
  <main class=" relative">
    <div v-if="archive" style="--to-height: 200px"
      class="absolute top-0 left-0 right-0 
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
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-center text-gray-800 leading-tight">
            {{ archive?.title }}
          </h1>
          <div class=" text-sm text-gray-500 flex justify-around">
            <div>发布时间:{{ new Date(archive.publishedAt).toLocaleDateString() }}</div>
            <div v-if="archive.publisher">发布者:{{ archive.publisher }} </div>
            <div v-if="archive.tags">
              <TagList :tags="archive.tags.tags"></TagList>
            </div>
          </div>
        </div>
        <div class="flex flex-row w-full max-w-screen">
          <!-- 文章内容 -->
          <MarkdownRender ref="markdownRender" :content="archive.content" @toc-updated="handleTocUpdate"
            class="flex-1 max-w-screen overflow-hidden box-border p-4">
          </MarkdownRender>

          <!-- 目录 -->
          <MarkdownTOC class="hidden md:block w-70 ml-8 sticky top-20 self-start" :items="tocItems">
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
const route = useRoute()
const markdownRender = ref();
const tocItems = ref<TocItem[]>([]);
const para = computed(() => route.params.para)
const {
  data: archive,
  loading,
  error,
  get
} = useApi<ArchiveData>();
function handleTocUpdate(items: TocItem[]) {
  console.log('Received TOC items:', items);
  tocItems.value = items;
}
onMounted(() => {
  get(`/archives/${para.value}`)
})
</script>

<style scoped></style>
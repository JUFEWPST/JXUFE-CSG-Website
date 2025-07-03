<template>
    <main class="mt-15">
        <div class="font-bold text-4xl text-center">归档</div>
        <div class="flex justify-center items-center mt-1 flex-col">
            <div v-if="loading" class="text-center py-8">
                <AnimationLoadingSpinner size="xl2" color="[var(--color-accent-hover)]"></AnimationLoadingSpinner>
            </div>
            <div v-else-if="error">
                <ErrorDisplay :errorData="error"></ErrorDisplay>
            </div>
            <template v-else>
                <ul class="box-border p-2 w-full md:w-1/2">
                    <ArticleBlock v-for="archive in archives" :key="archive.id" :title="archive.title"
                        :linkto="`/archive/${archive.documentId}`"
                        :datetime="new Date(archive.publishedAt).toLocaleDateString()"
                        :tags="archive.tags?.tags || []" />
                </ul>
            </template>
            <PageNav v-if="totalPages >= 1" :totalPages="totalPages" :currentPage="currentPage"
                @page-change="handlePageChange">
            </PageNav>
        </div>
    </main>
</template>

<script setup lang="ts">
import PageNav from '~/components/PageNav.vue';
import ArticleBlock from '~/components/ArticleBlock.vue';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from '#imports';
import { useApi } from '~/composables/useapi';
import type { Archive } from '~/types/archives';

useHead({
    title: '归档 - 江西财经大学网络安全协会'
})

const route = useRoute();
const router = useRouter();
const {
    data: archives,
    meta,
    loading,
    error,
    get: getArticles
} = useApi<Archive[]>();

const currentPage = ref(1);
const totalPages = ref(1);

const loadArticles = async (page: number = 1) => {
    console.log("加载分页数据:", page);
    await getArticles(`/archives?pagination[page]=${page}`);
    if (archives.value) {
        console.log("文章数据:", archives.value);
        if (meta.value?.pagination) {
            totalPages.value = meta.value.pagination.pageCount;
            currentPage.value = meta.value.pagination.page;
        }
    } else {
        console.error("加载失败", error.value);
    }
};



watch(
    () => route.query.page,
    (newPage) => {
        const pageNum = parseInt(newPage as string) || 1;
        currentPage.value = pageNum;
        loadArticles(pageNum);
    },
    { immediate: true }
);

const handlePageChange = (page: number) => {
    if (page === currentPage.value) return;
    router.push({
        query: {
            ...route.query,
            page: page > 1 ? page : undefined
        }
    });
};
</script>

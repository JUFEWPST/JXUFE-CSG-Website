<template>
    <div
        class="box-border min-h-[calc(100vh-16rem)] bg-(--md-sys-color-surface-container-lowest) px-4 py-6 sm:px-6 sm:py-8"
    >
        <div class="mx-auto max-w-4xl">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
                <AnzuProgressRing :size="48" status="loading" />
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="flex justify-center py-12">
                <div class="text-center">
                    <p class="mb-2 text-lg font-medium text-red-500">
                        {{ t("pages.wiki.tree.loadError") }}
                    </p>
                    <button
                        @click="refresh"
                        class="text-(--md-sys-color-primary) hover:underline"
                    >
                        {{ t("ctf.reload") }}
                    </button>
                </div>
            </div>

            <!-- Content Grid -->
            <ul
                v-else-if="data && data.children"
                class="m-0 list-none p-0 space-y-2"
            >
                <WikiIndexTreeItem
                    v-for="item in data.children"
                    :key="item.id"
                    :node="item"
                    :depth="0"
                />
            </ul>

            <!-- Empty State -->
            <div
                v-else
                class="flex flex-col items-center justify-center py-20 opacity-50"
            >
                <BookOpenIcon class="mb-4 h-24 w-24 stroke-1" />
                <p>{{ t("common.items.empty") }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { usePageTitle } from "@/composables/usePageTitle";
import {
    BookOpenIcon,
    FolderIcon,
    DocumentTextIcon,
    ArrowRightIcon,
} from "@heroicons/vue/24/outline";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useApi } from "~/composables/useapi";
import type { WikiTreeNode } from "~/types/wiki";
import AnzuProgressRing from "~/components/AnzuProgressRing.vue";
import WikiIndexTreeItem from "~/components/WikiIndexTreeItem.vue";

const { setPageTitle } = usePageTitle();

const { t } = useI18n();
const router = useRouter();

setPageTitle("pages.wiki.title");

const { data, get, loading, error } = useApi<WikiTreeNode>();

const refresh = () => {
    get("/v1/tree?root=wiki&depth=0");
};

const handleNavigate = (item: WikiTreeNode) => {
    router.push(`/${item.path}`);
};

onMounted(() => {
    get("/v1/tree?root=wiki&depth=0");
});

useHead(() => ({
    title: t("pages.wiki.meta.title"),
    meta: [{ name: "description", content: t("pages.wiki.meta.description") }],
}));
</script>

<template>
    <div class="relative">
        <div
            class="max-h-[calc(100vh-7rem)] overflow-y-auto text-(--md-sys-color-on-surface-variant) transition-all duration-300 ease-in-out"
        >
            <div class="flex items-center">
                <h2 class="text-lg font-bold">
                    {{ t("pages.wiki.tree.title") }}
                </h2>
            </div>

            <div v-if="loading" class="flex justify-center">
                <AnzuProgressRing :size="32" status="loading" />
            </div>

            <div v-else-if="error" class="text-sm text-red-500">
                {{ t("pages.wiki.tree.loadError") }}
            </div>

            <ul
                v-if="data && data.children"
                class="m-0 list-none p-0 space-y-1"
            >
                <WikiTreeItem
                    v-for="child in data.children"
                    :key="child.id"
                    :node="child"
                    :depth="0"
                />
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useApi, onMounted } from "#imports";
import type { WikiTreeNode } from "~/types/wiki";
import WikiTreeItem from "./WikiTreeItem.vue";
import AnzuProgressRing from "~/components/AnzuProgressRing.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { data, get, loading, error } = useApi<WikiTreeNode>();

onMounted(() => {
    // 0 depth means fetch full tree
    get("/v1/tree?root=wiki&depth=0");
});
</script>

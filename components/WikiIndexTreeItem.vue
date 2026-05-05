<template>
    <li>
        <div
            :class="[
                'flex cursor-pointer select-none items-center justify-between rounded-xl py-3 pr-4 transition-colors',
                isActive
                    ? 'bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) font-medium'
                    : 'text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-surface-container-high)',
            ]"
            :style="{ paddingLeft: `${padding}rem` }"
            @click="handleClick"
        >
            <div class="flex min-w-0 flex-1 items-center gap-3">
                <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                    :class="[
                        node.is_container
                            ? 'bg-(--md-sys-color-secondary-container) text-(--md-sys-color-on-secondary-container)'
                            : 'text-(--md-sys-color-primary)',
                    ]"
                >
                    <template v-if="node.is_container">
                        <FolderIcon v-if="isOpen" class="h-5 w-5" />
                        <FolderIcon v-else class="h-5 w-5" />
                    </template>
                    <DocumentTextIcon v-else class="h-5 w-5" />
                </div>
                <span class="truncate text-base">{{ node.title }}</span>
            </div>

            <div
                v-if="node.is_container"
                class="text-(--md-sys-color-on-surface-variant)"
            >
                <ChevronDownIcon v-if="isOpen" class="h-5 w-5" />
                <ChevronRightIcon v-else class="h-5 w-5" />
            </div>
        </div>

        <ul
            v-if="isOpen && node.children && node.children.length"
            class="mt-1 m-0 list-none p-0 space-y-1"
        >
            <WikiIndexTreeItem
                v-for="child in node.children"
                :key="child.id"
                :node="child"
                :depth="depth + 1"
            />
        </ul>
    </li>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "#imports";
import type { WikiTreeNode } from "~/types/wiki";
import {
    ChevronRightIcon,
    ChevronDownIcon,
    FolderIcon,
    DocumentTextIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps<{
    node: WikiTreeNode;
    depth: number;
}>();

const route = useRoute();
const router = useRouter();

const isOpen = ref(true);

const isActive = computed(() => {
    if (!props.node.path) return false;
    const nodePath = "/" + props.node.path;
    const cleanRoute = route.path.replace(/\/$/, "");
    const cleanNode = nodePath.replace(/\/$/, "");
    return cleanRoute === cleanNode;
});

const padding = computed(() => {
    return 1 + props.depth * 1.5;
});

function toggleOpen() {
    isOpen.value = !isOpen.value;
}

function handleClick() {
    if (props.node.is_container) {
        toggleOpen();
        return;
    }

    if (!props.node.path) return;
    const targetPath = "/" + props.node.path;
    router.push(targetPath);
}
</script>

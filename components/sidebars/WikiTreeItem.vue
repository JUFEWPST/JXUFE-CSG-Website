<template>
    <li>
        <div
            :class="[
                'flex cursor-pointer select-none items-center justify-between rounded-lg py-1.5 pr-2 text-sm transition-colors md:pr-3',
                isActive
                    ? 'bg-(--md-sys-color-primary) text-(--md-sys-color-on-primary) font-medium'
                    : 'text-(--md-sys-color-on-surface-variant) hover:bg-(--md-sys-color-primary-container) hover:text-(--md-sys-color-primary)',
            ]"
            :style="{ paddingLeft: `${padding}rem` }"
            @click="handleClick"
        >
            <div class="flex min-w-0 flex-1 items-center gap-1.5">
                <div
                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors"
                    :class="[
                        node.is_container
                            ? 'hover:bg-black/10 dark:hover:bg-white/10'
                            : 'cursor-default',
                    ]"
                    @click.stop="node.is_container && toggleOpen()"
                >
                    <template v-if="node.is_container">
                        <ChevronDownIcon v-if="isOpen" class="h-4 w-4" />
                        <ChevronRightIcon v-else class="h-4 w-4" />
                    </template>
                </div>
                <span class="truncate">{{ node.title }}</span>
            </div>
        </div>

        <ul
            v-if="isOpen && node.children && node.children.length"
            class="mt-0.5 m-0 list-none p-0 space-y-0.5"
        >
            <WikiTreeItem
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
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{
    node: WikiTreeNode;
    depth: number;
}>();

const route = useRoute();
const router = useRouter();

const isOpen = ref(false);

const isActive = computed(() => {
    // node.path should match route.path roughly
    // node.path example: "wiki/ctf"
    // route.path example: "/wiki/ctf"
    if (!props.node.path) return false;
    const nodePath = "/" + props.node.path;
    const cleanRoute = route.path.replace(/\/$/, "");
    const cleanNode = nodePath.replace(/\/$/, "");
    return cleanRoute === cleanNode;
});

const isChildActive = computed(() => {
    if (!props.node.path) return false;
    const nodePath = "/" + props.node.path;
    const cleanRoute = route.path.replace(/\/$/, "");
    const cleanNode = nodePath.replace(/\/$/, "");
    return cleanRoute.startsWith(cleanNode + "/");
});

// Auto expand
watch(
    [isActive, isChildActive],
    () => {
        if (isChildActive.value || isActive.value) {
            isOpen.value = true;
        }
    },
    { immediate: true },
);

const padding = computed(() => {
    // Indentation logic
    return 0.5 + props.depth * 0.75;
});

function toggleOpen() {
    isOpen.value = !isOpen.value;
}

function handleClick() {
    if (props.node.is_container) {
        // Folders only toggle
        isOpen.value = !isOpen.value;
        return;
    }

    if (!props.node.path) return;
    const targetPath = "/" + props.node.path;
    router.push(targetPath);
}
</script>

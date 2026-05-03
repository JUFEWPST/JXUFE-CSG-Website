<template>
    <nav
        aria-label="Breadcrumb"
        class="flex"
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
    >
        <ol
            class="flex flex-wrap items-center gap-2 text-sm text-(--md-sys-color-on-surface-variant)"
        >
            <li
                v-for="(item, index) in items"
                :key="index"
                class="flex items-center gap-2"
                itemprop="itemListElement"
                itemscope
                itemtype="https://schema.org/ListItem"
            >
                <span
                    v-if="index > 0"
                    class="select-none text-(--md-sys-color-outline-variant)"
                    aria-hidden="true"
                >
                    <slot name="separator">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </slot>
                </span>

                <NuxtLink
                    v-if="item.to && index < items.length - 1"
                    :to="item.to"
                    class="hover:text-(--md-sys-color-on-surface) hover:bg-(--md-sys-color-on-surface-variant)/8 rounded-md px-2 py-1 -mx-2 transition-all duration-200 flex items-center gap-1.5 cursor-pointer font-medium"
                    @click.prevent="handleClick(item, index)"
                    itemprop="item"
                    itemscope
                    itemtype="https://schema.org/Thing"
                    :itemid="getItemUrl(item, index)"
                >
                    <component
                        v-if="item.icon"
                        :is="item.icon"
                        class="h-5 w-5"
                    />
                    <span itemprop="name">{{ item.text }}</span>
                </NuxtLink>

                <span
                    v-else
                    class="font-bold text-(--md-sys-color-on-surface) flex items-center gap-1.5 px-2 py-1 -mx-2"
                    :aria-current="
                        index === items.length - 1 ? 'page' : undefined
                    "
                    @click="handleClick(item, index)"
                    itemprop="item"
                    itemscope
                    itemtype="https://schema.org/Thing"
                    :itemid="getItemUrl(item, index)"
                >
                    <component
                        v-if="item.icon"
                        :is="item.icon"
                        class="h-5 w-5"
                    />
                    <span itemprop="name">{{ item.text }}</span>
                </span>
                <meta itemprop="position" :content="(index + 1).toString()" />
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import type { Component } from "vue";

const emit = defineEmits<{
    (e: "select", item: BreadcrumbItem, index: number): void;
    (e: "click", item: BreadcrumbItem, index: number): void;
}>();

const handleClick = (item: BreadcrumbItem, index: number) => {
    emit("click", item, index);
    emit("select", item, index);
};

export interface BreadcrumbItem {
    text: string;
    to?: string;
    icon?: Component;
}

const props = defineProps<{
    items: BreadcrumbItem[];
}>();

const route = useRoute();
const config = useRuntimeConfig();

const getItemUrl = (item: BreadcrumbItem, index: number) => {
    if (index === props.items.length - 1) {
        return new URL(route.path, config.public.siteUrl).toString();
    }
    return new URL(item.to || route.path, config.public.siteUrl).toString();
};
</script>

<style scoped>
@reference "tailwindcss";
</style>

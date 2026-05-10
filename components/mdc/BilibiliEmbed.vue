<template>
    <iframe
        v-if="src"
        :src="src"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
        style="
            width: 100%;
            aspect-ratio: 16/9;
            margin: 1em 0;
            display: block;
            border-radius: 4px;
        "
    />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    identifier: string;
}>();

const src = computed(() => {
    const value = (props.identifier || "").trim();
    if (!value) return "";

    if (value.toLowerCase().startsWith("bv")) {
        return `//player.bilibili.com/player.html?bvid=${value}&page=1&high_quality=1&danmaku=0`;
    }

    if (value.toLowerCase().startsWith("av")) {
        const id = value.slice(2);
        return `//player.bilibili.com/player.html?aid=${id}&page=1&high_quality=1&danmaku=0`;
    }

    return "";
});
</script>

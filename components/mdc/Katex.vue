<template>
    <span v-if="!isDisplay" class="katex-inline" v-html="rendered" />
    <div v-else class="katex-block" v-html="rendered" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";

const props = defineProps<{
    tex?: string;
    display?: boolean | string;
}>();

const isDisplay = computed(
    () => props.display === true || props.display === "true",
);

const decodedTex = computed(() => {
    const raw = props.tex || "";
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
});

const rendered = computed(() => {
    const tex = decodedTex.value;
    try {
        return katex.renderToString(tex, {
            displayMode: isDisplay.value,
            throwOnError: false,
            trust: true,
        });
    } catch {
        return isDisplay.value
            ? `<span class="math-error">${tex}</span>`
            : `<code class="math-error">${tex}</code>`;
    }
});
</script>

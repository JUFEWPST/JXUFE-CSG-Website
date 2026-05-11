<template>
    <component :is="tag" :id="headingId">
        <a
            v-if="showAnchor"
            class="anchor"
            :href="anchorHref"
            aria-hidden="true"
            tabindex="-1"
        >
            <span class="octicon octicon-link" />
        </a>
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    id?: string;
    tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    showAnchor?: boolean;
}>();

const headingId = computed(() => props.id || "");
const showAnchor = computed(() => Boolean(props.showAnchor && headingId.value));
const anchorHref = computed(() => `#${headingId.value}`);
</script>

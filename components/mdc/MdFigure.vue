<template>
    <figure class="my-4 flex flex-col items-center">
        <img :src="src" :alt="alt" class="max-w-full rounded-xl" />
        <figcaption
            v-if="caption"
            class="mt-2 text-center text-sm text-(--md-sys-color-on-surface-variant)"
        >
            {{ caption }}
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
defineProps<{
    src?: string;
    alt?: string;
    caption?: string;
}>();
</script>

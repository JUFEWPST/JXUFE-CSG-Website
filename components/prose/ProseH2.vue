<template>
    <ProseHeading tag="h2" :id="id" :show-anchor="Boolean(id)">
        <slot />
    </ProseHeading>
</template>

<script setup lang="ts">
import ProseHeading from "~/components/prose/ProseHeading.vue";

defineProps<{
    id?: string;
}>();
</script>

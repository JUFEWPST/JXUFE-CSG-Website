<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import PageFooter from '@/components/PageFooter.vue'
</script>

<template>
    <div class="layout-wrapper">
        <NavBar />
        <slot />
        <PageFooter />
    </div>
</template>

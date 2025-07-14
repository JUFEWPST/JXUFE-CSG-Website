<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import PageFooter from '@/components/PageFooter.vue'
import { useNotification } from '@/composables/useNotification'
import AnzuNotification from '~/components/AnzuNotification.vue'
const { notificationRef } = useNotification()
</script>

<template>
    <div class="layout-wrapper">
        <NavBar />
        <slot />
        <AnzuNotification ref="notificationRef" />
        <PageFooter />
    </div>
</template>

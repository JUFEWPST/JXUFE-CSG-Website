<template>
    <main class="mt-15 mb-2 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-bold text-4xl text-center">历届负责人</h1>
        <LeadersList :leaders="leadersData" />
        <h2 class="text-xl font-bold text-amber-500 text-center">⇈ 数据努力收集中 ⇈</h2>
    </main>
</template>
<script setup lang="ts">
import LeadersList from '~/components/LeadersList.vue';
import { leadersData } from '~/data/leadersData';
useHead({
    title: '历届负责人 - 江西财经大学网络安全协会',
    meta: [
        {
            name: 'description',
            content: '江西财经大学网络安全协会归档页，在此可查阅江财网安协会历届负责人.'
        }
    ]
})

</script>
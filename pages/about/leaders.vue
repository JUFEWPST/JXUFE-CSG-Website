<template>
    <main class="mt-15 mb-2 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-bold text-4xl text-center">历届负责人</h1>
        <LeadersList :leaders="leadersData" />
        <AnzuAlert type="info">
            数据努力收集中，若您是协会相关成员，烦请协助填写我们的收集表<NuxtLink class="text-blue-500" to="/archive/nvz60h0y8pj9opi1hyn9ysvb">
                [历届成员档案共建邀请]</NuxtLink>
        </AnzuAlert>
    </main>
</template>
<script setup lang="ts">
import LeadersList from '~/components/LeadersList.vue';
import { leadersData } from '~/data/leadersData';
import AnzuAlert from '~/components/AnzuAlert.vue';
useHead({
    title: '历届负责人 - 江西财经大学网络安全协会',
    meta: [
        {
            name: 'description',
            content: '江西财经大学网络安全协会历届负责人展示页，在此可查阅江财网安协会历届负责人.'
        },
        {
            name:"keywords",
            content:"历届负责人,历届会长,历任会长,江财网安协会会长"
        }
    ]
})

</script>
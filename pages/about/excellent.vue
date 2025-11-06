<template>
    <main class="mt-15 mb-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-bold text-4xl text-center">协会优秀成员</h1>
        <AnzuAlert type="info">
            数据努力收集中，若您是协会相关成员，烦请协助填写我们的收集表<NuxtLink class="text-blue-500" to="/archive/nvz60h0y8pj9opi1hyn9ysvb">
                [历届成员档案共建邀请]</NuxtLink>
        </AnzuAlert>
        <section class="mt-3 grid grid-cols-auto-fill gap-4">
            <MemberHonorCard v-for="(person, index) in excellentData" :key="index" :person="person"></MemberHonorCard>
        </section>
    </main>
</template>
<script setup lang="ts">
import MemberHonorCard from '~/components/MemberHonorCard.vue';
import { excellentData } from '~/data/excellentData';
useHead({
    title: '优秀成员 - 江西财经大学网络安全协会',
    meta: [
        {
            name: 'description',
            content: '江西财经大学网络安全协会优秀成员页，在此可查阅协会优秀成员.'
        },
        {
            name: "keywords",
            content: "优秀成员,成员风采,技术大神,荣誉榜,江财网安协会优秀成员"
        }
    ]
})

</script>
<style scoped>
.grid-cols-auto-fill {
    --min-col-size: 360px;
    grid-template-columns: repeat(auto-fill, minmax(var(--min-col-size), 1fr));
}
</style>
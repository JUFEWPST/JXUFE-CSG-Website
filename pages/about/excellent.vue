<template>
    <main class="mt-15 mb-2 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h1 class="font-bold text-4xl text-center">协会优秀成员</h1>
        <section class="flex flex-wrap justify-between gap-4 my-3">
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
        }
    ]
})

</script>
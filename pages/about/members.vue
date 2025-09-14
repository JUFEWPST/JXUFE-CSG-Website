<template>
    <main class="mt-15 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-bold text-4xl text-center">历届成员</h1>
        <AnzuAlert type="info">
            数据努力收集中，若您是协会相关成员，烦请协助填写我们的收集表<NuxtLink class="text-blue-500" to="/archive/nvz60h0y8pj9opi1hyn9ysvb">
                [历届成员档案共建邀请]</NuxtLink>
        </AnzuAlert>
        <div v-for="item in members" :key="item.year" class="mb-12">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-yellow-400 pl-3">
                <template v-if="typeof item.year === 'string'">{{ item.year }}</template>
                <template v-if="typeof item.year === 'number'">{{ item.year }} 届</template>
            </h2>
            <div class="flex flex-wrap gap-4 justify-around">
                <MemberCard v-for="(member, index) in item.members" :key="`${item.year}-${index}`" :member="member" />
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { membersArray } from '~/data/membersData';
const members = ref(membersArray);
useHead({
    title: '历届成员 - 江西财经大学网络安全协会',
    meta: [
        {
            name: 'description',
            content: '江西财经大学网络安全协会历届成员页，在此可查阅江财网安协会历届成员.'
        },
        {
            name: "keywords",
            content: "历届成员,协会成员,成员档案,江财网安协会历届成员"
        }
    ]
})

</script>
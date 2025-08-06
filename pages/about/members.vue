<template>
    <main class="mt-15 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-bold text-4xl text-center">历届成员</h1>
        <div v-for="(yearMembers, year) in members" :key="year" class="mb-12">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-l-4 border-yellow-400 pl-3">
                {{ year }} 届成员
            </h2>
            <div class="flex flex-wrap gap-4 justify-around">
                <MemberCard v-for="(member, index) in yearMembers" :key="`${year}-${index}`" :name="member.name"
                    :position="member.position" :avatar="member.avatar" :message="member.message"
                    :contact="member.contact" />
            </div>
        </div>
        <h2 class="text-xl font-bold text-amber-500 text-center">⇈ 数据努力收集中 ⇈</h2>
    </main>
</template>

<script setup lang="ts">
import membersData from '~/data/membersData';
const members = ref(membersData);
</script>
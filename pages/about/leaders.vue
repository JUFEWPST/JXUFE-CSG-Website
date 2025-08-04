<template>
    <main class="mt-15 mb-2 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="font-bold text-4xl text-center">历届负责人</h1>
        <LeadersList :leaders="leadersData" />
    </main>

</template>
<script setup lang="ts">
import LeadersList from '~/components/LeadersList.vue';
import { leadersData } from '~/data/leadersData';
</script>
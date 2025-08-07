<template>
    <div class="flex flex-col justify-center">
        <template v-for="(leader, index) in leaders" :key="index">
            <LeaderCard :leader="leader" />
            <hr class="h-0.5 border-dashed border-gray-400 my-6">
        </template>

    </div>
</template>

<script setup lang="ts">
import LeaderCard from '~/components/LeaderCard.vue'
import type { Leader } from '~/types/leader';

defineProps<{
    leaders: Leader[]
}>()
</script>

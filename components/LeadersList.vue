<template>
    <div class="flex flex-col justify-center">
        <LeaderCard v-for="(leader, index) in leaders" :key="index" :leader="leader" />
    </div>
</template>

<script setup lang="ts">
import LeaderCard from '~/components/LeaderCard.vue'
import type { Leader } from '~/types/leader';

defineProps<{
    leaders: Leader[]
}>()
</script>

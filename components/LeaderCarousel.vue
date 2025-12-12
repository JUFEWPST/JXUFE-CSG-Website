<template>
    <BaseCarousel :item-count="leaders.length">
        <LeaderCard
            v-for="(leader, index) in leaders"
            :key="index"
            :leader="leader"
        />
    </BaseCarousel>
</template>

<script setup lang="ts">
import BaseCarousel from "~/components/BaseCarousel.vue";
import LeaderCard from "~/components/LeaderCard.vue";
import type { Leader } from "~/types/leader";

defineProps<{
    leaders: Leader[];
}>();
</script>

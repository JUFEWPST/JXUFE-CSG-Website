<template>
    <BaseCarousel :item-count="leaders.length">
        <div
            v-for="(leader, index) in leaders"
            :key="index"
            class="w-full shrink-0 pb-8 sm:px-12"
        >
            <LeaderCard :leader="leader" />
        </div>
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

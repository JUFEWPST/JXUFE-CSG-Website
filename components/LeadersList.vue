<template>
    <div class="flex flex-col justify-center">
        <template v-for="(leader, index) in leaders" :key="index">
            <LeaderCard :leader="leader" />
            <hr
                class="my-6 h-0.5 border-dashed border-(--md-sys-color-outline-variant)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import LeaderCard from "~/components/LeaderCard.vue";
import type { Leader } from "~/types/leader";

defineProps<{
    leaders: Leader[];
}>();
</script>

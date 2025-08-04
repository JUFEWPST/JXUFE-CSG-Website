<template>
    <div class="flex flex-wrap gap-6 p-4 justify-center">
        <LeaderCard v-for="(leader, index) in leaders" :key="index" :leader="leader"
            class="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]" />
    </div>
</template>

<script setup lang="ts">
import LeaderCard from '~/components/LeaderCard.vue'

interface Leader {
    name: string
    class?: string
    year: string
    message?: string
    achievements?: string[]
    avatar?: string
}

defineProps<{
    leaders: Leader[]
}>()
</script>

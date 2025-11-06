<template>
    <div class="member-card flex flex-col items-center rounded-xl overflow-hidden transition-all duration-300 w-full min-w-[300px] h-40"
        :title="member.message">
        <div class="relative h-25 w-full">
            <img v-if="member.avatar" class="absolute top-0 left-0 z-1 object-cover w-full h-full opacity-30"
                :src="member.avatar" alt="背景图" />
            <div v-else class="absolute top-0 left-0 z-1 w-full h-full bg-blue-200/10" />
            <div class="absolute top-0 left-0 z-2 w-full h-full p-2 box-border flex gap-2">
                <div class="relative -bottom-10 w-20 h-20 rounded-full shadow-sm overflow-hidden">
                    <img v-if="member.avatar" :src="member.avatar" :alt="(member.display || 'fakename') + '的头像'"
                        class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-500">
                        <span class="text-2xl font-bold">{{ nameInitial }}</span>
                    </div>
                </div>
                <div class="flex-1 relative">
                    <div class="flex-1 absolute bottom-0">
                        <h2 class="text-2xl font-bold" :class="{ 'blur-sm opacity-35': !member.display }">
                            {{ member.display || 'fakename' }}
                        </h2>
                        <span
                            class="text-xs text-white font-medium mt-1 truncate py-1 px-2 rounded-full shadow-sm bg-blue-400">
                            {{ member.position }} </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="member.message" class="flex-1 w-full mt-1">
            <p class="w-full pl-22 box-border text-sm text-gray-600 dark:text-white/90">
                <span class="">「</span>{{ member.message }}<span class="">」</span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Member } from '~/data/membersData';

const props = defineProps<{ member: Member }>();
const nameInitial = computed(() => {
    if (!props.member.display) {
        return '○'
    }
    return props.member.display.charAt(0).toUpperCase() || '';
});
</script>

<style scoped>
.member-card {
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);
}
.dark .member-card {
    box-shadow: 0px 0px 3px rgba(255, 255, 255, 0.2);
}
</style>

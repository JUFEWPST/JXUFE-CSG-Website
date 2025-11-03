<template>
    <div class="member-card flex p-4  w-[340px] h-32 min-w-[300px]" :title="member.message">
        <div class="flex-shrink-0 mr-4 flex items-center">
            <div class="w-24 h-24 rounded-full overflow-hidden border-1 border-gray-100 dark:border-gray-700">
                <img v-if="member.avatar" :src="member.avatar" :alt="member.display || '头像'"
                    class="w-full h-full object-cover">
                <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-2xl font-bold">
                        {{ nameInitial }}
                    </span>
                </div>
            </div>
        </div>
        <div class="member-info flex-grow flex flex-col justify-between py-1 overflow-hidden">
            <div>
                <h3 class="text-lg font-bold m-0.5 truncate mb-1" :class="{ 'blur-sm opacity-35': !member.display }">
                    {{ member.display || 'fakename' }}
                </h3>
                <span class="text-xs text-white font-medium mt-1 truncate py-1 px-2 rounded-full shadow-sm bg-blue-400">
                    {{ member.position }}
                </span>
                <div v-if="member.message" class="mt-2">
                    <p class="text-sm text-gray-600 dark:text-gray-300 truncate">
                        「
                        {{ member.message }}
                        」
                    </p>
                </div>
            </div>
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
@custom-variant dark (&:where(.dark, .dark *));
.member-card {
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: 0.1px solid rgba(89, 83, 83, 0.3);
    border-radius: 18px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
}

.dark .member-card {
    border: 0.1px solid rgba(89, 83, 83, 0.5);
}

.member-card:hover {
    border-color: rgba(89, 83, 83, 0.7);
}
</style>

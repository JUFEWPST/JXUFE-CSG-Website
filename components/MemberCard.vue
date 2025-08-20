<template>
    <div
        class="member-card flex p-4 rounded-xl shadow-md transition-all duration-300 bg-white dark:bg-gray-800 hover:shadow-2xl w-[340px] h-[190px] min-w-[300px] min-h-[180px] border-0">
        <div class="flex-shrink-0 mr-4 flex items-center">
            <div class="w-24 h-24 rounded-full overflow-hidden shadow-lg border-1 border-gray-100 dark:border-gray-700">
                <img v-if="member.avatar" :src="member.avatar" :alt="member.display || '头像'"
                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="text-2xl font-bold">
                        {{ nameInitial }}
                    </span>
                </div>
            </div>
        </div>

        <div class="member-info flex-grow flex flex-col justify-between py-1 overflow-hidden">
            <div>
                <h3 class="text-lg font-bold rounded-2xl text-gray-900 m-0.5 dark:text-white truncate mb-1"
                    :class="{ 'blur-sm opacity-35': !member.display }">
                    {{ member.display || 'fakename' }}
                </h3>
                <span class="text-xs text-white font-medium mt-1 truncate py-1 px-2 rounded-full shadow-sm bg-blue-400">
                    {{ member.position }}
                </span>
                <div v-if="member.message" class="mt-2">
                    <p class="text-sm text-gray-600 dark:text-gray-300 ">
                        「
                        {{ member.message }}
                        」
                    </p>
                </div>
            </div>
            <div v-if="member.contact"
                class="mt-1 flex items-center pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                <span class="text-xs text-gray-600 dark:text-gray-400 truncate flex items-center">
                    {{ member.contact }}
                </span>
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
.member-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
    position: relative;
    overflow: hidden;
}

.member-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: 0;
    pointer-events: none;
}

.member-card:hover {
    transform: translateY(-5px) rotate(1deg);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
}
</style>

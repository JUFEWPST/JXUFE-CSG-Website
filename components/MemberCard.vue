<template>
    <div class="member-card flex p-4 rounded-xl shadow-md transition-all duration-300 bg-white dark:bg-gray-800 hover:shadow-lg border border-gray-200 dark:border-gray-700
              w-[300px] h-[180px] min-w-[300px] min-h-[180px]">
        <div class="flex-shrink-0 mr-4 flex items-center">
            <div class="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                <img v-if="avatar" :src="avatar" :alt="name" class="w-full h-full object-cover">
                <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span class="text-2xl font-bold text-gray-500 dark:text-gray-400">
                        {{ nameInitial }}
                    </span>
                </div>
            </div>
        </div>

        <div class="member-info flex-grow flex flex-col justify-between py-1 overflow-hidden">
            <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ name }}</h3>
                <span
                    class="text-sm text-white bg-amber-500 font-medium mt-1 truncate p-0.5 rounded">{{ position }}</span>
                <div v-if="message" class="mt-2">
                    <p class="text-sm text-gray-600 dark:text-gray-300 italic truncate">"{{ message }}"</p>
                </div>
            </div>
            <div v-if="contact" class="mt-1 flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ contact }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface MemberCardProps {
    name: string;
    position: string;
    avatar?: string;
    message?: string;
    contact?: string;
}

const props = defineProps<MemberCardProps>();
const nameInitial = computed(() => {
    return props.name.charAt(0).toUpperCase() || '';
});
</script>

<style scoped>
.member-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.member-card:hover {
    transform: translateY(-5px);
}
</style>

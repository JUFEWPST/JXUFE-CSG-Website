<template>
    <div
        class="member-card flex p-4 rounded shadow-md transition-all duration-300 bg-white dark:bg-gray-800 hover:shadow-lg w-[340px] h-[190px] min-w-[300px] min-h-[180px] border border-gray-200 dark:border-gray-700">
        <div class="flex-shrink-0 mr-4 flex items-center">
            <div class="w-28 h-28 rounded-full overflow-hidden shadow-lg">
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

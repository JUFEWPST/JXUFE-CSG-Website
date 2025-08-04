<template>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center mb-6">
            <div class="inline-flex rounded-md shadow-sm" role="group">
                <button v-for="year in Object.keys(members)" :key="year" @click="selectYear(year)" :class="[
                    'px-4 py-2 text-sm font-medium border',
                    'first:rounded-l-lg last:rounded-r-md',
                    'focus:z-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none',
                    selectedYear === year
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                ]">
                    {{ year }}届
                </button>
            </div>
        </div>

        <!-- 轮播组件 -->
        <div class="relative">
            <BaseCarousel :item-count="getGroupCount()">
                <div v-for="(group, groupIndex) in getGroups()" :key="groupIndex" class="flex justify-center gap-4 p-2">
                    <MemberCard v-for="(member, index) in group" :key="`${groupIndex}-${index}`" :name="member.name"
                        :position="member.position" :avatar="member.avatar" :message="member.message"
                        :contact="member.contact" />
                </div>
            </BaseCarousel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import BaseCarousel from './BaseCarousel.vue';
import MemberCard from './MemberCard.vue';

const props = defineProps<{
    membersData: Record<string, any[]>
}>();

const members = ref(props.membersData);
const selectedYear = ref(Object.keys(props.membersData)[0]);
const perPage = ref(4); 

const updatePerPage = () => {
    const width = window.innerWidth;
    if (width < 640) perPage.value = 1;
    else if (width < 768) perPage.value = 2;
    else if (width < 1024) perPage.value = 3;
    else perPage.value = 4;
};

const getGroupCount = () => {
    return Math.ceil(members.value[selectedYear.value].length / perPage.value);
};

// 将当前年份的成员分成多个组
const getGroups = () => {
    const currentMembers = members.value[selectedYear.value];
    const groups = [];
    for (let i = 0; i < currentMembers.length; i += perPage.value) {
        groups.push(currentMembers.slice(i, i + perPage.value));
    }
    return groups;
};

// 选择年份
const selectYear = (year: string) => {
    selectedYear.value = year;
};

// 监听窗口大小变化
onMounted(() => {
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
});

onUnmounted(() => {
    window.removeEventListener('resize', updatePerPage);
});
</script>

<style scoped>
.carousel-container {
    min-height: 220px;
}
</style>

<template>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center mb-6">
            <div class="inline-flex rounded-md shadow-sm" role="group">
                <button v-for="item in membersArray" :key="item.year" @click="selectYear(item.year)" :class="[
                    'px-4 py-2 text-sm font-medium border',
                    'first:rounded-l-md last:rounded-r-md',
                    'focus:z-10 focus:outline-none',
                    selectedYear === item.year
                        ? 'bg-blue-400 text-white border-blue-600'
                        : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
                ]">
                    <template v-if="typeof item.year === 'string'">{{ item.year }}</template>
                    <template v-if="typeof item.year === 'number'">{{ item.year }}届</template>
                </button>
            </div>
        </div>

        <!-- 轮播组件 -->
        <div class="relative">
            <BaseCarousel :item-count="getGroupCount()">
                <div v-for="(group, groupIndex) in getGroups()" :key="groupIndex" class="flex justify-center gap-4 p-2">
                    <MemberCard v-for="(member, index) in group" :key="`${groupIndex}-${index}`"
                        :name="member.display || 'XXX'" :position="member.position" :avatar="member.avatar"
                        :message="member.message" :contact="member.contact" />
                </div>
            </BaseCarousel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import BaseCarousel from './BaseCarousel.vue';
import MemberCard from './MemberCard.vue';
import type { Member, MemberGroup } from '~/data/membersData';


const props = defineProps<{
    membersArray: MemberGroup[];
}>();

const selectedYear = ref<string | number>(props.membersArray[0]?.year || '');
const perPage = ref(4);

const currentMembers = computed(() => {
    const group = props.membersArray.find(g => g.year === selectedYear.value);
    return group ? group.members : [];
});

const updatePerPage = () => {
    const width = window.innerWidth;
    if (width < 640) perPage.value = 1;
    else if (width < 768) perPage.value = 2;
    else if (width < 1024) perPage.value = 3;
    else perPage.value = 4;
};

const getGroupCount = () => {
    return Math.ceil(currentMembers.value.length / perPage.value);
};

const getGroups = () => {
    const groups = [];
    for (let i = 0; i < currentMembers.value.length; i += perPage.value) {
        groups.push(currentMembers.value.slice(i, i + perPage.value));
    }
    return groups;
};

const selectYear = (year: string | number) => {
    selectedYear.value = year;
};

onMounted(() => {
    updatePerPage();
    window.addEventListener('resize', updatePerPage);

    // 确保默认选中第一个年份
    if (props.membersArray.length > 0 && !selectedYear.value) {
        selectedYear.value = props.membersArray[0].year;
    }
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

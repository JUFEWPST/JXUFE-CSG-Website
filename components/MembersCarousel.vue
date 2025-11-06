<template>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center mb-6">
            <AnzuButtonGroup v-model="selectedYear" gap="none" class="h-10">
                <AnzuButton v-for="item in membersArray" :key="item.year" :value="item.year" primary-color="#50a2ff">
                    <template v-if="typeof item.year === 'string'">{{ item.year }}</template>
                    <template v-else>{{ item.year }}届</template>
                </AnzuButton>
            </AnzuButtonGroup>
        </div>

        <!-- 轮播组件 -->
        <div class="relative">
            <BaseCarousel :item-count="getGroupCount()">
                <div v-for="(group, groupIndex) in getGroups()" :key="groupIndex" class="flex justify-center gap-4 p-2">
                    <MemberCard v-for="(member, index) in group" :key="`${groupIndex}-${index}`" :member="member" />
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

onMounted(() => {
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    if (props.membersArray.length > 0 && !selectedYear.value) {
        selectedYear.value = props.membersArray[0].year;
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', updatePerPage);
});
</script>

<style scoped>
@reference "tailwindcss";

.carousel-container {
    min-height: 220px;
}

@media (max-width: 640px) {
    :deep(.anzu-button-group) {
        @apply flex-wrap justify-center;
    }

    :deep(.anzu-button-group .anzu-button) {
        @apply flex-1 min-w-0 px-3 py-2 text-xs;
    }
}
</style>

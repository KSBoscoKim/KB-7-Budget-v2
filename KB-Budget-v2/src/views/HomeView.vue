<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import Filter from '@/components/Filter.vue';
import FilterModal from '@/components/FilterModal.vue';
import Transaction from '@/components/Transaction.vue';
import AddTransactionFab from '@/components/AddTransactionFab.vue';
import BudgetPanel from '@/components/BudgetPanel.vue';
import { useUserStore } from '@/stores/user';
import SocialCustomTab from '@/components/SocialCustomTab.vue';
import { useTransactionStore } from '@/stores/transaction';

const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const transactionStore = useTransactionStore();
const { groupedByDateDesc } = storeToRefs(transactionStore);

const isPlanner = computed(() => currentUser.value?.spendingType === '계획형');
const isSocial = computed(() => currentUser.value?.spendingType === '사회형');

const filterModalOpen = ref(false);
const filterFocusSection = ref('date');

// 사회형 필터 상태 ('me' 또는 'others')
const socialFilterMode = ref('me');

// 현재 달 구하기 (YYYY-MM 형식)
const currentMonth = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});

function openFilter(section) {
  filterFocusSection.value = section;
  filterModalOpen.value = true;
}

// 탭 클릭 시 필터링 모드 변경
function handleSocialFilter(mode) {
  socialFilterMode.value = mode;
}

// 현재 달 데이터만 필터링
const currentMonthData = computed(() => {
  return groupedByDateDesc.value.filter((group) => {
    return group.date.startsWith(currentMonth.value);
  });
});

// 사회형 필터링 적용
const filteredGroupedData = computed(() => {
  if (!isSocial.value) {
    // 사회형이 아니면 현재 달 데이터만 반환
    return currentMonthData.value;
  }

  // 사회형인 경우 추가 필터링
  return currentMonthData.value
    .map((group) => {
      const filteredItems = group.items.filter((tx) => {
        const isOthers = tx.category === '경조사/회비';
        return socialFilterMode.value === 'others' ? isOthers : !isOthers;
      });
      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0); // 아이템이 없는 날짜 그룹은 제거
});
</script>

<template>
  <div class="home">
    <!-- 계획형 유저 전용 예산 패널 -->
    <BudgetPanel v-if="isPlanner" />
    <!-- 사회형 유저 전용 탭 -->
    <SocialCustomTab v-if="isSocial" @filter-social="handleSocialFilter" />
    <!-- 필터 -->
    <Filter
      @open-date="openFilter('date')"
      @open-category="openFilter('category')"
    />
    <!-- 거래 내역 (현재 달만 표시) -->
    <Transaction :list="filteredGroupedData" />
    <!-- 필터 모달 -->
    <FilterModal
      v-model="filterModalOpen"
      :focus-section="filterFocusSection"
    />
    <!-- 거래 추가 버튼 -->
    <AddTransactionFab />
  </div>
</template>

<style scoped>
.home {
  /* app-main의 스크롤 영역을 자연스럽게 채움 */
  display: flex;
  flex-direction: column;
  padding: 1rem 0 1.25rem;
  background: var(--color-bg-page);
}
</style>

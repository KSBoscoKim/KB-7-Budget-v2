<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();
const { groupedByDateDesc } = storeToRefs(transactionStore);

// 현재 선택된 모드 (me: 나를 위한, others: 타인을 위한)
const activeMode = ref('me');

const emit = defineEmits(['filter-social']);

function setMode(mode) {
  activeMode.value = mode;
  emit('filter-social', mode);
}

// 현재 달 구하기 (YYYY-MM 형식)
const currentMonth = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});

// 현재 달 데이터만 추출
const currentMonthTransactions = computed(() => {
  const items = [];
  groupedByDateDesc.value.forEach((group) => {
    // 현재 달에 해당하는 그룹만 처리
    if (group.date.startsWith(currentMonth.value)) {
      group.items.forEach((tx) => {
        items.push(tx);
      });
    }
  });
  return items;
});

// 나를 위한 거래 (경조사/회비 제외, 현재 달만)
const meTransactions = computed(() => {
  return currentMonthTransactions.value.filter(
    (tx) => tx.category !== '경조사/회비',
  );
});

// 타인을 위한 거래 (경조사/회비만, 현재 달만)
const othersTransactions = computed(() => {
  return currentMonthTransactions.value.filter(
    (tx) => tx.category === '경조사/회비',
  );
});

// 나를 위한 거래 통계
const meStats = computed(() => {
  const count = meTransactions.value.length;
  const total = meTransactions.value.reduce((sum, tx) => {
    return tx.type === 'expense' ? sum + tx.amount : sum - tx.amount;
  }, 0);
  return { count, total };
});

// 타인을 위한 거래 통계
const othersStats = computed(() => {
  const count = othersTransactions.value.length;
  const total = othersTransactions.value.reduce((sum, tx) => {
    return tx.type === 'expense' ? sum + tx.amount : sum - tx.amount;
  }, 0);
  return { count, total };
});

function formatAmount(amount) {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(amount));
}
</script>

<template>
  <div class="social-panel">
    <div class="panel-header">
      <span class="emoji">🌟</span>
      <p class="greeting">반가워요! 오늘은 누구를 위해 <b>씀씀</b>하셨나요?</p>
    </div>

    <div class="tab-group">
      <button
        :class="['tab-item', { active: activeMode === 'me' }]"
        @click="setMode('me')"
      >
        <span class="tab-icon">🙋‍♂️</span>
        <div class="tab-content">
          <span class="tab-label">나를 위한</span>
          <span class="tab-stats"
            >{{ meStats.count }}건 · {{ formatAmount(meStats.total) }}원</span
          >
        </div>
      </button>
      <button
        :class="['tab-item', { active: activeMode === 'others' }]"
        @click="setMode('others')"
      >
        <span class="tab-icon">🤝</span>
        <div class="tab-content">
          <span class="tab-label">타인을 위한</span>
          <span class="tab-stats"
            >{{ othersStats.count }}건 ·
            {{ formatAmount(othersStats.total) }}원</span
          >
        </div>
      </button>
    </div>

    <div class="mini-stats">
      <p v-if="activeMode === 'me'">나를 가꾸는 데 집중한 소비 내역이에요.</p>
      <p v-else>소중한 사람들과 마음을 나눈 따뜻한 지출입니다!</p>
    </div>
  </div>
</template>

<style scoped>
.social-panel {
  margin: 0 1rem 1rem;
  padding: 1.25rem;
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.greeting {
  font-size: 0.9rem;
  color: #1f2937;
  margin: 0;
}

.tab-group {
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.3rem;
  border-radius: 1rem;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-item.active {
  background: #fff;
  color: #2563eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.tab-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
}

.tab-label {
  font-size: 0.85rem;
  font-weight: 700;
}

.tab-stats {
  font-size: 0.65rem;
  font-weight: 500;
  opacity: 0.7;
}

.tab-item.active .tab-stats {
  opacity: 0.9;
}

.mini-stats {
  margin-top: 0.8rem;
  text-align: center;
}

.mini-stats p {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
}
</style>

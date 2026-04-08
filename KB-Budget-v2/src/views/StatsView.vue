<script setup>
import Calendar from '@/components/Calendar.vue';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transaction';
import { useStatsMonth } from '@/utils/useStatsMonth';
import StatsMonthNav from '@/components/stats/StatsMonthNav.vue';
import StatsSummaryStrip from '@/components/stats/StatsSummaryStrip.vue';
import StatsIncomeExpenseTabs from '@/components/stats/StatsIncomeExpenseTabs.vue';
import StatsCategoryPieChart from '@/components/stats/StatsCategoryPieChart.vue';

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const { selectedMonth, txsInMonth, incomeTotal, expenseTotal, netTotal } =
  useStatsMonth(transactions);

const activeTab = ref('expense');

function formatWon(n) {
  return `${new Intl.NumberFormat('ko-KR').format(Math.round(n))}원`;
}

function formatNetWon(n) {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? '-' : '';
  const abs = Math.abs(rounded);
  return `${sign}${new Intl.NumberFormat('ko-KR').format(abs)}원`;
}

const categoryTotalsForTab = computed(() => {
  const type = activeTab.value;
  const map = new Map();
  for (const tx of txsInMonth.value) {
    if (tx.type !== type) continue;
    const cat = tx.category || '기타';
    map.set(cat, (map.get(cat) || 0) + Number(tx.amount));
  }
  const rows = [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
  const sum = rows.reduce((s, r) => s + r.amount, 0);
  return rows.map((r) => ({
    ...r,
    percent: sum > 0 ? (r.amount / sum) * 100 : 0,
  }));
});

const emptyHint = computed(
  () =>
    `이 달에 ${activeTab.value === 'income' ? '수입' : '지출'} 내역이 없습니다.`
);

watch(selectedMonth, () => {
  const hasIncome = txsInMonth.value.some((t) => t.type === 'income');
  const hasExpense = txsInMonth.value.some((t) => t.type === 'expense');
  if (activeTab.value === 'income' && !hasIncome && hasExpense)
    activeTab.value = 'expense';
  if (activeTab.value === 'expense' && !hasExpense && hasIncome)
    activeTab.value = 'income';
});
</script>

<template>
  <div class="stats-page">
    <section class="stats-panel">
      <StatsMonthNav v-model="selectedMonth" />

      <StatsIncomeExpenseTabs
        v-model:active-tab="activeTab"
        :income-label="formatWon(incomeTotal)"
        :expense-label="formatWon(expenseTotal)"
      />

      <StatsCategoryPieChart
        :slices="categoryTotalsForTab"
        :empty-hint="emptyHint"
        :size="300"
      />

      <StatsSummaryStrip
        :income-label="formatWon(incomeTotal)"
        :expense-label="formatWon(expenseTotal)"
        :net-label="formatNetWon(netTotal)"
      />
    </section>

    <section class="calendar-panel">
      <Calendar v-model:month="selectedMonth" :show-month-nav="false" />
    </section>
  </div>
</template>

<style scoped>
.stats-page {
  max-width: 430px;
  margin: 0 auto;
  padding: 0.75rem 0.65rem 1rem;
  background: var(--color-bg-page);
  box-sizing: border-box;
}

.stats-panel {
  margin-bottom: 0.75rem;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-card);
  padding: 0.5rem 0.5rem 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-panel {
  margin-top: 0.25rem;
}
</style>

/** 날짜 클릭 시 상세 리스트 - 해당 날짜 거래 필터링 */
<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="isOpen" class="overlay" @click.self="close">
        <Transition name="panel">
          <div v-if="isOpen" class="panel">
            <!-- 헤더 -->
            <div class="panel-header">
              <div class="header-left">
                <div class="date-badge">
                  <span class="date-day">{{ selectedDay }}</span>
                  <span class="date-info">{{ selectedMonthYear }}</span>
                  <span class="date-weekday">{{ selectedWeekday }}</span>
                </div>
              </div>
              <div class="header-summary">
                <div class="summary-item income">
                  <span class="summary-label">수입</span>
                  <span class="summary-amount"
                    >+{{ formatAmount(totalIncome) }}원</span
                  >
                </div>
                <div class="divider-v"></div>
                <div class="summary-item expense">
                  <span class="summary-label">지출</span>
                  <span class="summary-amount"
                    >-{{ formatAmount(totalExpense) }}원</span
                  >
                </div>
              </div>
              <button class="close-btn" @click="close">✕</button>
            </div>

            <!-- 거래 없을 때 -->
            <div v-if="filteredTransactions.length === 0" class="empty-state">
              <div class="empty-icon">📭</div>
              <p class="empty-title">거래 내역이 없습니다</p>
              <p class="empty-sub">이 날짜에 등록된 거래가 없어요</p>
            </div>

            <!-- 거래 리스트 -->
            <div v-else class="transaction-list">
              <!-- 수입 섹션 -->
              <div v-if="incomeTransactions.length > 0" class="section">
                <div class="section-header income-header">
                  <span class="section-icon">📈</span>
                  <span class="section-title">수입</span>
                  <span class="section-total income-text"
                    >+{{ formatAmount(totalIncome) }}원</span
                  >
                </div>
                <TransitionGroup name="card" tag="div" class="cards">
                  <div
                    v-for="(tx, i) in incomeTransactions"
                    :key="tx.id"
                    class="card income-card"
                    :style="{ animationDelay: `${i * 60}ms` }"
                  >
                    <div class="card-icon-wrap income-icon-bg">
                      <span class="card-icon">{{ tx.icon || '💰' }}</span>
                    </div>
                    <div class="card-body">
                      <div class="card-top">
                        <span class="card-name">{{ tx.name }}</span>
                        <span class="card-amount income-text"
                          >+{{ formatAmount(tx.amount) }}원</span
                        >
                      </div>
                      <div class="card-bottom">
                        <span class="card-category">{{ tx.category }}</span>
                        <span class="card-time">{{ tx.time }}</span>
                      </div>
                      <p v-if="tx.memo" class="card-memo">{{ tx.memo }}</p>
                    </div>
                  </div>
                </TransitionGroup>
              </div>

              <!-- 지출 섹션 -->
              <div v-if="expenseTransactions.length > 0" class="section">
                <div class="section-header expense-header">
                  <span class="section-icon">📉</span>
                  <span class="section-title">지출</span>
                  <span class="section-total expense-text"
                    >-{{ formatAmount(totalExpense) }}원</span
                  >
                </div>
                <TransitionGroup name="card" tag="div" class="cards">
                  <div
                    v-for="(tx, i) in expenseTransactions"
                    :key="tx.id"
                    class="card expense-card"
                    :style="{
                      animationDelay: `${(incomeTransactions.length + i) * 60}ms`,
                    }"
                  >
                    <div class="card-icon-wrap expense-icon-bg">
                      <span class="card-icon">{{ tx.icon || '💸' }}</span>
                    </div>
                    <div class="card-body">
                      <div class="card-top">
                        <span class="card-name">{{ tx.name }}</span>
                        <span class="card-amount expense-text"
                          >-{{ formatAmount(tx.amount) }}원</span
                        >
                      </div>
                      <div class="card-bottom">
                        <span class="card-category">{{ tx.category }}</span>
                        <span class="card-time">{{ tx.time }}</span>
                      </div>
                      <p v-if="tx.memo" class="card-memo">{{ tx.memo }}</p>
                    </div>
                  </div>
                </TransitionGroup>
              </div>
            </div>

            <!-- 하단 순이익 -->
            <div class="panel-footer">
              <span class="footer-label">하루 순이익</span>
              <span
                class="footer-net"
                :class="netAmount >= 0 ? 'income-text' : 'expense-text'"
              >
                {{ netAmount >= 0 ? '+' : '' }}{{ formatAmount(netAmount) }}원
              </span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useCalendarStore } from '../stores/calendar';
import { useTransactionStore } from '../stores/transaction';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const calendarStore = useCalendarStore();
const transactionStore = useTransactionStore();

// 선택된 날짜 포맷
const selectedDay = computed(() => {
  return calendarStore.selectedDate.getDate();
});

const selectedMonthYear = computed(() => {
  return calendarStore.selectedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });
});

const selectedWeekday = computed(() => {
  const days = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  return days[calendarStore.selectedDate.getDay()];
});

// 선택된 날짜 거래 필터링
const filteredTransactions = computed(() => {
  const selected = calendarStore.selectedDate;
  return transactionStore.transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      txDate.getFullYear() === selected.getFullYear() &&
      txDate.getMonth() === selected.getMonth() &&
      txDate.getDate() === selected.getDate()
    );
  });
});

const incomeTransactions = computed(() =>
  filteredTransactions.value.filter((tx) => tx.type === 'income'),
);

const expenseTransactions = computed(() =>
  filteredTransactions.value.filter((tx) => tx.type === 'expense'),
);

const totalIncome = computed(() =>
  incomeTransactions.value.reduce((sum, tx) => sum + tx.amount, 0),
);

const totalExpense = computed(() =>
  expenseTransactions.value.reduce((sum, tx) => sum + tx.amount, 0),
);

const netAmount = computed(() => totalIncome.value - totalExpense.value);

function formatAmount(amount) {
  return Math.abs(amount).toLocaleString('ko-KR');
}

function close() {
  emit('close');
}
</script>

<style scoped>
/* ── 오버레이 ── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center; /* flex-end에서 center로 변경 */
  padding: 20px; /* 화면 끝에 붙지 않도록 여백 추가 */
}

/* ── 패널 ── */
.panel {
  width: 100%;
  max-width: 390px; /* 모바일 기준 */
  height: 75vh; /* 화면의 75%만 차지 */
  background: #f8f7f4;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-radius: 20px;
}

/* ── 헤더 ── */
.panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 20px;
  background: #1a1a2e;
  color: white;
  flex-shrink: 0;
}

.header-left {
  flex-shrink: 0;
}

.date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 14px;
  min-width: 64px;
}

.date-day {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1px;
}

.date-info {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 2px;
}

.date-weekday {
  font-size: 11px;
  opacity: 0.85;
  font-weight: 600;
}

.header-summary {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.summary-label {
  font-size: 10px;
  opacity: 0.6;
  letter-spacing: 0.5px;
}

.summary-amount {
  font-size: 14px;
  font-weight: 700;
}

.income .summary-amount {
  color: #4ade80;
}
.expense .summary-amount {
  color: #f87171;
}

.divider-v {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ── 빈 상태 ── */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: #555;
  margin: 0;
}

.empty-sub {
  font-size: 13px;
  margin: 0;
}

/* ── 거래 리스트 ── */
.transaction-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.transaction-list::-webkit-scrollbar {
  width: 4px;
}

.transaction-list::-webkit-scrollbar-track {
  background: transparent;
}

.transaction-list::-webkit-scrollbar-thumb {
  background: #d0cfc9;
  border-radius: 2px;
}

/* ── 섹션 ── */
.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
}

.income-header {
  background: #f0fdf4;
  border-left: 3px solid #22c55e;
}

.expense-header {
  background: #fff1f2;
  border-left: 3px solid #ef4444;
}

.section-icon {
  font-size: 16px;
}

.section-title {
  font-size: 13px;
  color: #444;
  letter-spacing: 0.3px;
}

.section-total {
  margin-left: auto;
  font-size: 14px;
  font-weight: 800;
}

/* ── 카드 ── */
.cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: white;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #eeede9;
  animation: slideIn 0.35s ease both;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.09);
}

.income-card {
  border-left: 3px solid #22c55e;
}

.expense-card {
  border-left: 3px solid #ef4444;
}

.card-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.income-icon-bg {
  background: #f0fdf4;
}
.expense-icon-bg {
  background: #fff1f2;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.card-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-amount {
  font-size: 15px;
  font-weight: 800;
  flex-shrink: 0;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-category {
  font-size: 11px;
  color: #888;
  background: #f3f2ef;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 500;
}

.card-time {
  font-size: 11px;
  color: #bbb;
}

.card-memo {
  font-size: 12px;
  color: #999;
  margin: 6px 0 0;
  padding-top: 6px;
  border-top: 1px dashed #eee;
  line-height: 1.4;
}

/* ── 색상 ── */
.income-text {
  color: #16a34a;
}
.expense-text {
  color: #dc2626;
}

/* ── 푸터 ── */
.panel-footer {
  padding: 16px 20px;
  background: #1a1a2e;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.footer-label {
  font-size: 13px;
  opacity: 0.7;
  letter-spacing: 0.3px;
}

.footer-net {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

/* ── 애니메이션 ── */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.panel-enter-active {
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.panel-leave-active {
  transition: transform 0.22s ease-in;
}

.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
}
</style>

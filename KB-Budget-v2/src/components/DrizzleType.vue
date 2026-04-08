<template>
  <div class="drizzle-card">
    <!-- 헤더 -->
    <div class="card-header">
      <span class="badge">🌧️ 보슬비형</span>
      <span class="month-label">{{ currentMonthLabel }}</span>
    </div>

    <!-- 결제 건수 -->
    <div class="count-section">
      <p class="count-desc">이번 달 결제 건수</p>
      <p class="count-number">
        <span class="count-value">{{ expenseCount }}</span>
        <span class="count-unit">건</span>
      </p>
      <p class="count-amount">총 {{ formattedTotal }}원 지출</p>
    </div>

    <div class="divider" />

    <!-- 이만큼 참았으면 -->
    <div class="savings-section">
      <p class="savings-title">✨ 이만큼 참았으면 살 수 있었어요</p>
      <div v-if="affordableItems.length > 0" class="items-list">
        <div v-for="item in affordableItems" :key="item.name" class="item-row">
          <span class="item-emoji">{{ item.emoji }}</span>
          <span class="item-name">{{ item.name }}</span>
          <span class="item-price">{{ item.formattedPrice }}원</span>
        </div>
      </div>
      <p v-else class="no-expense">이번 달 지출이 없어요 🎉</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionStore } from '@/stores/transaction';

//1. Pinia 스토어 연결
const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

//2. 날짜 관련 계산
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const currentMonthLabel = computed(() => `${currentYear}년 ${currentMonth}월`);

//3.이번 달 지출 데이터 필터링
const thisMonthExpenses = computed(() =>
  transactions.value.filter((tx) => {
    if (tx.type !== 'expense') return false;
    const d = new Date(tx.date);
    return d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth;
  })
);

//4. 총액 계산 및 포맷팅
const expenseCount = computed(() => thisMonthExpenses.value.length);

const totalExpense = computed(() =>
  thisMonthExpenses.value.reduce((sum, tx) => sum + Number(tx.amount), 0)
);

const formattedTotal = computed(() =>
  new Intl.NumberFormat('ko-KR').format(totalExpense.value)
);

const WISH_ITEMS = [
  { name: '스타벅스 아메리카노', emoji: '☕', price: 4500 },
  { name: '편의점 삼각김밥', emoji: '🍙', price: 1500 },
  { name: '치킨 한 마리', emoji: '🍗', price: 20000 },
  { name: '영화 티켓', emoji: '🎬', price: 14000 },
  { name: '떡볶이 한 그릇', emoji: '🌶️', price: 5000 },
  { name: '버스 한 달 정기권', emoji: '🚌', price: 55000 },
  { name: '넷플릭스 한 달', emoji: '📺', price: 17000 },
  { name: '에어팟', emoji: '🎧', price: 179000 },
  { name: '아이폰', emoji: '📱', price: 1200000 },
  { name: '제주도 왕복 항공권', emoji: '✈️', price: 150000 },
];

//5. 구매 가능 항목 로직
const affordableItems = computed(() => {
  const total = totalExpense.value; // 이번 달 총 지출액
  if (total === 0) return []; // 돈을 안 썼으면 보여줄 게 없으니 빈 배열 반환
  return WISH_ITEMS.filter((item) => item.price <= total) // 1단계: 필터링
    .sort((a, b) => b.price - a.price) // 2단계: 정렬
    .slice(0, 3) // 3단계: 자르기
    .map((item) => ({
      // 4단계: 가공
      ...item,
      formattedPrice: new Intl.NumberFormat('ko-KR').format(item.price),
    }));
});
</script>

<style scoped>
.drizzle-card {
  background: #fffdf9;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(180, 130, 80, 0.1);
  padding: 18px 20px;
  margin: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid #f0e6d3;
}

/* 헤더 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge {
  background: #f5ede0;
  color: #8b5e3c;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

.month-label {
  font-size: 12px;
  color: #b59a80;
}

/* 결제 건수 */
.count-section {
  text-align: center;
  padding: 4px 0;
}

.count-desc {
  font-size: 13px;
  color: #a08060;
  margin: 0 0 4px;
}

.count-number {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin: 0 0 6px;
}

.count-value {
  font-size: 42px;
  font-weight: 800;
  color: #6b3f1f;
  line-height: 1;
}

.count-unit {
  font-size: 18px;
  font-weight: 600;
  color: #6b3f1f;
}

.count-amount {
  font-size: 13px;
  color: #b59a80;
  margin: 0;
}

.divider {
  height: 1px;
  background: #f0e6d3;
}

/* 이만큼 참았으면 */
.savings-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.savings-title {
  font-size: 13px;
  font-weight: 700;
  color: #5c3d1e;
  margin: 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f5ede0;
  border-radius: 10px;
  padding: 10px 14px;
}

.item-emoji {
  font-size: 20px;
}

.item-name {
  flex: 1;
  font-size: 13px;
  color: #5c3d1e;
  font-weight: 500;
}

.item-price {
  font-size: 13px;
  color: #c0622a;
  font-weight: 700;
}

.no-expense {
  font-size: 13px;
  color: #b59a80;
  text-align: center;
  margin: 0;
  padding: 8px 0;
}
</style>

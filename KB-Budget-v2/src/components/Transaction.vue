<script setup>
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction'

const transactionStore = useTransactionStore()
const { groupedByDateDesc } = storeToRefs(transactionStore)

async function onDelete(id, event) {
  event.preventDefault()
  event.stopPropagation()
  if (!window.confirm('이 거래를 삭제할까요?')) return
  try {
    await transactionStore.removeTransaction(id)
  } catch (e) {
    console.error(e)
    window.alert('삭제에 실패했습니다. json-server 실행 여부를 확인해 주세요.')
  }
}

function formatSectionDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(d)
}

function formatAmount(amount, type) {
  const n = new Intl.NumberFormat('ko-KR').format(amount)
  return type === 'expense' ? `−${n}원` : `+${n}원`
}

function typeLabel(type) {
  return type === 'income' ? '수입' : '지출'
}
</script>

<template>
  <section class="transaction" aria-label="거래 내역">
    <template v-if="groupedByDateDesc.length">
      <div
        v-for="group in groupedByDateDesc"
        :key="group.date"
        class="transaction-day"
      >
        <h2 class="transaction-day__heading">
          <time :datetime="group.date">{{ formatSectionDate(group.date) }}</time>
        </h2>
        <ul class="transaction-list">
          <li
            v-for="tx in group.items"
            :key="tx.id"
            class="transaction-item"
            :class="`transaction-item--${tx.type}`"
          >
            <div class="transaction-item__top">
              <RouterLink
                class="transaction-edit"
                :to="{ name: 'add-transaction', query: { id: tx.id } }"
              >
                수정
              </RouterLink>
              <button
                type="button"
                class="transaction-delete"
                @click="onDelete(tx.id, $event)"
              >
                삭제
              </button>
              <span class="transaction-type">{{ typeLabel(tx.type) }}</span>
            </div>
            <div class="transaction-item__body">
              <span class="transaction-amount">{{ formatAmount(tx.amount, tx.type) }}</span>
              <span class="transaction-category">{{ tx.category }}</span>
            </div>
            <p v-if="tx.memo" class="transaction-memo">{{ tx.memo }}</p>
          </li>
        </ul>
      </div>
    </template>
    <p v-else class="transaction-empty">거래 내역이 없습니다.</p>
  </section>
</template>

<style scoped>
.transaction {
  padding: 0 1rem 1rem;
}

.transaction-day + .transaction-day {
  margin-top: 1.25rem;
}

.transaction-day__heading {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #374151;
  letter-spacing: -0.02em;
}

.transaction-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.transaction-item {
  padding: 0.875rem 1rem;
  background: #ffffff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  border-left-width: 4px;
}

.transaction-item--income {
  background: #f0fdf4;
  border-color: #bbf7d0;
  border-left-color: #10b981;
}

.transaction-item--expense {
  background: #fff5f5;
  border-color: #fecaca;
  border-left-color: #ef4444;
}

.transaction-item__top {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.transaction-edit {
  margin-right: auto;
  font-size: 0.75rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}

.transaction-delete {
  padding: 0.125rem 0.5rem;
  border: 0;
  border-radius: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #fff;
  background: #ef4444;
  cursor: pointer;
}

.transaction-type {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: #f3f4f6;
  color: #4b5563;
}

.transaction-item--income .transaction-type {
  background: #d1fae5;
  color: #047857;
}

.transaction-item--expense .transaction-type {
  background: #fee2e2;
  color: #b91c1c;
}

.transaction-item__body {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.transaction-amount {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.transaction-item--income .transaction-amount {
  color: #059669;
}

.transaction-item--expense .transaction-amount {
  color: #dc2626;
}

.transaction-category {
  font-size: 0.8125rem;
  color: #374151;
  font-weight: 500;
}

.transaction-memo {
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.45;
}

.transaction-empty {
  margin: 0;
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #9ca3af;
}
</style>

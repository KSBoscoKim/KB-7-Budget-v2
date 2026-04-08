<script setup>
import { useTransactionStore } from '@/stores/transaction';

const transactionStore = useTransactionStore();

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

async function onDelete(id, event) {
  event.preventDefault();
  event.stopPropagation();
  if (!window.confirm('이 거래를 삭제할까요?')) return;
  try {
    await transactionStore.removeTransaction(id);
  } catch (e) {
    console.error(e);
    window.alert('삭제에 실패했습니다. json-server 실행 여부를 확인해 주세요.');
  }
}

function formatSectionDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(d);
}

function formatYear(isoDate) {
  return new Date(`${isoDate}T12:00:00`).getFullYear();
}

function formatAmount(amount, type) {
  const n = new Intl.NumberFormat('ko-KR').format(amount);
  return type === 'expense' ? `−${n}원` : `+${n}원`;
}

function typeLabel(type) {
  return type === 'income' ? '수입' : '지출';
}

function categoryInitial(cat) {
  return cat ? cat.charAt(0) : '?';
}
</script>

<template>
  <section class="transaction" aria-label="거래 내역">
    <template v-if="list.length">
      <div v-for="group in list" :key="group.date" class="transaction-day">
        <!-- 날짜 헤딩 -->
        <div class="transaction-day__header">
          <div class="transaction-day__date-wrap">
            <span class="transaction-day__year">{{
              formatYear(group.date)
            }}</span>
            <h2 class="transaction-day__heading">
              <time :datetime="group.date">{{
                formatSectionDate(group.date)
              }}</time>
            </h2>
          </div>
          <div class="transaction-day__divider" aria-hidden="true" />
        </div>

        <!-- 거래 리스트 -->
        <ul class="transaction-list">
          <li
            v-for="tx in group.items"
            :key="tx.id"
            class="transaction-item"
            :class="`transaction-item--${tx.type}`"
          >
            <!-- 좌: 카테고리 아이콘 -->
            <div
              class="transaction-item__avatar"
              :class="`transaction-item__avatar--${tx.type}`"
            >
              <span class="transaction-item__avatar-letter">{{
                categoryInitial(tx.category)
              }}</span>
            </div>

            <!-- 중: 내용 -->
            <div class="transaction-item__content">
              <div class="transaction-item__top-row">
                <span class="transaction-category">{{ tx.category }}</span>
                <span
                  class="transaction-type-badge transaction-type-badge--{{ tx.type }}"
                  >{{ typeLabel(tx.type) }}</span
                >
              </div>
              <p v-if="tx.memo" class="transaction-memo">{{ tx.memo }}</p>
            </div>

            <!-- 우: 금액 + 액션 -->
            <div class="transaction-item__right">
              <span
                class="transaction-amount"
                :class="`transaction-amount--${tx.type}`"
              >
                {{ formatAmount(tx.amount, tx.type) }}
              </span>
              <div class="transaction-actions">
                <RouterLink
                  class="transaction-action-btn"
                  :to="{ name: 'add-transaction', query: { id: tx.id } }"
                  aria-label="수정"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M5.433 13.917l1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"
                    />
                    <path
                      d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"
                    />
                  </svg>
                </RouterLink>
                <button
                  type="button"
                  class="transaction-action-btn transaction-action-btn--del"
                  aria-label="삭제"
                  @click="onDelete(tx.id, $event)"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5Zm0 1.5h2.5A1.25 1.25 0 0 1 12.5 3.75v.25h-5v-.25A1.25 1.25 0 0 1 8.75 2.5ZM9.25 9a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 9.25 9Zm1.5.75a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0v-4.5Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>

    <div v-else class="transaction-empty">
      <svg
        class="transaction-empty__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 14h6m-3-3v6M4 6h16M4 10h16M4 14h4M4 18h4" />
        <rect x="14" y="12" width="6" height="6" rx="1" />
      </svg>
      <p class="transaction-empty__text">거래 내역이 없습니다</p>
      <p class="transaction-empty__sub">우측 하단 버튼으로 추가해보세요</p>
    </div>
  </section>
</template>

<style scoped>
.transaction {
  padding: 0.25rem 1rem 6rem;
}

/* ── Day group ── */
.transaction-day + .transaction-day {
  margin-top: 1.75rem;
}

.transaction-day__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.625rem;
}

.transaction-day__date-wrap {
  flex-shrink: 0;
}

.transaction-day__year {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
  color: var(--color-text-muted);
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: 0.15rem;
}

.transaction-day__heading {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-secondary);
  letter-spacing: var(--tracking-normal);
  white-space: nowrap;
}

.transaction-day__divider {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, var(--color-border-light), transparent);
}

/* ── Transaction list ── */
.transaction-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ── Transaction item ── */
.transaction-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  background: var(--color-bg);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border-light);
  transition:
    transform var(--dur-base) var(--ease-spring),
    box-shadow var(--dur-base);
}

.transaction-item:active {
  transform: scale(0.988);
}

@media (hover: hover) and (pointer: fine) {
  .transaction-item:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
  }
}

/* ── Avatar (카테고리 이니셜) ── */
.transaction-item__avatar {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transaction-item__avatar--income {
  background: var(--color-income-soft);
}

.transaction-item__avatar--expense {
  background: var(--color-expense-soft);
}

.transaction-item__avatar-letter {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1;
}

.transaction-item__avatar--income .transaction-item__avatar-letter {
  color: var(--color-income);
}

.transaction-item__avatar--expense .transaction-item__avatar-letter {
  color: var(--color-expense);
}

/* ── Content ── */
.transaction-item__content {
  flex: 1;
  min-width: 0;
}

.transaction-item__top-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 0.2rem;
}

.transaction-category {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: var(--tracking-normal);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-type-badge--income,
.transaction-type-badge--expense,
[class*='transaction-type-badge'] {
  font-size: var(--text-2xs);
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-pill);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}

.transaction-type-badge--수입,
.transaction-type-badge--income {
  background: var(--color-income-soft);
  color: var(--color-income);
}

.transaction-type-badge--지출,
.transaction-type-badge--expense {
  background: var(--color-expense-soft);
  color: var(--color-expense);
}

.transaction-memo {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Right: Amount + Actions ── */
.transaction-item__right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.transaction-amount {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.transaction-amount--income {
  color: var(--color-income);
}

.transaction-amount--expense {
  color: var(--color-expense);
}

.transaction-actions {
  display: flex;
  gap: 0.25rem;
}

.transaction-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-subtle);
  color: var(--color-text-muted);
  text-decoration: none;
  cursor: pointer;
  transition:
    background var(--dur-fast),
    border-color var(--dur-fast),
    color var(--dur-fast);
  -webkit-tap-highlight-color: transparent;
  padding: 0;
}

.transaction-action-btn svg {
  width: 14px;
  height: 14px;
}

.transaction-action-btn:hover {
  background: #fff;
  border-color: var(--color-brand);
  color: var(--color-brand-mid);
}

.transaction-action-btn--del:hover {
  border-color: rgba(194, 87, 10, 0.45);
  color: var(--color-expense);
  background: rgba(194, 87, 10, 0.06);
}

/* ── Empty state ── */
.transaction-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 0.5rem;
  text-align: center;
}

.transaction-empty__icon {
  width: 52px;
  height: 52px;
  color: var(--color-text-muted);
  opacity: 0.5;
  margin-bottom: 0.5rem;
}

.transaction-empty__text {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-secondary);
}

.transaction-empty__sub {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
</style>

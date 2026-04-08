<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction'
import { useBudgetStore } from '@/stores/budget'
import { useUserStore } from '@/stores/user'

const txStore = useTransactionStore()
const budgetStore = useBudgetStore()
const userStore = useUserStore()

const { currentUser } = storeToRefs(userStore)
const { transactions } = storeToRefs(txStore)
const { currentMonth } = storeToRefs(budgetStore)

/* ── 저장 키 ── */
const PLAN_KEY = computed(() => `plan_${currentUser.value?.id}_${currentMonth.value}`)

/* ── 계획 데이터 ── */
const plan = ref({
  expectedIncome: 0,
  fixedItems: [
    { id: '1', name: '주거비', amount: 0 },
    { id: '2', name: '교통비', amount: 0 },
    { id: '3', name: '통신비', amount: 0 },
  ],
})

function loadPlan() {
  const saved = localStorage.getItem(PLAN_KEY.value)
  if (saved) {
    plan.value = JSON.parse(saved)
  } else {
    plan.value = {
      expectedIncome: Number(currentUser.value?.totalAmount) || 0,
      fixedItems: [
        { id: '1', name: '주거비', amount: 0 },
        { id: '2', name: '교통비', amount: 0 },
        { id: '3', name: '통신비', amount: 0 },
      ],
    }
  }
}

/* ── 이번 달 실제 거래 ── */
const thisMonthTx = computed(() => {
  const [year, month] = currentMonth.value.split('-')
  return transactions.value.filter((tx) => {
    const [y, m] = tx.date.split('-')
    return y === year && m === month
  })
})

const actualIncome = computed(() =>
  thisMonthTx.value
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0),
)

const actualExpense = computed(() =>
  thisMonthTx.value
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0),
)

/* ── 계획 합산 ── */
const fixedPlanTotal = computed(() =>
  plan.value.fixedItems.reduce((s, i) => s + Number(i.amount || 0), 0),
)

const variableActual = computed(() => Math.max(0, actualExpense.value - fixedPlanTotal.value))

const remainingBudget = computed(
  () => plan.value.expectedIncome - fixedPlanTotal.value - variableActual.value,
)

/* ── 날짜 라벨 ── */
const monthLabel = computed(() => {
  const [year, month] = currentMonth.value.split('-')
  return `${year}년 ${Number(month)}월`
})

/* ── 편집 상태 ── */
const isEditing = ref(false)
const editIncome = ref('')
const editItems = ref([])

function startEdit() {
  editIncome.value = plan.value.expectedIncome ? String(plan.value.expectedIncome) : ''
  editItems.value = plan.value.fixedItems.map((i) => ({ ...i, amount: i.amount ? String(i.amount) : '' }))
  isEditing.value = true
}

function addItem() {
  editItems.value.push({ id: Date.now().toString(), name: '', amount: '' })
  nextTick(() => {
    const inputs = document.querySelectorAll('.rp-item-name')
    inputs[inputs.length - 1]?.focus()
  })
}

function removeItem(id) {
  editItems.value = editItems.value.filter((i) => i.id !== id)
}

function save() {
  plan.value = {
    expectedIncome: Number(String(editIncome.value).replace(/,/g, '')) || 0,
    fixedItems: editItems.value
      .filter((i) => i.name.trim())
      .map((i) => ({
        id: i.id,
        name: i.name.trim(),
        amount: Number(String(i.amount).replace(/,/g, '')) || 0,
      })),
  }
  localStorage.setItem(PLAN_KEY.value, JSON.stringify(plan.value))
  isEditing.value = false
}

/* ── 포맷 ── */
function fmt(n) {
  return new Intl.NumberFormat('ko-KR').format(Math.round(Math.abs(n)))
}

onMounted(() => {
  budgetStore.init()
  loadPlan()
})

watch(PLAN_KEY, () => loadPlan())
</script>

<template>
  <div class="rp-card">
    <!-- 헤더 -->
    <div class="rp-header">
      <div class="rp-header__left">
        <span class="rp-badge">계획형</span>
        <p class="rp-title">{{ monthLabel }} 예산 계획</p>
      </div>
      <button class="rp-edit-icon" @click="startEdit" aria-label="예산 계획 수정">
        <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
          <path d="m5.433 13.917 1.144-3.054a.5.5 0 0 1 .114-.175l6.76-6.76a1.5 1.5 0 0 1 2.121 2.121l-6.76 6.76a.5.5 0 0 1-.175.114l-3.054 1.144a.25.25 0 0 1-.323-.323Z"/>
          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"/>
        </svg>
      </button>
    </div>

    <!-- 수입 행 -->
    <div class="rp-rows">
      <div class="rp-row">
        <span class="rp-row__dot rp-row__dot--income" />
        <span class="rp-row__label">
          예상 수입
          <em>실제 {{ fmt(actualIncome) }}원</em>
        </span>
        <span class="rp-row__value rp-row__value--income">
          {{ plan.expectedIncome ? fmt(plan.expectedIncome) + '원' : '미설정' }}
        </span>
      </div>

      <div class="rp-divider" />

      <!-- 고정 지출 -->
      <div class="rp-section-label">
        <span class="rp-row__dot rp-row__dot--fixed" />
        고정 지출 <em class="rp-muted-tag">숨만 쉬어도 나가는 돈</em>
      </div>

      <template v-if="plan.fixedItems.length > 0">
        <div class="rp-fixed-grid">
          <div v-for="item in plan.fixedItems" :key="item.id" class="rp-fixed-chip">
            <span class="rp-fixed-chip__name">{{ item.name }}</span>
            <span class="rp-fixed-chip__amount">{{ fmt(item.amount) }}원</span>
          </div>
        </div>
        <div class="rp-subtotal">
          <span>소계</span>
          <span>-{{ fmt(fixedPlanTotal) }}원</span>
        </div>
      </template>
      <div v-else class="rp-empty">항목을 추가해 주세요</div>

      <div class="rp-divider" />

      <!-- 변동 지출 -->
      <div class="rp-row">
        <span class="rp-row__dot rp-row__dot--variable" />
        <span class="rp-row__label">
          변동 지출 <em>내가 통제할 돈</em>
        </span>
        <span class="rp-row__value rp-row__value--variable">-{{ fmt(variableActual) }}원</span>
      </div>

      <div class="rp-divider rp-divider--strong" />

      <!-- 잔여 -->
      <div class="rp-row rp-row--balance">
        <span class="rp-row__label">잔여 예산</span>
        <span
          class="rp-row__value rp-row__value--balance"
          :class="remainingBudget >= 0 ? 'rp-row__value--pos' : 'rp-row__value--neg'"
        >
          {{ remainingBudget >= 0 ? '+' : '-' }}{{ fmt(remainingBudget) }}원
        </span>
      </div>
    </div>

    <!-- 편집 바텀시트 -->
    <Teleport to="body">
      <Transition name="rp-sheet">
        <div v-if="isEditing" class="rp-overlay" @click.self="isEditing = false">
          <div class="rp-sheet">
            <p class="rp-sheet__title">{{ monthLabel }} 예산 계획</p>
            <p class="rp-sheet__desc">예상 수입과 고정 지출 항목을 입력하세요</p>

            <div class="rp-sheet__scroll">
              <!-- 예상 수입 -->
              <label class="rp-field-label">한달 예상 수입</label>
              <div class="rp-input-wrap">
                <input
                  v-model="editIncome"
                  class="rp-input"
                  type="number"
                  inputmode="numeric"
                  placeholder="예: 3200000"
                />
                <span class="rp-input__unit">원</span>
              </div>

              <!-- 고정 지출 -->
              <label class="rp-field-label" style="margin-top: 0.25rem;">고정 지출 내역</label>
              <div class="rp-items">
                <div v-for="(item, idx) in editItems" :key="item.id" class="rp-item">
                  <input
                    v-model="item.name"
                    class="rp-item-name rp-input-sm"
                    :placeholder="['주거비', '교통비', '통신비', '보험료'][idx] || '항목명'"
                    maxlength="8"
                  />
                  <div class="rp-input-wrap rp-item-amount-wrap">
                    <input
                      v-model="item.amount"
                      class="rp-input-sm"
                      type="number"
                      inputmode="numeric"
                      placeholder="0"
                    />
                    <span class="rp-input__unit">원</span>
                  </div>
                  <button class="rp-remove-btn" @click="removeItem(item.id)" aria-label="삭제">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                    </svg>
                  </button>
                </div>

                <button class="rp-add-btn" @click="addItem">
                  <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4Z"/>
                  </svg>
                  항목 추가
                </button>
              </div>
            </div>

            <div class="rp-sheet__actions">
              <button class="rp-btn rp-btn--cancel" @click="isEditing = false">취소</button>
              <button class="rp-btn rp-btn--save" @click="save">저장</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── 카드 ── */
.rp-card {
  margin: 0 0.75rem 0.75rem;
  border-radius: var(--radius-card);
  background: #fff;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

/* ── 헤더 ── */
.rp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem 0.4rem;
}

.rp-header__left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rp-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--gradient-brand);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  width: fit-content;
}

.rp-title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.rp-edit-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-bg-page);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.rp-edit-icon:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.4);
  color: var(--color-brand);
}

/* ── 행 영역 ── */
.rp-rows {
  padding: 0 1rem 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
}

.rp-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
}

.rp-row__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.rp-row__dot--income   { background: var(--color-income); }
.rp-row__dot--fixed    { background: #b45309; }
.rp-row__dot--variable { background: var(--color-expense); }

.rp-row__label {
  flex: 1;
  color: var(--color-text-secondary);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.rp-row__label em {
  font-style: normal;
  font-size: 0.67rem;
  color: var(--color-text-muted);
  background: var(--color-bg-subtle);
  padding: 1px 6px;
  border-radius: 999px;
}

.rp-row__value {
  font-weight: 700;
  font-family: var(--font-display);
  font-size: 0.88rem;
  white-space: nowrap;
}

.rp-row__value--income   { color: var(--color-income); }
.rp-row__value--fixed    { color: #b45309; }
.rp-row__value--variable { color: var(--color-expense); }
.rp-row__value--pos      { color: var(--color-income); }
.rp-row__value--neg      { color: var(--color-expense); }

/* ── 고정 지출 섹션 라벨 ── */
.rp-section-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.rp-muted-tag {
  font-style: normal;
  font-size: 0.67rem;
  color: var(--color-text-muted);
  background: var(--color-bg-subtle);
  padding: 1px 6px;
  border-radius: 999px;
  font-weight: 500;
}

/* ── 고정 지출 플렉스 그리드 ── */
.rp-fixed-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  padding: 0.05rem 0 0.1rem;
}

.rp-fixed-chip {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0.3rem 0.55rem;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card-sm);
  min-width: 4.5rem;
  flex: 1 1 calc(33% - 0.3rem);
}

.rp-fixed-chip__name {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rp-fixed-chip__amount {
  font-size: 0.82rem;
  font-weight: 800;
  color: #b45309;
  font-family: var(--font-display);
  white-space: nowrap;
}

/* ── 소계 ── */
.rp-subtotal {
  display: flex;
  justify-content: space-between;
  padding: 0.12rem 0 0 0.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  border-top: 1px dashed var(--color-border-light);
  margin-top: 0.05rem;
}

/* ── 빈 항목 안내 ── */
.rp-empty {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  text-align: center;
  padding: 0.3rem 0;
}

/* ── 구분선 ── */
.rp-divider {
  height: 1px;
  background: var(--color-border-light);
  margin: 0.05rem 0;
}

.rp-divider--strong {
  background: var(--color-border);
  margin: 0.1rem 0;
}

/* ── 잔여 행 ── */
.rp-row--balance .rp-row__label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-text);
}

.rp-row__value--balance {
  font-size: 1.05rem;
  font-weight: 800;
}

/* ── 바텀시트 오버레이 ── */
.rp-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
}

/* ── 바텀시트 ── */
.rp-sheet {
  width: 100%;
  max-width: 430px;
  background: #fff;
  border-radius: var(--radius-card) var(--radius-card) 0 0;
  padding: 1.5rem 1.25rem 1.25rem;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 82dvh;
}

.rp-sheet__title {
  margin: 0 0 3px;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text);
  flex-shrink: 0;
}

.rp-sheet__desc {
  margin: 0 0 1.1rem;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.rp-sheet__scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 2px;
}

/* ── 필드 라벨 ── */
.rp-field-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
  margin-bottom: 0.4rem;
}

/* ── 인풋 래퍼 ── */
.rp-input-wrap {
  position: relative;
  margin-bottom: 1rem;
}

.rp-input__unit {
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.rp-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: 0.92rem;
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg-page);
  outline: none;
  transition: border-color 0.2s;
}

.rp-input:focus {
  border-color: var(--color-brand);
  box-shadow: var(--shadow-focus-ring);
}

.rp-input::-webkit-inner-spin-button,
.rp-input::-webkit-outer-spin-button { -webkit-appearance: none; }

/* ── 고정 지출 항목 리스트 ── */
.rp-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.rp-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.rp-input-sm {
  padding: 0.65rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: 0.85rem;
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg-page);
  outline: none;
  transition: border-color 0.2s;
}

.rp-input-sm:focus {
  border-color: var(--color-brand);
  box-shadow: var(--shadow-focus-ring);
}

.rp-input-sm::-webkit-inner-spin-button,
.rp-input-sm::-webkit-outer-spin-button { -webkit-appearance: none; }

.rp-item-name {
  width: 5.5rem;
  flex-shrink: 0;
}

.rp-item-amount-wrap {
  flex: 1;
  margin-bottom: 0;
}

.rp-item-amount-wrap .rp-input-sm {
  width: 100%;
  padding-right: 2rem;
}

.rp-remove-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-subtle);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
}

.rp-remove-btn:hover {
  background: rgba(194, 87, 10, 0.08);
  border-color: rgba(194, 87, 10, 0.3);
  color: var(--color-expense);
}

/* ── 항목 추가 버튼 ── */
.rp-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: 1.5px dashed var(--color-border);
  border-radius: var(--radius-input);
  font-size: 0.8rem;
  font-family: var(--font-body);
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.rp-add-btn:hover {
  border-color: var(--color-brand);
  color: var(--color-brand-mid);
  background: rgba(245, 158, 11, 0.04);
}

/* ── 액션 버튼 ── */
.rp-sheet__actions {
  display: flex;
  gap: 0.6rem;
  flex-shrink: 0;
  padding-top: 0.75rem;
}

.rp-btn {
  flex: 1;
  padding: 0.85rem;
  border-radius: var(--radius-input);
  font-size: 0.95rem;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
  border: none;
  transition: all 0.18s;
}

.rp-btn--cancel {
  background: var(--color-bg-page);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.rp-btn--cancel:hover { background: var(--color-bg-subtle); }

.rp-btn--save {
  background: var(--gradient-brand);
  color: #fff;
  box-shadow: var(--shadow-glow-brand);
}

.rp-btn--save:hover { filter: brightness(1.05); }

/* ── 트랜지션 ── */
.rp-sheet-enter-active,
.rp-sheet-leave-active {
  transition: opacity 0.25s;
}

.rp-sheet-enter-active .rp-sheet,
.rp-sheet-leave-active .rp-sheet {
  transition: transform 0.3s var(--ease-spring);
}

.rp-sheet-enter-from,
.rp-sheet-leave-to { opacity: 0; }

.rp-sheet-enter-from .rp-sheet,
.rp-sheet-leave-to .rp-sheet {
  transform: translateY(100%);
}
</style>

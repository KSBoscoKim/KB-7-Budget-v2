<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction'
import { useBudgetStore } from '@/stores/budget'
import { useUserStore } from '@/stores/user'
import { SquarePen, Info } from 'lucide-vue-next'

const txStore = useTransactionStore()
const budgetStore = useBudgetStore()
const userStore = useUserStore()

const { currentUser } = storeToRefs(userStore)
const { transactions } = storeToRefs(txStore)
const { monthlyBudget, currentMonth } = storeToRefs(budgetStore)

/* 예산 편집 상태 */
const isEditing = ref(false)
const editValue = ref('')

function openEdit() {
  editValue.value = String(monthlyBudget.value)
  isEditing.value = true
}

function saveEdit() {
  const num = Number(editValue.value.replace(/,/g, ''))
  if (!isNaN(num) && num > 0) {
    budgetStore.setBudget(num)
  }
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

function onEditKeydown(e) {
  if (e.key === 'Enter') saveEdit()
  if (e.key === 'Escape') cancelEdit()
}

/* 이번 달 지출 합계 */
const thisMonthSpent = computed(() => {
  const [year, month] = currentMonth.value.split('-')
  return transactions.value
    .filter((tx) => {
      if (tx.type !== 'expense') return false
      const [y, m] = tx.date.split('-')
      return y === year && m === month
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0)
})

const budget = computed(() => monthlyBudget.value)
const remaining = computed(() => budget.value - thisMonthSpent.value)
const percentage = computed(() => {
  if (!budget.value) return 0
  return Math.min((thisMonthSpent.value / budget.value) * 100, 100)
})

/* 상태별 색상 */
const statusColor = computed(() => {
  const p = percentage.value
  if (p >= 100) return 'danger'
  if (p >= 80) return 'warning'
  return 'safe'
})

/* 원형 게이지 SVG 계산 */
const RADIUS = 56
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const dashOffset = computed(() =>
  CIRCUMFERENCE - (percentage.value / 100) * CIRCUMFERENCE
)

/* 금액 포맷 */
function fmt(n) {
  return new Intl.NumberFormat('ko-KR').format(Math.round(Math.abs(n)))
}

/* 이번 달 레이블: 'YYYY년 M월' */
const monthLabel = computed(() => {
  const [year, month] = currentMonth.value.split('-')
  return `${year}년 ${Number(month)}월`
})

/* 남은 일수 */
const daysLeft = computed(() => {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return lastDay.getDate() - now.getDate()
})

/* 하루 평균 가능 지출 */
const dailyBudget = computed(() => {
  if (daysLeft.value <= 0 || remaining.value <= 0) return 0
  return remaining.value / (daysLeft.value + 1)
})

onMounted(() => budgetStore.init())
watch(currentUser, () => budgetStore.init())
</script>

<template>
  <div class="budget-panel" :class="`budget-panel--${statusColor}`">
    <!-- 헤더 -->
    <div class="bp-header">
      <div class="bp-header__left">
        <span class="bp-badge">플렉스형</span>
        <p class="bp-month">{{ monthLabel }} 예산</p>
      </div>
      <button class="bp-edit-btn" @click="openEdit" aria-label="예산 수정">
        <SquarePen :size="15" :stroke-width="2" />
      </button>
    </div>

    <!-- 본문 -->
    <div class="bp-body">
      <!-- 원형 게이지 -->
      <div class="bp-gauge">
        <svg class="bp-gauge__svg" viewBox="0 0 140 140">
          <!-- 배경 트랙 -->
          <circle
            class="bp-gauge__track"
            cx="70" cy="70"
            :r="RADIUS"
            fill="none"
            stroke-width="10"
          />
          <!-- 진행 호 -->
          <circle
            class="bp-gauge__arc"
            cx="70" cy="70"
            :r="RADIUS"
            fill="none"
            stroke-width="10"
            stroke-linecap="round"
            :stroke-dasharray="CIRCUMFERENCE"
            :stroke-dashoffset="dashOffset"
          />
          <!-- 퍼센트 텍스트 -->
          <text x="70" y="70" class="bp-gauge__pct-text" text-anchor="middle" dominant-baseline="middle">
            {{ Math.round(percentage) }}%
          </text>
        </svg>
      </div>

      <!-- 수치 요약 -->
      <div class="bp-stats">
        <div class="bp-stat">
          <span class="bp-stat__label">이번 달 예산</span>
          <span class="bp-stat__value">{{ fmt(budget) }}원</span>
        </div>
        <div class="bp-stat">
          <span class="bp-stat__label">사용한 금액</span>
          <span class="bp-stat__value bp-stat__value--spent">{{ fmt(thisMonthSpent) }}원</span>
        </div>
        <div class="bp-divider" />
        <div class="bp-stat bp-stat--highlight">
          <span class="bp-stat__label">남은 예산</span>
          <span class="bp-stat__value" :class="remaining < 0 ? 'bp-stat__value--over' : 'bp-stat__value--safe'">
            {{ remaining < 0 ? '-' : '' }}{{ fmt(remaining) }}원
          </span>
        </div>
        <div v-if="dailyBudget > 0" class="bp-daily-hint">
          <Info :size="12" :stroke-width="2.2" />
          오늘부터 {{ daysLeft }}일, 하루 <strong>{{ fmt(dailyBudget) }}원</strong> 가능
        </div>
      </div>
    </div>

    <!-- 하단 바 게이지 -->
    <div class="bp-bar">
      <div class="bp-bar__fill" :style="{ width: `${percentage}%` }" />
    </div>

    <!-- 예산 편집 모달 -->
    <Teleport to="body">
      <Transition name="bp-modal">
        <div v-if="isEditing" class="bp-modal-overlay" @click.self="cancelEdit">
          <div class="bp-modal-card" role="dialog" aria-modal="true" aria-label="예산 설정">
            <p class="bp-modal-title">{{ monthLabel }} 예산 설정</p>
            <p class="bp-modal-desc">이번 달 지출 목표 금액을 입력하세요</p>
            <div class="bp-modal-input-wrap">
              <input
                v-model="editValue"
                class="bp-modal-input"
                type="number"
                inputmode="numeric"
                placeholder="예: 1500000"
                @keydown="onEditKeydown"
                autofocus
              />
              <span class="bp-modal-input-unit">원</span>
            </div>
            <div class="bp-modal-actions">
              <button class="bp-modal-btn bp-modal-btn--cancel" @click="cancelEdit">취소</button>
              <button class="bp-modal-btn bp-modal-btn--save" @click="saveEdit">저장</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* ── 패널 기본 ── */
.budget-panel {
  margin: 0 0.75rem 0.75rem;
  border-radius: var(--radius-card);
  background: #fff;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

/* ── 헤더 ── */
.bp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1rem 0.6rem;
}

.bp-header__left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bp-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  width: fit-content;
}

.bp-month {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.bp-edit-btn {
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
}

.bp-edit-btn:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.4);
  color: var(--color-brand);
}

/* ── 본문 (게이지 + 수치) ── */
.bp-body {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem 0.8rem;
}

/* ── SVG 원형 게이지 ── */
.bp-gauge {
  flex-shrink: 0;
  width: 130px;
  height: 130px;
}

.bp-gauge__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.bp-gauge__track {
  stroke: #f3f4f6;
}

.bp-gauge__arc {
  stroke: var(--gauge-color, #f59e0b);
  transition:
    stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
    stroke 0.4s;
}

.budget-panel--safe    { --gauge-color: #f59e0b; }
.budget-panel--warning { --gauge-color: #fb923c; }
.budget-panel--danger  { --gauge-color: #ef4444; }

/* 텍스트는 SVG transform 반전 필요 */
.bp-gauge__pct-text {
  transform: rotate(90deg) translateX(0);
  transform-box: fill-box;
  transform-origin: center;
  font-size: 22px;
  font-weight: 800;
  fill: var(--color-text);
  font-family: var(--font-display);
}

.bp-gauge__sub-text {
  transform: rotate(90deg);
  transform-box: fill-box;
  transform-origin: center;
  font-size: 11px;
  font-weight: 600;
  fill: var(--color-text-secondary);
}

/* ── 수치 요약 ── */
.bp-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.bp-stat {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.bp-stat__label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.bp-stat__value {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text);
  font-family: var(--font-display);
}

.bp-stat__value--spent {
  color: var(--color-expense, #f59e0b);
}

.bp-stat__value--safe {
  color: #16a34a;
}

.bp-stat__value--over {
  color: #ef4444;
}

.bp-divider {
  height: 1px;
  background: var(--color-border-light);
  margin: 0.1rem 0;
}

.bp-stat--highlight .bp-stat__label {
  color: var(--color-text-secondary);
}

.bp-stat--highlight .bp-stat__value {
  font-size: 1.05rem;
}

.bp-daily-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 0.15rem;
  font-size: 0.68rem;
  color: var(--color-text-muted);
  line-height: 1.3;
}

.bp-daily-hint strong {
  color: var(--color-text-secondary);
}

/* ── 하단 바 ── */
.bp-bar {
  height: 5px;
  background: #f3f4f6;
  border-radius: 0;
}

.bp-bar__fill {
  height: 100%;
  border-radius: 0;
  background: var(--gauge-color, #f59e0b);
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ── 편집 모달 ── */
.bp-modal-overlay {
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

.bp-modal-card {
  width: 100%;
  max-width: 430px;
  background: #fff;
  border-radius: var(--radius-card) var(--radius-card) 0 0;
  padding: 1.5rem 1.25rem 1.25rem;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.15);
}

.bp-modal-title {
  margin: 0 0 4px;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text);
}

.bp-modal-desc {
  margin: 0 0 1.1rem;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
}

.bp-modal-input-wrap {
  position: relative;
  margin-bottom: 1.1rem;
}

.bp-modal-input {
  width: 100%;
  padding: 0.85rem 3rem 0.85rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-input, 12px);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  background: var(--color-bg-page);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.bp-modal-input:focus {
  border-color: var(--color-brand);
}

.bp-modal-input::-webkit-inner-spin-button,
.bp-modal-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.bp-modal-input-unit {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.bp-modal-actions {
  display: flex;
  gap: 0.6rem;
}

.bp-modal-btn {
  flex: 1;
  padding: 0.85rem;
  border-radius: var(--radius-input, 12px);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.18s;
}

.bp-modal-btn--cancel {
  background: var(--color-bg-page);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.bp-modal-btn--cancel:hover {
  background: #f3f4f6;
}

.bp-modal-btn--save {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #fff;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
}

.bp-modal-btn--save:hover {
  filter: brightness(1.05);
}

/* ── 트랜지션 ── */
.bp-modal-enter-active,
.bp-modal-leave-active {
  transition: opacity 0.25s;
}

.bp-modal-enter-active .bp-modal-card,
.bp-modal-leave-active .bp-modal-card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bp-modal-enter-from,
.bp-modal-leave-to {
  opacity: 0;
}

.bp-modal-enter-from .bp-modal-card,
.bp-modal-leave-to .bp-modal-card {
  transform: translateY(100%);
}
</style>

<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** 'date' | 'category' — 열릴 때 해당 블록으로 스크롤 */
  focusSection: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const { filterDateFrom, filterDateTo, filterCategoryNames } = storeToRefs(transactionStore)
const { categories } = storeToRefs(categoryStore)

const draftFrom = ref('')
const draftTo = ref('')
const draftCategories = ref([])

const categoryNamesSorted = computed(() =>
  [...categories.value].map((c) => c.name).sort((a, b) => a.localeCompare(b, 'ko')),
)

function syncDraftFromStore() {
  draftFrom.value = filterDateFrom.value || ''
  draftTo.value = filterDateTo.value || ''
  draftCategories.value = [...filterCategoryNames.value]
}

const sectionDateEl = ref(null)
const sectionCategoryEl = ref(null)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      syncDraftFromStore()
      nextTick(() => {
        const el =
          props.focusSection === 'category'
            ? sectionCategoryEl.value
            : props.focusSection === 'date'
              ? sectionDateEl.value
              : null
        el?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      })
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

function toggleCategory(name) {
  const i = draftCategories.value.indexOf(name)
  if (i === -1) draftCategories.value = [...draftCategories.value, name]
  else draftCategories.value = draftCategories.value.filter((_, idx) => idx !== i)
}

function setThisMonth() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const lastDay = String(new Date(y, now.getMonth() + 1, 0).getDate()).padStart(2, '0')
  draftFrom.value = `${y}-${m}-01`
  draftTo.value = `${y}-${m}-${lastDay}`
}

function clearDates() {
  draftFrom.value = ''
  draftTo.value = ''
}

function clearCategories() {
  draftCategories.value = []
}

function apply() {
  transactionStore.applyTransactionFilters({
    dateFrom: draftFrom.value || null,
    dateTo: draftTo.value || null,
    categoryNames: draftCategories.value,
  })
  close()
}

function resetAll() {
  transactionStore.clearTransactionFilters()
  syncDraftFromStore()
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="filter-modal">
      <div
        v-if="modelValue"
        class="filter-modal-root"
        aria-hidden="false"
      >
        <div
          class="filter-modal__backdrop"
          @click="close"
        />
        <div
          class="filter-modal__sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-modal-title"
          @click.stop
        >
            <div class="filter-modal__handle" aria-hidden="true" />
            <h2 id="filter-modal-title" class="filter-modal__title">필터</h2>

            <div ref="sectionDateEl" class="filter-modal__section">
              <div class="filter-modal__section-head">
                <span class="filter-modal__label">기간</span>
                <div class="filter-modal__quick">
                  <button type="button" class="filter-modal__text-btn" @click="setThisMonth">
                    이번 달
                  </button>
                  <button type="button" class="filter-modal__text-btn" @click="clearDates">
                    기간 전체
                  </button>
                </div>
              </div>
              <div class="filter-modal__dates">
                <label class="filter-modal__field">
                  <span class="filter-modal__field-label">시작</span>
                  <input v-model="draftFrom" type="date" class="filter-modal__input" />
                </label>
                <label class="filter-modal__field">
                  <span class="filter-modal__field-label">종료</span>
                  <input v-model="draftTo" type="date" class="filter-modal__input" />
                </label>
              </div>
            </div>

            <div ref="sectionCategoryEl" class="filter-modal__section filter-modal__section--scroll">
              <div class="filter-modal__section-head">
                <span class="filter-modal__label">카테고리</span>
                <button type="button" class="filter-modal__text-btn" @click="clearCategories">
                  선택 해제
                </button>
              </div>
              <p class="filter-modal__hint">선택하지 않으면 전체 카테고리가 표시됩니다.</p>
              <div class="filter-modal__chips">
                <button
                  v-for="name in categoryNamesSorted"
                  :key="name"
                  type="button"
                  class="filter-modal__chip"
                  :class="{ 'filter-modal__chip--on': draftCategories.includes(name) }"
                  @click="toggleCategory(name)"
                >
                  {{ name }}
                </button>
              </div>
            </div>

            <div class="filter-modal__actions">
              <button type="button" class="filter-modal__btn filter-modal__btn--ghost" @click="resetAll">
                전체 초기화
              </button>
              <button type="button" class="filter-modal__btn filter-modal__btn--primary" @click="apply">
                적용
              </button>
            </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.filter-modal-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.filter-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
}

.filter-modal__sheet {
  position: relative;
  width: 100%;
  max-width: 430px;
  max-height: min(85vh, 640px);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 1.25rem 1.25rem 0 0;
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
}

.filter-modal__handle {
  width: 2.25rem;
  height: 0.25rem;
  margin: 0.625rem auto 0;
  border-radius: 9999px;
  background: #e5e7eb;
}

.filter-modal__title {
  margin: 0.75rem 0 1rem;
  padding: 0 1.25rem;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
}

.filter-modal__section {
  padding: 0 1.25rem 1rem;
  flex-shrink: 0;
}

.filter-modal__section--scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.filter-modal__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.filter-modal__label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #374151;
}

.filter-modal__quick {
  display: flex;
  gap: 0.75rem;
}

.filter-modal__text-btn {
  border: none;
  background: none;
  padding: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-accent-link);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.filter-modal__dates {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.filter-modal__field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filter-modal__field-label {
  flex: 0 0 2.25rem;
  font-size: 0.8125rem;
  color: #6b7280;
}

.filter-modal__input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.9375rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  color: var(--color-text);
  background: #fafafa;
}

.filter-modal__hint {
  margin: 0 0 0.625rem;
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.4;
}

.filter-modal__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-modal__chip {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #4b5563;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.filter-modal__chip--on {
  border-color: rgba(245, 158, 11, 0.55);
  background: rgba(255, 154, 77, 0.15);
  color: var(--color-expense);
  font-weight: 700;
}

.filter-modal__actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem 0;
  border-top: 1px solid #f3f4f6;
  flex-shrink: 0;
}

.filter-modal__btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.filter-modal__btn--ghost {
  background: #f2f2f7;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-pill);
}

.filter-modal__btn--primary {
  border: none;
  background: var(--gradient-brand);
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-glow-brand);
}

.filter-modal-enter-active,
.filter-modal-leave-active {
  transition: opacity 0.22s ease;
}

.filter-modal-enter-active .filter-modal__sheet,
.filter-modal-leave-active .filter-modal__sheet {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.filter-modal-enter-from,
.filter-modal-leave-to {
  opacity: 0;
}

.filter-modal-enter-from .filter-modal__sheet,
.filter-modal-leave-to .filter-modal__sheet {
  transform: translateY(100%);
}
</style>

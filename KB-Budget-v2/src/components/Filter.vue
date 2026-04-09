<script setup>
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction'
import { Calendar, Tag } from 'lucide-vue-next'

const emit = defineEmits(['open-date', 'open-category'])

const transactionStore = useTransactionStore()
const { hasDateFilter, hasCategoryFilter } = storeToRefs(transactionStore)
</script>

<template>
  <div class="filter-bar" role="toolbar" aria-label="거래 필터">
    <button
      type="button"
      class="filter-chip"
      :class="{ 'filter-chip--active': hasDateFilter }"
      @click="emit('open-date')"
    >
      <Calendar class="filter-chip__icon" :size="15" :stroke-width="2.2" />
      <span class="filter-chip__text">날짜</span>
      <span v-if="hasDateFilter" class="filter-chip__badge" aria-hidden="true" />
    </button>

    <button
      type="button"
      class="filter-chip"
      :class="{ 'filter-chip--active': hasCategoryFilter }"
      @click="emit('open-category')"
    >
      <Tag class="filter-chip__icon" :size="15" :stroke-width="2.2" />
      <span class="filter-chip__text">카테고리</span>
      <span v-if="hasCategoryFilter" class="filter-chip__badge" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.875rem 1rem 0.75rem;
  background: var(--color-bg-page);
}

.filter-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.875rem 0.5rem 0.75rem;
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-pill);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 1px 4px rgba(26, 20, 16, 0.05);
  transition:
    background var(--dur-fast),
    border-color var(--dur-fast),
    color var(--dur-fast),
    box-shadow var(--dur-fast),
    transform var(--dur-fast) var(--ease-spring);
}

.filter-chip__icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  opacity: 0.75;
  transition: opacity var(--dur-fast);
}

.filter-chip__text {
  line-height: 1;
}

.filter-chip__badge {
  position: absolute;
  top: 3px;
  right: 5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-brand);
  box-shadow: 0 0 0 1.5px var(--color-bg);
}

/* 활성 상태 */
.filter-chip--active {
  background: rgba(251, 191, 36, 0.14);
  border-color: rgba(245, 158, 11, 0.5);
  color: var(--color-brand-deep);
  box-shadow:
    0 1px 4px rgba(26, 20, 16, 0.05),
    0 0 0 3px rgba(251, 191, 36, 0.12);
}

.filter-chip--active .filter-chip__icon {
  opacity: 1;
}

.filter-chip:active {
  transform: scale(0.95);
}
</style>

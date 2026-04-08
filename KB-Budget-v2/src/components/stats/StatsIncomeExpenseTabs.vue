<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true,
    validator: (v) => v === 'income' || v === 'expense',
  },
  incomeLabel: { type: String, required: true },
  expenseLabel: { type: String, required: true },
})

const emit = defineEmits(['update:activeTab'])
</script>

<template>
  <div class="tab-bar" role="tablist">
    <button
      type="button"
      role="tab"
      class="tab-bar__btn"
      :class="{ 'tab-bar__btn--active': activeTab === 'income' }"
      :aria-selected="activeTab === 'income'"
      @click="emit('update:activeTab', 'income')"
    >
      <span class="tab-bar__name">수입</span>
      <span class="tab-bar__amount">{{ incomeLabel }}</span>
    </button>
    <button
      type="button"
      role="tab"
      class="tab-bar__btn"
      :class="{ 'tab-bar__btn--active': activeTab === 'expense' }"
      :aria-selected="activeTab === 'expense'"
      @click="emit('update:activeTab', 'expense')"
    >
      <span class="tab-bar__name">지출</span>
      <span class="tab-bar__amount">{{ expenseLabel }}</span>
    </button>
  </div>
</template>

<style scoped>
.tab-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid #e5e7eb;
}

.tab-bar__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  padding: 0.45rem 0.5rem 0.4rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #9ca3af;
  font-weight: 600;
  position: relative;
  transition: color 0.15s ease;
}

.tab-bar__btn--active {
  color: #111827;
}

.tab-bar__btn--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 12%;
  right: 12%;
  height: 2px;
  background: #ef4444;
  border-radius: 2px 2px 0 0;
}

.tab-bar__name {
  font-size: 0.8125rem;
}

.tab-bar__amount {
  font-size: 0.6875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  opacity: 0.85;
}

.tab-bar__btn:not(.tab-bar__btn--active) .tab-bar__amount {
  font-weight: 600;
  opacity: 0.65;
}
</style>

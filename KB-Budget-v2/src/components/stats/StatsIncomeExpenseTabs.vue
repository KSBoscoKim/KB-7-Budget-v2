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
  border-bottom: 1px solid var(--color-border-light);
  gap: 0;
}

.tab-bar__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.65rem 0.5rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-muted);
  font-family: var(--font-display);
  font-weight: 600;
  position: relative;
  transition: color 0.2s ease;
}

.tab-bar__btn--active {
  color: var(--color-brand-deep);
}

.tab-bar__btn:nth-child(1).tab-bar__btn--active {
  color: var(--color-income);
}

.tab-bar__btn:nth-child(2).tab-bar__btn--active {
  color: var(--color-expense);
}

.tab-bar__btn--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 3px;
  border-radius: 4px 4px 0 0;
  background: var(--gradient-brand);
}

.tab-bar__btn:nth-child(1).tab-bar__btn--active::after {
  background: linear-gradient(90deg, #0f766e, #2dd4bf);
}

.tab-bar__btn:nth-child(2).tab-bar__btn--active::after {
  background: var(--gradient-brand);
}

.tab-bar__name {
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.02em;
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

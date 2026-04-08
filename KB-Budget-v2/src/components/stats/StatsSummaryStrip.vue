<script setup>
defineProps({
  incomeLabel: { type: String, required: true },
  expenseLabel: { type: String, required: true },
  netLabel: { type: String, required: true },
})
</script>

<template>
  <div class="summary-strip">
    <div class="summary-strip__col">
      <span class="summary-strip__label">수입</span>
      <span class="summary-strip__value summary-strip__value--income">{{ incomeLabel }}</span>
    </div>
    <div class="summary-strip__col">
      <span class="summary-strip__label">지출</span>
      <span class="summary-strip__value summary-strip__value--expense">{{ expenseLabel }}</span>
    </div>
    <div class="summary-strip__col">
      <span class="summary-strip__label">합계</span>
      <span class="summary-strip__value summary-strip__value--net">{{ netLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.summary-strip {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.35rem;
  padding: 0.65rem 0.25rem 0.75rem;
  border-top: 1px solid var(--color-border-light);
}

.summary-strip__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-align: center;
}

.summary-strip__label {
  font-family: var(--font-display);
  font-size: 0.625rem;
  color: var(--color-text-muted);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.summary-strip__value {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  font-variant-numeric: tabular-nums;
}

.summary-strip__value--income {
  color: var(--color-income);
}

.summary-strip__value--expense {
  color: var(--color-expense);
}

.summary-strip__value--net {
  color: var(--color-text);
}
</style>

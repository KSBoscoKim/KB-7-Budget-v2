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
  padding: 0.5rem 0 0.65rem;
  border-top: 1px solid #f3f4f6;
  border-bottom: 1px solid #f3f4f6;
}

.summary-strip__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-align: center;
}

.summary-strip__label {
  font-size: 0.6875rem;
  color: #9ca3af;
  font-weight: 500;
}

.summary-strip__value {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.summary-strip__value--income {
  color: #2563eb;
}

.summary-strip__value--expense {
  color: #ea580c;
}

.summary-strip__value--net {
  color: #111827;
}
</style>

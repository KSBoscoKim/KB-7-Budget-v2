<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const title = computed(() => {
  const [y, m] = props.modelValue.split('-').map(Number)
  return `${y}년 ${m}월`
})

function shift(delta) {
  const [y, m] = props.modelValue.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  emit(
    'update:modelValue',
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
  )
}
</script>

<template>
  <div class="month-nav">
    <button type="button" class="month-nav__btn" aria-label="이전 달" @click="shift(-1)">
      ‹
    </button>

    <span class="month-nav__title">{{ title }}</span>

    <button type="button" class="month-nav__btn" aria-label="다음 달" @click="shift(1)">
      ›
    </button>
  </div>
</template>

<style scoped>
.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.month-nav__btn {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  border: 1px solid var(--color-border);
  background: #fafafa;
  font-size: 1.25rem;
  line-height: 1;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-pill);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
  flex-shrink: 0;
}

.month-nav__btn:hover {
  background: #fff;
  border-color: rgba(245, 158, 11, 0.35);
  color: var(--color-expense);
}

.month-nav__title {
  min-width: 7.5rem;
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: var(--tracking-tight);
  color: var(--color-text);
  user-select: none;
}
</style>

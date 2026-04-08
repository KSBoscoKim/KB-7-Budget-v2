<script setup>
defineProps({
  to: {
    type: [String, Object],
    default: () => ({ name: 'add-transaction' }),
  },
  ariaLabel: {
    type: String,
    default: '지출/수익 추가',
  },
})
</script>

<template>
  <RouterLink :to="to" class="fab" :aria-label="ariaLabel">
    <span class="fab__icon" aria-hidden="true">+</span>
  </RouterLink>
</template>

<style scoped>
.fab {
  position: fixed;
  right: max(1rem, calc((100vw - 430px) / 2 + 1rem));
  bottom: calc(4.5rem + env(safe-area-inset-bottom));
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.375rem;
  height: 3.375rem;
  border-radius: 50%;
  text-decoration: none;
  color: #fff;
  background: var(--gradient-brand);
  box-shadow:
    var(--shadow-fab),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    filter 0.18s ease;
  -webkit-tap-highlight-color: transparent;
}

.fab:hover {
  filter: brightness(1.06);
  box-shadow:
    0 8px 28px rgba(245, 158, 11, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.fab:active {
  transform: scale(0.94);
  filter: brightness(0.96);
  box-shadow:
    0 2px 12px rgba(245, 158, 11, 0.4),
    inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.fab:focus-visible {
  outline: 2px solid rgba(255, 180, 120, 0.9);
  outline-offset: 3px;
}

.fab__icon {
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  margin-top: -0.08em;
  letter-spacing: 0;
}
</style>

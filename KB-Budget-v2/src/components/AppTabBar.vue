<script setup>
const tabs = [
  { name: 'home', label: '가계', to: { name: 'home' } },
  { name: 'stats', label: '통계', to: { name: 'stats' } },
  { name: 'settings', label: '설정', to: { name: 'settings' } },
]
</script>

<template>
  <nav class="tab-bar" aria-label="주요 메뉴">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="tab.to"
      class="tab-link"
      active-class="tab-link--active"
    >
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.tab-bar {
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  min-height: 3.25rem;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.tab-link {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #9ca3af;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  -webkit-tap-highlight-color: transparent;
}

.tab-link--active {
  color: #111827;
  font-weight: 700;
}
</style>

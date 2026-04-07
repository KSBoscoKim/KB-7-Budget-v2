<script setup>
import AppTabBar from '../components/AppTabBar.vue'
</script>

<template>
  <div class="app-root">
    <div class="app-shell" role="application">
      <header class="app-header">
        <h1 class="app-title">가계부</h1>
      </header>
      <main class="app-main">
        <RouterView />
      </main>
      <AppTabBar />
    </div>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100%;
  min-height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 0;
  box-sizing: border-box;
}

.app-shell {
  width: 100%;
  max-width: 430px;
  min-height: 100%;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 12px 40px rgba(0, 0, 0, 0.08);
}

@media (max-width: 430px) {
  .app-shell {
    box-shadow: none;
    max-width: none;
  }
}

.app-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3.25rem;
  padding: 0.625rem 1rem;
  padding-top: max(0.625rem, env(safe-area-inset-top));
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.app-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.app-main {
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

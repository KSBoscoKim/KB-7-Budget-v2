<script setup>
// import { onMounted } from 'vue';
// import { useTransactionStore } from './stores/transaction';

// const transactionStore = useTransactionStore();

// onMounted(() => {
//   transactionStore.loadTransactionsFromServer();
// });
</script>

<template>
  <RouterView />
</template>

<style>
html,
body {
  margin: 0;
  height: 100%;
  height: 100dvh;
  overflow: hidden; /* 브라우저 자체 스크롤 차단 */
  -webkit-tap-highlight-color: transparent;
}

#app {
  height: 100%;
  height: 100dvh;
  overflow: hidden;
}

body {
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text);
  background-color: var(--color-bg-page);
  letter-spacing: var(--tracking-normal);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* 전역 box-sizing 리셋 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 스크롤바 세련되게 */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(245, 158, 11, 0.28);
  border-radius: 999px;
}
</style>

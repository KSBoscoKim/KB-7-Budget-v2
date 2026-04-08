<script setup>
import { onMounted } from 'vue'
import { useTransactionStore } from './stores/transaction'
import { useUserStore } from './stores/user'

const transactionStore = useTransactionStore()
const userStore = useUserStore()

onMounted(() => {
  transactionStore.loadTransactionsFromServer()
  userStore.loadCurrentUser()
})
</script>

<template>
  <RouterView />
</template>

<style>
html,
body {
  margin: 0;
  height: 100%;
  -webkit-tap-highlight-color: transparent;
}

#app {
  height: 100%;
}

body {
  font-family:
    'Pretendard Variable',
    Pretendard,
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;
  font-size: 16px;
  color: #111827;
  background: #e5e7eb;
}
</style>

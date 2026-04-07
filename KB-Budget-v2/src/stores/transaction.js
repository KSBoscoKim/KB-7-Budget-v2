import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])

  const sortedByDateDesc = computed(() =>
    [...transactions.value].sort((a, b) => b.date.localeCompare(a.date)),
  )

  function setTransactions(rows) {
    transactions.value = Array.isArray(rows) ? [...rows] : []
  }

  return {
    transactions,
    sortedByDateDesc,
    setTransactions,
  }
})

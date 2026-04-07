import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import seed from '../../db.json'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref(seed.transactions.map((t) => ({ ...t })))

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

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import seed from '../../db.json'
import * as txApi from '../api/transactions'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref(seed.transactions.map((t) => ({ ...t })))
  const loadError = ref(null)

  /** YYYY-MM-DD, null이면 해당 끝 미적용 */
  const filterDateFrom = ref(null)
  const filterDateTo = ref(null)
  /** 비어 있으면 카테고리 제한 없음. 값이 있으면 해당 이름만 */
  const filterCategoryNames = ref([])

  const filteredTransactions = computed(() =>
    transactions.value.filter((tx) => {
      if (filterDateFrom.value && tx.date < filterDateFrom.value) return false
      if (filterDateTo.value && tx.date > filterDateTo.value) return false
      if (
        filterCategoryNames.value.length > 0 &&
        !filterCategoryNames.value.includes(tx.category)
      ) {
        return false
      }
      return true
    }),
  )

  const sortedByDateDesc = computed(() =>
    [...filteredTransactions.value].sort((a, b) => {
      const byDate = b.date.localeCompare(a.date)
      if (byDate !== 0) return byDate
      return String(b.id).localeCompare(String(a.id), undefined, { numeric: true })
    }),
  )

  /** 날짜 내림차순 섹션: 같은 날짜 거래는 함께 묶음 */
  const groupedByDateDesc = computed(() => {
    const sections = []
    let currentDate = null
    for (const tx of sortedByDateDesc.value) {
      if (tx.date !== currentDate) {
        currentDate = tx.date
        sections.push({ date: tx.date, items: [] })
      }
      sections[sections.length - 1].items.push(tx)
    }
    return sections
  })

  const hasDateFilter = computed(
    () => filterDateFrom.value != null || filterDateTo.value != null,
  )

  const hasCategoryFilter = computed(() => filterCategoryNames.value.length > 0)

  function applyTransactionFilters({ dateFrom, dateTo, categoryNames }) {
    filterDateFrom.value = dateFrom || null
    filterDateTo.value = dateTo || null
    filterCategoryNames.value = Array.isArray(categoryNames) ? [...categoryNames] : []
  }

  function clearTransactionFilters() {
    filterDateFrom.value = null
    filterDateTo.value = null
    filterCategoryNames.value = []
  }

  function setTransactions(rows) {
    transactions.value = Array.isArray(rows) ? [...rows] : []
  }

  async function loadTransactionsFromServer() {
    loadError.value = null
    try {
      const rows = await txApi.fetchTransactions()
      setTransactions(rows)
    } catch (e) {
      loadError.value = e
      console.error(e)
    }
  }

  async function createTransaction(payload) {
    const created = await txApi.createTransaction(payload)
    transactions.value = [...transactions.value, created]
    return created
  }

  async function updateTransaction(id, payload) {
    const updated = await txApi.updateTransaction(id, { ...payload, id })
    const idx = transactions.value.findIndex((t) => String(t.id) === String(id))
    if (idx !== -1) {
      const next = [...transactions.value]
      next[idx] = updated
      transactions.value = next
    }
    return updated
  }

  async function removeTransaction(id) {
    await txApi.deleteTransaction(id)
    transactions.value = transactions.value.filter((t) => String(t.id) !== String(id))
  }

  return {
    transactions,
    loadError,
    filterDateFrom,
    filterDateTo,
    filterCategoryNames,
    filteredTransactions,
    sortedByDateDesc,
    groupedByDateDesc,
    hasDateFilter,
    hasCategoryFilter,
    applyTransactionFilters,
    clearTransactionFilters,
    setTransactions,
    loadTransactionsFromServer,
    createTransaction,
    updateTransaction,
    removeTransaction,
  }
})

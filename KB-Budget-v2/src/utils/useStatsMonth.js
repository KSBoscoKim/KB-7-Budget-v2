import { computed, ref } from 'vue'

function monthBounds(ym) {
  const [y, m] = ym.split('-').map(Number)
  const from = `${ym}-01`
  const last = new Date(y, m, 0).getDate()
  const to = `${ym}-${String(last).padStart(2, '0')}`
  return { from, to }
}

export function useStatsMonth(transactionsRef) {
  const selectedMonth = ref(new Date().toISOString().slice(0, 7))

  const txsInMonth = computed(() => {
    const { from, to } = monthBounds(selectedMonth.value)
    return transactionsRef.value.filter((tx) => tx.date >= from && tx.date <= to)
  })

  const incomeTotal = computed(() =>
    txsInMonth.value.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
  )

  const expenseTotal = computed(() =>
    txsInMonth.value.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
  )

  const netTotal = computed(() => incomeTotal.value - expenseTotal.value)

  return {
    selectedMonth,
    txsInMonth,
    incomeTotal,
    expenseTotal,
    netTotal,
  }
}

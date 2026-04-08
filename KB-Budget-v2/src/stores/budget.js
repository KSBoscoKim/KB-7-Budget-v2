import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useBudgetStore = defineStore('budget', () => {
  const userStore = useUserStore()

  /** 현재 달 키: 'YYYY-MM' */
  function currentMonthKey() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  /** localStorage 키: 유저별 · 월별 */
  function storageKey(userId, monthKey) {
    return `budget_${userId}_${monthKey}`
  }

  /** 저장된 예산을 불러옴. 없으면 유저의 totalAmount 반환 */
  function loadBudget() {
    const user = userStore.currentUser
    if (!user) return 0
    const key = storageKey(user.id, currentMonthKey())
    const saved = localStorage.getItem(key)
    if (saved !== null) return Number(saved)
    return Number(user.totalAmount) || 0
  }

  const monthlyBudget = ref(0)

  function init() {
    monthlyBudget.value = loadBudget()
  }

  function setBudget(amount) {
    const user = userStore.currentUser
    if (!user) return
    const key = storageKey(user.id, currentMonthKey())
    monthlyBudget.value = Number(amount)
    localStorage.setItem(key, String(amount))
  }

  const currentMonth = computed(() => currentMonthKey())

  return {
    monthlyBudget,
    currentMonth,
    init,
    setBudget,
  }
})

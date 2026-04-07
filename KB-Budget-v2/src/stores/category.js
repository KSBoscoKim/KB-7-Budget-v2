import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import seed from '../../db.json'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref(seed.categories.map((c) => ({ ...c })))

  const incomeCategories = computed(() =>
    categories.value.filter((c) => c.type === 'income'),
  )

  const expenseCategories = computed(() =>
    categories.value.filter((c) => c.type === 'expense'),
  )

  function setCategories(rows) {
    categories.value = Array.isArray(rows) ? [...rows] : []
  }

  return {
    categories,
    incomeCategories,
    expenseCategories,
    setCategories,
  }
})

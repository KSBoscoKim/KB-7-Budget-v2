import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchCategories } from '../api/categories'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])

  const incomeCategories = computed(() =>
    categories.value.filter((c) => c.type === 'income'),
  )

  const expenseCategories = computed(() =>
    categories.value.filter((c) => c.type === 'expense'),
  )

  function setCategories(rows) {
    categories.value = Array.isArray(rows) ? [...rows] : []
  }

  async function loadCategoriesFromServer() {
    const rows = await fetchCategories()
    setCategories(rows)
  }

  return {
    categories,
    incomeCategories,
    expenseCategories,
    setCategories,
    loadCategoriesFromServer,
  }
})

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore } from '../stores/category'
import { useTransactionStore } from '../stores/transaction'

const router = useRouter()
const route = useRoute()
const categoryStore = useCategoryStore()
const transactionStore = useTransactionStore()

const type = ref('expense')
const selectedCategory = ref('')
const amount = ref('')
const memo = ref('')
const date = ref('')

const editingId = computed(() => {
  const id = route.query.id
  return id != null && id !== '' ? String(id) : null
})

const filteredCategories = computed(() =>
  categoryStore.categories.filter((category) => category.type === type.value),
)

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function resetForm() {
  type.value = 'expense'
  selectedCategory.value = ''
  amount.value = ''
  memo.value = ''
  date.value = todayStr()
}

function applyTransaction(tx) {
  type.value = tx.type
  selectedCategory.value = tx.category
  amount.value = String(tx.amount)
  memo.value = tx.memo ?? ''
  date.value = tx.date
}

function syncFormFromRoute() {
  const id = editingId.value
  if (!id) {
    resetForm()
    return
  }
  const tx = transactionStore.transactions.find((t) => String(t.id) === id)
  if (tx) applyTransaction(tx)
}

watch(type, () => {
  selectedCategory.value = ''
})

watch(
  () => route.query.id,
  () => {
    syncFormFromRoute()
  },
)

onMounted(() => {
  syncFormFromRoute()
})

function goHome() {
  router.push({ name: 'home' })
}

async function save() {
  const n = Number(amount.value)
  if (!date.value || !selectedCategory.value || Number.isNaN(n) || n <= 0) {
    window.alert('금액, 카테고리, 날짜를 확인해 주세요.')
    return
  }
  const payload = {
    type: type.value,
    date: date.value,
    amount: n,
    category: selectedCategory.value,
    memo: (memo.value || '').trim(),
  }
  try {
    if (editingId.value) {
      await transactionStore.updateTransaction(editingId.value, {
        ...payload,
        id: editingId.value,
      })
    } else {
      await transactionStore.createTransaction(payload)
    }
    goHome()
  } catch (e) {
    console.error(e)
    window.alert('저장에 실패했습니다. 터미널에서 npm run server 로 json-server가 켜져 있는지 확인해 주세요.')
  }
}

async function deleteTx() {
  if (!editingId.value) {
    goHome()
    return
  }
  if (!window.confirm('이 거래를 삭제할까요?')) return
  try {
    await transactionStore.removeTransaction(editingId.value)
    goHome()
  } catch (e) {
    console.error(e)
    window.alert('삭제에 실패했습니다. json-server 실행 여부를 확인해 주세요.')
  }
}
</script>

<template>
  <section class="entry-page">
    <h2 class="title">{{ editingId ? '거래 수정' : '지출/수익 추가' }}</h2>

    <form class="entry-form" @submit.prevent="save">
      <fieldset class="type-group">
        <legend class="field-label">유형</legend>
        <label class="type-option">
          <input v-model="type" type="radio" value="expense" name="type" />
          지출
        </label>
        <label class="type-option">
          <input v-model="type" type="radio" value="income" name="type" />
          수익
        </label>
      </fieldset>

      <div class="field-row">
        <label class="field-label" for="amount">금액</label>
        <input
          id="amount"
          v-model="amount"
          type="number"
          min="1"
          step="1"
          placeholder="금액 입력"
          class="field-input"
        />
      </div>

      <div class="field-row">
        <label class="field-label" for="category">카테고리</label>
        <select id="category" v-model="selectedCategory" class="field-input">
          <option disabled value="">카테고리 선택</option>
          <option
            v-for="category in filteredCategories"
            :key="category.id"
            :value="category.name"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="field-row">
        <label class="field-label" for="memo">메모</label>
        <textarea id="memo" v-model="memo" rows="3" placeholder="메모 입력" class="field-input memo-input" />
      </div>

      <div class="field-row">
        <label class="field-label" for="date">날짜</label>
        <input id="date" v-model="date" type="date" class="field-input" />
      </div>
    </form>

    <div class="action-row">
      <button type="button" class="action-btn save-btn" @click="save">저장</button>
      <button type="button" class="action-btn delete-btn" @click="deleteTx">
        {{ editingId ? '삭제' : '취소' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.entry-page {
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem;
}

.title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.entry-form {
  display: grid;
  gap: 0.875rem;
  padding: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}

.type-group {
  margin: 0;
  padding: 0;
  border: 0;
}

.type-option {
  margin-right: 1rem;
  font-size: 0.95rem;
}

.field-row {
  display: grid;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.875rem;
  color: #4b5563;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  background: #fff;
}

.memo-input {
  min-height: 5rem;
  resize: vertical;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  margin-top: 0.875rem;
}

.action-btn {
  min-height: 2.625rem;
  border: 0;
  border-radius: 0.625rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.save-btn {
  background: #2563eb;
}

.delete-btn {
  background: #ef4444;
}
</style>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '../stores/category';
import { useTransactionStore } from '../stores/transaction';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const categoryStore = useCategoryStore();
const transactionStore = useTransactionStore();

const type = ref('expense');
const selectedCategory = ref('');
const amount = ref('');
const memo = ref('');
const date = ref('');

const editingId = computed(() => {
  const id = route.query.id;
  return id != null && id !== '' ? String(id) : null;
});

const filteredCategories = computed(() =>
  categoryStore.categories.filter((category) => category.type === type.value),
);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function resetForm() {
  type.value = 'expense';
  selectedCategory.value = '';
  amount.value = '';
  memo.value = '';
  date.value = todayStr();
}

function applyTransaction(tx) {
  type.value = tx.type;
  selectedCategory.value = tx.category;
  amount.value = String(tx.amount);
  memo.value = tx.memo ?? '';
  date.value = tx.date;
}

function syncFormFromRoute() {
  const id = editingId.value;
  if (!id) {
    resetForm();
    return;
  }
  const tx = transactionStore.transactions.find((t) => String(t.id) === id);
  if (tx) applyTransaction(tx);
}

watch(type, () => {
  selectedCategory.value = '';
});

watch(
  () => route.query.id,
  () => {
    syncFormFromRoute();
  },
);

onMounted(() => {
  syncFormFromRoute();
});

function goHome() {
  router.push({ name: 'home' });
}

async function save() {
  const n = Number(amount.value);
  if (!date.value || !selectedCategory.value || Number.isNaN(n) || n <= 0) {
    window.alert('금액, 카테고리, 날짜를 확인해 주세요.');
    return;
  }
  const payload = {
    userId: userStore.currentUser.id,
    type: type.value,
    date: date.value,
    amount: n,
    category: selectedCategory.value,
    memo: (memo.value || '').trim(),
  };
  try {
    if (editingId.value) {
      await transactionStore.updateTransaction(editingId.value, {
        ...payload,
        id: editingId.value,
      });
    } else {
      await transactionStore.createTransaction(payload);
    }
    goHome();
  } catch (e) {
    console.error(e);
    window.alert(
      '저장에 실패했습니다. 터미널에서 npm run server 로 json-server가 켜져 있는지 확인해 주세요.',
    );
  }
}

async function deleteTx() {
  if (!editingId.value) {
    goHome();
    return;
  }
  if (!window.confirm('이 거래를 삭제할까요?')) return;
  try {
    await transactionStore.removeTransaction(editingId.value);
    goHome();
  } catch (e) {
    console.error(e);
    window.alert('삭제에 실패했습니다. json-server 실행 여부를 확인해 주세요.');
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
        <textarea
          id="memo"
          v-model="memo"
          rows="3"
          placeholder="메모 입력"
          class="field-input memo-input"
        />
      </div>

      <div class="field-row">
        <label class="field-label" for="date">날짜</label>
        <input id="date" v-model="date" type="date" class="field-input" />
      </div>
    </form>

    <div class="action-row">
      <button type="button" class="action-btn save-btn" @click="save">
        저장
      </button>
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
  background: var(--color-bg-page);
  box-sizing: border-box;
}

.title {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 800;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-text);
}

.entry-form {
  display: grid;
  gap: 0.875rem;
  padding: 1.125rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.type-group {
  margin: 0;
  padding: 0;
  border: 0;
}

.type-option {
  margin-right: 1rem;
  font-size: 0.95rem;
  color: var(--color-text);
}

.field-row {
  display: grid;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  min-height: 2.75rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  font-size: 0.95rem;
  background: #fafafa;
  color: var(--color-text);
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.field-input:focus {
  outline: none;
  border-color: rgba(245, 158, 11, 0.55);
  box-shadow: var(--shadow-focus-ring);
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
  min-height: 2.875rem;
  border: 0;
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  cursor: pointer;
  transition: filter 0.15s;
}

.save-btn {
  background: var(--gradient-brand);
  box-shadow: var(--shadow-glow-brand);
}

.save-btn:hover {
  filter: brightness(1.05);
}

.delete-btn {
  background: #fff;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.delete-btn:hover {
  border-color: rgba(220, 38, 38, 0.45);
  color: #dc2626;
}
</style>

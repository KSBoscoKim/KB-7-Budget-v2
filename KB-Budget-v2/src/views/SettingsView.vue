<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { LogOut, Check, Save, Plus, Trash2 } from 'lucide-vue-next';
import imgPlan from '@/assets/images/안경알파카.png';
import imgFlex from '@/assets/images/플렉스곰2.png';
import imgSocial from '@/assets/images/악어.png';
import imgDrizzle from '@/assets/images/토끼.png';

const router = useRouter();
const userStore = useUserStore();
const { currentUser } = storeToRefs(userStore);

const SPENDING_TYPES = [
  { key: '계획형', img: imgPlan, desc: '수입·지출 계획을 세워 관리' },
  { key: '플렉스형', img: imgFlex, desc: '월 예산 한도를 정해 관리' },
  { key: '사회형', img: imgSocial, desc: '나와 타인을 위한 지출 구분' },
  { key: '보슬비형', img: imgDrizzle, desc: '소소한 지출 빈도를 체크' },
];

const selectedType = ref(currentUser.value?.spendingType ?? '계획형');
const editIncome = ref('');
const editBudget = ref('');
const editFixedItems = ref([]);
const isSaving = ref(false);
const saveSuccess = ref(false);

function cloneItems(items) {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map((i) => ({
    id: i.id,
    name: i.name ?? '',
    amount: i.amount ? String(i.amount) : '',
  }));
}

function initFields() {
  if (!currentUser.value) return;
  selectedType.value = currentUser.value.spendingType;
  editIncome.value = currentUser.value.expectedIncome
    ? String(currentUser.value.expectedIncome)
    : '';
  editBudget.value = currentUser.value.monthlyBudget
    ? String(currentUser.value.monthlyBudget)
    : '';
  editFixedItems.value = cloneItems(currentUser.value.fixedItems);
}
initFields();
watch(currentUser, initFields);

const showIncomeField = computed(() => selectedType.value === '계획형');
const showBudgetField = computed(() => selectedType.value === '플렉스형');

function parseNum(val) {
  if (!val) return null;
  const n = Number(String(val).replace(/,/g, ''));
  return isNaN(n) || n === 0 ? null : n;
}

function itemsChanged() {
  const cur = currentUser.value?.fixedItems ?? [];
  const edit = editFixedItems.value;
  if (cur.length !== edit.length) return true;
  return cur.some((c, i) => {
    const e = edit[i];
    return c.name !== (e.name ?? '') || c.amount !== (parseNum(e.amount) ?? 0);
  });
}

const hasChanges = computed(() => {
  if (!currentUser.value) return false;
  if (selectedType.value !== currentUser.value.spendingType) return true;
  if (parseNum(editIncome.value) !== (currentUser.value.expectedIncome ?? null)) return true;
  if (parseNum(editBudget.value) !== (currentUser.value.monthlyBudget ?? null)) return true;
  if (showIncomeField.value && itemsChanged()) return true;
  return false;
});

function addFixedItem() {
  editFixedItems.value.push({ id: Date.now().toString(), name: '', amount: '' });
}

function removeFixedItem(id) {
  editFixedItems.value = editFixedItems.value.filter((i) => i.id !== id);
}

async function handleSave() {
  if (!hasChanges.value || isSaving.value) return;
  isSaving.value = true;

  const fixedItems = editFixedItems.value
    .filter((i) => i.name.trim())
    .map((i) => ({
      id: i.id,
      name: i.name.trim(),
      amount: Number(String(i.amount).replace(/,/g, '')) || 0,
    }));

  const fields = {
    spendingType: selectedType.value,
    expectedIncome: parseNum(editIncome.value),
    monthlyBudget: parseNum(editBudget.value),
    fixedItems,
  };

  const ok = await userStore.updateProfile(fields);
  isSaving.value = false;

  if (ok) {
    saveSuccess.value = true;
    setTimeout(() => (saveSuccess.value = false), 2000);
  }
}

function handleLogout() {
  userStore.logout();
  router.push('/login');
}

function formatAmount(val) {
  if (!val) return '';
  const num = Number(String(val).replace(/,/g, ''));
  if (isNaN(num) || num === 0) return '';
  return new Intl.NumberFormat('ko-KR').format(num) + '원';
}
</script>

<template>
  <section class="settings-page">
    <h2 class="page-title">설정</h2>

    <!-- 내 정보 카드 -->
    <div class="card">
      <p class="card__label">내 정보</p>
      <template v-if="currentUser">
        <dl class="info">
          <div class="info__row">
            <dt>이름</dt>
            <dd>{{ currentUser.username }}</dd>
          </div>
          <div class="info__row">
            <dt>아이디</dt>
            <dd>{{ currentUser.loginId }}</dd>
          </div>
          <div class="info__row">
            <dt>소비 유형</dt>
            <dd>
              <template v-if="currentUser.spendingType">
                {{ currentUser.spendingType }}
              </template>
            </dd>
          </div>
        </dl>
      </template>
      <p v-else class="empty">유저 정보를 불러올 수 없습니다.</p>
    </div>

    <!-- 소비 유형 선택 -->
    <div class="card">
      <p class="card__label">소비 유형</p>
      <p class="card__desc">나에게 맞는 소비 관리 스타일을 선택하세요</p>

      <div class="type-grid">
        <button
          v-for="t in SPENDING_TYPES"
          :key="t.key"
          class="type-btn"
          :class="{ 'type-btn--active': selectedType === t.key }"
          @click="selectedType = t.key"
        >
          <span class="type-btn__check" v-if="selectedType === t.key">
            <Check :size="12" :stroke-width="3" />
          </span>
          <span class="type-btn__emoji">
            <img :src="t.img" :alt="t.key" class="type-btn__img" :class="{ 'type-btn__img--large': t.key === '보슬비형' }" />
          </span>
          <span class="type-btn__name">{{ t.key }}</span>
          <span class="type-btn__desc">{{ t.desc }}</span>
        </button>
      </div>
    </div>

    <!-- 금액 설정 -->
    <Transition name="fade" mode="out-in">
      <div
        v-if="showIncomeField || showBudgetField"
        class="card"
        :key="selectedType"
      >
        <p class="card__label">
          {{ showIncomeField ? '예상 수입 설정' : '월 예산 설정' }}
        </p>
        <p class="card__desc">
          {{
            showIncomeField
              ? '이번 달 예상되는 총 수입을 입력하세요'
              : '이번 달 지출 목표 금액을 입력하세요'
          }}
        </p>

        <div class="amount-field">
          <input
            v-if="showIncomeField"
            v-model="editIncome"
            class="amount-input"
            type="number"
            inputmode="numeric"
            placeholder="예: 3200000"
          />
          <input
            v-else
            v-model="editBudget"
            class="amount-input"
            type="number"
            inputmode="numeric"
            placeholder="예: 1500000"
          />
          <span class="amount-unit">원</span>
        </div>
        <p
          v-if="showIncomeField && currentUser?.expectedIncome"
          class="current-val"
        >
          현재 설정: {{ formatAmount(currentUser.expectedIncome) }}
        </p>
        <p
          v-if="showBudgetField && currentUser?.monthlyBudget"
          class="current-val"
        >
          현재 설정: {{ formatAmount(currentUser.monthlyBudget) }}
        </p>
      </div>
    </Transition>

    <!-- 계획형 고정 지출 항목 -->
    <Transition name="fade" mode="out-in">
      <div v-if="showIncomeField" class="card" key="fixed-items">
        <p class="card__label">고정 지출 항목</p>
        <p class="card__desc">매달 고정으로 나가는 지출을 미리 등록하세요</p>

        <div class="fixed-list">
          <div
            v-for="item in editFixedItems"
            :key="item.id"
            class="fixed-item"
          >
            <input
              v-model="item.name"
              class="fixed-item__name"
              placeholder="항목명"
              maxlength="8"
            />
            <div class="fixed-item__amount-wrap">
              <input
                v-model="item.amount"
                class="fixed-item__amount"
                type="number"
                inputmode="numeric"
                placeholder="0"
              />
              <span class="fixed-item__unit">원</span>
            </div>
            <button
              class="fixed-item__remove"
              @click="removeFixedItem(item.id)"
              aria-label="삭제"
            >
              <Trash2 :size="14" :stroke-width="2" />
            </button>
          </div>

          <button class="fixed-add-btn" @click="addFixedItem">
            <Plus :size="14" :stroke-width="2.5" />
            항목 추가
          </button>
        </div>
      </div>
    </Transition>

    <!-- 저장 버튼 -->
    <button
      class="save-btn"
      :class="{ 'save-btn--success': saveSuccess }"
      :disabled="!hasChanges || isSaving"
      @click="handleSave"
    >
      <template v-if="saveSuccess">
        <Check :size="18" :stroke-width="2.5" />
        저장 완료
      </template>
      <template v-else-if="isSaving">
        <span class="save-spinner" />
        저장 중...
      </template>
      <template v-else>
        <Save :size="18" :stroke-width="2" />
        변경사항 저장
      </template>
    </button>

    <!-- 로그아웃 -->
    <button class="logout-btn" @click="handleLogout">
      <LogOut :size="16" :stroke-width="2" />
      로그아웃
    </button>
  </section>
</template>

<style scoped>
.settings-page {
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem 1rem 6rem;
  background: var(--color-bg-page);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.page-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

/* ── 카드 ── */
.card {
  padding: 1.125rem 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.card__label {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
}

.card__desc {
  margin: 0 0 0.875rem;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

/* ── 내 정보 ── */
.info {
  margin: 0;
}
.info__row {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 0.5rem 0.75rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 0.875rem;
}
.info__row:last-of-type {
  border-bottom: 0;
}
.info__row dt {
  margin: 0;
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
}
.info__row dd {
  margin: 0;
  color: var(--color-text);
  font-weight: 600;
  text-align: right;
}

.empty {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

/* ── 유형 그리드 ── */
.type-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.type-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.9rem 0.5rem 0.75rem;
  background: var(--color-bg-page);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition: all 0.2s;
}

.type-btn:hover {
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(251, 191, 36, 0.04);
}

.type-btn--active {
  border-color: var(--color-brand);
  background: rgba(251, 191, 36, 0.08);
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.12);
}

.type-btn__check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-brand);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-btn__emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
}

.type-btn__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.type-btn__img--large {
  width: 175%;
  height: 175%;
}

.type-btn__name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text);
}

.type-btn__desc {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  text-align: center;
  line-height: 1.3;
}

/* ── 금액 입력 ── */
.amount-field {
  position: relative;
}

.amount-input {
  width: 100%;
  padding: 0.85rem 3rem 0.85rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-input, 12px);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
  background: var(--color-bg-page);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.amount-input:focus {
  border-color: var(--color-brand);
  box-shadow: var(--shadow-focus-ring);
}

.amount-input::-webkit-inner-spin-button,
.amount-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.amount-unit {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.current-val {
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

/* ── 고정 지출 항목 ── */
.fixed-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fixed-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.fixed-item__name {
  width: 5.5rem;
  flex-shrink: 0;
  padding: 0.6rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-input, 12px);
  font-size: 0.85rem;
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg-page);
  outline: none;
  transition: border-color 0.2s;
}

.fixed-item__name:focus {
  border-color: var(--color-brand);
  box-shadow: var(--shadow-focus-ring);
}

.fixed-item__amount-wrap {
  flex: 1;
  position: relative;
}

.fixed-item__amount {
  width: 100%;
  padding: 0.6rem 2rem 0.6rem 0.75rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-input, 12px);
  font-size: 0.85rem;
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg-page);
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.fixed-item__amount:focus {
  border-color: var(--color-brand);
  box-shadow: var(--shadow-focus-ring);
}

.fixed-item__amount::-webkit-inner-spin-button,
.fixed-item__amount::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

.fixed-item__unit {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.fixed-item__remove {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  background: var(--color-bg-subtle, #f5f5f5);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s;
}

.fixed-item__remove:hover {
  background: rgba(220, 38, 38, 0.06);
  border-color: rgba(220, 38, 38, 0.3);
  color: #dc2626;
}

.fixed-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: 1.5px dashed var(--color-border);
  border-radius: var(--radius-input, 12px);
  font-size: 0.8rem;
  font-family: var(--font-body);
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.fixed-add-btn:hover {
  border-color: var(--color-brand);
  color: var(--color-brand);
  background: rgba(245, 158, 11, 0.04);
}

/* ── 저장 버튼 ── */
.save-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.9rem;
  background: var(--gradient-brand);
  border: none;
  border-radius: var(--radius-card);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-glow-brand);
}

.save-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.save-btn:not(:disabled):hover {
  filter: brightness(1.05);
}

.save-btn--success {
  background: #16a34a;
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.3);
}

.save-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── 로그아웃 ── */
.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.875rem;
  background: #fff;
  border: 1px solid #ef4444;
  border-radius: var(--radius-card);
  color: #ef4444;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.logout-btn:hover {
  background: #fff1f2;
}

/* ── 트랜지션 ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

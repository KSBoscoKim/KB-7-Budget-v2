<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
</script>

<template>
  <section class="settings-page">
    <h2 class="title">설정</h2>

    <div class="card">
      <div class="card__head">
        <span class="card__label">내 정보</span>
      </div>

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
            <dd>{{ currentUser.spendingType }}</dd>
          </div>
        </dl>
      </template>

      <p v-else class="empty">유저 정보를 불러올 수 없습니다.</p>
    </div>
  </section>
</template>

<style scoped>
.settings-page {
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem;
}

.title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.card {
  padding: 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}

.card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}

.card__label {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #111827;
}

.info {
  margin: 0;
}

.info__row {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 0.5rem 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}

.info__row:last-of-type {
  border-bottom: 0;
}

.info__row dt {
  margin: 0;
  color: #6b7280;
  font-weight: 500;
}

.info__row dd {
  margin: 0;
  color: #111827;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}

.hint {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  color: #b45309;
  line-height: 1.45;
}

.hint code {
  font-size: 0.6875rem;
}

.empty {
  margin: 0;
  font-size: 0.875rem;
  color: #9ca3af;
}
</style>

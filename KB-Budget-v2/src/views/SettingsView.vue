<script setup>
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
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

    <button class="logout-btn" @click="handleLogout">로그아웃</button>
  </section>
</template>

<style scoped>
.settings-page {
  max-width: 420px;
  margin: 0 auto;
  padding: 1rem;
  background: var(--color-bg-page);
  box-sizing: border-box;
}

.title {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.card {
  padding: 1.125rem 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}

.card__label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

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
  letter-spacing: 0.02em;
}

.info__row dd {
  margin: 0;
  color: var(--color-text);
  font-weight: 600;
  text-align: right;
  word-break: break-all;
}

.hint {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  color: var(--color-expense);
  line-height: 1.45;
}

.hint code {
  font-size: 0.6875rem;
}

.empty {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.logout-btn {
  margin-top: 1rem;
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
</style>

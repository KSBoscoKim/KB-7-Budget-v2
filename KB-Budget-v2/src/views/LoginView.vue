<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';
import { User, Lock, AlertTriangle } from 'lucide-vue-next';
import { useCategoryStore } from '../stores/category';
const router = useRouter();
const userStore = useUserStore();

const loginId = ref('');
const password = ref('');
const isLoading = ref(false);
const categoryStore = useCategoryStore();
async function handleLogin() {
  if (!loginId.value || !password.value) return;
  isLoading.value = true;
  const success = await userStore.login(loginId.value, password.value);
  isLoading.value = false;
  if (success) {
    if (!userStore.currentUser?.spendingType) {
      router.push('/testing');
    } else {
      router.push('/');
    }
  }
}
</script>

<template>
  <div class="login-page">
    <!-- 배경 -->
    <div class="login-bg">
      <div class="login-bg__blob login-bg__blob--1" aria-hidden="true" />
      <div class="login-bg__blob login-bg__blob--2" aria-hidden="true" />
      <div class="login-bg__blob login-bg__blob--3" aria-hidden="true" />
    </div>

    <div class="login-wrap">
      <!-- 히어로 영역 -->
      <div class="login-hero">
        <p class="login-hero__kicker">나만의 가계부</p>
        <h1 class="login-hero__wordmark">씀씀</h1>
        <p class="login-hero__tagline">지출을 기록하고, 소비를 이해해요</p>
      </div>

      <!-- 카드 -->
      <div class="login-card">
        <form class="form" @submit.prevent="handleLogin" novalidate>
          <div class="field">
            <label class="field__label" for="loginId">아이디</label>
            <div class="field__input-wrap">
              <User class="field__icon" :size="18" :stroke-width="1.7" />
              <input
                id="loginId"
                v-model="loginId"
                class="field__input"
                type="text"
                placeholder="아이디를 입력하세요"
                autocomplete="username"
              />
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="password">비밀번호</label>
            <div class="field__input-wrap">
              <Lock class="field__icon" :size="18" :stroke-width="1.7" />
              <input
                id="password"
                v-model="password"
                class="field__input"
                type="password"
                placeholder="비밀번호를 입력하세요"
                autocomplete="current-password"
              />
            </div>
          </div>

          <p v-if="userStore.loginError" class="error-msg">
            <AlertTriangle
              class="error-msg__icon"
              :size="14"
              :stroke-width="2"
            />
            {{ userStore.loginError }}
          </p>

          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="!isLoading" class="login-btn__text">시작하기</span>
            <span v-else class="login-btn__spinner" aria-label="로그인 중" />
          </button>

          <p class="signup-link">
            계정이 없으신가요?
            <RouterLink to="/signup">회원가입</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ── */
.login-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem 1.25rem;
  box-sizing: border-box;
  overflow: hidden;
  background: var(--color-bg-page);
}

/* ── Background blobs ── */
.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.login-bg__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
}

.login-bg__blob--1 {
  width: min(110vw, 480px);
  height: min(110vw, 480px);
  top: -30%;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(
    circle,
    rgba(253, 211, 77, 0.5) 0%,
    rgba(251, 191, 36, 0.18) 45%,
    transparent 70%
  );
}

.login-bg__blob--2 {
  width: 300px;
  height: 300px;
  bottom: -8%;
  right: -15%;
  background: radial-gradient(
    circle,
    rgba(245, 158, 11, 0.28) 0%,
    transparent 65%
  );
}

.login-bg__blob--3 {
  width: 200px;
  height: 200px;
  top: 40%;
  left: -12%;
  background: radial-gradient(
    circle,
    rgba(254, 243, 199, 0.7) 0%,
    transparent 68%
  );
}

/* ── Wrap ── */
.login-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* ── Hero ── */
.login-hero {
  text-align: center;
}

.login-hero__kicker {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-brand-mid);
  opacity: 0.9;
}

.login-hero__wordmark {
  margin: 0 0 0.5rem;
  font-family: var(--font-wordmark);
  font-size: clamp(3.5rem, 18vw, 5rem);
  font-weight: 400;
  letter-spacing: 0.08em;
  line-height: 1;
  color: var(--color-brand-text);
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.6),
    0 4px 20px rgba(245, 158, 11, 0.3);
}

.login-hero__tagline {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* ── Card ── */
.login-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-card);
  padding: 1.75rem 1.5rem;
  box-shadow: 0 2px 8px rgba(26, 20, 16, 0.06),
    0 16px 48px rgba(26, 20, 16, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* ── Form ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field__label {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.field__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field__icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
  flex-shrink: 0;
  pointer-events: none;
  transition: color var(--dur-base);
}

.field__input {
  width: 100%;
  padding: 13px 14px 13px 42px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-input);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text);
  background: var(--color-bg-subtle);
  outline: none;
  transition: border-color var(--dur-fast), box-shadow var(--dur-fast),
    background var(--dur-fast);
  box-sizing: border-box;
}

.field__input:focus {
  border-color: var(--color-brand);
  box-shadow: var(--shadow-focus-ring);
  background: var(--color-bg);
}

.field__input-wrap:focus-within .field__icon {
  color: var(--color-brand-mid);
}

/* ── Error ── */
.error-msg {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-card-sm);
  background: rgba(194, 87, 10, 0.08);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-expense);
}

.error-msg__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* ── Login Button ── */
.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  height: 3.125rem;
  padding: 0 1.5rem;
  background: var(--gradient-brand);
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  box-shadow: var(--shadow-fab);
  transition: transform var(--dur-fast) var(--ease-spring),
    filter var(--dur-fast), box-shadow var(--dur-fast);
  -webkit-tap-highlight-color: transparent;
}

.login-btn__text {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 800;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 1px 2px rgba(120, 53, 15, 0.25);
}

.login-btn:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(245, 158, 11, 0.5),
    0 4px 12px rgba(120, 53, 15, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
  filter: brightness(0.97);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-btn__spinner {
  display: block;
  width: 22px;
  height: 22px;
  border: 2.5px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.signup-link {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
}

.signup-link a {
  color: var(--color-brand-mid, #f59e0b);
  font-weight: 700;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>

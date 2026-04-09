<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const loginId = ref('');
const password = ref('');
const passwordConfirm = ref('');
const username = ref('');
const isLoading = ref(false);
const validationError = ref('');

async function handleSignup() {
  validationError.value = '';

  if (
    !loginId.value ||
    !password.value ||
    !passwordConfirm.value ||
    !username.value
  ) {
    validationError.value = '모든 항목을 입력해주세요.';
    return;
  }
  if (password.value !== passwordConfirm.value) {
    validationError.value = '비밀번호가 일치하지 않습니다.';
    return;
  }

  isLoading.value = true;
  const success = await userStore.signup({
    loginId: loginId.value,
    password: password.value,
    username: username.value,
    totalAmount: 0,
    spendingType: null,
  });
  isLoading.value = false;

  if (success) {
    router.push('/login');
  }
}
</script>

<template>
  <div class="signup-page">
    <!-- 배경 (로그인과 동일) -->
    <div class="login-bg">
      <div class="login-bg__blob login-bg__blob--1" aria-hidden="true" />
      <div class="login-bg__blob login-bg__blob--2" aria-hidden="true" />
      <div class="login-bg__blob login-bg__blob--3" aria-hidden="true" />
    </div>

    <div class="signup-wrap">
      <!-- 히어로 -->
      <div class="login-hero">
        <p class="login-hero__kicker">나만의 가계부</p>
        <h1 class="login-hero__wordmark">씀씀</h1>
        <p class="login-hero__tagline">계정을 만들고 소비를 기록해요</p>
      </div>

      <!-- 카드 -->
      <div class="login-card">
        <form class="form" @submit.prevent="handleSignup" novalidate>
          <!-- 이름 -->
          <div class="field">
            <label class="field__label" for="username">이름</label>
            <div class="field__input-wrap">
              <svg
                class="field__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="username"
                v-model="username"
                class="field__input"
                type="text"
                placeholder="이름을 입력하세요"
                autocomplete="name"
              />
            </div>
          </div>

          <!-- 아이디 -->
          <div class="field">
            <label class="field__label" for="loginId">아이디</label>
            <div class="field__input-wrap">
              <svg
                class="field__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18" />
              </svg>
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

          <!-- 비밀번호 -->
          <div class="field">
            <label class="field__label" for="password">비밀번호</label>
            <div class="field__input-wrap">
              <svg
                class="field__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                v-model="password"
                class="field__input"
                type="password"
                placeholder="비밀번호를 입력하세요"
                autocomplete="new-password"
              />
            </div>
          </div>

          <!-- 비밀번호 확인 -->
          <div class="field">
            <label class="field__label" for="passwordConfirm"
              >비밀번호 확인</label
            >
            <div class="field__input-wrap">
              <svg
                class="field__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 12l2 2 4-4" />
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="passwordConfirm"
                v-model="passwordConfirm"
                class="field__input"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                autocomplete="new-password"
              />
            </div>
          </div>

          <!-- 에러 메시지 -->
          <p v-if="validationError || userStore.loginError" class="error-msg">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="error-msg__icon"
            >
              <path
                fill-rule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 1.999-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clip-rule="evenodd"
              />
            </svg>
            {{ validationError || userStore.loginError }}
          </p>

          <!-- 가입 버튼 -->
          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="!isLoading" class="login-btn__text">가입하기</span>
            <span v-else class="login-btn__spinner" aria-label="가입 중" />
          </button>

          <p class="login-link">
            이미 계정이 있으신가요?
            <RouterLink to="/login">로그인</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Page ── */
.signup-page {
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

/* ── 배경 blob ── */
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
.signup-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* ── Hero (로그인과 동일) ── */
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

/* ── Card (로그인과 동일) ── */
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

/* ── 가입 버튼 (로그인 버튼과 동일) ── */
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

.login-link {
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
}
.login-link a {
  color: var(--color-brand-mid, #f59e0b);
  font-weight: 700;
  text-decoration: none;
}
.login-link a:hover {
  text-decoration: underline;
}
</style>

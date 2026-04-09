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
    spendingType: '일반형',
  });
  isLoading.value = false;

  if (success) {
    router.push('/login');
    success = !success;
  }
}
</script>

<template>
  <div class="signup-page">
    <div class="signup-card">
      <h1 class="title">회원가입</h1>
      <p class="subtitle">정보를 입력하고 시작하세요</p>

      <form class="form" @submit.prevent="handleSignup">
        <div class="field">
          <label for="username">이름</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="이름을 입력하세요"
            autocomplete="name"
          />
        </div>

        <div class="field">
          <label for="loginId">아이디</label>
          <input
            id="loginId"
            v-model="loginId"
            type="text"
            placeholder="아이디를 입력하세요"
            autocomplete="username"
          />
        </div>

        <div class="field">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            autocomplete="new-password"
          />
        </div>

        <div class="field">
          <label for="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            v-model="passwordConfirm"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            autocomplete="new-password"
          />
        </div>

        <!-- 에러 메시지 -->
        <p v-if="validationError" class="error-msg">{{ validationError }}</p>
        <p v-else-if="userStore.loginError" class="error-msg">
          {{ userStore.loginError }}
        </p>

        <button type="submit" class="signup-btn" :disabled="isLoading">
          {{ isLoading ? '가입 중...' : '회원가입' }}
        </button>

        <p class="login-link">
          이미 계정이 있으신가요?
          <RouterLink to="/login">로그인</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.signup-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #e5e7eb;
  padding: 24px;
  box-sizing: border-box;
}

.signup-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px;
  color: #111827;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 32px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.field input {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus {
  border-color: #3b82f6;
}

.error-msg {
  font-size: 13px;
  color: #ef4444;
  margin: 0;
}

.signup-btn {
  margin-top: 8px;
  padding: 14px;
  background: #3b82f6;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.signup-btn:hover:not(:disabled) {
  background: #2563eb;
}

.signup-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.login-link a {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>

<template>
  <div class="test-page">
    <!-- 배경 (로그인과 동일) -->
    <div class="login-bg">
      <div class="login-bg__blob login-bg__blob--1" aria-hidden="true" />
      <div class="login-bg__blob login-bg__blob--2" aria-hidden="true" />
      <div class="login-bg__blob login-bg__blob--3" aria-hidden="true" />
    </div>

    <div class="test-wrap">
      <!-- ── 시작 화면 ── -->
      <template v-if="step === 'start'">
        <div class="hero">
          <p class="hero__kicker">소비 습관 분석</p>
          <div class="hero__emoji">💸</div>
          <h1 class="hero__title">나의 소비 유형은?</h1>
          <p class="hero__desc">
            12개의 질문을 통해<br />나의 평소 지출 습관과 유형을 확인해보세요!
          </p>
        </div>
        <div class="card">
          <button class="primary-btn" @click="startTest">
            테스트 시작하기
          </button>
          <button class="skip-btn" @click="skipTest">나중에 하기</button>
        </div>
      </template>

      <!-- ── 질문 화면 ── -->
      <template v-else-if="step === 'question'">
        <div class="hero hero--sm">
          <p class="hero__kicker">소비 습관 분석</p>
          <h1 class="hero__title hero__title--sm">나의 소비 MBTI</h1>
        </div>

        <div class="card">
          <!-- 진행 막대 -->
          <div class="progress-bars">
            <div
              v-for="(_, i) in questions"
              :key="i"
              class="prog-bar"
              :class="{ done: i < currentIdx, active: i === currentIdx }"
            />
          </div>
          <p class="prog-label">
            <span class="prog-label__cur">{{ currentIdx + 1 }}</span> /
            {{ questions.length }}
          </p>

          <!-- 질문 -->
          <p class="question-text">{{ currentQuestion.text }}</p>

          <!-- 답변 버튼 -->
          <div class="ans-group">
            <button
              class="ans-btn"
              :class="{ 'ans-btn--yes': answers[currentIdx] === true }"
              @click="selectAnswer(true)"
            >
              <span>그렇다</span>
              <span
                class="ans-icon"
                :class="
                  answers[currentIdx] === true
                    ? 'ans-icon--yes-on'
                    : 'ans-icon--yes'
                "
                >✓</span
              >
            </button>
            <button
              class="ans-btn"
              :class="{ 'ans-btn--no': answers[currentIdx] === false }"
              @click="selectAnswer(false)"
            >
              <span>아니다</span>
              <span
                class="ans-icon"
                :class="
                  answers[currentIdx] === false
                    ? 'ans-icon--no-on'
                    : 'ans-icon--no'
                "
                >✕</span
              >
            </button>
          </div>

          <!-- 이전 / 다음 -->
          <div class="nav-row">
            <button
              class="nav-btn"
              :disabled="currentIdx === 0"
              @click="goPrev"
            >
              ← 이전
            </button>
            <button
              class="nav-btn nav-btn--next"
              :disabled="answers[currentIdx] === null"
              @click="goNext"
            >
              {{ currentIdx === questions.length - 1 ? '결과 보기' : '다음' }} →
            </button>
          </div>
        </div>
      </template>

      <!-- ── 결과 화면 ── -->
      <template v-else>
        <div class="hero">
          <p class="hero__kicker hero__kicker--result">분석 완료!</p>
          <div class="character-wrap">
            <div class="character-glow" />
            <img
              :src="resultCharacter"
              class="character-img"
              alt="소비유형 캐릭터"
            />
          </div>
        </div>

        <div class="card">
          <div class="result-badge">{{ resultType }}</div>
          <p class="result-desc">{{ resultDescription }}</p>
          <button class="primary-btn" @click="goHome">시작하기</button>
          <button class="skip-btn" @click="reset">다시 테스트하기</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import charFlex from '@/assets/images/character-flex.png';
import charSocial from '@/assets/images/character-social.png';
import charPlan from '@/assets/images/character-plan.png';
import charDrizzle from '@/assets/images/character-drizzle.png';

const router = useRouter();

const step = ref('start');
const currentIdx = ref(0);
const answers = ref(new Array(12).fill(null));

const questions = [
  { id: 1, text: '물건을 사기 전에 반드시 여러 사이트의 가격을 비교해 본다.' },
  {
    id: 2,
    text: "쇼핑몰 앱의 '타임 세일' 알람을 보고 계획에 없던 물건을 산 적이 많다.",
  },
  {
    id: 3,
    text: '한 달 동안 쓸 생활비 예산을 미리 정해두고 그 안에서 지출하려고 노력한다.',
  },
  {
    id: 4,
    text: "길을 가다 마음에 드는 물건을 발견하면 '나중에 필요할 거야'라며 바로 구매한다.",
  },
  {
    id: 5,
    text: '스트레스를 많이 받은 날에는 맛있는 음식을 먹거나 쇼핑을 하며 기분을 푼다.',
  },
  {
    id: 6,
    text: "물건을 살 때 '디자인이나 브랜드'보다 '기능과 가치(가성비)'를 더 중요하게 생각한다.",
  },
  {
    id: 7,
    text: '친구나 가족에게 선물을 줄 때 예산보다 훨씬 더 좋은 것을 사주고 싶어 한다.',
  },
  {
    id: 8,
    text: "편의점에 들렀을 때 꼭 필요하지 않아도 '1+1'이나 '신상 과자'를 습관적으로 집어 든다.",
  },
  {
    id: 9,
    text: '혼자 영화를 보거나 취미 생활을 즐기는 데 돈을 쓰는 것이 가장 아깝지 않다.',
  },
  {
    id: 10,
    text: '친구들과 모임이 있을 때 분위기에 휩쓸려 내가 먼저 계산하는 경우가 종종 있다.',
  },
  {
    id: 11,
    text: '경조사비나 지인 선물 비용이 내 용돈보다 더 많이 나갈 때가 있다.',
  },
  {
    id: 12,
    text: "배달 음식이나 택시비처럼 '내 몸이 편하기 위해' 쓰는 돈은 아깝지 않다고 생각한다.",
  },
];

const resultDescriptions = {
  계획가형:
    '계획적이고 꼼꼼한 소비를 즐기는 타입이에요. 가격 비교는 기본, 예산 내에서 최고의 만족을 추구합니다.',
  플렉스형:
    '순간의 감정과 욕구에 충실한 소비 스타일! 때로는 지갑이 얇아지지만, 삶의 즐거움을 아는 사람이에요.',
  사회활동가형:
    '관계와 사람에 기꺼이 투자하는 타입이에요. 타인을 위한 소비에서 진정한 행복을 느낍니다.',
  보슬비형:
    '작은 지출이 모여 큰 소비가 되는 스타일. 충동적이지만 소소한 기쁨을 사랑하는 사람이에요.',
};

const currentQuestion = computed(() => questions[currentIdx.value]);

const resultType = computed(() => {
  const scores = { 계획가형: 0, 플렉스형: 0, 사회활동가형: 0, 보슬비형: 0 };
  const a = answers.value;
  if (a[0]) scores['계획가형']++;
  if (a[2]) scores['계획가형']++;
  if (a[5]) scores['계획가형']++;
  if (a[3]) scores['플렉스형']++;
  if (a[4]) scores['플렉스형']++;
  if (a[8]) scores['플렉스형']++;
  if (a[6]) scores['사회활동가형']++;
  if (a[9]) scores['사회활동가형']++;
  if (a[10]) scores['사회활동가형']++;
  if (a[1]) scores['보슬비형']++;
  if (a[7]) scores['보슬비형']++;
  if (a[11]) scores['보슬비형']++;
  return Object.keys(scores).reduce((a, b) => (scores[a] >= scores[b] ? a : b));
});

const resultDescription = computed(() => resultDescriptions[resultType.value]);

function startTest() {
  step.value = 'question';
}
function skipTest() {
  router.push('/');
}
function goHome() {
  router.push('/');
}
function selectAnswer(val) {
  answers.value[currentIdx.value] = val;
}
function goPrev() {
  if (currentIdx.value > 0) currentIdx.value--;
}
function goNext() {
  if (answers.value[currentIdx.value] === null) return;
  if (currentIdx.value < questions.length - 1) currentIdx.value++;
  else step.value = 'result';
}
function reset() {
  step.value = 'start';
  currentIdx.value = 0;
  answers.value = new Array(12).fill(null);
}

const CHARACTERS = {
  플렉스형: charFlex,
  사회활동가형: charSocial,
  계획가형: charPlan,
  보슬비형: charDrizzle,
};

const resultCharacter = computed(() => CHARACTERS[resultType.value]);
</script>

<style scoped>
/* ── Page (로그인과 동일 구조) ── */
.test-page {
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

/* ── 배경 blob (로그인과 동일) ── */
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
.test-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Hero ── */
.hero {
  text-align: center;
}
.hero--sm {
  margin-bottom: -0.5rem;
}

.hero__kicker {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--color-brand-mid);
  opacity: 0.9;
}

.hero__emoji {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  line-height: 1;
}

.hero__title {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 8vw, 2.4rem);
  font-weight: 800;
  color: var(--color-brand-text);
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.6),
    0 4px 20px rgba(245, 158, 11, 0.3);
}
.hero__title--sm {
  font-size: clamp(1.4rem, 6vw, 1.8rem);
}

.hero__desc {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.hero__kicker--result {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-transform: none;
  color: var(--color-brand-text);
  opacity: 1;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 2px 8px rgba(245, 158, 11, 0.35));
}

/* ── Card (로그인 카드와 동일) ── */
.card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-card);
  padding: 1.75rem 1.5rem;
  box-shadow: 0 2px 8px rgba(26, 20, 16, 0.06),
    0 16px 48px rgba(26, 20, 16, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── 진행 막대 ── */
.progress-bars {
  display: flex;
  gap: 4px;
}
.prog-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #ede8e0;
  transition: background 0.25s;
}
.prog-bar.done {
  background: var(--color-brand-mid, #f59e0b);
}
.prog-bar.active {
  background: rgba(245, 158, 11, 0.45);
}

.prog-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: -0.25rem 0 0;
}
.prog-label__cur {
  color: var(--color-brand-mid, #f59e0b);
  font-weight: 700;
}

/* ── 질문 ── */
.question-text {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-brand-text, #3b1f0a);
  line-height: 1.7;
  text-align: center;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* ── 답변 버튼 ── */
.ans-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ans-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: var(--radius-input, 12px);
  border: 1.5px solid var(--color-border, #e8ddd0);
  background: var(--color-bg-subtle, #fdf8f2);
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text, #3b1f0a);
  transition: border-color 0.15s, background 0.15s, transform 0.1s;
}
.ans-btn:hover {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(253, 211, 77, 0.1);
}
.ans-btn:active {
  transform: scale(0.98);
}

.ans-btn--yes {
  border-color: var(--color-brand-mid, #f59e0b);
  background: rgba(253, 211, 77, 0.15);
  color: var(--color-brand-text, #3b1f0a);
}
.ans-btn--no {
  border-color: #c8bdb0;
  background: #f5f0eb;
}

.ans-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.ans-icon--yes {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-brand-mid, #f59e0b);
}
.ans-icon--yes-on {
  background: var(--color-brand-mid, #f59e0b);
  color: #fff;
}
.ans-icon--no {
  background: #ede8e0;
  color: #a09080;
}
.ans-icon--no-on {
  background: #8b7d70;
  color: #fff;
}

/* ── 네비 ── */
.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}
.nav-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 18px;
  border-radius: 12px;
  border: 1.5px solid var(--color-border, #e8ddd0);
  background: transparent;
  font-size: 14px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, transform 0.1s;
}
.nav-btn:hover:not(:disabled) {
  border-color: rgba(245, 158, 11, 0.4);
  color: var(--color-brand-text);
}
.nav-btn:active:not(:disabled) {
  transform: scale(0.97);
}
.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.nav-btn--next {
  background: var(--gradient-brand, linear-gradient(135deg, #fbbf24, #f59e0b));
  border-color: transparent;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35);
}
.nav-btn--next:hover:not(:disabled) {
  filter: brightness(1.06);
  color: #fff;
  transform: translateY(-1px);
}

/* ── 결과 ── */
.result-badge {
  background: rgba(253, 211, 77, 0.2);
  border: 1.5px solid rgba(245, 158, 11, 0.4);
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  color: var(--color-brand-text, #3b1f0a);
}
.result-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  text-align: center;
  margin: 0;
}

/* ── 공통 버튼 ── */
.primary-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.125rem;
  padding: 0 1.5rem;
  background: var(--gradient-brand, linear-gradient(135deg, #fbbf24, #f59e0b));
  border: none;
  border-radius: var(--radius-pill, 9999px);
  cursor: pointer;
  box-shadow: var(--shadow-fab, 0 8px 32px rgba(245, 158, 11, 0.4));
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 800;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 1px 2px rgba(120, 53, 15, 0.25);
  transition: transform 0.15s, filter 0.15s, box-shadow 0.15s;
}
.primary-btn:hover {
  filter: brightness(1.05);
  transform: translateY(-2px);
}
.primary-btn:active {
  transform: scale(0.98);
}

.skip-btn {
  background: none;
  border: none;
  font-size: 13px;
  color: var(--color-text-muted);
  cursor: pointer;
  text-align: center;
  padding: 4px 0;
  transition: color 0.15s;
}
.skip-btn:hover {
  color: var(--color-text-secondary);
}
.character-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
}

.character-glow {
  position: absolute;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(253, 211, 77, 0.9) 0%,
    rgba(245, 158, 11, 0.5) 40%,
    transparent 70%
  );
  filter: blur(20px);
  animation: glow-pulse 2s ease-in-out infinite;
}

.character-img {
  position: relative;
  z-index: 1;
  width: 120px;
  height: 120px;
  object-fit: contain;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 0 12px rgba(253, 211, 77, 0.8));
}

@keyframes glow-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.75;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>

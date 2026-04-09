<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import alpacaImg from '@/assets/images/안경알파카.png'

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const COL_COUNT = 7  // 세로 컬럼 수
const ROW_COUNT = 6  // 컬럼당 숫자 개수

const streams = ref([])

function randomChar() {
  return DIGITS[Math.floor(Math.random() * DIGITS.length)]
}

function buildStreams() {
  return Array.from({ length: COL_COUNT }, (_, ci) => ({
    id: ci,
    // 알파카 너비(70px) 중심으로 균등 배치, 양옆으로 살짝 넘침
    x: Math.round((ci - (COL_COUNT - 1) / 2) * 13),
    chars: Array.from({ length: ROW_COUNT }, (_, ri) => ({
      id: ri,
      char: randomChar(),
      // 같은 컬럼 내에서 위→아래로 순차 점등, 컬럼마다 시작 시점 다름
      delay: Number((ci * 0.28 + ri * 0.14).toFixed(2)),
      duration: Number((1.4 + Math.random() * 0.6).toFixed(2)),
    })),
  }))
}

let charInterval = null

onMounted(() => {
  streams.value = buildStreams()
  // 랜덤하게 문자 교체해서 살아있는 느낌 유지
  charInterval = setInterval(() => {
    streams.value.forEach((stream) => {
      const ri = Math.floor(Math.random() * ROW_COUNT)
      stream.chars[ri].char = randomChar()
    })
  }, 180)
})

onUnmounted(() => {
  clearInterval(charInterval)
})
</script>

<template>
  <!-- 알파카 마스코트 (계획형) -->
  <div class="mascot" aria-hidden="true">

    <!-- 매트릭스 숫자 스트림 (알파카 뒤) -->
    <div class="matrix-bg">
      <div
        v-for="stream in streams"
        :key="stream.id"
        class="stream"
        :style="{ left: `calc(50% + ${stream.x}px)` }"
      >
        <span
          v-for="cell in stream.chars"
          :key="cell.id"
          class="digit"
          :style="{
            animationDelay: cell.delay + 's',
            animationDuration: cell.duration + 's',
          }"
        >{{ cell.char }}</span>
      </div>
    </div>

    <!-- 알파카 이미지 (앞) -->
    <img :src="alpacaImg" class="mascot__img" alt="" draggable="false" />
  </div>
</template>

<style scoped>
/* ── 알파카 마스코트 ── */
.mascot {
  position: absolute;
  bottom: 3px;
  right: 1.5rem;
  z-index: 2;
  animation: mascot-walk 10s linear infinite;
  will-change: transform;
}

.mascot__img {
  display: block;
  width: 70px;
  position: relative;
  z-index: 2;
  pointer-events: none;
  user-select: none;
}

/* ── 매트릭스 배경 ── */
.matrix-bg {
  position: absolute;
  bottom: 38px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 80px;
  z-index: 1;
  overflow: hidden;
}

.stream {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  transform: translateX(-50%);
}

.digit {
  font-family: 'Courier New', Courier, monospace;
  font-size: 9px;
  font-weight: 700;
  color: #00ff41;
  line-height: 1;
  opacity: 0;
  animation: matrix-pulse linear infinite;
  will-change: opacity, color, text-shadow;
}

/* 숫자 떴다 사라지기: 가장 밝을 때(50%) 흰색 글로우 */
@keyframes matrix-pulse {
  0%   { opacity: 0;   color: #003d10; text-shadow: none; }
  35%  { opacity: 0.9; color: #00ff41; text-shadow: 0 0 6px #00ff41; }
  50%  { opacity: 1;   color: #ccffcc; text-shadow: 0 0 8px #00ff41, 0 0 3px #fff; }
  65%  { opacity: 0.9; color: #00ff41; text-shadow: 0 0 6px #00ff41; }
  100% { opacity: 0;   color: #003d10; text-shadow: none; }
}

/* ── 좌우 걷기 애니메이션 ── */
@keyframes mascot-walk {
  /* ─── 왼쪽으로 걷기 ─── */
  0%   { transform: translateX(0)      translateY(0)    scaleX(1);  }
  8%   { transform: translateX(-48px)  translateY(-4px) scaleX(1);  }
  16%  { transform: translateX(-96px)  translateY(0)    scaleX(1);  }
  24%  { transform: translateX(-144px) translateY(-4px) scaleX(1);  }
  32%  { transform: translateX(-193px) translateY(0)    scaleX(1);  }
  38%  { transform: translateX(-215px) translateY(0)    scaleX(1);  }

  /* ─── 방향 전환 (순간 반전) ─── */
  39%  { transform: translateX(-220px) translateY(0)    scaleX(-1); }
  40%  { transform: translateX(-220px) translateY(0)    scaleX(-1); }

  /* ─── 오른쪽으로 걷기 ─── */
  48%  { transform: translateX(-172px) translateY(-4px) scaleX(-1); }
  56%  { transform: translateX(-124px) translateY(0)    scaleX(-1); }
  64%  { transform: translateX(-76px)  translateY(-4px) scaleX(-1); }
  72%  { transform: translateX(-28px)  translateY(0)    scaleX(-1); }
  78%  { transform: translateX(0)      translateY(0)    scaleX(-1); }

  /* ─── 방향 전환 (순간 복원) ─── */
  79%  { transform: translateX(0)      translateY(0)    scaleX(1);  }

  /* ─── 잠시 제자리 대기 ─── */
  100% { transform: translateX(0)      translateY(0)    scaleX(1);  }
}
</style>

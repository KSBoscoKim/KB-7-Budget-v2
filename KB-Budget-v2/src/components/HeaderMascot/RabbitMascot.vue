<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import coin1 from '@/assets/images/동전1.png'
import coin2 from '@/assets/images/동전2.png'
import coin3 from '@/assets/images/동전3.png'
import coin4 from '@/assets/images/동전4.png'
import bill1 from '@/assets/images/지폐1.png'
import rabbitImg from '@/assets/images/토끼.png'

// 지폐는 드물게 나오도록 1개, 동전은 각 2개씩
const COIN_IMGS = [coin1, coin1, coin2, coin2, coin3, coin3, coin4, coin4, bill1]

const mascotEl = ref(null)
const coins = ref([])
let uid = 0
let intervalId = null
let lastRight = null

function spawnCoin() {
  if (!mascotEl.value) return

  // CSS 애니메이션이 적용된 실제 시각 위치를 DOM에서 직접 읽기
  const mascotRect = mascotEl.value.getBoundingClientRect()
  const header = mascotEl.value.closest('header')
  if (!header) return
  const headerRect = header.getBoundingClientRect()

  // 토끼 중심의 right 오프셋 (헤더 오른쪽 끝 기준)
  const centerRight = Math.round(
    headerRect.right - mascotRect.left - mascotRect.width / 2
  )

  // 2px 미만 이동 = 멈춤 구간 → 생략
  if (lastRight !== null && Math.abs(centerRight - lastRight) < 2) return
  lastRight = centerRight

  const id = ++uid
  const img = COIN_IMGS[Math.floor(Math.random() * COIN_IMGS.length)]
  const jitter = (Math.random() - 0.5) * 8

  coins.value.push({ id, img, right: centerRight + jitter })

  setTimeout(() => {
    coins.value = coins.value.filter((c) => c.id !== id)
  }, 700)
}

onMounted(() => {
  intervalId = setInterval(spawnCoin, 250)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <!-- 토끼 마스코트 (보슬비형) -->
  <div ref="mascotEl" class="mascot" aria-hidden="true">
    <img :src="rabbitImg" class="mascot__img" alt="" draggable="false" />
  </div>

  <!-- 동전: 토끼가 흘리고 사라짐 -->
  <TransitionGroup tag="div" name="coin" class="coin-layer" aria-hidden="true">
    <img
      v-for="coin in coins"
      :key="coin.id"
      :src="coin.img"
      class="coin-item"
      :style="{ right: coin.right + 'px' }"
      alt=""
      draggable="false"
    />
  </TransitionGroup>
</template>

<style scoped>
/* ── 토끼 마스코트 ── */
.mascot {
  position: absolute;
  bottom: -10px;
  right: 1.5rem;
  z-index: 2;
  animation: mascot-walk 10s linear infinite;
  will-change: transform;
}

.mascot__img {
  display: block;
  width: 110px;
  pointer-events: none;
  user-select: none;
}

/* 좌우 걷기 애니메이션 */
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

/* ── 동전 레이어 ── */
.coin-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.coin-item {
  position: absolute;
  bottom: 10px;
  height: 11px;
  width: auto;
  pointer-events: none;
  user-select: none;
}

/* 동전 등장: 위에서 톡 떨어짐 */
.coin-enter-active {
  animation: coin-drop 0.18s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* 동전 퇴장 */
.coin-leave-active {
  animation: coin-fade 0.3s ease-in forwards;
}

@keyframes coin-drop {
  0%   { opacity: 0; transform: translateY(-12px) scale(0.3) rotate(-20deg); }
  70%  { opacity: 1; transform: translateY(2px)   scale(1.1) rotate(5deg);   }
  100% { opacity: 1; transform: translateY(0)     scale(1)   rotate(0deg);   }
}

@keyframes coin-fade {
  0%   { opacity: 1; transform: scale(1)   translateY(0);   }
  100% { opacity: 0; transform: scale(0.4) translateY(6px); }
}
</style>

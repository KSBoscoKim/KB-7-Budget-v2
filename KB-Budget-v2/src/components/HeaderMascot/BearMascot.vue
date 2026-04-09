<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import bearImg from '@/assets/images/플렉스곰2.png'
import bill3 from '@/assets/images/지폐3.png'
import bill4 from '@/assets/images/지폐4.png'
import bill5 from '@/assets/images/지폐5.png'

const BILL_IMGS = [bill3, bill4, bill5]

const mascotEl = ref(null)
const bills = ref([])
let uid = 0
let intervalId = null

function spawnBill() {
  if (!mascotEl.value) return
  const mascotRect = mascotEl.value.getBoundingClientRect()
  const header = mascotEl.value.closest('header')
  if (!header) return
  const headerRect = header.getBoundingClientRect()

  // 곰 중심 위치 (헤더 기준 left, bottom)
  const centerLeft = mascotRect.left - headerRect.left + mascotRect.width / 2
  const centerBottom = headerRect.bottom - (mascotRect.top + mascotRect.height / 2)

  // 분수처럼 위로 퍼지는 방향: 수직 기준 ±75° 범위
  const angleRad = (Math.random() - 0.5) * (Math.PI * 5 / 6) // ±75°
  const distance = 40 + Math.random() * 65 // 40~105px
  const dx = Math.sin(angleRad) * distance
  const dy = -Math.cos(angleRad) * distance // 위쪽 = 음수

  const id = ++uid
  const img = BILL_IMGS[Math.floor(Math.random() * BILL_IMGS.length)]
  const rotate = (Math.random() - 0.5) * 70 // -35°~+35° 회전
  const duration = 750 + Math.random() * 450 // 750~1200ms

  bills.value.push({
    id,
    img,
    left: centerLeft - 18, // 지폐 너비 절반 보정 (~36px 기준)
    bottom: centerBottom - 7, // 지폐 높이 절반 보정 (~14px 기준)
    dx,
    dy,
    rotate,
    duration,
  })

  setTimeout(() => {
    bills.value = bills.value.filter((b) => b.id !== id)
  }, duration + 100)
}

onMounted(() => {
  intervalId = setInterval(() => {
    spawnBill()
    spawnBill()
    spawnBill()
  }, 200)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <!-- 곰 마스코트 (플렉스형) -->
  <div ref="mascotEl" class="mascot" aria-hidden="true">
    <img :src="bearImg" class="mascot__img" alt="" draggable="false" />
  </div>

  <!-- 지폐 분수 레이어 -->
  <div class="bill-layer" aria-hidden="true">
    <img
      v-for="bill in bills"
      :key="bill.id"
      :src="bill.img"
      class="bill-item"
      :style="{
        left: bill.left + 'px',
        bottom: bill.bottom + 'px',
        '--dx': bill.dx + 'px',
        '--dy': bill.dy + 'px',
        '--rot': bill.rotate + 'deg',
        animationDuration: bill.duration + 'ms',
      }"
      alt=""
      draggable="false"
    />
  </div>
</template>

<style scoped>
/* ── 곰 마스코트 ── */
.mascot {
  position: absolute;
  bottom: 5px;
  right: 1.5rem;
  z-index: 3;
  animation: mascot-walk 10s linear infinite;
  will-change: transform;
}

.mascot__img {
  display: block;
  width: 55px;
  pointer-events: none;
  user-select: none;
}

/* 좌우 걷기 애니메이션 */
@keyframes mascot-walk {
  /* ─── 왼쪽으로 걷기 ─── */
  0%   { transform: translateX(0)      translateY(0)    scaleX(1);  }
  8%   { transform: translateX(-48px)  translateY(-3px) scaleX(1);  }
  16%  { transform: translateX(-96px)  translateY(0)    scaleX(1);  }
  24%  { transform: translateX(-144px) translateY(-3px) scaleX(1);  }
  32%  { transform: translateX(-193px) translateY(0)    scaleX(1);  }
  38%  { transform: translateX(-215px) translateY(0)    scaleX(1);  }

  /* ─── 방향 전환 (순간 반전) ─── */
  39%  { transform: translateX(-220px) translateY(0)    scaleX(-1); }
  40%  { transform: translateX(-220px) translateY(0)    scaleX(-1); }

  /* ─── 오른쪽으로 걷기 ─── */
  48%  { transform: translateX(-172px) translateY(-3px) scaleX(-1); }
  56%  { transform: translateX(-124px) translateY(0)    scaleX(-1); }
  64%  { transform: translateX(-76px)  translateY(-3px) scaleX(-1); }
  72%  { transform: translateX(-28px)  translateY(0)    scaleX(-1); }
  78%  { transform: translateX(0)      translateY(0)    scaleX(-1); }

  /* ─── 방향 전환 (순간 복원) ─── */
  79%  { transform: translateX(0)      translateY(0)    scaleX(1);  }

  /* ─── 잠시 제자리 대기 ─── */
  100% { transform: translateX(0)      translateY(0)    scaleX(1);  }
}

/* ── 지폐 레이어 ── */
.bill-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.bill-item {
  position: absolute;
  height: 28px;
  width: auto;
  pointer-events: none;
  user-select: none;
  transform-origin: center center;
  animation-name: bill-burst;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation-fill-mode: forwards;
}

/* 지폐 분수 터짐 */
@keyframes bill-burst {
  0% {
    opacity: 0;
    transform: translateX(0) translateY(0) rotate(0deg) scale(0.4);
  }
  15% {
    opacity: 1;
    transform: translateX(calc(var(--dx) * 0.15)) translateY(calc(var(--dy) * 0.15)) rotate(calc(var(--rot) * 0.2)) scale(0.9);
  }
  70% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
    transform: translateX(var(--dx)) translateY(var(--dy)) rotate(var(--rot)) scale(0.7);
  }
}
</style>

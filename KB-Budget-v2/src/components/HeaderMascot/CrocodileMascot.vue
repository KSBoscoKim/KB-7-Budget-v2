<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import crocodileImg from '@/assets/images/악어.png'
import msgImg from '@/assets/images/문자.png'
import heartImg from '@/assets/images/하트연락.png'

const mascotEl = ref(null)
const notifs = ref([])
let uid = 0
let intervalId = null

function spawnNotif() {
  const id = ++uid
  const isMsg = Math.random() < 0.5
  const img = isMsg ? msgImg : heartImg
  const isLeft = Math.random() < 0.5

  const x = isLeft
    ? -(30 + Math.random() * 14)  // 머리 왼쪽: -30 ~ -44px
    : (52 + Math.random() * 14)   // 머리 오른쪽: 52 ~ 66px
  const yJitter = (Math.random() - 0.5) * 14

  // 문자 이미지는 기본이 오른쪽 방향이므로:
  // - CSS 오른쪽 배치(isLeft=false) → 악어가 왼쪽 → 이미지 반전 필요
  // - CSS 왼쪽 배치(isLeft=true)  → 악어가 오른쪽 → 기본 방향 그대로
  // (부모 scaleX(-1)이 바뀌어도 이 규칙이 일관되게 유지됨)
  const flipX = isMsg && !isLeft

  notifs.value.push({ id, img, x, yJitter, flipX })

  setTimeout(() => {
    notifs.value = notifs.value.filter((n) => n.id !== id)
  }, 1400)
}

onMounted(() => {
  setTimeout(() => {
    spawnNotif()
    intervalId = setInterval(spawnNotif, 580)
  }, Math.random() * 400)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <!-- 악어 마스코트 (사회형) -->
  <div ref="mascotEl" class="mascot" aria-hidden="true">

    <!--
      wrapper div: 위치 + 팝업 애니메이션 담당
      inner img:   방향 반전(flipX)만 담당 → 두 transform이 충돌하지 않음
    -->
    <div
      v-for="notif in notifs"
      :key="notif.id"
      class="notif-item"
      :style="{
        left: notif.x + 'px',
        bottom: `calc(58% + ${notif.yJitter}px)`,
      }"
    >
      <img
        :src="notif.img"
        class="notif-img"
        :style="notif.flipX ? { transform: 'scaleX(-1)' } : {}"
        alt=""
        draggable="false"
      />
    </div>

    <!-- 악어 이미지 (앞) -->
    <img :src="crocodileImg" class="mascot__img" alt="" draggable="false" />
  </div>
</template>

<style scoped>
/* ── 악어 마스코트 ── */
.mascot {
  position: absolute;
  bottom: 5px;
  right: 1.5rem;
  z-index: 2;
  animation: mascot-walk 10s linear infinite;
  will-change: transform;
}

.mascot__img {
  display: block;
  width: 65px;
  position: relative;
  z-index: 2;
  pointer-events: none;
  user-select: none;
}

/* ── 연락 알림 아이콘 ── */
.notif-item {
  position: absolute;
  z-index: 3;
  pointer-events: none;
  user-select: none;
  animation: notif-pop 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.notif-img {
  display: block;
  height: 26px;
  width: auto;
}

/* 팝업처럼 등장 후 서서히 사라짐 */
@keyframes notif-pop {
  0%   { opacity: 0; transform: scale(0.2) translateY(6px); }
  18%  { opacity: 1; transform: scale(1.15) translateY(-4px); }
  30%  { transform: scale(1) translateY(0); }
  65%  { opacity: 1; }
  100% { opacity: 0; transform: scale(0.85) translateY(-10px); }
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

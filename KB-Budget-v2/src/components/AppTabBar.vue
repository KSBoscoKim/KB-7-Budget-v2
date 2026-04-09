<script setup>
import { House, ChartNoAxesColumn, Settings } from 'lucide-vue-next'

const tabs = [
  { name: 'home',     label: '가계',  icon: House },
  { name: 'stats',    label: '통계',  icon: ChartNoAxesColumn },
  { name: 'settings', label: '설정',  icon: Settings },
]
</script>

<template>
  <nav class="tab-bar" aria-label="주요 메뉴">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="{ name: tab.name }"
      class="tab-link"
      exact-active-class="tab-link--active"
    >
      <span class="tab-link__dot" aria-hidden="true" />

      <span class="tab-link__icon-wrap" aria-hidden="true">
        <component :is="tab.icon" class="tab-icon" :size="24" :stroke-width="1.6" />
      </span>

      <span class="tab-link__label">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
/* ── Tab Bar 컨테이너 ── */
.tab-bar {
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  min-height: 4rem;
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: var(--shadow-tab);
  border-top: 1px solid rgba(230, 215, 190, 0.6);
}

/* ── 개별 탭 링크 ── */
.tab-link {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 0.5rem 0.25rem 0.25rem;
  text-decoration: none;
  color: var(--color-text-muted);
  -webkit-tap-highlight-color: transparent;
  transition: color var(--dur-base) var(--ease-smooth);
}

/* ── 활성 인디케이터 점 ── */
.tab-link__dot {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%) scale(0);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-brand);
  transition:
    transform var(--dur-base) var(--ease-spring),
    opacity var(--dur-base);
  opacity: 0;
}

.tab-link--active .tab-link__dot {
  transform: translateX(-50%) scale(1);
  opacity: 1;
}

/* ── 아이콘 래퍼 ── */
.tab-link__icon-wrap {
  position: relative;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── SVG 아이콘 ── */
.tab-icon {
  width: 24px;
  height: 24px;
  transition:
    stroke-width var(--dur-base) var(--ease-smooth),
    transform var(--dur-base) var(--ease-spring);
}

.tab-link--active .tab-icon {
  stroke-width: 2.4;
  transform: scale(1.05);
}

/* ── 레이블 ── */
.tab-link__label {
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  transition: color var(--dur-base) var(--ease-smooth);
}

/* ── 활성 상태 색상 ── */
.tab-link--active {
  color: var(--color-brand-mid);
}

/* ── 탭 누름 효과 ── */
.tab-link:active {
  opacity: 0.7;
}
</style>

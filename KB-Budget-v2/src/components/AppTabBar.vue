<script setup>
const tabs = [
  { name: 'home',     label: '가계' },
  { name: 'stats',    label: '통계' },
  { name: 'settings', label: '설정' },
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
      <!-- 활성 인디케이터 -->
      <span class="tab-link__dot" aria-hidden="true" />

      <!-- 아이콘 래퍼 -->
      <span class="tab-link__icon-wrap" aria-hidden="true">

        <!-- HOME ── 집 (filled / outline) -->
        <template v-if="tab.name === 'home'">
          <svg class="tab-icon tab-icon--on" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.061-1.061l-8.69-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"/>
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"/>
          </svg>
          <svg class="tab-icon tab-icon--off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
          </svg>
        </template>

        <!-- STATS ── 막대 차트 -->
        <template v-if="tab.name === 'stats'">
          <svg class="tab-icon tab-icon--on" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z"/>
          </svg>
          <svg class="tab-icon tab-icon--off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/>
          </svg>
        </template>

        <!-- SETTINGS ── 기어 -->
        <template v-if="tab.name === 'settings'">
          <svg class="tab-icon tab-icon--on" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd"/>
          </svg>
          <svg class="tab-icon tab-icon--off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
          </svg>
        </template>
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
  position: absolute;
  width: 24px;
  height: 24px;
  transition:
    opacity var(--dur-base) var(--ease-smooth),
    transform var(--dur-base) var(--ease-spring);
}

/* 비활성: outline 표시 */
.tab-icon--on  { opacity: 0; transform: scale(0.88); }
.tab-icon--off { opacity: 1; transform: scale(1); }

/* 활성: filled 표시 */
.tab-link--active .tab-icon--on  { opacity: 1; transform: scale(1); }
.tab-link--active .tab-icon--off { opacity: 0; transform: scale(0.88); }

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

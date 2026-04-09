<script setup>
import AppTabBar from '../components/AppTabBar.vue'
import HeaderCharacter from '../components/HeaderMascot/HeaderCharacter.vue'
</script>

<template>
  <div class="app-root">
    <div class="app-shell" role="application">
      <header class="app-header">
        <!-- 배경 장식 -->
        <div class="app-header__orb app-header__orb--1" aria-hidden="true" />
        <div class="app-header__orb app-header__orb--2" aria-hidden="true" />
        <div class="app-header__lines" aria-hidden="true" />

        <!-- 브랜드 -->
        <div class="app-header__inner">
          <div class="app-header__brand">
            <span class="app-header__badge">MY BUDGET</span>
            <h1 class="app-title">씀씀</h1>
            <p class="app-tagline">스마트하게 기록하는 소비 습관</p>
          </div>
        </div>

        <!-- 유형별 캐릭터 마스코트 -->
        <HeaderCharacter />
      </header>

      <main class="app-main">
        <RouterView />
      </main>

      <AppTabBar />
    </div>
  </div>
</template>

<style scoped>
.app-root {
  height: 100%;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 0;
  box-sizing: border-box;
  background: #e8e0d0;
}

.app-shell {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-bg-page);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.04),
    0 24px 64px rgba(0, 0, 0, 0.1);
}

@media (max-width: 430px) {
  .app-root {
    background: none;
  }
  .app-shell {
    box-shadow: none;
    max-width: none;
  }
}

/* ── Header ──────────────────────────────── */
.app-header {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  padding: 0 1.5rem 1.25rem;
  padding-top: max(1.125rem, env(safe-area-inset-top));
  background: var(--gradient-header);
  box-shadow: var(--shadow-header);
}

/* 배경 장식: 큰 원형 orb */
.app-header__orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.app-header__orb--1 {
  width: 240px;
  height: 240px;
  top: -100px;
  right: -60px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.06) 50%,
    transparent 72%
  );
}

.app-header__orb--2 {
  width: 120px;
  height: 120px;
  bottom: -40px;
  left: 60px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
}

/* 사선 라인 텍스처 */
.app-header__lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.04) 0px,
    rgba(255, 255, 255, 0.04) 1px,
    transparent 1px,
    transparent 12px
  );
}

/* 브랜드 영역 */
.app-header__inner {
  position: relative;
  z-index: 1;
}

.app-header__badge {
  display: inline-block;
  margin-bottom: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  background: rgba(120, 53, 15, 0.14);
  border: 1px solid rgba(120, 53, 15, 0.18);
  font-family: var(--font-display);
  font-size: var(--text-2xs);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-brand-text);
  backdrop-filter: blur(4px);
}

.app-title {
  margin: 0 0 0.15rem;
  font-family: var(--font-wordmark);
  font-size: clamp(2.5rem, 14vw, 3.25rem);
  font-weight: 400;
  letter-spacing: 0.06em;
  line-height: 1;
  color: var(--color-brand-text);
  text-shadow:
    0 1px 0 rgba(255, 255, 255, 0.55),
    0 2px 6px rgba(120, 53, 15, 0.2);
}

.app-tagline {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.03em;
  color: rgba(120, 53, 15, 0.65);
  line-height: 1;
}

/* ── Main ────────────────────────────────── */
.app-main {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
</style>

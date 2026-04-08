<script setup>
import { computed } from 'vue';
import { buildPieSlices } from '@/utils/statsPie';

const props = defineProps({
  slices: {
    type: Array,
    default: () => [],
  },
  /** viewBox 한 변 길이 (정사각형) */
  size: {
    type: Number,
    default: 300,
  },
  emptyHint: {
    type: String,
    default: '내역이 없습니다.',
  },
});

const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
/** 차트 세로를 줄이기 위해 반지름·라벨 거리 축소 */
const r = computed(() => Math.round(props.size * 0.2));
const labelRadius = computed(() => Math.round(props.size * 0.36));

const pieSlices = computed(() =>
  buildPieSlices(props.slices, {
    cx: cx.value,
    cy: cy.value,
    r: r.value,
    labelRadius: labelRadius.value,
  })
);

const hasData = computed(() => pieSlices.value.length > 0);
</script>

<template>
  <div class="chart-panel">
    <div v-if="hasData" class="chart-svg-wrap">
      <svg
        class="chart-svg"
        :viewBox="`0 0 ${size} ${size}`"
        aria-hidden="true"
      >
        <template v-for="(slice, idx) in pieSlices" :key="slice.category + idx">
          <circle
            v-if="slice.fullCircle"
            :cx="cx"
            :cy="cy"
            :r="r"
            :fill="slice.color"
            stroke="#fff"
            stroke-width="1"
          />
          <path
            v-else
            :d="slice.d"
            :fill="slice.color"
            stroke="#fff"
            stroke-width="1.25"
          />
          <line
            :x1="slice.line.x1"
            :y1="slice.line.y1"
            :x2="slice.line.x2"
            :y2="slice.line.y2"
            stroke="#e8e8ed"
            stroke-width="0.9"
          />
          <text
            :text-anchor="slice.label.anchor"
            :x="slice.label.x"
            :y="slice.label.y"
            class="chart-label"
          >
            <tspan :x="slice.label.x" dy="-0.3em">
              {{ slice.label.title }}
            </tspan>
            <tspan :x="slice.label.x" dy="1.05em" class="chart-label__pct">
              {{ slice.label.pct }}
            </tspan>
          </text>
        </template>
      </svg>
    </div>

    <p v-else class="chart-empty">{{ emptyHint }}</p>
  </div>
</template>

<style scoped>
.chart-panel {
  padding: 0.35rem 0 0;
  background: transparent;
}

.chart-svg-wrap {
  width: 100%;
  max-width: min(100%, 340px);
  margin: 0 auto;
}

.chart-svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}

.chart-label {
  font-size: 10px;
  font-weight: 600;
  fill: #3a3a3c;
}

.chart-label__pct {
  font-weight: 500;
  fill: #8e8e93;
  font-size: 9px;
}

.chart-empty {
  margin: 0;
  padding: 1.25rem 0.75rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.45;
}
</style>

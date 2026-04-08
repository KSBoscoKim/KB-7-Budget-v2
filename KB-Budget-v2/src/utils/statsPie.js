/** 참고 UI: 큰 비중일수록 붉은 계열 → 작을수록 초록 계열 */
export const WARM_PALETTE = [
  '#ef4444',
  '#f97316',
  '#fb923c',
  '#fbbf24',
  '#fde047',
  '#a3e635',
  '#4ade80',
  '#22c55e',
]

export function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

export function donutSlicePath(cx, cy, r, startDeg, endDeg) {
  const start = polar(cx, cy, r, startDeg)
  const end = polar(cx, cy, r, endDeg)
  const delta = endDeg - startDeg
  const largeArc = delta > 180 ? 1 : 0
  return [
    'M',
    cx,
    cy,
    'L',
    start.x,
    start.y,
    'A',
    r,
    r,
    0,
    largeArc,
    1,
    end.x,
    end.y,
    'Z',
  ].join(' ')
}

/**
 * @param {Array<{ category: string, amount: number, percent: number }>} rows
 * @param {{ cx: number, cy: number, r: number, labelRadius: number }} opts
 */
export function buildPieSlices(rows, opts) {
  const { cx, cy, r, labelRadius } = opts
  const total = rows.reduce((s, row) => s + row.amount, 0)
  if (total <= 0 || !rows.length) return []

  let angle = 0
  return rows.map((row, i) => {
    const sweep = (row.amount / total) * 360
    const startDeg = angle
    const endDeg = angle + sweep
    angle = endDeg

    const color = WARM_PALETTE[Math.min(i, WARM_PALETTE.length - 1)]
    const midDeg = startDeg + sweep / 2
    const fullCircle = rows.length === 1 && sweep >= 359.99

    const edge = polar(cx, cy, r, midDeg)
    const lineEnd = polar(cx, cy, r + Math.round(r * 0.18), midDeg)
    const labelPos = polar(cx, cy, labelRadius, midDeg)
    const anchor = labelPos.x >= cx ? 'start' : 'end'
    const dx = anchor === 'start' ? 3 : -3

    return {
      category: row.category,
      amount: row.amount,
      percent: row.percent,
      color,
      fullCircle,
      d: fullCircle ? null : donutSlicePath(cx, cy, r, startDeg, endDeg),
      line: { x1: edge.x, y1: edge.y, x2: lineEnd.x, y2: lineEnd.y },
      label: {
        x: labelPos.x + dx,
        y: labelPos.y,
        anchor,
        title: row.category,
        pct: `${row.percent.toFixed(1)}%`,
      },
    }
  })
}

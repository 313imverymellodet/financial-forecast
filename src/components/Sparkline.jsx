// Compact projected-balance trajectory. Reinforces the "forecast" concept and
// colors itself by the weather outlook (storm/cloudy/clear).
export default function Sparkline({ series, kind }) {
  const balances = series.map((e) => e.balance)
  if (balances.length < 2) return null

  const W = 320
  const H = 60
  const padY = 8

  // Always include the zero line in the domain so "above/below water" is legible.
  const dataMin = Math.min(...balances)
  const dataMax = Math.max(...balances)
  const min = Math.min(0, dataMin)
  const max = Math.max(0, dataMax)
  const span = max - min || 1

  const x = (i) => (i / (balances.length - 1)) * W
  const y = (v) => H - padY - ((v - min) / span) * (H - 2 * padY)
  const zeroY = y(0)

  const linePoints = balances.map((b, i) => `${x(i).toFixed(1)},${y(b).toFixed(1)}`)
  const linePath = `M ${linePoints.join(' L ')}`
  const areaPath = `${linePath} L ${W},${zeroY.toFixed(1)} L 0,${zeroY.toFixed(1)} Z`

  // Low point marker.
  const lowIdx = balances.indexOf(dataMin)
  const crossesZero = dataMin < 0

  const gradId = `spark-grad-${kind}`

  return (
    <div className={`sparkline ${kind}`}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="sparkline-svg" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {crossesZero && (
          <line
            x1="0" y1={zeroY} x2={W} y2={zeroY}
            className="spark-zero" vectorEffect="non-scaling-stroke"
          />
        )}

        <path d={areaPath} fill={`url(#${gradId})`} />
        <path
          d={linePath} fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"
        />
        <circle cx={x(lowIdx)} cy={y(dataMin)} r="3" className="spark-dot" />
      </svg>
    </div>
  )
}

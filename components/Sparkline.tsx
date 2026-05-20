interface Props {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export default function Sparkline({ data, width = 100, height = 28, color = '#2D7DD2' }: Props) {
  if (data.length === 0) return null
  const max = Math.max(...data, 1)
  const stepX = width / (data.length - 1 || 1)
  const points = data
    .map((v, i) => `${(i * stepX).toFixed(1)},${(height - (v / max) * height).toFixed(1)}`)
    .join(' ')
  const lastY = height - (data[data.length - 1] / max) * height
  const lastX = (data.length - 1) * stepX

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r={2.5} fill={color} />
    </svg>
  )
}

// Full currency: $1,000.00
export function formatCurrency(n) {
  const neg = n < 0
  const abs = Math.abs(n)
  const s = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${neg ? '-' : ''}$${s}`
}

// Compact pill: $1k, $1.1k, $150, -$50
export function formatShort(n) {
  const neg = n < 0
  const abs = Math.abs(n)
  let out
  if (abs >= 1000) {
    const k = abs / 1000
    out = `$${(Math.round(k * 10) / 10).toString()}k`
  } else {
    out = `$${Math.round(abs)}`
  }
  return neg ? `-${out}` : out
}

// Signed amount for a transaction chip: +$1k / -$50
export function formatSigned(n) {
  const sign = n >= 0 ? '+' : '-'
  return `${sign}${formatShort(Math.abs(n)).replace('-', '')}`
}

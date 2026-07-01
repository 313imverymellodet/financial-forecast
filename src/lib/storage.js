import { dayKey, startOfDay, addDays } from './date.js'

const KEY = 'financial-forecast/v1'
const SCHEMA = 1

// Example transactions, anchored relative to today so the demo always shows
// activity. Offered during onboarding — never forced on a real user.
export function sampleTransactions() {
  const today = startOfDay(new Date())
  const mk = (id, category, amount, recurrence, offset) => ({
    id,
    category,
    label: '',
    amount,
    recurrence,
    date: dayKey(addDays(today, offset)),
  })
  return [
    mk('t-rent', 'rent', -800, 'monthly', 2),
    mk('t-groceries', 'groceries', -50, 'weekly', 3),
    mk('t-job', 'job', 1000, 'biweekly', 4),
    mk('t-gas', 'gas', -50, 'weekly', 5),
    mk('t-music', 'music', -10, 'monthly', 6),
  ]
}

// Fresh, un-onboarded state — no fabricated numbers until the user opts in.
function blankState() {
  return { schema: SCHEMA, onboarded: false, balance: 0, updatedAt: Date.now(), transactions: [] }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return blankState()
    const parsed = JSON.parse(raw)
    return { ...blankState(), ...parsed }
  } catch {
    return blankState()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

// ---- Backup: export / import as JSON ----
export function exportState(state) {
  const payload = {
    app: 'financial-forecast',
    schema: SCHEMA,
    exportedAt: new Date().toISOString(),
    balance: state.balance,
    transactions: state.transactions,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `financial-forecast-backup-${dayKey(new Date())}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Parse an imported backup file, validating shape. Returns { balance, transactions }.
export function parseImport(text) {
  const data = JSON.parse(text)
  if (data.app !== 'financial-forecast' || !Array.isArray(data.transactions)) {
    throw new Error('Not a Financial Forecast backup file.')
  }
  const transactions = data.transactions
    .filter((t) => t && typeof t.amount === 'number' && typeof t.date === 'string')
    .map((t) => ({
      id: t.id || `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category: t.category || 'other',
      label: typeof t.label === 'string' ? t.label : '',
      amount: t.amount,
      date: t.date,
      recurrence: ['once', 'weekly', 'biweekly', 'monthly'].includes(t.recurrence)
        ? t.recurrence
        : 'once',
    }))
  const balance = typeof data.balance === 'number' ? data.balance : 0
  return { balance, transactions }
}

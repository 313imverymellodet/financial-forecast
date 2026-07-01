// Small date helpers — everything works on local-midnight Date objects.

export const MS_DAY = 86400000

export function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function addDays(d, n) {
  const x = startOfDay(d)
  x.setDate(x.getDate() + n)
  return x
}

export function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

// Whole days between two dates (b - a), ignoring time-of-day.
export function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / MS_DAY)
}

// ISO key (YYYY-MM-DD) in local time — used to map transactions to cells.
export function dayKey(d) {
  const x = startOfDay(d)
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, '0')
  const day = String(x.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Build the 6-week grid (Mon-first) that contains `month`.
export function monthGrid(year, month) {
  const first = new Date(year, month, 1)
  // JS: 0=Sun..6=Sat -> shift so Monday=0
  const offset = (first.getDay() + 6) % 7
  const start = addDays(first, -offset)
  const cells = []
  for (let i = 0; i < 42; i++) cells.push(addDays(start, i))
  return cells
}

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export function longDate(d) {
  const x = startOfDay(d)
  return `${WEEKDAY[x.getDay()]}, ${MONTH[x.getMonth()]} ${x.getDate()}`
}

export function shortDate(d) {
  const x = startOfDay(d)
  return `${MONTH[x.getMonth()].slice(0, 3)} ${x.getDate()}`
}

export function monthLabel(year, month) {
  return `${MONTH[month]} ${year}`
}

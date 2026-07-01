import { startOfDay, addDays, daysBetween, dayKey, isSameDay, keyToDate } from './date.js'

// Transactions store their date as a "YYYY-MM-DD" key; parse it in local time
// (new Date("YYYY-MM-DD") would be UTC and drift a day in western timezones).
function txStart(tx) {
  return typeof tx.date === 'string' ? keyToDate(tx.date) : startOfDay(tx.date)
}

// Does a recurring transaction land on `date`?
export function occursOn(tx, date) {
  const start = txStart(tx)
  const day = startOfDay(date)
  if (day < start) return false

  switch (tx.recurrence) {
    case 'once':
      return isSameDay(start, day)
    case 'weekly':
      return daysBetween(start, day) % 7 === 0
    case 'biweekly':
      return daysBetween(start, day) % 14 === 0
    case 'monthly':
      // Match the day-of-month, clamping for short months (e.g. 31st -> Feb 28).
      return day.getDate() === Math.min(start.getDate(), daysInMonth(day)) &&
        (day.getFullYear() > start.getFullYear() ||
         (day.getFullYear() === start.getFullYear() && day.getMonth() >= start.getMonth()))
    default:
      return false
  }
}

function daysInMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

// All transaction instances that fall on a given date.
export function transactionsOn(transactions, date) {
  return transactions.filter((t) => occursOn(t, date))
}

// Running-balance forecast for `days` starting at `startDate`.
// Returns a Map keyed by dayKey -> { date, balance, transactions }.
export function buildForecast(startBalance, startDate, transactions, days) {
  const map = new Map()
  let balance = startBalance
  const from = startOfDay(startDate)
  for (let i = 0; i < days; i++) {
    const date = addDays(from, i)
    const txs = transactionsOn(transactions, date)
    const dayDelta = txs.reduce((s, t) => s + t.amount, 0)
    balance += dayDelta
    map.set(dayKey(date), { date, balance, transactions: txs })
  }
  return map
}

// Weather status from the forecast: find the lowest projected balance ahead.
export function weatherFor(forecast) {
  let min = Infinity
  let minEntry = null
  for (const entry of forecast.values()) {
    if (entry.balance < min) {
      min = entry.balance
      minEntry = entry
    }
  }
  if (!minEntry) {
    return { kind: 'clear', min: 0, date: null }
  }
  let kind = 'clear'
  if (min < 0) kind = 'storm'
  else if (min < 200) kind = 'cloudy'
  return { kind, min, date: minEntry.date }
}

export const WEATHER = {
  storm:  { title: 'Storm Warning', emoji: '🌧️', className: 'storm' },
  cloudy: { title: 'Partly Cloudy', emoji: '⛅', className: 'cloudy' },
  clear:  { title: 'Clear Skies',   emoji: '☀️', className: 'clear' },
}

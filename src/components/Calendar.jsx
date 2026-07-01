import { monthGrid, dayKey, monthLabel, shortDate } from '../lib/date.js'
import { CATEGORIES } from '../lib/categories.js'
import { formatShort, formatSigned } from '../lib/format.js'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Calendar({ viewMonth, onChangeMonth, today, forecast, selectedKey, onSelect, onToday }) {
  const { year, month } = viewMonth
  const cells = monthGrid(year, month)
  const todayKey = dayKey(today)
  const onCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  function shift(delta) {
    const d = new Date(year, month + delta, 1)
    onChangeMonth({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <div className="calendar">
      <div className="cal-nav">
        <button className="icon-btn" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
        <span className="cal-month">
          {monthLabel(year, month)}
          {!onCurrentMonth && (
            <button className="today-btn" onClick={onToday}>Today</button>
          )}
        </span>
        <button className="icon-btn" onClick={() => shift(1)} aria-label="Next month">›</button>
      </div>

      <div className="cal-weekdays">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="cal-weekday">{w}</div>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((date) => {
          const key = dayKey(date)
          const inMonth = date.getMonth() === month
          const isToday = key === todayKey
          const isSelected = key === selectedKey
          const entry = forecast.get(key)
          return (
            <button
              key={key}
              className={
                'cal-cell' +
                (inMonth ? '' : ' out') +
                (isSelected ? ' selected' : '') +
                (isToday ? ' today' : '')
              }
              onClick={() => onSelect(key)}
            >
              <div className="cell-num">{date.getDate() === 1 ? shortDate(date) : date.getDate()}</div>
              {entry && <div className="cell-balance">{formatShort(entry.balance)}</div>}
              <div className="cell-txs">
                {entry?.transactions.map((tx) => {
                  const cat = CATEGORIES[tx.category] || CATEGORIES.other
                  return (
                    <div key={tx.id} className={`chip cat-${cat.color}`}>
                      <span className="chip-emoji">{cat.emoji}</span>
                      <span className="chip-label">{tx.label || cat.label}</span>
                      <span className="chip-amt">{formatSigned(tx.amount)}</span>
                    </div>
                  )
                })}
                {isSelected && entry && entry.transactions.length === 0 && (
                  <div className="cell-empty">No plans today!</div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

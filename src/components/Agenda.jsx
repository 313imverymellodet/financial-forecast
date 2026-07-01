import { CATEGORIES, RECURRENCE } from '../lib/categories.js'
import { formatShort, formatSigned } from '../lib/format.js'
import { longDate, isSameDay } from '../lib/date.js'

// Chronological list of upcoming money movements — the counterpart to the
// calendar for people who think in lists rather than grids.
export default function Agenda({ forecast, today, onEditTx }) {
  const days = [...forecast.values()].filter((d) => d.transactions.length > 0)

  if (days.length === 0) {
    return (
      <div className="agenda">
        <div className="agenda-empty">Nothing scheduled ahead. Tap + to add something.</div>
      </div>
    )
  }

  return (
    <div className="agenda">
      {days.map((day) => {
        const negative = day.balance < 0
        return (
          <div className="agenda-day" key={day.date.getTime()}>
            <div className="agenda-day-head">
              <span className="agenda-date">
                {isSameDay(day.date, today) ? 'Today' : longDate(day.date)}
              </span>
              <span className={'agenda-bal' + (negative ? ' negative' : '')}>
                {formatShort(day.balance)}
              </span>
            </div>
            {day.transactions.map((tx) => {
              const cat = CATEGORIES[tx.category] || CATEGORIES.other
              const income = tx.amount >= 0
              return (
                <button
                  className="agenda-row"
                  key={tx.id}
                  onClick={() => onEditTx(tx)}
                >
                  <span className={`dot cat-${cat.color}`}>{cat.emoji}</span>
                  <span className="agenda-row-main">
                    <span className="agenda-row-title">{tx.label || cat.label}</span>
                    <span className="agenda-row-sub">{RECURRENCE[tx.recurrence]}</span>
                  </span>
                  <span className={'agenda-amt ' + (income ? 'pos' : 'neg')}>
                    {formatSigned(tx.amount)}
                  </span>
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

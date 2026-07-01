import { keyToDate, longDate } from '../lib/date.js'
import { CATEGORIES, RECURRENCE } from '../lib/categories.js'
import { formatCurrency, formatSigned } from '../lib/format.js'

export default function DaySheet({ dayKey, forecast, onClose, onAdd, onEdit, onDelete }) {
  const date = keyToDate(dayKey)
  const entry = forecast.get(dayKey)
  const txs = entry?.transactions || []

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber" />
        <div className="sheet-head">
          <div>
            <div className="sheet-date">{longDate(date)}</div>
            {entry && (
              <div className="sheet-balance">
                Projected balance {formatCurrency(entry.balance)}
              </div>
            )}
          </div>
          <button className="pill-btn" onClick={onAdd}>+ Add</button>
        </div>

        <div className="sheet-list">
          {txs.length === 0 && <div className="sheet-empty">No plans today!</div>}
          {txs.map((tx) => {
            const cat = CATEGORIES[tx.category] || CATEGORIES.other
            return (
              <div key={tx.id} className="sheet-row" onClick={() => onEdit(tx)}>
                <span className={`dot cat-${cat.color}`}>{cat.emoji}</span>
                <div className="sheet-row-main">
                  <div className="sheet-row-title">{tx.label || cat.label}</div>
                  <div className="sheet-row-sub">{RECURRENCE[tx.recurrence]}</div>
                </div>
                <span className={'sheet-amt ' + (tx.amount >= 0 ? 'pos' : 'neg')}>
                  {formatSigned(tx.amount)}
                </span>
                <button
                  className="row-del"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(tx.id)
                  }}
                  aria-label="Delete"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>

        <button className="sheet-close" onClick={onClose}>Done</button>
      </div>
    </div>
  )
}

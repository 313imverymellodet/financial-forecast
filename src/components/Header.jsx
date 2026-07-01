import { longDate } from '../lib/date.js'
import { formatCurrency } from '../lib/format.js'

function timeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 1) return 'Updated just now'
  if (mins === 1) return 'Updated 1 minute ago'
  if (mins < 60) return `Updated ${mins} minutes ago`
  const hrs = Math.floor(mins / 60)
  if (hrs === 1) return 'Updated 1 hour ago'
  if (hrs < 24) return `Updated ${hrs} hours ago`
  const days = Math.floor(hrs / 24)
  return days === 1 ? 'Updated 1 day ago' : `Updated ${days} days ago`
}

export default function Header({ today, balance, updatedAt, onMenu }) {
  return (
    <header className="header">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className="header-row">
        <div>
          <h1 className="title">Financial Forecast</h1>
          <p className="subtitle">{longDate(today)}</p>
        </div>
        <div className="balance">
          <div className="balance-amount">{formatCurrency(balance)}</div>
          <div className="balance-updated">{timeAgo(updatedAt)}</div>
        </div>
      </div>
    </header>
  )
}

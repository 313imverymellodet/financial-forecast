import { longDate } from '../lib/date.js'
import { formatCurrency } from '../lib/format.js'

export default function Header({ today, balance, onMenu, onEditBalance }) {
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
        <button className="balance" onClick={onEditBalance} aria-label="Edit balance">
          <div className="balance-amount" key={balance}>{formatCurrency(balance)}</div>
          <div className="balance-updated">Starting balance · Edit</div>
        </button>
      </div>
    </header>
  )
}

import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, RECURRENCE } from '../lib/categories.js'
import { formatSigned } from '../lib/format.js'
import { isStandalone } from '../lib/platform.js'

export default function Menu({
  state, onClose, onSetBalance, onEditTx, onDeleteTx, onExport, onImport, onInstall, onReset,
}) {
  const [draft, setDraft] = useState(String(state.balance))

  // B3: commit on blur AND on unmount — Esc/backdrop closes the drawer without
  // firing blur, which used to silently discard a typed balance.
  const commitRef = useRef(() => {})
  commitRef.current = () => {
    const v = parseFloat(draft)
    if (Number.isFinite(v) && v !== state.balance) onSetBalance(v)
  }
  useEffect(() => () => commitRef.current(), [])

  function commitBalance() {
    commitRef.current()
  }

  function confirmReset() {
    if (confirm('Erase all data and start over? This cannot be undone.')) onReset()
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="field">
          <span>Starting balance (before today's scheduled items)</span>
          <div className="amount-input">
            <span className="amount-sign">$</span>
            <input
              type="number"
              step="0.01"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitBalance}
            />
          </div>
        </div>

        <div className="drawer-section-title">Scheduled transactions</div>
        <div className="drawer-list">
          {state.transactions.length === 0 && (
            <div className="sheet-empty">Nothing scheduled yet.</div>
          )}
          {state.transactions.map((tx) => {
            const cat = CATEGORIES[tx.category] || CATEGORIES.other
            return (
              <div key={tx.id} className="drawer-row" onClick={() => onEditTx(tx)}>
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
                    onDeleteTx(tx.id)
                  }}
                  aria-label="Delete"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>

        {!isStandalone() && (
          <>
            <div className="drawer-section-title">App</div>
            <button className="btn-ghost btn-block" onClick={onInstall}>📲 Add to Home Screen</button>
          </>
        )}

        <div className="drawer-section-title">Backup</div>
        <div className="drawer-actions">
          <button className="btn-ghost" onClick={onExport}>Export backup</button>
          <button className="btn-ghost" onClick={onImport}>Import backup</button>
        </div>

        <button className="btn-reset" onClick={confirmReset}>Erase all data</button>

        <div className="drawer-about">Financial Forecast · v1.0</div>
      </div>
    </div>
  )
}

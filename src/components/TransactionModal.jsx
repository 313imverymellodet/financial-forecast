import { useState } from 'react'
import { CATEGORIES, CATEGORY_KEYS, RECURRENCE } from '../lib/categories.js'
import { dayKey, startOfDay } from '../lib/date.js'

export default function TransactionModal({ initial, onClose, onSave, onDelete }) {
  const isEdit = Boolean(initial.id)
  const [kind, setKind] = useState(initial.amount > 0 ? 'income' : 'expense')
  const [category, setCategory] = useState(initial.category || 'groceries')
  const [label, setLabel] = useState(initial.label || '')
  const [amount, setAmount] = useState(
    initial.amount != null ? String(Math.abs(initial.amount)) : ''
  )
  const [date, setDate] = useState(initial.date || dayKey(startOfDay(new Date())))
  const [recurrence, setRecurrence] = useState(initial.recurrence || 'once')

  function submit(e) {
    e.preventDefault()
    const value = Math.abs(parseFloat(amount) || 0)
    if (value === 0) return
    onSave({
      id: initial.id || `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category,
      label: label.trim(),
      amount: kind === 'income' ? value : -value,
      date,
      recurrence,
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <h2>{isEdit ? 'Edit transaction' : 'New transaction'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="segmented">
          <button
            type="button"
            className={kind === 'expense' ? 'active' : ''}
            onClick={() => setKind('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={kind === 'income' ? 'active' : ''}
            onClick={() => setKind('income')}
          >
            Income
          </button>
        </div>

        <label className="field">
          <span>Category</span>
          <div className="cat-grid">
            {CATEGORY_KEYS.map((k) => (
              <button
                type="button"
                key={k}
                className={'cat-choice cat-' + CATEGORIES[k].color + (category === k ? ' on' : '')}
                onClick={() => setCategory(k)}
              >
                <span>{CATEGORIES[k].emoji}</span>
                <span className="cat-choice-label">{CATEGORIES[k].label}</span>
              </button>
            ))}
          </div>
        </label>

        <label className="field">
          <span>Label (optional)</span>
          <input
            type="text"
            value={label}
            placeholder={CATEGORIES[category].label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Amount</span>
          <div className="amount-input">
            <span className="amount-sign">{kind === 'income' ? '+$' : '-$'}</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={amount}
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
        </label>

        <label className="field">
          <span>Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <label className="field">
          <span>Repeat</span>
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
            {Object.entries(RECURRENCE).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>

        <div className="modal-actions">
          {onDelete && (
            <button type="button" className="btn-danger" onClick={onDelete}>Delete</button>
          )}
          <button type="submit" className="btn-primary">{isEdit ? 'Save' : 'Add'}</button>
        </div>
      </form>
    </div>
  )
}

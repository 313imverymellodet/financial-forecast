import { useEffect, useMemo, useRef, useState } from 'react'
import {
  loadState, saveState, clearState, sampleTransactions, exportState, parseImport,
} from './lib/storage.js'
import { buildForecast, weatherFor } from './lib/forecast.js'
import { startOfDay, dayKey } from './lib/date.js'
import { CATEGORIES } from './lib/categories.js'
import Header from './components/Header.jsx'
import WeatherBanner from './components/WeatherBanner.jsx'
import Calendar from './components/Calendar.jsx'
import DaySheet from './components/DaySheet.jsx'
import TransactionModal from './components/TransactionModal.jsx'
import Menu from './components/Menu.jsx'
import Onboarding from './components/Onboarding.jsx'
import Sparkline from './components/Sparkline.jsx'
import Agenda from './components/Agenda.jsx'
import InstallGuide from './components/InstallGuide.jsx'

const FORECAST_DAYS = 120

export default function App() {
  const [state, setState] = useState(loadState)
  const [today, setToday] = useState(() => startOfDay(new Date()))
  const [selectedKey, setSelectedKey] = useState(() => dayKey(today))
  const todayRef = useRef(today)
  todayRef.current = today
  const [viewMonth, setViewMonth] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const [sheetOpen, setSheetOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(null) // null = closed, {} = new, tx = edit
  const [view, setView] = useState('calendar') // 'calendar' | 'agenda'
  const [installOpen, setInstallOpen] = useState(false)
  const importRef = useRef(null)

  useEffect(() => saveState(state), [state])

  // B1: refresh "today" when the app wakes on a new day — installed PWAs stay
  // in memory across midnights, and everything anchors to this date.
  useEffect(() => {
    function refresh() {
      const now = startOfDay(new Date())
      if (now.getTime() === todayRef.current.getTime()) return
      const prevKey = dayKey(todayRef.current)
      setToday(now)
      setSelectedKey((k) => (k === prevKey ? dayKey(now) : k))
    }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  // Escape closes the top-most layer.
  useEffect(() => {
    function onKey(e) {
      if (e.key !== 'Escape') return
      if (installOpen) setInstallOpen(false)
      else if (editing) setEditing(null)
      else if (sheetOpen) setSheetOpen(false)
      else if (menuOpen) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editing, sheetOpen, menuOpen, installOpen])

  const forecast = useMemo(
    () => buildForecast(state.balance, today, state.transactions, FORECAST_DAYS),
    [state.balance, state.transactions, today]
  )
  const weather = useMemo(() => weatherFor(forecast), [forecast])
  // B6: chart the same window the weather banner scans, so the two never disagree.
  const sparkSeries = useMemo(() => [...forecast.values()], [forecast])

  function completeOnboarding({ balance, withSample }) {
    setState({
      schema: 1,
      onboarded: true,
      balance,
      updatedAt: Date.now(),
      transactions: withSample ? sampleTransactions() : [],
    })
  }

  function upsertTransaction(tx) {
    setState((s) => {
      const exists = s.transactions.some((t) => t.id === tx.id)
      const transactions = exists
        ? s.transactions.map((t) => (t.id === tx.id ? tx : t))
        : [...s.transactions, tx]
      return { ...s, transactions }
    })
  }

  // B2: recurring rows look like "remove from this day" but delete the whole
  // series — confirm with recurrence-aware copy. Returns false on cancel so
  // callers (the edit modal) can stay open.
  function deleteTransaction(id) {
    const tx = state.transactions.find((t) => t.id === id)
    if (!tx) return false
    const label = tx.label || (CATEGORIES[tx.category] || CATEGORIES.other).label
    const msg =
      tx.recurrence === 'once'
        ? `Delete "${label}"?`
        : `"${label}" repeats — deleting it removes every occurrence from the forecast. Delete it?`
    if (!confirm(msg)) return false
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }))
    return true
  }

  function setBalance(balance) {
    setState((s) => ({ ...s, balance, updatedAt: Date.now() }))
  }

  function resetApp() {
    clearState()
    setState(loadState())
    setMenuOpen(false)
  }

  async function handleImportFile(file) {
    try {
      const text = await file.text()
      const { balance, transactions } = parseImport(text)
      setState((s) => ({ ...s, balance, transactions, updatedAt: Date.now() }))
      alert('Backup restored.')
    } catch (err) {
      alert(`Couldn't import: ${err.message}`)
    }
  }

  function openNewFor(key) {
    setEditing({ date: key || selectedKey })
  }

  function goToToday() {
    setViewMonth({ year: today.getFullYear(), month: today.getMonth() })
    setSelectedKey(dayKey(today))
  }

  if (!state.onboarded) {
    return <Onboarding onComplete={completeOnboarding} />
  }

  return (
    <div className="app">
      <Header
        today={today}
        balance={state.balance}
        onMenu={() => setMenuOpen(true)}
        onEditBalance={() => setMenuOpen(true)}
      />

      <WeatherBanner key={weather.kind} weather={weather} onEdit={() => setMenuOpen(true)} />

      <Sparkline series={sparkSeries} kind={weather.kind} />

      <div className="view-toggle" role="tablist">
        <button
          role="tab"
          aria-selected={view === 'calendar'}
          className={view === 'calendar' ? 'active' : ''}
          onClick={() => setView('calendar')}
        >
          Calendar
        </button>
        <button
          role="tab"
          aria-selected={view === 'agenda'}
          className={view === 'agenda' ? 'active' : ''}
          onClick={() => setView('agenda')}
        >
          Upcoming
        </button>
      </div>

      {view === 'calendar' ? (
        <Calendar
          viewMonth={viewMonth}
          onChangeMonth={setViewMonth}
          today={today}
          forecast={forecast}
          selectedKey={selectedKey}
          onSelect={(key) => {
            setSelectedKey(key)
            setSheetOpen(true)
          }}
          onToday={goToToday}
        />
      ) : (
        <Agenda forecast={forecast} today={today} onEditTx={(tx) => setEditing(tx)} />
      )}

      {state.transactions.length === 0 && (
        <p className="empty-hint">
          Your calendar is clear. Tap <strong>+</strong> to schedule your first paycheck or bill.
        </p>
      )}

      <button className="fab" onClick={() => openNewFor(selectedKey)} aria-label="Add transaction">
        +
      </button>

      {sheetOpen && (
        <DaySheet
          dayKey={selectedKey}
          forecast={forecast}
          onClose={() => setSheetOpen(false)}
          onAdd={() => openNewFor(selectedKey)}
          onEdit={(tx) => setEditing(tx)}
          onDelete={deleteTransaction}
        />
      )}

      {editing && (
        <TransactionModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(tx) => {
            upsertTransaction(tx)
            setEditing(null)
          }}
          onDelete={
            editing.id
              ? () => {
                  if (deleteTransaction(editing.id)) setEditing(null)
                }
              : null
          }
        />
      )}

      {menuOpen && (
        <Menu
          state={state}
          onClose={() => setMenuOpen(false)}
          onSetBalance={setBalance}
          onEditTx={(tx) => {
            setEditing(tx)
            setMenuOpen(false)
          }}
          onDeleteTx={deleteTransaction}
          onExport={() => exportState(state)}
          onImport={() => importRef.current?.click()}
          onInstall={() => {
            setMenuOpen(false)
            setInstallOpen(true)
          }}
          onReset={resetApp}
        />
      )}

      {installOpen && (
        <div className="modal-backdrop" onClick={() => setInstallOpen(false)}>
          <div className="modal install-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Add to Home Screen</h2>
              <button className="icon-btn" onClick={() => setInstallOpen(false)} aria-label="Close">✕</button>
            </div>
            <InstallGuide />
            <button className="btn-primary" onClick={() => setInstallOpen(false)}>Got it</button>
          </div>
        </div>
      )}

      <input
        ref={importRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImportFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

import { useMemo, useState } from 'react'
import InstallGuide from './InstallGuide.jsx'
import { isStandalone } from '../lib/platform.js'

export default function Onboarding({ onComplete }) {
  // Skip the install step if we're already running as an installed app.
  const steps = useMemo(
    () => ['welcome', 'balance', ...(isStandalone() ? [] : ['install']), 'start'],
    []
  )
  const [i, setI] = useState(0)
  const [balance, setBalance] = useState('')
  const step = steps[i]

  const next = () => setI((n) => Math.min(n + 1, steps.length - 1))
  const back = () => setI((n) => Math.max(n - 1, 0))

  function finish(withSample) {
    const value = parseFloat(balance)
    onComplete({ balance: Number.isNaN(value) ? 0 : value, withSample })
  }

  return (
    <div className="onboard">
      {i > 0 && (
        <button className="onboard-back" onClick={back} aria-label="Go back">‹ Back</button>
      )}

      {step === 'welcome' && (
        <div className="onboard-card">
          <div className="onboard-hero">🌤️</div>
          <h1 className="onboard-title">Financial Forecast</h1>
          <p className="onboard-sub">
            See your balance days and weeks ahead. Schedule the money you know is coming
            and going, and we'll forecast the weather — clear skies or a storm warning.
          </p>
          <button className="btn-primary onboard-btn" onClick={next}>Get started</button>
        </div>
      )}

      {step === 'balance' && (
        <div className="onboard-card">
          <div className="onboard-hero">💵</div>
          <h1 className="onboard-title">What's your balance today?</h1>
          <p className="onboard-sub">
            Your current account balance. Everything you forecast builds from here.
          </p>
          <div className="amount-input onboard-amount">
            <span className="amount-sign">$</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={balance}
              placeholder="0.00"
              onChange={(e) => setBalance(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && balance !== '' && next()}
            />
          </div>
          <button className="btn-primary onboard-btn" disabled={balance === ''} onClick={next}>
            Continue
          </button>
        </div>
      )}

      {step === 'install' && (
        <div className="onboard-card">
          <div className="onboard-hero">📲</div>
          <h1 className="onboard-title">Add it to your home screen</h1>
          <InstallGuide />
          <button className="btn-primary onboard-btn" onClick={next}>Continue</button>
          <button className="btn-ghost onboard-btn" onClick={next}>Maybe later</button>
        </div>
      )}

      {step === 'start' && (
        <div className="onboard-card">
          <div className="onboard-hero">📅</div>
          <h1 className="onboard-title">How do you want to start?</h1>
          <p className="onboard-sub">
            Add example transactions to explore, or start with a clean calendar.
          </p>
          <button className="btn-primary onboard-btn" onClick={() => finish(true)}>
            Start with examples
          </button>
          <button className="btn-ghost onboard-btn" onClick={() => finish(false)}>
            Start fresh
          </button>
        </div>
      )}

      <div className="onboard-dots">
        {steps.map((_, idx) => (
          <span key={idx} className={'dot-tick' + (idx === i ? ' on' : '')} />
        ))}
      </div>
    </div>
  )
}

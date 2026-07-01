import { useState } from 'react'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [balance, setBalance] = useState('')

  function finish(withSample) {
    const value = parseFloat(balance)
    onComplete({ balance: Number.isNaN(value) ? 0 : value, withSample })
  }

  return (
    <div className="onboard">
      {step > 0 && (
        <button className="onboard-back" onClick={() => setStep(step - 1)} aria-label="Go back">
          ‹ Back
        </button>
      )}
      {step === 0 && (
        <div className="onboard-card">
          <div className="onboard-hero">🌤️</div>
          <h1 className="onboard-title">Financial Forecast</h1>
          <p className="onboard-sub">
            See your balance days and weeks ahead. Schedule the money you know is coming
            and going, and we'll forecast the weather — clear skies or a storm warning.
          </p>
          <button className="btn-primary onboard-btn" onClick={() => setStep(1)}>
            Get started
          </button>
        </div>
      )}

      {step === 1 && (
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
              onKeyDown={(e) => e.key === 'Enter' && balance !== '' && setStep(2)}
            />
          </div>
          <button
            className="btn-primary onboard-btn"
            disabled={balance === ''}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
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
        {[0, 1, 2].map((i) => (
          <span key={i} className={'dot-tick' + (i === step ? ' on' : '')} />
        ))}
      </div>
    </div>
  )
}

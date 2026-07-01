import { isIOS } from '../lib/platform.js'

// iOS Safari share glyph — a box with an upward arrow.
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" className="ig-share" aria-hidden="true">
      <path d="M12 3v11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// PlusSquare — the "Add to Home Screen" row glyph.
function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// Steps to add the PWA to the home screen. Tailored for iOS; a generic
// fallback covers Android / desktop browsers.
export default function InstallGuide({ compact }) {
  const ios = isIOS()

  const steps = ios
    ? [
        { icon: <ShareIcon />, text: <>Tap the <strong>Share</strong> button in Safari's toolbar.</> },
        { icon: <AddIcon />, text: <>Scroll down and tap <strong>Add to Home Screen</strong>.</> },
        { icon: <span className="ig-num">✓</span>, text: <>Tap <strong>Add</strong> — then open Forecast from your home screen.</> },
      ]
    : [
        { icon: <ShareIcon />, text: <>Open your browser's menu (<strong>⋮</strong> or Share).</> },
        { icon: <AddIcon />, text: <>Choose <strong>Install</strong> or <strong>Add to Home Screen</strong>.</> },
        { icon: <span className="ig-num">✓</span>, text: <>Confirm — then launch Forecast like any app.</> },
      ]

  return (
    <div className={'install-guide' + (compact ? ' compact' : '')}>
      {!compact && (
        <p className="ig-lead">
          Forecast runs like a native app — no App Store needed. Add it to your home
          screen for full-screen, offline access.
        </p>
      )}
      <ol className="ig-steps">
        {steps.map((s, i) => (
          <li key={i} className="ig-step">
            <span className="ig-step-icon">{s.icon}</span>
            <span className="ig-step-text">{s.text}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

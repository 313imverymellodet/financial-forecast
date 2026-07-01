// Lightweight platform checks for the "Add to Home Screen" flow.

export function isStandalone() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export function isIOS() {
  const ua = window.navigator.userAgent
  const iOSDevice = /iPad|iPhone|iPod/.test(ua)
  // iPadOS 13+ reports as Mac; detect via touch support.
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iOSDevice || iPadOS
}

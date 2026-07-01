import { WEATHER } from '../lib/forecast.js'
import { formatCurrency } from '../lib/format.js'
import { shortDate } from '../lib/date.js'

export default function WeatherBanner({ weather, onEdit }) {
  const meta = WEATHER[weather.kind]
  const when = weather.date ? ` on ${shortDate(weather.date)}` : ''
  return (
    <div className={`weather ${meta.className}`}>
      <span className="weather-emoji">{meta.emoji}</span>
      <div className="weather-text">
        <div className="weather-title">{meta.title}</div>
        <div className="weather-sub">
          Your balance forecast is {formatCurrency(weather.min)}{when}
        </div>
      </div>
      <button className="weather-edit" onClick={onEdit}>Edit</button>
    </div>
  )
}

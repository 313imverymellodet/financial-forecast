// Preset transaction categories — emoji + color pulled from the mockup.
export const CATEGORIES = {
  rent:      { label: 'Rent',      emoji: '🏠', color: 'red' },
  groceries: { label: 'Groceries', emoji: '🛒', color: 'yellow' },
  job:       { label: 'Job',       emoji: '🧑‍🍳', color: 'green' },
  gas:       { label: 'Gas',       emoji: '⛽', color: 'blue' },
  music:     { label: 'Spotify',   emoji: '🎵', color: 'purple' },
  paycheck:  { label: 'Paycheck',  emoji: '💰', color: 'green' },
  dining:    { label: 'Dining',    emoji: '🍔', color: 'orange' },
  shopping:  { label: 'Shopping',  emoji: '🛍️', color: 'pink' },
  bills:     { label: 'Bills',     emoji: '💡', color: 'teal' },
  other:     { label: 'Other',     emoji: '💸', color: 'gray' },
}

export const CATEGORY_KEYS = Object.keys(CATEGORIES)

export const RECURRENCE = {
  once:     'One time',
  weekly:   'Weekly',
  biweekly: 'Every 2 weeks',
  monthly:  'Monthly',
}

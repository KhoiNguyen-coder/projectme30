const MOOD_CONFIG = {
  good: {
    label: 'Sung sức',
    emoji: '💪',
    bg: 'bg-green-500/20',
    text: 'text-green-300',
    border: 'border-green-500/30',
    glow: '0 0 12px rgba(34, 197, 94, 0.3)',
  },
  ok: {
    label: 'Ổn',
    emoji: '👌',
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    border: 'border-yellow-500/30',
    glow: '0 0 12px rgba(234, 179, 8, 0.3)',
  },
  bad: {
    label: 'Mệt',
    emoji: '😮‍💨',
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    border: 'border-red-500/30',
    glow: '0 0 12px rgba(239, 68, 68, 0.3)',
  },
}

export default function MoodBadge({ mood }) {
  const config = MOOD_CONFIG[mood]
  if (!config) return null

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
      style={{ boxShadow: config.glow }}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  )
}

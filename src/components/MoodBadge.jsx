const MOOD_CONFIG = {
  good: { label: 'Sung sức', emoji: '💪', color: 'bg-green-100 text-green-700' },
  ok: { label: 'Ổn', emoji: '👌', color: 'bg-yellow-100 text-yellow-700' },
  bad: { label: 'Mệt', emoji: '😮‍💨', color: 'bg-red-100 text-red-700' },
}

export default function MoodBadge({ mood }) {
  const config = MOOD_CONFIG[mood]
  if (!config) return null

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span>{config.emoji}</span>
      {config.label}
    </span>
  )
}

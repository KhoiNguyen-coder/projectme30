import { useState } from 'react'

const REACTION_TYPES = [
  { type: 'heart', emoji: '❤️', label: 'Tim', glow: 'rgba(239, 68, 68, 0.3)' },
  { type: 'fire', emoji: '🔥', label: 'Lửa', glow: 'rgba(249, 115, 22, 0.3)' },
  { type: 'clap', emoji: '👏', label: 'Vỗ tay', glow: 'rgba(234, 179, 8, 0.3)' },
]

export default function ReactionButtons({ entryId, counts = {}, onReact, disabled }) {
  const [animating, setAnimating] = useState(null)

  const handleReact = async (type) => {
    if (disabled) return
    setAnimating(type)
    await onReact(entryId, type)
    setTimeout(() => setAnimating(null), 600)
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      {REACTION_TYPES.map(({ type, emoji, glow }) => {
        const count = counts[type] || 0
        const isAnimating = animating === type

        return (
          <button
            key={type}
            onClick={() => handleReact(type)}
            disabled={disabled}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
              border transition-all duration-200
              ${disabled
                ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/10'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 cursor-pointer'
              }
              ${isAnimating ? 'animate-reaction-pop' : ''}
            `}
            style={isAnimating ? { boxShadow: `0 0 20px ${glow}` } : {}}
          >
            <span className={isAnimating ? 'animate-bounce' : ''}>{emoji}</span>
            {count > 0 && (
              <span className="text-xs text-white/60 font-semibold">{count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

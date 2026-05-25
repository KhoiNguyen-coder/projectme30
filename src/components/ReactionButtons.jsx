import { useState } from 'react'

const REACTION_TYPES = [
  { type: 'heart', emoji: '❤️', label: 'Tim' },
  { type: 'fire', emoji: '🔥', label: 'Lửa' },
  { type: 'clap', emoji: '👏', label: 'Vỗ tay' },
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
    <div className="flex items-center gap-2 mt-3">
      {REACTION_TYPES.map(({ type, emoji }) => {
        const count = counts[type] || 0
        const isAnimating = animating === type

        return (
          <button
            key={type}
            onClick={() => handleReact(type)}
            disabled={disabled}
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm
              border border-gray-200 transition-all duration-200
              ${disabled
                ? 'opacity-60 cursor-not-allowed bg-gray-50'
                : 'hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95 cursor-pointer'
              }
              ${isAnimating ? 'scale-110' : ''}
            `}
          >
            <span className={`${isAnimating ? 'animate-bounce' : ''}`}>{emoji}</span>
            {count > 0 && (
              <span className="text-xs text-gray-500 font-medium">{count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

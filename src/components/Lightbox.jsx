import { useEffect, useCallback } from 'react'
import MoodBadge from './MoodBadge'
import TagList from './TagList'

export default function Lightbox({ entry, onClose }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!entry) return null

  const { day, date, mood, caption, tags, media_type, media_url, is_fail } = entry

  const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative glass-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-white/10"
        onClick={e => e.stopPropagation()}
        style={{ boxShadow: '0 0 60px rgba(139, 92, 246, 0.15)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer border border-white/10"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Media */}
        {media_type === 'image' && media_url && (
          <img
            src={media_url}
            alt={`Ngày ${day}`}
            className="w-full max-h-[50vh] object-contain bg-black/30 rounded-t-3xl"
          />
        )}

        {media_type === 'video' && media_url && (
          <video
            src={media_url}
            controls
            autoPlay
            className="w-full max-h-[50vh] bg-black rounded-t-3xl"
          />
        )}

        {/* Content */}
        <div className="p-6 relative">
          <div className="day-watermark text-white" style={{ opacity: 0.03, fontSize: '8rem', top: '-20px' }}>{day}</div>

          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white">Ngày {day}</h2>
              <MoodBadge mood={mood} />
            </div>
          </div>

          <p className="text-sm text-white/30 mb-4">{formattedDate}</p>

          <p className={`text-base leading-relaxed ${is_fail ? 'italic text-orange-300/90' : 'text-white/70'}`}>
            {caption}
          </p>

          <div className="mt-4">
            <TagList tags={tags} />
          </div>
        </div>
      </div>
    </div>
  )
}

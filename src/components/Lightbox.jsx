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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors cursor-pointer"
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
            className="w-full max-h-[50vh] object-contain bg-gray-100 rounded-t-2xl"
          />
        )}

        {media_type === 'video' && media_url && (
          <video
            src={media_url}
            controls
            autoPlay
            className="w-full max-h-[50vh] bg-black rounded-t-2xl"
          />
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">Ngày {day}</h2>
              <MoodBadge mood={mood} />
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4">{formattedDate}</p>

          <p className={`text-base leading-relaxed ${is_fail ? 'italic text-orange-700' : 'text-gray-700'}`}>
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

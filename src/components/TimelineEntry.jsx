import MoodBadge from './MoodBadge'
import TagList from './TagList'
import ReactionButtons from './ReactionButtons'

export default function TimelineEntry({
  entry,
  reactions,
  onReact,
  onOpenLightbox,
  isPublic,
  hasReacted,
}) {
  const { day, date, mood, caption, tags, media_type, media_url, is_fail, completed } = entry

  const dotColor = is_fail
    ? 'bg-orange-500'
    : completed
      ? 'bg-green-500'
      : 'bg-gray-300'

  const borderColor = is_fail
    ? 'border-orange-200 bg-orange-50/50'
    : 'border-gray-200 bg-white'

  const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  })

  return (
    <div className="relative flex gap-4 sm:gap-6 pb-8 last:pb-0">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${dotColor} flex-shrink-0 z-10`} />
        <div className="w-0.5 bg-gray-200 flex-1 mt-1" />
      </div>

      {/* Card */}
      <div className={`flex-1 border rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${borderColor} -mt-1`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">Ngày {day}</span>
            <MoodBadge mood={mood} />
          </div>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>

        {/* Media */}
        {media_type === 'image' && media_url && (
          <button
            onClick={() => onOpenLightbox(entry)}
            className="w-full mb-3 rounded-lg overflow-hidden cursor-pointer group"
          >
            <img
              src={media_url}
              alt={`Ngày ${day}`}
              className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        )}

        {media_type === 'video' && media_url && (
          <button
            onClick={() => onOpenLightbox(entry)}
            className="w-full mb-3 rounded-lg overflow-hidden cursor-pointer relative group"
          >
            <video
              src={media_url}
              className="w-full h-48 sm:h-56 object-cover"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </button>
        )}

        {/* Caption */}
        <p className={`text-sm leading-relaxed ${is_fail ? 'italic text-orange-700' : 'text-gray-600'}`}>
          {caption}
        </p>

        {/* Tags */}
        <TagList tags={tags} />

        {/* Reactions (public view) */}
        {isPublic && (
          <ReactionButtons
            entryId={entry.id}
            counts={reactions}
            onReact={onReact}
            disabled={hasReacted}
          />
        )}
      </div>
    </div>
  )
}

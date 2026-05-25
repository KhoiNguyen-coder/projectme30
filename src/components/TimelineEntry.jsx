import { useScrollReveal } from '../hooks/useScrollReveal'
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
  index = 0,
}) {
  const { day, date, mood, caption, tags, media_type, media_url, is_fail, completed } = entry
  const { ref, isVisible } = useScrollReveal()
  const isLeft = index % 2 === 0

  const dotColor = is_fail
    ? 'bg-orange-500'
    : completed
      ? 'bg-green-500'
      : 'bg-white/20'

  const dotGlow = is_fail
    ? 'glow-orange'
    : completed
      ? 'glow-green'
      : ''

  const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
  })

  const cardBorder = is_fail ? 'border-orange-500/30' : 'border-white/10'

  const cardProps = {
    day, date: formattedDate, mood, caption, tags, media_type, media_url, is_fail,
    cardBorder, entry, onOpenLightbox, isPublic, reactions, onReact, hasReacted,
  }

  return (
    <div ref={ref} className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      {/* Desktop zigzag */}
      <div className="hidden md:flex items-start">
        <div className="flex-1">
          {isLeft ? <div className="mr-8"><Card {...cardProps} /></div> : <div />}
        </div>

        <div className="flex flex-col items-center z-10 flex-shrink-0">
          <Dot dotColor={dotColor} dotGlow={dotGlow} completed={completed} is_fail={is_fail} />
          <div className="w-0.5 timeline-line flex-1 min-h-[2rem]" />
        </div>

        <div className="flex-1">
          {!isLeft ? <div className="ml-8"><Card {...cardProps} /></div> : <div />}
        </div>
      </div>

      {/* Mobile — always left-aligned */}
      <div className="md:hidden flex items-start">
        <div className="flex flex-col items-center z-10 flex-shrink-0">
          <Dot dotColor={dotColor} dotGlow={dotGlow} completed={completed} is_fail={is_fail} />
          <div className="w-0.5 timeline-line flex-1 min-h-[2rem]" />
        </div>
        <div className="flex-1 ml-3">
          <Card {...cardProps} />
        </div>
      </div>
    </div>
  )
}

function Dot({ dotColor, dotGlow, completed, is_fail }) {
  return (
    <div className={`relative w-5 h-5 rounded-full ${dotColor} ${dotGlow} border-2 border-white/20 flex-shrink-0`}>
      {completed && !is_fail && (
        <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      {is_fail && (
        <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  )
}

function Card({
  day, date, mood, caption, tags, media_type, media_url, is_fail,
  cardBorder, entry, onOpenLightbox, isPublic, reactions, onReact, hasReacted,
}) {
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 card-hover relative overflow-hidden mb-6 ${cardBorder} ${is_fail ? 'glow-orange' : 'hover:glow-purple'}`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: is_fail ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Day watermark */}
      <div className="day-watermark text-white">{day}</div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-white">Ngày {day}</span>
          <MoodBadge mood={mood} />
        </div>
        <span className="text-xs text-white/30 font-medium">{date}</span>
      </div>

      {/* Media */}
      {media_type === 'image' && media_url && (
        <button
          onClick={() => onOpenLightbox(entry)}
          className="w-full mb-3 rounded-xl overflow-hidden cursor-pointer group relative"
        >
          <img
            src={media_url}
            alt={`Ngày ${day}`}
            className="w-full h-48 sm:h-56 object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      )}

      {media_type === 'video' && media_url && (
        <button
          onClick={() => onOpenLightbox(entry)}
          className="w-full mb-3 rounded-xl overflow-hidden cursor-pointer relative group"
        >
          <video src={media_url} className="w-full h-48 sm:h-56 object-cover" muted preload="metadata" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {/* Caption */}
      <p className={`text-sm leading-relaxed relative z-10 ${is_fail ? 'italic text-orange-300/90' : 'text-white/70'}`}>
        {caption}
      </p>

      <TagList tags={tags} />

      {isPublic && (
        <ReactionButtons
          entryId={entry.id}
          counts={reactions}
          onReact={onReact}
          disabled={hasReacted}
        />
      )}
    </div>
  )
}

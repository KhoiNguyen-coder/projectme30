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
  const isEven = index % 2 === 0

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

  const cardBorder = is_fail
    ? 'border-orange-500/30'
    : 'border-white/10'

  return (
    <div ref={ref} className="relative">
      {/* Desktop zigzag layout */}
      <div className={`
        flex items-start gap-0
        ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
      `}>
        {/* Left side (card or spacer) */}
        <div className={`hidden md:block flex-1 ${isEven ? '' : 'order-3'}`}>
          {isEven && (
            <div className={`mr-8 ${isEven ? 'text-right' : ''}`}>
              <Card
                day={day}
                date={formattedDate}
                mood={mood}
                caption={caption}
                tags={tags}
                media_type={media_type}
                media_url={media_url}
                is_fail={is_fail}
                cardBorder={cardBorder}
                entry={entry}
                onOpenLightbox={onOpenLightbox}
                isPublic={isPublic}
                reactions={reactions}
                onReact={onReact}
                hasReacted={hasReacted}
                alignRight
              />
            </div>
          )}
          {!isEven && <div />}
        </div>

        {/* Center timeline */}
        <div className="flex flex-col items-center z-10 mx-2 md:mx-0">
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
          <div className="w-0.5 timeline-line flex-1 min-h-[2rem]" />
        </div>

        {/* Right side (card or spacer) */}
        <div className={`hidden md:block flex-1 ${isEven ? 'order-3' : ''}`}>
          {!isEven && (
            <div className="ml-8">
              <Card
                day={day}
                date={formattedDate}
                mood={mood}
                caption={caption}
                tags={tags}
                media_type={media_type}
                media_url={media_url}
                is_fail={is_fail}
                cardBorder={cardBorder}
                entry={entry}
                onOpenLightbox={onOpenLightbox}
                isPublic={isPublic}
                reactions={reactions}
                onReact={onReact}
                hasReacted={hasReacted}
              />
            </div>
          )}
          {isEven && <div />}
        </div>

        {/* Mobile layout - always right */}
        <div className="md:hidden flex-1 ml-3">
          <Card
            day={day}
            date={formattedDate}
            mood={mood}
            caption={caption}
            tags={tags}
            media_type={media_type}
            media_url={media_url}
            is_fail={is_fail}
            cardBorder={cardBorder}
            entry={entry}
            onOpenLightbox={onOpenLightbox}
            isPublic={isPublic}
            reactions={reactions}
            onReact={onReact}
            hasReacted={hasReacted}
          />
        </div>
      </div>
    </div>
  )
}

function Card({
  day, date, mood, caption, tags, media_type, media_url, is_fail,
  cardBorder, entry, onOpenLightbox, isPublic, reactions, onReact, hasReacted,
}) {
  return (
    <div className={`
      glass-card rounded-2xl p-4 sm:p-5 card-hover relative overflow-hidden mb-6
      ${cardBorder}
      ${is_fail ? 'glow-orange' : 'hover:glow-purple'}
    `}>
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
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {media_type === 'video' && media_url && (
        <button
          onClick={() => onOpenLightbox(entry)}
          className="w-full mb-3 rounded-xl overflow-hidden cursor-pointer relative group"
        >
          <video
            src={media_url}
            className="w-full h-48 sm:h-56 object-cover"
            muted
            preload="metadata"
          />
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

      {/* Tags */}
      <TagList tags={tags} />

      {/* Reactions */}
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

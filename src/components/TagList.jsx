const TAG_LABELS = {
  'eat-clean': { label: 'Ăn sạch', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  'run-2km': { label: 'Chạy 2km', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  'run-3km': { label: 'Chạy 3km', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  'run-5km': { label: 'Chạy 5km', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  'gym': { label: 'Gym', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  'yoga': { label: 'Yoga', color: 'bg-pink-500/15 text-pink-300 border-pink-500/30' },
  'sleep-early': { label: 'Ngủ sớm', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  'walk': { label: 'Đi bộ', color: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
  'home-workout': { label: 'Tập ở nhà', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  'fail': { label: 'Bại trận', color: 'bg-red-500/15 text-red-300 border-red-500/30' },
}

export default function TagList({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {tags.map(tag => {
        const config = TAG_LABELS[tag] || {
          label: tag,
          color: 'bg-white/10 text-white/50 border-white/15',
        }
        return (
          <span
            key={tag}
            className={`inline-block px-3 py-1 text-[11px] font-semibold rounded-full border ${config.color}`}
          >
            {config.label}
          </span>
        )
      })}
    </div>
  )
}

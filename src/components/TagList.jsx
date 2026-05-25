const TAG_LABELS = {
  'eat-clean': { label: 'Ăn sạch', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  'run-2km': { label: 'Chạy 2km', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  'run-3km': { label: 'Chạy 3km', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  'run-5km': { label: 'Chạy 5km', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  'gym': { label: 'Gym', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  'yoga': { label: 'Yoga', color: 'bg-pink-50 text-pink-600 border-pink-200' },
  'sleep-early': { label: 'Ngủ sớm', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  'walk': { label: 'Đi bộ', color: 'bg-teal-50 text-teal-600 border-teal-200' },
  'home-workout': { label: 'Tập ở nhà', color: 'bg-amber-50 text-amber-600 border-amber-200' },
  'fail': { label: 'Bại trận', color: 'bg-red-50 text-red-600 border-red-200' },
}

export default function TagList({ tags }) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {tags.map(tag => {
        const config = TAG_LABELS[tag] || {
          label: tag,
          color: 'bg-gray-50 text-gray-600 border-gray-200',
        }
        return (
          <span
            key={tag}
            className={`inline-block px-2 py-0.5 text-xs rounded-full border ${config.color}`}
          >
            {config.label}
          </span>
        )
      })}
    </div>
  )
}

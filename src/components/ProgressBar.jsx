export default function ProgressBar({ entries, totalDays = 30 }) {
  const completedDays = entries.filter(e => e.completed && !e.is_fail).length
  const currentDay = entries.length
  const percentage = (completedDays / totalDays) * 100

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Ngày {currentDay} / {totalDays}
        </span>
        <span className="text-sm text-gray-500">
          {completedDays} ngày hoàn thành
        </span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
          }}
        />
      </div>
      <div className="mt-1 text-right">
        <span className="text-xs text-gray-400">{Math.round(percentage)}%</span>
      </div>
    </div>
  )
}

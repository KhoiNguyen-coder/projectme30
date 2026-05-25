export default function EmptyDay({ day }) {
  return (
    <div className="relative flex gap-4 sm:gap-6 pb-8 last:pb-0">
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm bg-gray-300 flex-shrink-0 z-10" />
        <div className="w-0.5 bg-gray-200 flex-1 mt-1" />
      </div>

      <div className="flex-1 border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 -mt-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-400">Ngày {day}</span>
          <span className="text-xs text-gray-300">Sắp tới</span>
        </div>
        <p className="text-xs text-gray-300 mt-1">Chưa có ghi chép...</p>
      </div>
    </div>
  )
}

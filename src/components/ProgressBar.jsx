export default function ProgressBar({ entries, totalDays = 30 }) {
  const completedDays = entries.filter(e => e.completed && !e.is_fail).length
  const failDays = entries.filter(e => e.is_fail).length
  const currentDay = entries.length
  const percentage = Math.round((completedDays / totalDays) * 100)

  const streak = (() => {
    let count = 0
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].completed && !entries[i].is_fail) count++
      else break
    }
    return count
  })()

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 px-4">
      {/* Main day counter — hero style */}
      <div
        className="rounded-3xl px-6 py-5 mb-4 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          {currentDay}<span className="text-white/25 text-3xl sm:text-4xl">/{totalDays}</span>
        </div>
        <div className="text-xs text-white/40 uppercase tracking-[0.2em] mt-1">Ngày đã đi</div>

        {/* Progress bar — bright & glowing */}
        <div className="mt-4 relative">
          <div
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{
                width: `${percentage}%`,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #c084fc)',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'shimmer 2s ease-in-out infinite',
                }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[11px] text-white/30 font-medium">{percentage}% hành trình</span>
            <span className="text-[11px] text-white/30 font-medium">{totalDays - currentDay} ngày còn lại</span>
          </div>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="rounded-2xl px-4 py-4 text-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className={`text-lg ${streak > 0 ? 'animate-flicker' : ''}`}>🔥</span>
            <span className="text-2xl font-black text-orange-400">{streak}</span>
          </div>
          <div className="text-[10px] text-white/35 uppercase tracking-widest mt-1">Streak</div>
        </div>

        <div
          className="rounded-2xl px-4 py-4 text-center"
          style={{ background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.15)' }}
        >
          <div className="text-2xl font-black text-green-400">{completedDays}</div>
          <div className="text-[10px] text-green-400/40 uppercase tracking-widest mt-1">Thành công</div>
        </div>

        <div
          className="rounded-2xl px-4 py-4 text-center"
          style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.12)' }}
        >
          <div className="text-2xl font-black text-red-400/80">{failDays}</div>
          <div className="text-[10px] text-red-400/35 uppercase tracking-widest mt-1">Bại trận</div>
        </div>
      </div>
    </div>
  )
}

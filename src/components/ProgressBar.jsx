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
    <div className="w-full max-w-3xl mx-auto mb-8 px-4">
      {/* Stats row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Day counter */}
        <div className="glass-card rounded-2xl px-4 py-3 flex-1 text-center">
          <div className="text-2xl font-black text-white">{currentDay}<span className="text-white/30">/{totalDays}</span></div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Ngày</div>
        </div>

        {/* Streak */}
        <div className="glass-card rounded-2xl px-4 py-3 flex-1 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className={`text-xl ${streak > 0 ? 'animate-flicker' : ''}`}>🔥</span>
            <span className="text-2xl font-black text-orange-400">{streak}</span>
          </div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Streak</div>
        </div>

        {/* Completed */}
        <div className="glass-card rounded-2xl px-4 py-3 flex-1 text-center">
          <div className="text-2xl font-black text-green-400">{completedDays}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Thành công</div>
        </div>

        {/* Failed */}
        <div className="glass-card rounded-2xl px-4 py-3 flex-1 text-center">
          <div className="text-2xl font-black text-orange-400">{failDays}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Bại trận</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)',
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-white/30">{percentage}% hành trình</span>
          <span className="text-xs text-white/30">{totalDays - currentDay} ngày còn lại</span>
        </div>
      </div>
    </div>
  )
}

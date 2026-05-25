import { useScrollReveal } from '../hooks/useScrollReveal'

export default function EmptyDay({ day, index = 0 }) {
  const { ref, isVisible } = useScrollReveal()
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className="relative">
      <div className={`
        flex items-start gap-0
        ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
      `}>
        {/* Left spacer (desktop) */}
        <div className={`hidden md:block flex-1 ${isEven ? '' : 'order-3'}`}>
          {isEven && (
            <div className="mr-8 text-right">
              <EmptyCard day={day} />
            </div>
          )}
          {!isEven && <div />}
        </div>

        {/* Center dot */}
        <div className="flex flex-col items-center z-10 mx-2 md:mx-0">
          <div className="w-5 h-5 rounded-full bg-white/10 border-2 border-white/10 flex-shrink-0" />
          <div className="w-0.5 bg-white/5 flex-1 min-h-[2rem]" />
        </div>

        {/* Right spacer (desktop) */}
        <div className={`hidden md:block flex-1 ${isEven ? 'order-3' : ''}`}>
          {!isEven && (
            <div className="ml-8">
              <EmptyCard day={day} />
            </div>
          )}
          {isEven && <div />}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex-1 ml-3">
          <EmptyCard day={day} />
        </div>
      </div>
    </div>
  )
}

function EmptyCard({ day }) {
  return (
    <div className="glass-card rounded-2xl p-4 mb-6 border-dashed border-white/5 opacity-40">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/30">Ngày {day}</span>
        <span className="text-xs text-white/15">Sắp tới</span>
      </div>
      <p className="text-xs text-white/15 mt-1">Chưa có ghi chép...</p>
    </div>
  )
}

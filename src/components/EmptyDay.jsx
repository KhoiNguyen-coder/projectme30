import { useScrollReveal } from '../hooks/useScrollReveal'

export default function EmptyDay({ day, index = 0 }) {
  const { ref, isVisible } = useScrollReveal()
  const isLeft = index % 2 === 0

  const cardEl = <EmptyCard day={day} />

  return (
    <div ref={ref} className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      {/* Desktop zigzag */}
      <div className="hidden md:flex items-start">
        <div className="flex-1">
          {isLeft ? <div className="mr-8">{cardEl}</div> : <div />}
        </div>
        <div className="flex flex-col items-center z-10 flex-shrink-0">
          <div className="w-5 h-5 rounded-full bg-white/10 border-2 border-white/10 flex-shrink-0" />
          <div className="w-0.5 bg-white/5 flex-1 min-h-[2rem]" />
        </div>
        <div className="flex-1">
          {!isLeft ? <div className="ml-8">{cardEl}</div> : <div />}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-start">
        <div className="flex flex-col items-center z-10 flex-shrink-0">
          <div className="w-5 h-5 rounded-full bg-white/10 border-2 border-white/10 flex-shrink-0" />
          <div className="w-0.5 bg-white/5 flex-1 min-h-[2rem]" />
        </div>
        <div className="flex-1 ml-3">{cardEl}</div>
      </div>
    </div>
  )
}

function EmptyCard({ day }) {
  return (
    <div
      className="rounded-2xl p-4 mb-6 opacity-40"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px dashed rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/30">Ngày {day}</span>
        <span className="text-xs text-white/15">Sắp tới</span>
      </div>
      <p className="text-xs text-white/15 mt-1">Chưa có ghi chép...</p>
    </div>
  )
}

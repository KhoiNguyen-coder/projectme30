import { useScrollReveal } from '../hooks/useScrollReveal'

const MOTIVATIONS = [
  'Ngày mai bạn sẽ làm gì?',
  'Hành trình vẫn đang chờ...',
  'Một ngày mới, một cơ hội mới!',
  'Đừng bỏ cuộc nhé!',
  'Tiếp tục cố gắng!',
  'Bạn có thể làm được!',
]

export default function EmptyDay({ day, index = 0 }) {
  const { ref, isVisible } = useScrollReveal()
  const isLeft = index % 2 === 0
  const motivation = MOTIVATIONS[(day - 1) % MOTIVATIONS.length]

  const cardEl = <EmptyCard day={day} motivation={motivation} />

  return (
    <div ref={ref} className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
      {/* Desktop zigzag */}
      <div className="hidden md:flex items-start">
        <div className="flex-1">
          {isLeft ? <div className="mr-4">{cardEl}</div> : <div />}
        </div>
        <div className="flex flex-col items-center z-10 flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-white/8 border-2 border-white/8 flex-shrink-0" />
          <div className="timeline-line-fade flex-1 min-h-[2rem]" />
        </div>
        <div className="flex-1">
          {!isLeft ? <div className="ml-4">{cardEl}</div> : <div />}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-start">
        <div className="flex flex-col items-center z-10 flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-white/8 border-2 border-white/8 flex-shrink-0" />
          <div className="timeline-line-fade flex-1 min-h-[2rem]" />
        </div>
        <div className="flex-1 ml-3">{cardEl}</div>
      </div>
    </div>
  )
}

function EmptyCard({ day, motivation }) {
  return (
    <div
      className="rounded-2xl p-4 mb-6 animate-skeleton relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px dashed rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Skeleton bars */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-white/20">Ngày {day}</span>
        <div className="w-12 h-2.5 rounded-full bg-white/5" />
      </div>

      {/* Fake image skeleton */}
      <div className="w-full h-20 rounded-lg bg-white/3 mb-3" />

      {/* Fake text skeleton lines */}
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-white/4 w-3/4" />
        <div className="h-2 rounded-full bg-white/3 w-1/2" />
      </div>

      {/* Motivational text */}
      <p className="text-xs text-purple-400/40 mt-3 italic">{motivation}</p>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useEntries } from '../hooks/useEntries'
import { useReactions } from '../hooks/useReactions'
import { MOCK_USER } from '../lib/mockData'
import ProgressBar from '../components/ProgressBar'
import TimelineEntry from '../components/TimelineEntry'
import EmptyDay from '../components/EmptyDay'
import Lightbox from '../components/Lightbox'

export default function PublicProfile() {
  const { username } = useParams()
  const [lightboxEntry, setLightboxEntry] = useState(null)

  const profileUser = MOCK_USER

  const { entries, loading: entriesLoading } = useEntries(profileUser?.id)

  const entryIds = useMemo(() => entries.map(e => e.id), [entries])
  const { reactions, addReaction, hasReacted } = useReactions(entryIds)

  const entriesByDay = useMemo(() => {
    const map = {}
    entries.forEach(e => { map[e.day] = e })
    return map
  }, [entries])

  if (entriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <h1 className="text-xl font-black text-white tracking-tight">
            Project<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Me</span>30
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Hành trình 30 ngày của <span className="font-semibold text-white/70">{profileUser?.display_name || username}</span>
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8">
        <ProgressBar entries={entries} />

        <div className="px-4">
          <div className="relative">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day, i) => {
              const entry = entriesByDay[day]
              if (entry) {
                return (
                  <TimelineEntry
                    key={day}
                    entry={entry}
                    reactions={reactions[entry.id]}
                    onReact={addReaction}
                    onOpenLightbox={setLightboxEntry}
                    isPublic={true}
                    hasReacted={!!hasReacted(entry.id)}
                    index={i}
                  />
                )
              }
              return <EmptyDay key={day} day={day} index={i} />
            })}
          </div>

          {entries.length >= 30 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-black text-white">
                Đã hoàn thành 30 ngày!
              </h3>
            </div>
          )}
        </div>
      </main>

      {lightboxEntry && (
        <Lightbox entry={lightboxEntry} onClose={() => setLightboxEntry(null)} />
      )}
    </div>
  )
}

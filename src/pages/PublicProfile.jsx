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

  // In production, fetch user by username from Supabase
  // For now, use mock data
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-5 text-center">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Project<span className="text-green-600">Me</span>30
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Hành trình 30 ngày của <span className="font-medium text-gray-700">{profileUser?.display_name || username}</span>
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-6">
        <ProgressBar entries={entries} />

        <div className="px-4">
          <div className="relative">
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
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
                  />
                )
              }
              return <EmptyDay key={day} day={day} />
            })}
          </div>

          {entries.length >= 30 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-bold text-gray-800">
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

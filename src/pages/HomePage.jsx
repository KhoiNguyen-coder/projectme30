import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useEntries } from '../hooks/useEntries'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import ProgressBar from '../components/ProgressBar'
import TimelineEntry from '../components/TimelineEntry'
import EmptyDay from '../components/EmptyDay'
import LogForm from '../components/LogForm'
import Lightbox from '../components/Lightbox'
import LoginForm from '../components/LoginForm'

export default function HomePage() {
  const { user, loading: authLoading, demoMode, signOut } = useAuth()
  const { entries, loading: entriesLoading, addEntry } = useEntries(user?.id)
  const [lightboxEntry, setLightboxEntry] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const entriesByDay = useMemo(() => {
    const map = {}
    entries.forEach(e => { map[e.day] = e })
    return map
  }, [entries])

  const nextDay = useMemo(() => {
    const loggedDays = entries.map(e => e.day)
    for (let d = 1; d <= 30; d++) {
      if (!loggedDays.includes(d)) return d
    }
    return null
  }, [entries])

  const handleSubmit = useCallback(async (formData) => {
    setSubmitting(true)
    const { media_file, ...rest } = formData

    let media_url = null

    if (media_file && isSupabaseConfigured()) {
      const ext = media_file.name?.split('.').pop() || 'jpg'
      const path = `${user.id}/day${rest.day}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, media_file, { upsert: true })

      if (!uploadError) {
        const { data } = supabase.storage.from('media').getPublicUrl(path)
        media_url = data.publicUrl
      }
    } else if (media_file) {
      media_url = URL.createObjectURL(media_file)
    }

    await addEntry({
      ...rest,
      user_id: user.id,
      media_url,
    })

    setSubmitting(false)
  }, [user, addEntry])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const allDone = entries.length >= 30

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            Project<span className="text-green-600">Me</span>30
          </h1>
          <div className="flex items-center gap-3">
            {demoMode && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                Demo
              </span>
            )}
            <button
              onClick={signOut}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-6">
        <ProgressBar entries={entries} />

        {entriesLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="px-4">
            {/* Timeline */}
            <div className="relative">
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                const entry = entriesByDay[day]
                if (entry) {
                  return (
                    <TimelineEntry
                      key={day}
                      entry={entry}
                      onOpenLightbox={setLightboxEntry}
                      isPublic={false}
                    />
                  )
                }
                return <EmptyDay key={day} day={day} />
              })}
            </div>

            {/* Log form */}
            {nextDay && !allDone && (
              <LogForm
                day={nextDay}
                onSubmit={handleSubmit}
                loading={submitting}
              />
            )}

            {allDone && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-lg font-bold text-gray-800">
                  Chúc mừng! Bạn đã hoàn thành 30 ngày!
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Hành trình tuyệt vời. Hãy chia sẻ timeline này với mọi người!
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {lightboxEntry && (
        <Lightbox entry={lightboxEntry} onClose={() => setLightboxEntry(null)} />
      )}
    </div>
  )
}

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const allDone = entries.length >= 30

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-white tracking-tight">
            Project<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Me</span>30
          </h1>
          <div className="flex items-center gap-3">
            {demoMode && (
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full font-semibold border border-purple-500/20 uppercase tracking-wider">
                Demo
              </span>
            )}
            <button
              onClick={signOut}
              className="text-xs text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8">
        <ProgressBar entries={entries} />

        {entriesLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="px-4">
            {/* Timeline */}
            <div className="relative">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day, i) => {
                const entry = entriesByDay[day]
                if (entry) {
                  return (
                    <TimelineEntry
                      key={day}
                      entry={entry}
                      onOpenLightbox={setLightboxEntry}
                      isPublic={false}
                      index={i}
                    />
                  )
                }
                return <EmptyDay key={day} day={day} index={i} />
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
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-black text-white mb-2">
                  Chúc mừng! Bạn đã hoàn thành 30 ngày!
                </h3>
                <p className="text-sm text-white/40">
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

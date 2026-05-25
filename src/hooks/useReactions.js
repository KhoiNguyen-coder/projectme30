import { useState, useCallback, useRef, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { MOCK_REACTIONS } from '../lib/mockData'

const REACTION_STORAGE_KEY = 'projectme30_reactions'

function getLocalReactions() {
  try {
    return JSON.parse(localStorage.getItem(REACTION_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function setLocalReaction(entryId, type) {
  const reactions = getLocalReactions()
  reactions[entryId] = type
  localStorage.setItem(REACTION_STORAGE_KEY, JSON.stringify(reactions))
}

function hasReactedCheck(entryId) {
  const reactions = getLocalReactions()
  return reactions[entryId] || null
}

export function useReactions(entryIds) {
  const [reactions, setReactions] = useState({})
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)

  const fetchReactions = useCallback(async () => {
    if (!entryIds || entryIds.length === 0) {
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured()) {
      setReactions(MOCK_REACTIONS)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('reactions')
      .select('entry_id, type')
      .in('entry_id', entryIds)

    if (!error && data) {
      const grouped = {}
      data.forEach(r => {
        if (!grouped[r.entry_id]) {
          grouped[r.entry_id] = { heart: 0, fire: 0, clap: 0 }
        }
        grouped[r.entry_id][r.type]++
      })
      setReactions(grouped)
    }
    setLoading(false)
  }, [entryIds])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchReactions()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addReaction = async (entryId, type) => {
    if (hasReactedCheck(entryId)) return { error: 'Already reacted' }

    setLocalReaction(entryId, type)

    setReactions(prev => {
      const current = prev[entryId] || { heart: 0, fire: 0, clap: 0 }
      return {
        ...prev,
        [entryId]: { ...current, [type]: current[type] + 1 },
      }
    })

    if (!isSupabaseConfigured()) {
      return { error: null }
    }

    const { error } = await supabase
      .from('reactions')
      .insert([{ entry_id: entryId, type }])

    return { error }
  }

  return { reactions, loading, addReaction, hasReacted: hasReactedCheck }
}

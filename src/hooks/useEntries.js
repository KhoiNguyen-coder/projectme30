import { useState, useCallback, useRef, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { MOCK_ENTRIES } from '../lib/mockData'

export function useEntries(userId) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)

  const fetchEntries = useCallback(async () => {
    if (!isSupabaseConfigured() || !userId) {
      setEntries(MOCK_ENTRIES)
      setLoading(false)
      return
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('day', { ascending: true })

    if (!error && data) {
      setEntries(data)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchEntries()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addEntry = async (entry) => {
    if (!isSupabaseConfigured()) {
      const newEntry = {
        ...entry,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
      }
      setEntries(prev => [...prev, newEntry])
      return { data: newEntry, error: null }
    }

    const { data, error } = await supabase
      .from('entries')
      .insert([entry])
      .select()
      .single()

    if (!error && data) {
      setEntries(prev => [...prev, data])
    }
    return { data, error }
  }

  return { entries, loading, addEntry, refetch: fetchEntries }
}

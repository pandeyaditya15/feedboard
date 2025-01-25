"use client"

import RoadmapPage from "@/app/components/roadmap/page"
import { Button } from "@/components/ui/button"
import { Star, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { isValidUUID } from "@/lib/utils"

export default function Roadmap() {
  const params = useParams()
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchFeatures() {
    try {
      if (!params.id || !isValidUUID(params.id)) return;
      
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('board_id', params.id)
        .order('votes', { ascending: false })

      if (error) throw error
      setFeatures(data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching features:', error)
      setError(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatures()

    // Subscribe to feature changes
    const channel = supabase
      .channel('roadmap_features')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'features',
        filter: `board_id=eq.${params.id}`
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setFeatures(currentFeatures => 
            currentFeatures.map(feature => 
              feature.id === payload.new.id ? { ...feature, ...payload.new } : feature
            )
          )
        } else if (payload.eventType === 'INSERT') {
          setFeatures(currentFeatures => [payload.new, ...currentFeatures])
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [params.id])

  if (loading) {
    return <div className="text-white text-center p-8">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>
  }

  return <RoadmapPage features={features} boardId={params.id} />
} 
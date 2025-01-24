"use client"

import BoardManage from "../../components/board-manage/page"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { isValidUUID } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { useSupabase } from '@/components/providers/supabase-provider'

export default function Board() {
  const params = useParams()
  const { supabase } = useSupabase()
  const [board, setBoard] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBoard() {
      if (!params?.id || !isValidUUID(params.id)) {
        setError("Invalid board ID")
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('boards')
          .select('*')
          .eq('id', params.id)
          .single()

        if (error) throw error
        if (!data) throw new Error('Board not found')

        setBoard(data)
      } catch (error) {
        console.error('Error fetching board:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBoard()
  }, [params?.id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E1B3A] bg-[url('/subway-pattern.png')] p-4 md:p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1E1B3A] bg-[url('/subway-pattern.png')] p-4 md:p-6 flex items-center justify-center">
        <Card className="bg-[#2D2B52] border-4 border-red-500 p-6 rounded-3xl">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </Card>
      </div>
    )
  }

  return <BoardManage board={board} />
} 
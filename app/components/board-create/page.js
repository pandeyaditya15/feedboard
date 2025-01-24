"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star, Gamepad2, Trophy } from "lucide-react"
import { useSupabase } from '@/components/providers/supabase-provider'

export default function BoardCreate() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [boards, setBoards] = useState([])
  const [formData, setFormData] = useState({
    boardName: "",
    boardDescription: ""
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBoards()
  }, [])

  async function fetchBoards() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No user found')
      }

      const { data, error } = await supabase
        .from('boards')
        .select('id, name, description, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBoards(data || [])
    } catch (error) {
      console.error('Error fetching boards:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleCreateBoard = async () => {
    if (!formData.boardName) return
    
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('No user found')
      }

      const { data, error } = await supabase
        .from('boards')
        .insert([
          {
            name: formData.boardName,
            description: formData.boardDescription || '',
            user_id: user.id
          }
        ])
        .select()
        .single()

      if (error) throw error

      if (!data?.id) {
        throw new Error('Failed to create board')
      }

      setFormData({
        boardName: "",
        boardDescription: ""
      })

      // Navigate to the new board
      router.push(`/board/${data.id}/feature-request`)
    } catch (error) {
      console.error('Error creating board:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1B3A] bg-[url('/subway-pattern.png')] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Create Board Form */}
        <Card className="max-w-lg bg-[#2D2B52] border-4 border-[#FFD600] p-6 rounded-3xl shadow-[0_0_20px_rgba(255,214,0,0.3)]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFD600] p-2 rounded-xl">
                <Gamepad2 className="h-6 w-6 text-[#1E1B3A]" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Build updates players <span className="bg-[#FF4D6A] text-white px-3 py-1 rounded-lg">really</span> want
              </h1>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="boardName" className="text-sm font-bold text-[#FFD600]">
                  Board Name
                </label>
                <Input 
                  id="boardName" 
                  placeholder="Enter your board name" 
                  className="bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#FFD600] transition-colors"
                  value={formData.boardName}
                  onChange={handleInputChange}
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <Button 
                className="w-full bg-[#FFD600] hover:bg-[#FFE44D] text-[#1E1B3A] font-bold h-12 rounded-xl shadow-[0_4px_0_#B89B00] hover:shadow-[0_6px_0_#B89B00] transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={handleCreateBoard}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Board'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Boards */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF4D6A] p-2 rounded-xl">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Your Boards</h2>
          </div>
          {loading ? (
            <div className="text-white">Loading boards...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map(board => (
                <Card 
                  key={board.id} 
                  className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-5 rounded-2xl hover:border-[#FFD600] transition-all duration-300 cursor-pointer group"
                  onClick={() => router.push(`/board/${board.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-[#1E1B3A] p-2 rounded-xl">
                      <Star className="h-5 w-5 text-[#FFD600] group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{board.name}</h3>
                      <p className="text-[#B4B4D9]">{board.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
              {boards.length === 0 && !loading && (
                <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-5 rounded-2xl col-span-full">
                  <div className="flex items-center justify-center gap-3">
                    <Star className="h-5 w-5 text-[#B4B4D9]" />
                    <p className="text-[#B4B4D9] font-bold">Create your first board above</p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

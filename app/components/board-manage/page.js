"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpIcon, Copy, ExternalLink, Rocket, Trophy, Check, MessageSquare, LogOut, User, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/providers/supabase-provider"

const TAG_COLORS = {
  "Gameplay": "bg-[#FF4D6A] text-white",
  "User Interface": "bg-[#9B51E0] text-white",
  "Character": "bg-[#00C2FF] text-white",
  "Level & Mission": "bg-[#FF9F1C] text-white",
  "Rewards": "bg-[#FF66D8] text-white",
  "Other": "bg-[#6E7191] text-white"
}

const STATUS_COLORS = {
  PENDING: "bg-[#FFD600]",
  UNDER_REVIEW: "bg-[#6E7191]",
  PRE_PRODUCTION: "bg-[#00C2FF]",
  IN_PRODUCTION: "bg-[#9B51E0]",
  LAUNCHED: "bg-[#00FF94]"
}

export default function BoardManage({ board }) {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [features, setFeatures] = useState([])
  const [selectedTag, setSelectedTag] = useState("all")
  const [sortBy, setSortBy] = useState("trending")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (supabase) {
      getUser()
    }
    if (board?.id) {
      fetchFeatures()
    }
  }, [supabase, board?.id])

  useEffect(() => {
    fetchFeatures()

    // Subscribe to feature changes
    const channel = supabase
      .channel('board_features')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'features',
        filter: `board_id=eq.${board?.id}`
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
  }, [board?.id])

  async function getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      setUser(user)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  async function fetchFeatures() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('board_id', board.id)
        .order('votes', { ascending: false })

      if (error) throw error
      setFeatures(data || [])
    } catch (error) {
      console.error('Error fetching features:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : window.location.origin
    navigator.clipboard.writeText(`${baseUrl}/board/${board?.id}/feature-request`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVote = (featureId) => {
    const updatedFeatures = features.map(feature => {
      if (feature.id === featureId) {
        return { ...feature, votes: feature.votes + 1 }
      }
      return feature
    })
    setFeatures(updatedFeatures)
    localStorage.setItem(`features_${board?.id}`, JSON.stringify(updatedFeatures))
  }

  const handleStatusChange = (featureId, newStatus) => {
    const updatedFeatures = features.map(feature => {
      if (feature.id === featureId) {
        return { ...feature, status: newStatus }
      }
      return feature
    })
    setFeatures(updatedFeatures)
    localStorage.setItem(`features_${board?.id}`, JSON.stringify(updatedFeatures))
  }

  const handleDeleteFeature = async (featureId) => {
    try {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', featureId)

      if (error) throw error

      setFeatures(features.filter(f => f.id !== featureId))
    } catch (error) {
      console.error('Error deleting feature:', error)
    }
  }

  const handleDeleteBoard = async () => {
    if (!confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', board.id)

      if (error) throw error

      router.push('/create-board')
    } catch (error) {
      console.error('Error deleting board:', error)
    }
  }

  const getSortedFeatures = (features) => {
    if (sortBy === "trending") {
      return [...features].sort((a, b) => b.votes - a.votes)
    } else {
      return [...features].sort((a, b) => b.id - a.id)
    }
  }

  const filteredFeatures = selectedTag === "all" 
    ? features 
    : features.filter(feature => feature.tag === selectedTag)

  const sortedAndFilteredFeatures = getSortedFeatures(filteredFeatures)

  const handleSignOut = async () => {
    try {
      if (!supabase) return
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1B3A] bg-[url('/subway-pattern.png')] p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD600] p-2 rounded-xl">
              <Trophy className="h-6 w-6 text-[#1E1B3A]" />
            </div>
            <h1 className="text-2xl font-bold text-white">{board?.name}</h1>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-[#2D2B52] p-2 rounded-xl">
                  <User className="h-5 w-5 text-[#FFD600]" />
                </div>
                <span className="text-white">{user.email}</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="text-[#FF4D6A] hover:text-[#FF6B84] hover:bg-[#FF4D6A]/10 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => router.push('/login')}
              className="bg-[#FFD600] hover:bg-[#FFE44D] text-[#1E1B3A] font-bold flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Feature Management */}
          <div className="lg:col-span-1">
            <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-4 sm:p-6 rounded-3xl sticky top-4">
              <div className="space-y-4">
                {/* Share Section */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-[#FFD600] p-2 rounded-xl">
                      <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-[#1E1B3A]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Board Link</h2>
                  </div>
                  <div className="flex items-center gap-2 bg-[#1E1B3A] p-3 rounded-xl border-2 border-[#FFD600]/30 mb-3">
                    <div className="flex-1 text-[#B4B4D9] text-sm truncate">
                      feedboard.vercel.app/board/{board?.id}
                    </div>
                    <Button
                      onClick={handleCopyLink}
                      className="bg-transparent hover:bg-[#373964] text-white h-8 w-8 p-0 rounded-lg"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-[#00FF94]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={() => router.push(`/board/${board?.id}/roadmap`)}
                    className="w-full bg-[#2D2B52] hover:bg-[#373964] text-white font-bold h-10 rounded-xl border-2 border-[#FFD600]/30 hover:border-[#FFD600] transition-all duration-200 flex items-center justify-center gap-2 text-sm mb-3"
                  >
                    <Rocket className="h-4 w-4" />
                    View Roadmap
                  </Button>
                  <Button
                    onClick={() => router.push(`/board/${board?.id}/feature-request`)}
                    className="w-full bg-[#2D2B52] hover:bg-[#373964] text-white font-bold h-10 rounded-xl border-2 border-[#FFD600]/30 hover:border-[#FFD600] transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    View Requests
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Features Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Section */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-3 pr-16">
                <div className="bg-[#00C2FF] p-2 rounded-xl">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Updates</h2>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white h-10 w-full sm:w-[140px] rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#2D2B52] border-2 border-[#FFD600]/30">
                  <SelectItem value="trending" className="text-white hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">Trending</SelectItem>
                  <SelectItem value="newest" className="text-white hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">Newest</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white h-10 w-full sm:w-[160px] rounded-xl">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-[#2D2B52] border-2 border-[#FFD600]/30">
                  <SelectItem value="all" className="text-white hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">All categories</SelectItem>
                  {Object.keys(TAG_COLORS).map(tag => (
                    <SelectItem key={tag} value={tag} className="text-white hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">
                      <div className="flex items-center gap-2">
                        <Badge className={`${TAG_COLORS[tag]} border-0 text-sm px-3 py-1 rounded-lg`}>
                          {tag}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-white text-center">Loading features...</div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                sortedAndFilteredFeatures.map(feature => (
                  <Card
                    key={feature.id}
                    className="bg-[#2D2B52] border-2 border-[#FFD600]/30 p-6 rounded-2xl hover:border-[#FFD600] transition-all duration-300 group relative"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white leading-tight mb-4 truncate">{feature.title}</h3>
                        <p className="text-[#B4B4D9] text-sm line-clamp-2 mb-4">{feature.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={`${TAG_COLORS[feature.tag]} border-0 text-xs px-2 py-0.5 rounded-lg`}>
                            {feature.tag}
                          </Badge>
                          <Select value={feature.status || "PENDING"} onValueChange={(value) => handleStatusChange(feature.id, value)}>
                            <SelectTrigger className="bg-transparent border-0 text-white h-5 text-xs pr-20">
                              <SelectValue>
                                <Badge className={`${STATUS_COLORS[feature.status || "PENDING"]} text-xs px-2 py-0.5 rounded-lg`}>
                                  {(feature.status || "PENDING").replace(/_/g, " ")}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="bg-[#2D2B52] border-2 border-[#FFD600]/30 z-50">
                              <SelectItem value="UNDER_REVIEW" className="text-gray-900 hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">
                                <Badge className={`${STATUS_COLORS.UNDER_REVIEW} text-xs px-2 py-0.5 rounded-lg`}>UNDER REVIEW</Badge>
                              </SelectItem>
                              <SelectItem value="PRE_PRODUCTION" className="text-gray-900 hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">
                                <Badge className={`${STATUS_COLORS.PRE_PRODUCTION} text-xs px-2 py-0.5 rounded-lg`}>PRE PRODUCTION</Badge>
                              </SelectItem>
                              <SelectItem value="IN_PRODUCTION" className="text-gray-900 hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">
                                <Badge className={`${STATUS_COLORS.IN_PRODUCTION} text-xs px-2 py-0.5 rounded-lg`}>IN PRODUCTION</Badge>
                              </SelectItem>
                              <SelectItem value="LAUNCHED" className="text-gray-900 hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">
                                <Badge className={`${STATUS_COLORS.LAUNCHED} text-xs px-2 py-0.5 rounded-lg`}>LAUNCHED</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          variant="outline"
                          size="lg"
                          className="bg-[#FF4D6A] hover:bg-[#FF6B84] border-0 text-white font-bold h-19 w-16 flex flex-col items-center justify-center rounded-2xl shadow-[0_4px_0_#CC3D55] hover:shadow-[0_6px_0_#CC3D55] transform hover:-translate-y-0.5 transition-all duration-200 gap-1"
                          onClick={() => handleVote(feature.id)}
                        >
                          <ArrowUpIcon className="h-4 w-4" />
                          <span className="text-lg">{feature.votes}</span>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="bg-transparent hover:bg-red-500/10 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
              {features.length === 0 && (
                <div className="col-span-full text-center text-[#B4B4D9]">
                  No features yet. Create one in the feature request page.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
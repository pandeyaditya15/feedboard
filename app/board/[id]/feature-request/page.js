"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, BarChart2, Filter, Sparkles, Star, Trophy, Zap, Rocket, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useSupabase } from '@/components/providers/supabase-provider'
import { isValidUUID } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const TAG_COLORS = {
  "Gameplay": "bg-[#FF4D6A] text-white",
  "User Interface": "bg-[#9B51E0] text-white",
  "Character": "bg-[#00C2FF] text-white",
  "Level": "bg-[#FF9F1C] text-white",
  "Level & Mission": "bg-[#FF9F1C] text-white",
  "Rewards": "bg-[#FF66D8] text-white",
  "Other": "bg-[#6E7191] text-white"
}

const UPDATE_TAGS = [
  "Gameplay",
  "User Interface",
  "Character",
  "Level & Mission",
  "Rewards",
  "Other"
]

const STATUS_COLORS = {
  PENDING: "bg-[#FFD600]",
  UNDER_REVIEW: "bg-[#6E7191]",
  PRE_PRODUCTION: "bg-[#00C2FF]",
  IN_PRODUCTION: "bg-[#9B51E0]",
  LAUNCHED: "bg-[#00FF94]"
}

function Feature({ feature, onVote }) {
  const { supabase } = useSupabase()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [hasVoted, setHasVoted] = useState(false)
  const [username, setUsername] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkVoteStatus()
    fetchComments()

    // Subscribe to comment changes
    const channel = supabase
      .channel(`feature_${feature.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `feature_id=eq.${feature.id}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          // Check if comment already exists before adding
          setComments(current => {
            const exists = current.some(c => c.id === payload.new.id)
            if (exists) return current
            return [payload.new, ...current]
          })
        }
      })
      .subscribe()

    // Subscribe to vote changes
    const voteChannel = supabase
      .channel(`feature_${feature.id}_votes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'feature_votes',
        filter: `feature_id=eq.${feature.id}`
      }, async () => {
        // Recheck vote status when votes change
        await checkVoteStatus()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(voteChannel)
    }
  }, [feature.id])

  const checkVoteStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: votes } = await supabase
        .from('feature_votes')
        .select('id')
        .eq('feature_id', feature.id)
        .eq('user_id', user.id)
        .maybeSingle()

      setHasVoted(!!votes)
    } catch (error) {
      console.error('Error checking vote status:', error)
    }
  }

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('feature_id', feature.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleAddComment = async () => {
    if (!username.trim() || !comment.trim()) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            feature_id: feature.id,
            username: username.trim(),
            text: comment.trim()
          }
        ])
        .select()
        .single()

      if (error) throw error

      setComments([data, ...comments])
      setUsername("")
      setComment("")
      setShowComments(false)
    } catch (error) {
      console.error('Error adding comment:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      if (hasVoted) {
        await supabase
          .from('feature_votes')
          .delete()
          .eq('feature_id', feature.id)
          .eq('user_id', user.id)
        
        await onVote(feature.id, -1)
        setHasVoted(false)
      } else {
        await supabase
          .from('feature_votes')
          .insert([
            {
              feature_id: feature.id,
              user_id: user.id
            }
          ])
        
        await onVote(feature.id, 1)
        setHasVoted(true)
      }
    } catch (error) {
      console.error('Error handling vote:', error)
    }
  }

  return (
    <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-4 rounded-2xl hover:border-[#FFD600] transition-all duration-300">
      <div className="space-y-3">
        {/* Title and Vote Button Row */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-left w-full"
            >
              <h3 className="font-bold text-white text-base sm:text-lg hover:text-[#FFD600] transition-colors">
                {feature.title}
              </h3>
              <p className={`text-[#B4B4D9] text-sm mt-1 ${isExpanded ? '' : 'line-clamp-1'}`}>
                {feature.description}
              </p>
            </button>
          </div>
          <Button
            onClick={handleVote}
            className={`${
              hasVoted 
                ? 'bg-[#FF4D6A] hover:bg-[#FF6B84] border-[#FF4D6A]' 
                : 'bg-[#1E1B3A] hover:bg-[#373964] border-[#FFD600]/30'
            } text-white font-bold h-10 w-16 rounded-xl border-2 transition-all duration-200 flex-shrink-0 flex items-center justify-center gap-1`}
          >
            <ArrowUpIcon className="h-4 w-4" />
            <span>{feature.votes}</span>
          </Button>
        </div>

        {/* Tags and Actions Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={`${TAG_COLORS[feature.tag]} text-xs px-2 py-0.5 rounded-lg`}>
              {feature.tag}
            </Badge>
            <Badge className={`${STATUS_COLORS[feature.status || "PENDING"]} text-xs px-2 py-0.5 rounded-lg`}>
              {(feature.status || "PENDING").replace(/_/g, " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowComments(!showComments)}
              className="bg-transparent hover:bg-[#373964] text-white h-8 px-3 rounded-lg flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{comments.length}</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-4 border-t border-[#FFD600]/30 pt-4">
            {/* Add Comment Form */}
            <div className="space-y-2">
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                className="bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white text-sm"
              />
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white text-sm min-h-[80px]"
              />
              <Button
                onClick={handleAddComment}
                disabled={loading}
                className="w-full bg-[#FFD600] hover:bg-[#FFE44D] text-[#1E1B3A] font-bold"
              >
                {loading ? 'Adding...' : 'Add Comment'}
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-[#1E1B3A] p-3 rounded-xl">
                  <div className="font-bold text-white text-sm">{comment.username}</div>
                  <div className="text-[#B4B4D9] text-sm mt-1">{comment.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default function FeatureRequest() {
  const params = useParams()
  const boardId = params?.id
  const router = useRouter()
  const searchParams = useSearchParams()
  const { supabase } = useSupabase()
  const [board, setBoard] = useState(null)
  const [features, setFeatures] = useState([])
  const [selectedTag, setSelectedTag] = useState("all")
  const [sortBy, setSortBy] = useState("trending")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: ""
  })

  async function fetchFeatures() {
    try {
      if (!boardId || !isValidUUID(boardId)) return;
      
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .eq('board_id', boardId)
        .order('votes', { ascending: false })

      if (error) throw error
      setFeatures(data || [])
    } catch (error) {
      console.error('Error fetching features:', error)
      setError(error.message)
    }
  }

  useEffect(() => {
    async function initializePage() {
      if (!boardId || !isValidUUID(boardId)) {
        setError("Invalid board ID")
        setLoading(false)
        return
      }
      await fetchBoardAndFeatures(boardId)
    }

    initializePage()
  }, [boardId])

  useEffect(() => {
    fetchFeatures()

    // Subscribe to feature changes
    const channel = supabase
      .channel('feature_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'features',
        filter: `board_id=eq.${boardId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setFeatures(current => {
            const exists = current.some(f => f.id === payload.new.id)
            if (exists) return current
            return [payload.new, ...current]
          })
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId])

  async function fetchBoardAndFeatures(id) {
    try {
      setLoading(true)
      setError(null)

      // Fetch board
      const { data: board, error: boardError } = await supabase
        .from('boards')
        .select('*')
        .eq('id', id)
        .single()

      if (boardError) throw boardError
      if (!board) throw new Error('Board not found')
      
      setBoard(board)

      // Fetch features
      const { data: features, error: featuresError } = await supabase
        .from('features')
        .select('*')
        .eq('board_id', id)
        .order('votes', { ascending: false })

      if (featuresError) throw featuresError
      setFeatures(features || [])

      // Handle scroll to feature if ID is in URL
      const featureId = searchParams.get('id')
      if (featureId) {
        setTimeout(() => {
          const element = document.getElementById(`feature-${featureId}`)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateFeature = async () => {
    if (!formData.title || !formData.description || !formData.tag) return
    if (!boardId || !isValidUUID(boardId)) {
      setError("Invalid board ID")
      return
    }

    try {
      setLoading(true)
      const { data: feature, error } = await supabase
        .from('features')
        .insert([
          {
            board_id: boardId,
            title: formData.title,
            description: formData.description,
            tag: formData.tag,
            status: 'PENDING',
            votes: 0
          }
        ])
        .select()
        .single()

      if (error) throw error

      setFeatures([feature, ...features])
      setFormData({
        title: "",
        description: "",
        tag: ""
      })
    } catch (error) {
      console.error('Error creating feature:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (featureId, voteChange) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Find the current feature
      const currentFeature = features.find(f => f.id === featureId)
      if (!currentFeature) return

      // Update the votes count in features table
      const { data, error } = await supabase
        .from('features')
        .update({ 
          votes: currentFeature.votes + voteChange 
        })
        .eq('id', featureId)
        .select()
        .single()

      if (error) throw error

      // Update local state
      setFeatures(features.map(f => 
        f.id === featureId ? { ...f, votes: f.votes + voteChange } : f
      ))

    } catch (error) {
      console.error('Error updating vote:', error)
    }
  }

  const handleRoadmapClick = () => {
    router.push(`/board/${params.id}/roadmap`)
  }

  const getSortedFeatures = (features) => {
    if (sortBy === "trending") {
      return [...features].sort((a, b) => b.votes - a.votes)
    }
    return [...features].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    )
  }

  const filteredFeatures = selectedTag === "all"
    ? getSortedFeatures(features)
    : getSortedFeatures(features.filter(feature => feature.tag === selectedTag))

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

  return (
    <div className="min-h-screen bg-[#1E1B3A] bg-[url('/subway-pattern.png')] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD600] p-2 rounded-xl">
              <Star className="h-6 w-6 text-[#1E1B3A]" />
            </div>
            <h1 className="text-2xl font-bold text-white">{board?.name || "Board"}</h1>
          </div>
          <Button 
            onClick={handleRoadmapClick}
            className="w-full sm:w-auto bg-[#FF4D6A] hover:bg-[#FF6B84] text-white font-bold h-12 px-6 rounded-xl shadow-[0_4px_0_#CC3D55] hover:shadow-[0_6px_0_#CC3D55] transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Rocket className="h-5 w-5" />
            Roadmap
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Suggestion Form */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600] p-6 rounded-3xl shadow-[0_0_20px_rgba(255,214,0,0.3)]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#FFD600] p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-[#1E1B3A]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Suggest a game update</h2>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#FFD600]">Short, descriptive title</label>
                <Input 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Login button color to green" 
                  className="bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-[#FFD600] transition-colors" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#FFD600]">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="The login button color should be green to match our brand colors."
                  className="min-h-[100px] bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white placeholder:text-gray-500 rounded-xl focus:border-[#FFD600] transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#FFD600]">Category</label>
                <Select
                  value={formData.tag}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tag: value }))}
                >
                  <SelectTrigger className="bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white h-12 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2D2B52] border-2 border-[#FFD600]/30">
                    {UPDATE_TAGS.map(tag => (
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

              <Button 
                className="w-full bg-[#FFD600] hover:bg-[#FFE44D] text-[#1E1B3A] font-bold h-12 rounded-xl shadow-[0_4px_0_#B89B00] hover:shadow-[0_6px_0_#B89B00] transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={handleCreateFeature}
              >
                Create Post
              </Button>
            </div>
          </Card>

          {/* Right Column - Feature Cards */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#00C2FF] p-2 rounded-xl">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Updates</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white h-10 w-full sm:w-[140px] rounded-xl">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2D2B52] border-2 border-[#FFD600]/30">
                    <SelectItem value="trending" className="text-white hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">Trending</SelectItem>
                    <SelectItem value="newest" className="text-white hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">Newest</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedTag}
                  onValueChange={setSelectedTag}
                >
                  <SelectTrigger className="bg-[#1E1B3A] border-2 border-[#FFD600]/30 text-white h-10 w-full sm:w-[160px] rounded-xl">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2D2B52] border-2 border-[#FFD600]/30">
                    <SelectItem value="all" className="text-white hover:bg-[#1E1B3A] focus:bg-[#1E1B3A]">All categories</SelectItem>
                    {UPDATE_TAGS.map(tag => (
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
            </div>

            {filteredFeatures.map(feature => (
              <Feature 
                key={feature.id}
                feature={feature}
                onVote={handleVote}
              />
            ))}

            {filteredFeatures.length === 0 && (
              <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-6 rounded-2xl">
                <p className="text-[#B4B4D9] text-center text-lg">
                  {selectedTag === "all" ? "No feature requests yet. Be the first to suggest one!" : "No features found for the selected category."}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
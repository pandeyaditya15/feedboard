"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowUpIcon, Filter, Trophy, Zap, Star, Rocket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSupabase } from '@/components/providers/supabase-provider'

const TAG_COLORS = {
  "Gameplay": "bg-[#FF4D6A] text-white",
  "User Interface": "bg-[#9B51E0] text-white",
  "Character": "bg-[#00C2FF] text-white",
  "Level": "bg-[#FF9F1C] text-white",
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

export default function RoadmapPage() {
  const params = useParams()
  const router = useRouter()
  const [board, setBoard] = useState(null)
  const [features, setFeatures] = useState([])

  useEffect(() => {
    if (params?.id) {
      // Load board and features from localStorage
      const storedBoards = JSON.parse(localStorage.getItem('boards') || '[]')
      const currentBoard = storedBoards.find(b => b.id.toString() === params.id)
      setBoard(currentBoard)

      const storedFeatures = JSON.parse(localStorage.getItem(`features_${params.id}`) || '[]')
      setFeatures(storedFeatures)
    }
  }, [params?.id])

  const handleVote = (featureId) => {
    const updatedFeatures = features.map(feature => {
      if (feature.id === featureId) {
        return { ...feature, votes: feature.votes + 1 }
      }
      return feature
    })
    setFeatures(updatedFeatures)
    localStorage.setItem(`features_${params?.id}`, JSON.stringify(updatedFeatures))
  }

  const getFeaturesByStatus = (status) => {
    return features.filter(feature => feature.status === status)
  }

  return ( 
    <div className="min-h-screen bg-[#1E1B3A] bg-[url('/subway-pattern.png')] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-[#FFD600] p-2 rounded-xl">
            <Rocket className="h-6 w-6 text-[#1E1B3A]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Roadmap</h1>
        </div> 

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Under Review Column */}
          <Card className="bg-[#2D2B52] border-4 border-[#6E7191] p-6 rounded-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#6E7191] p-2 rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white">Under Review</span>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {getFeaturesByStatus("UNDER_REVIEW").map(feature => (
                  <RoadmapItem
                    key={feature.id}
                    id={feature.id}
                    votes={feature.votes}
                    title={feature.title}
                    category="UPDATE"
                    tags={feature.tags}
                    onVote={() => handleVote(feature.id)}
                    onClick={() => router.push(`/board/${params.id}/feature-request?id=${feature.id}`)}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Pre Production Column */}
          <Card className="bg-[#2D2B52] border-4 border-[#00C2FF] p-6 rounded-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#00C2FF] p-2 rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white">Pre Production</span>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {getFeaturesByStatus("PRE_PRODUCTION").map(feature => (
                  <RoadmapItem
                    key={feature.id}
                    id={feature.id}
                    votes={feature.votes}
                    title={feature.title}
                    category="UPDATE"
                    tags={feature.tags}
                    onVote={() => handleVote(feature.id)}
                    onClick={() => router.push(`/board/${params.id}/feature-request?id=${feature.id}`)}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* In Production Column */}
          <Card className="bg-[#2D2B52] border-4 border-[#9B51E0] p-6 rounded-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#9B51E0] p-2 rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white">In Production</span>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-6">
                {getFeaturesByStatus("IN_PRODUCTION").map(feature => (
                  <RoadmapItem
                    key={feature.id}
                    id={feature.id}
                    votes={feature.votes}
                    title={feature.title}
                    category="UPDATE"
                    tags={feature.tags}
                    onVote={() => handleVote(feature.id)}
                    onClick={() => router.push(`/board/${params.id}/feature-request?id=${feature.id}`)}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Launched Column */}
          <Card className="bg-[#2D2B52] border-4 border-[#00FF94] p-6 rounded-2xl">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#00FF94] p-2 rounded-xl">
                  <Trophy className="h-5 w-5 text-[#1E1B3A]" />
                </div>
                <span className="font-bold text-white">Launched</span>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {getFeaturesByStatus("LAUNCHED").map(feature => (
                  <RoadmapItem
                    key={feature.id}
                    id={feature.id}
                    votes={feature.votes}
                    title={feature.title}
                    category="UPDATE"
                    tags={feature.tags}
                    onVote={() => handleVote(feature.id)}
                    onClick={() => router.push(`/board/${params.id}/feature-request?id=${feature.id}`)}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function RoadmapItem({ votes, title, category, tags, onVote, onClick }) {
  return (
    <div className="flex items-start gap-3 cursor-pointer group" onClick={onClick}>
      <Button
        variant="outline"
        size="lg"
        className="bg-[#FF4D6A] hover:bg-[#FF6B84] border-0 text-white font-bold h-19 w-16 flex flex-col items-center justify-center rounded-2xl shadow-[0_4px_0_#CC3D55] hover:shadow-[0_6px_0_#CC3D55] transform hover:-translate-y-0.5 transition-all duration-200 gap-1"
        onClick={(e) => {
          e.stopPropagation();
          onVote();
        }}
      >
        <ArrowUpIcon className="h-4 w-4" />
        <span className="text-lg">{votes}</span>
      </Button>
      <div className="space-y-2 group-hover:translate-x-1 transition-transform duration-200">
        <h3 className="font-bold text-white leading-tight">{title}</h3>
        <div className="flex flex-wrap gap-1">
          {tags && tags.map(tag => (
            <Badge key={tag} className={`${TAG_COLORS[tag]} border-0 text-xs px-2 py-0.5 rounded-lg`}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

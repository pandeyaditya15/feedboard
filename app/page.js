"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Gamepad2, Trophy, Rocket, MessageSquare, Sparkles, ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-[#1E1B3A] bg-[url('/subway-pattern.png')]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD600]/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#2D2B52]/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-[#FFD600]/30">
              <Star className="h-5 w-5 text-[#FFD600]" />
              <span className="text-white font-medium">The Ultimate Game Feedback Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Release updates that your players
              <span className="block text-[#FFD600]">Really want in your games</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-[#B4B4D9]">
              Connect with your players, gather feedback, and build a roadmap that excites your community.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => router.push('/create-board')}
                className="bg-[#FFD600] hover:bg-[#FFE44D] text-[#1E1B3A] font-bold h-12 px-8 rounded-xl shadow-[0_4px_0_#B89B00] hover:shadow-[0_6px_0_#B89B00] transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </Button>
              <Button className="bg-[#2D2B52] hover:bg-[#373964] text-white font-bold h-12 px-8 rounded-xl border-2 border-[#FFD600]/30 hover:border-[#FFD600] transition-all duration-200">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything You Need to Build Better Games
          </h2>
          <p className="text-[#B4B4D9]">Powerful features to help you collect and manage player feedback</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-6 rounded-2xl hover:border-[#FFD600] transition-all duration-300">
            <div className="space-y-4">
              <div className="bg-[#FF4D6A] w-12 h-12 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Player Feedback</h3>
              <p className="text-[#B4B4D9]">
                Collect and organize player suggestions in a structured way. Let players vote on features they want most.
              </p>
            </div>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-6 rounded-2xl hover:border-[#FFD600] transition-all duration-300">
            <div className="space-y-4">
              <div className="bg-[#00C2FF] w-12 h-12 rounded-xl flex items-center justify-center">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Public Roadmap</h3>
              <p className="text-[#B4B4D9]">
                Share your development progress with a beautiful roadmap. Keep players excited about what's coming next.
              </p>
            </div>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-6 rounded-2xl hover:border-[#FFD600] transition-all duration-300">
            <div className="space-y-4">
              <div className="bg-[#9B51E0] w-12 h-12 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Feature Updates</h3>
              <p className="text-[#B4B4D9]">
                Keep your community informed about feature progress. Build excitement with regular status updates.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Product Screenshots */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature Request Screenshot */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-4 rounded-2xl overflow-hidden">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src="/feature-request-preview.png"
                alt="Feature Request Board"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-white mb-2">Feature Request Board</h3>
              <p className="text-[#B4B4D9]">Let players suggest and vote on features they want to see in your game.</p>
            </div>
          </Card>

          {/* Roadmap Screenshot */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-4 rounded-2xl overflow-hidden">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src="/roadmap-preview.png"
                alt="Public Roadmap"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-white mb-2">Public Roadmap</h3>
              <p className="text-[#B4B4D9]">Share your development progress and keep players excited about upcoming features.</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-[#B4B4D9]">Start for free, upgrade when you need more features</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-6 rounded-2xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Free</h3>
                <p className="text-[#B4B4D9] mt-2">Perfect for indie developers</p>
              </div>
              <div className="text-4xl font-bold text-white">$0</div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#B4B4D9]">
                  <Check className="h-5 w-5 text-[#00FF94]" />
                  <span>1 Feedback Board</span>
                </div>
                <div className="flex items-center gap-2 text-[#B4B4D9]">
                  <Check className="h-5 w-5 text-[#00FF94]" />
                  <span>Basic Feature Voting</span>
                </div>
                <div className="flex items-center gap-2 text-[#B4B4D9]">
                  <Check className="h-5 w-5 text-[#00FF94]" />
                  <span>Simple Roadmap</span>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/create-board')}
                className="w-full bg-[#2D2B52] hover:bg-[#373964] text-white font-bold h-12 rounded-xl border-2 border-[#FFD600]/30 hover:border-[#FFD600] transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
          </Card>

          {/* Pro Tier */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600] p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FFD600] text-[#1E1B3A] px-4 py-1 font-bold text-sm transform translate-x-8 rotate-45">
              POPULAR
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Pro</h3>
                <p className="text-[#B4B4D9] mt-2">For growing game studios</p>
              </div>
              <div className="text-4xl font-bold text-white">$24<span className="text-lg text-[#B4B4D9]">/mo</span></div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#B4B4D9]">
                  <Check className="h-5 w-5 text-[#00FF94]" />
                  <span>Unlimited Feedback Boards</span>
                </div>
                <div className="flex items-center gap-2 text-[#B4B4D9]">
                  <Check className="h-5 w-5 text-[#00FF94]" />
                  <span>Advanced Analytics</span>
                </div>
                <div className="flex items-center gap-2 text-[#B4B4D9]">
                  <Check className="h-5 w-5 text-[#00FF94]" />
                  <span>Custom Branding</span>
                </div>
                <div className="flex items-center gap-2 text-[#B4B4D9]">
                  <Check className="h-5 w-5 text-[#00FF94]" />
                  <span>Priority Support</span>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/create-board')}
                className="w-full bg-[#FFD600] hover:bg-[#FFE44D] text-[#1E1B3A] font-bold h-12 rounded-xl shadow-[0_4px_0_#B89B00] hover:shadow-[0_6px_0_#B89B00] transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-[#2D2B52] border-4 border-[#FFD600] p-8 rounded-3xl shadow-[0_0_20px_rgba(255,214,0,0.3)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
              <p className="text-[#B4B4D9] max-w-xl">
                Create your first feedback board and start building the game your players want.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/create-board')}
              className="bg-[#FFD600] hover:bg-[#FFE44D] text-[#1E1B3A] font-bold h-14 px-8 rounded-xl shadow-[0_4px_0_#B89B00] hover:shadow-[0_6px_0_#B89B00] transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              Create Your Board
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#FFD600]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-[#B4B4D9] hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#FFD600]/20 text-center text-[#B4B4D9]">
            © 2024 Feedboard. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}

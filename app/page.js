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

      
      {/* Integration Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-[#1E1B3A]/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Easy Integration</h2>
          <p className="text-[#B4B4D9]">Just two simple steps to add feedback to your game</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Step 1 */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-6 rounded-2xl">
            <div className="space-y-4">
              <div className="bg-[#FFD600] w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-[#1E1B3A] text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-white">Copy Your Board Link</h3>
              <p className="text-[#B4B4D9]">
                After creating your board, copy the unique board URL from your dashboard. It will look like: <code className="bg-[#1E1B3A] px-2 py-1 rounded text-sm">feedback.yourgame.com/board/abc-123</code>
              </p>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-6 rounded-2xl">
            <div className="space-y-4">
              <div className="bg-[#FFD600] w-12 h-12 rounded-xl flex items-center justify-center">
                <span className="text-[#1E1B3A] text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-white">Add Feedback Button</h3>
              <p className="text-[#B4B4D9]">
                Add a feedback button to your game&apos;s ui that opens the board url in a webview. Players can now submit and vote on features without leaving your game.
              </p>
              <div className="bg-[#1E1B3A] p-4 rounded-xl">
                <pre className="text-sm text-[#B4B4D9] overflow-x-auto">
                  <code>{`// Example Unity C# code
                   public void OpenFeedboard() {
                   Application.OpenURL("your-board-url");
                   }`}</code>
                </pre>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-[#B4B4D9]">Start with a 7-day free trial, then choose your plan</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600]/30 p-6 rounded-2xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Monthly</h3>
                <p className="text-[#B4B4D9] mt-2">Flexible month-to-month billing</p>
              </div>
              <div className="text-4xl font-bold text-white">$19<span className="text-lg text-[#B4B4D9]">/mo</span></div>
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
                className="w-full bg-[#2D2B52] hover:bg-[#373964] text-white font-bold h-12 rounded-xl border-2 border-[#FFD600]/30 hover:border-[#FFD600] transition-all duration-200"
              >
                Start Free Trial
              </Button>
            </div>
          </Card>

          {/* Yearly Plan */}
          <Card className="bg-[#2D2B52] border-4 border-[#FFD600] p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FFD600] text-[#1E1B3A] px-4 py-1 font-bold text-sm transform translate-x-8 rotate-45">
             
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Yearly</h3>
                <p className="text-[#B4B4D9] mt-2">Best value for long-term growth</p>
              </div>
              <div className="text-4xl font-bold text-white">$79<span className="text-lg text-[#B4B4D9]">/year</span></div>
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
                Start Free Trial
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

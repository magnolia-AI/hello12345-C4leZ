import * as React from 'react';
import Image from 'next/image';
import { FocusTimer } from '@/components/focus-timer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Headphones, Wind, CloudRain, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Sidebar - Ambient Controls */}
      <aside className="w-full lg:w-72 bg-[#F6F6F3] p-8 border-r border-[#E5E5E5]">
        <div className="space-y-8">
          <div>
            <h2 className="text-black font-bold uppercase tracking-widest text-xs mb-6">Workspace</h2>
            <nav className="space-y-4">
              <a href="#" className="block text-black font-medium hover:opacity-70 transition-opacity">Dashboard</a>
              <a href="#" className="block text-slate-500 font-medium hover:text-black transition-colors">Documents</a>
              <a href="#" className="block text-slate-500 font-medium hover:text-black transition-colors">Analytics</a>
            </nav>
          </div>

          <Separator className="bg-[#E5E5E5]" />

          <div className="space-y-6">
            <h2 className="text-black font-bold uppercase tracking-widest text-xs flex items-center">
              <Headphones className="w-3 h-3 mr-2" /> Soundscape
            </h2>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-white hover:text-black border border-transparent hover:border-[#E5E5E5]">
                <Wind className="w-4 h-4 mr-3" /> White Noise
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-white hover:text-black border border-transparent hover:border-[#E5E5E5]">
                <CloudRain className="w-4 h-4 mr-3" /> Soft Rain
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-white hover:text-black border border-transparent hover:border-[#E5E5E5]">
                <Volume2 className="w-4 h-4 mr-3" /> Lo-Fi Beats
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-20 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-16">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black text-black mb-2">Focus Flow</h1>
              <p className="text-slate-500 max-w-md">Eliminate distractions and find your rhythm. Your productivity canvas starts here.</p>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-[#E5E5E5] text-slate-400 py-1">
              Active Session
            </Badge>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Illustration */}
            <div className="relative aspect-square bg-[#F6F6F3] rounded-2xl overflow-hidden border border-[#E5E5E5]">
              <Image 
                src="/images/focus-illustration.webp" 
                alt="Minimalist workspace illustration" 
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
              />
            </div>

            {/* Right: Timer */}
            <div className="bg-white">
              <FocusTimer />
            </div>
          </div>

          <Separator className="bg-[#E5E5E5]" />

          {/* Bottom: Daily Intent */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-black flex items-center">
                Today&apos;s Core Intentions
              </h3>
              <span className="text-slate-400 text-sm">Top 3 Priority</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "Refine project architecture document",
                "Review team feedback on design system",
                "Clear final backlog for sprint"
              ].map((task, i) => (
                <Card key={i} className="p-6 border-[#E5E5E5] shadow-none hover:border-black transition-colors cursor-pointer group">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2 group-hover:text-black">0{i+1}</span>
                  <p className="text-sm font-medium text-black leading-relaxed">{task}</p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


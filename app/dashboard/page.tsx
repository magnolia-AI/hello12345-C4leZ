'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FocusTimer } from '@/components/focus-timer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Headphones, Wind, CloudRain, Volume2, ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Todo } from '@/components/todo-app';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('notion-todos-v3');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setIsMounted(true);
  }, []);

  const toggleTodo = (id: string) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
    localStorage.setItem('notion-todos-v3', JSON.stringify(updated));
  };

  if (!isMounted) return null;

  // Filter for Top 3: High Priority first, then most recent active
  const topTasks = todos
    .filter(t => !t.completed)
    .sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return 0;
    })
    .slice(0, 3);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Sidebar - Ambient Controls */}
      <aside className="w-full lg:w-72 bg-[#F6F6F3] p-8 border-r border-[#E5E5E5]">
        <div className="space-y-8">
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-black font-bold uppercase tracking-widest text-xs">Workspace</h2>
              <Link href="/">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-black">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <nav className="space-y-4">
              <Link href="/dashboard" className="block text-black font-medium hover:opacity-70 transition-opacity">Focus Flow</Link>
              <Link href="/" className="block text-slate-500 font-medium hover:text-black transition-colors">Full List</Link>
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
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-4xl font-black text-black mb-2 tracking-tighter">Focus Mode</h1>
              <p className="text-slate-500 max-w-md">Synchronized with your Workspace. Mark tasks as high priority to see them here.</p>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-[#E5E5E5] text-slate-400 py-1">
              {todos.filter(t => !t.completed).length} Tasks Pending
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
                Current Focus Area
              </h3>
              <Link href="/" className="text-slate-400 text-sm hover:text-black transition-colors">Edit List →</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topTasks.length > 0 ? (
                topTasks.map((todo, i) => (
                  <Card 
                    key={todo.id} 
                    onClick={() => toggleTodo(todo.id)}
                    className={cn(
                      "p-6 border-[#E5E5E5] shadow-none hover:border-black transition-all cursor-pointer group relative overflow-hidden",
                      todo.priority === 'high' && "border-red-100 bg-red-50/10"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                       <span className={cn(
                         "text-[10px] uppercase font-bold text-slate-400 group-hover:text-black",
                         todo.priority === 'high' && "text-red-500"
                       )}>
                        {todo.priority || `Task 0${i+1}`}
                      </span>
                      <Circle className="w-4 h-4 text-slate-300 group-hover:text-black transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-black leading-relaxed line-clamp-2">{todo.text}</p>
                    
                    {todo.priority === 'high' && (
                      <div className="absolute top-0 right-0 p-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <p className="text-slate-400 mb-4">No active tasks found in your Workspace.</p>
                  <Link href="/">
                    <Button variant="outline" className="rounded-full border-[#E5E5E5]">Create your first task</Button>
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


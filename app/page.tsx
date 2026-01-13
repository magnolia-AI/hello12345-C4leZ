import { TodoApp } from '@/components/todo-app';
import Link from 'next/link';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Subtle Navigation Header */}
      <div className="absolute top-6 right-6 z-10">
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-full gap-2 border-[#E5E5E5] hover:bg-black hover:text-white transition-all shadow-sm group">
            <Target className="w-4 h-4 group-hover:animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest px-1">Focus Mode</span>
          </Button>
        </Link>
      </div>
      
      <TodoApp />
    </main>
  );
}


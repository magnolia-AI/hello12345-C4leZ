import { TodoApp } from '@/components/todo-app';
import Link from 'next/link';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      {/* Subtle Navigation Header */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <ThemeToggle />
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-full gap-2 border-border hover:bg-foreground hover:text-background transition-all shadow-sm group">
            <Target className="w-4 h-4 group-hover:animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest px-1">Focus Mode</span>
          </Button>
        </Link>
      </div>
      
      <TodoApp />
    </main>
  );
}


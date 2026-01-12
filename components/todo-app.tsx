'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notion-todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setIsMounted(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('notion-todos', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  if (!isMounted) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Workspace</h1>
        <p className="text-slate-500">A quiet space for your daily focus.</p>
      </header>

      {/* Input Section */}
      <section className="group">
        <form onSubmit={addTodo} className="flex items-center gap-2 px-1 hover:bg-slate-50 transition-colors rounded-md py-1">
          <Plus className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type '/' for commands or add a task..."
            className="border-none shadow-none focus-visible:ring-0 text-base placeholder:text-slate-400 p-0 h-8"
          />
        </form>
      </section>

      {/* Todo Groups */}
      <div className="space-y-8">
        {/* Active Tasks */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">To Do</h2>
          <div className="space-y-0.5">
            {activeTodos.length === 0 ? (
              <p className="text-sm text-slate-400 px-1 py-2 italic font-light">No pending tasks. Start building...</p>
            ) : (
              activeTodos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={toggleTodo} 
                  onDelete={deleteTodo} 
                />
              ))
            )}
          </div>
        </section>

        {/* Completed Tasks */}
        {completedTodos.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">Completed</h2>
            <div className="space-y-0.5 opacity-60">
              {completedTodos.map(todo => (
                <TodoItem 
                  key={todo.id} 
                  todo={todo} 
                  onToggle={toggleTodo} 
                  onDelete={deleteTodo} 
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function TodoItem({ 
  todo, 
  onToggle, 
  onDelete 
}: { 
  todo: Todo, 
  onToggle: (id: string) => void,
  onDelete: (id: string) => void
}) {
  return (
    <div className="group flex items-center justify-between py-1.5 px-1 hover:bg-slate-50 rounded-md transition-all duration-200">
      <div className="flex items-center gap-3 flex-1">
        <button 
          onClick={() => onToggle(todo.id)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          {todo.completed ? (
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
          )}
        </button>
        <span className={cn(
          "text-base transition-all duration-300",
          todo.completed ? "text-slate-400 line-through" : "text-foreground"
        )}>
          {todo.text}
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}


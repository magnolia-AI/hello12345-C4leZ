'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableTodoItem } from './sortable-item';
import { cn } from '@/lib/utils';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export const COMMANDS = [
  { id: 'high', label: 'High Priority', icon: '🔴', color: 'text-red-500' },
  { id: 'medium', label: 'Medium Priority', icon: '🟠', color: 'text-orange-500' },
  { id: 'low', label: 'Low Priority', icon: '🔵', color: 'text-blue-500' },
  { id: 'clear', label: 'No Priority', icon: '⚪', color: 'text-slate-400' },
];

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [activePriority, setActivePriority] = useState<Todo['priority']>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const saved = localStorage.getItem('notion-todos-v3');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('notion-todos-v3', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setShowCommands(val.startsWith('/'));
  };

  const applyCommand = (cmd: string) => {
    if (cmd === 'high' || cmd === 'medium' || cmd === 'low') {
      setActivePriority(cmd as Todo['priority']);
    } else if (cmd === 'clear') {
      setActivePriority(undefined);
    }
    setInputValue('');
    setShowCommands(false);
    inputRef.current?.focus();
  };

  const addTodo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      priority: activePriority,
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
    setActivePriority(undefined);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!isMounted) return null;

  const activeTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Workspace
        </h1>
        <p className="text-slate-500">Click a task to edit or change its priority.</p>
      </header>

      {/* Input Section */}
      <section className="relative group">
        <form onSubmit={addTodo} className="flex items-center gap-2 px-1 hover:bg-slate-50 transition-colors rounded-md py-1">
          <div className="flex items-center gap-2 min-w-max">
            {activePriority ? (
               <span className={cn(
                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border leading-none bg-white shadow-sm",
                activePriority === 'high' ? 'text-red-500 border-red-100' : 
                activePriority === 'medium' ? 'text-orange-500 border-orange-100' : 'text-blue-500 border-blue-100'
              )}>
                {activePriority}
              </span>
            ) : (
              <Plus className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
            )}
          </div>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type '/' for priorities..."
            className="border-none shadow-none focus-visible:ring-0 text-base placeholder:text-slate-400 p-0 h-8 font-light"
          />
        </form>

        {showCommands && (
          <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] z-50 mt-1 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Command className="w-3 h-3" />
              Priorities
            </div>
            {COMMANDS.map((cmd) => (
              <button
                key={cmd.id}
                type="button"
                onClick={() => applyCommand(cmd.id)}
                className="w-full flex items-center gap-3 px-3 py-1.5 hover:bg-slate-50 text-sm text-left transition-colors"
              >
                <span className="text-base">{cmd.icon}</span>
                <span className="flex-1 font-medium text-slate-700">{cmd.label}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="space-y-8">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1 inline-block border-b border-transparent">To Do</h2>
            <div className="space-y-0.5 min-h-[50px]">
              <SortableContext items={activeTodos} strategy={verticalListSortingStrategy}>
                {activeTodos.map(todo => (
                  <SortableTodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onToggle={toggleTodo} 
                    onDelete={deleteTodo}
                    onUpdate={updateTodo}
                  />
                ))}
              </SortableContext>
            </div>
          </section>

          {completedTodos.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">Completed</h2>
              <div className="space-y-0.5 opacity-70">
                <SortableContext items={completedTodos} strategy={verticalListSortingStrategy}>
                  {completedTodos.map(todo => (
                    <SortableTodoItem 
                      key={todo.id} 
                      todo={todo} 
                      onToggle={toggleTodo} 
                      onDelete={deleteTodo}
                      onUpdate={updateTodo}
                    />
                  ))}
                </SortableContext>
              </div>
            </section>
          )}
        </div>
      </DndContext>
    </div>
  );
}


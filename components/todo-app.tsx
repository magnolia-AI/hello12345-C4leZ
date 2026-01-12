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

const COMMANDS = [
  { id: 'high', label: 'High Priority', icon: '🔴', color: 'text-red-500' },
  { id: 'medium', label: 'Medium Priority', icon: '🟠', color: 'text-orange-500' },
  { id: 'low', label: 'Low Priority', icon: '🔵', color: 'text-blue-500' },
  { id: 'clear', label: 'Clear Priority', icon: '⚪', color: 'text-slate-400' },
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
    const saved = localStorage.getItem('notion-todos-v2');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('notion-todos-v2', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.startsWith('/')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
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

    // Handle commands during submit if not clicked
    if (inputValue.startsWith('/')) {
      const cmd = inputValue.slice(1).toLowerCase();
      const found = COMMANDS.find(c => c.id.startsWith(cmd));
      if (found) {
        applyCommand(found.id);
        return;
      }
    }

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
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Workspace
        </h1>
        <p className="text-slate-500">Organize your thoughts with slash commands and drag & drop.</p>
      </header>

      {/* Input Section with Slash Commands */}
      <section className="relative group">
        <form onSubmit={addTodo} className="flex items-center gap-2 px-1 hover:bg-slate-50 transition-colors rounded-md py-1 border-b border-transparent focus-within:border-slate-100">
          <div className="flex items-center gap-2 min-w-max">
            {activePriority ? (
               <span className={cn(
                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border leading-none bg-white",
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
            placeholder="Type '/' for priority commands..."
            className="border-none shadow-none focus-visible:ring-0 text-base placeholder:text-slate-400 p-0 h-8 font-light"
          />
        </form>

        {/* Slash Command Menu */}
        {showCommands && (
          <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 mt-2 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Command className="w-3 h-3" />
              Commands
            </div>
            {COMMANDS.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => applyCommand(cmd.id)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 text-sm text-left transition-colors"
              >
                <span className="text-base">{cmd.icon}</span>
                <span className="flex-1 font-medium text-slate-700">{cmd.label}</span>
                {inputValue.slice(1).toLowerCase() === cmd.id[0] && (
                  <span className="text-[10px] bg-slate-100 text-slate-400 px-1 py-0.5 rounded uppercase">Enter</span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Todo Groups with DND Context */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="space-y-8">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">To Do</h2>
            <div className="space-y-0.5">
              <SortableContext 
                items={activeTodos}
                strategy={verticalListSortingStrategy}
              >
                {activeTodos.length === 0 ? (
                  <p className="text-sm text-slate-400 px-1 py-2 italic font-light">Empty workspace.</p>
                ) : (
                  activeTodos.map(todo => (
                    <SortableTodoItem 
                      key={todo.id} 
                      todo={todo} 
                      onToggle={toggleTodo} 
                      onDelete={deleteTodo} 
                    />
                  ))
                )}
              </SortableContext>
            </div>
          </section>

          {completedTodos.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-1">Completed</h2>
              <div className="space-y-0.5 opacity-60">
                {completedTodos.map(todo => (
                  <SortableTodoItem 
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
      </DndContext>
    </div>
  );
}


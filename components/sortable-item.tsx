'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Todo, COMMANDS } from './todo-app';

interface SortableTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
}

export function SortableTodoItem({ 
  todo, 
  onToggle, 
  onDelete,
  onUpdate
}: SortableTodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleTextSubmit = () => {
    if (editText.trim() && editText !== todo.text) {
      onUpdate(todo.id, { text: editText.trim() });
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTextSubmit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const priorityColors = {
    high: 'bg-red-50 text-red-600 border-red-100',
    medium: 'bg-orange-50 text-orange-600 border-orange-100',
    low: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "group flex items-center justify-between py-1 px-1 hover:bg-slate-50/80 rounded-md transition-all duration-200 bg-white border border-transparent",
        isDragging && "shadow-xl scale-[1.01] border-slate-200 z-50",
        isEditing && "bg-slate-50 border-slate-100"
      )}
    >
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <button 
          onClick={() => onToggle(todo.id)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded shrink-0"
        >
          {todo.completed ? (
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
          )}
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0 ml-1">
          {isEditing ? (
            <Input
              ref={inputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleTextSubmit}
              onKeyDown={handleKeyDown}
              className="border-none shadow-none focus-visible:ring-0 text-base p-0 h-7 bg-transparent w-full"
            />
          ) : (
            <span 
              onClick={() => setIsEditing(true)}
              className={cn(
                "text-base transition-all duration-300 truncate cursor-text py-0.5 w-full",
                todo.completed ? "text-slate-400 line-through" : "text-foreground"
              )}
            >
              {todo.text}
            </span>
          )}

          {/* Priority Badge with Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "text-[10px] uppercase font-black px-1.5 py-0.5 rounded border leading-none tracking-tighter shrink-0 transition-opacity opacity-0 group-hover:opacity-100",
                todo.priority ? priorityColors[todo.priority] : "text-slate-300 border-slate-100 hover:bg-slate-50",
                todo.priority && "opacity-100"
              )}>
                {todo.priority || "Set"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-white">
              {COMMANDS.map((cmd) => (
                <DropdownMenuItem 
                  key={cmd.id}
                  onClick={() => onUpdate(todo.id, { priority: cmd.id === 'clear' ? undefined : cmd.id as any })}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span>{cmd.icon}</span>
                  <span className="text-xs font-medium">{cmd.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 ml-1"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}


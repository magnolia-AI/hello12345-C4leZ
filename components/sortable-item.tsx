'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, CheckCircle2, Circle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { Todo } from './todo-app';

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
  const editInputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id, disabled: isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  const priorityColors = {
    high: 'bg-red-50 text-red-600 border-red-100',
    medium: 'bg-orange-50 text-orange-600 border-orange-100',
    low: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (editText.trim() !== todo.text) {
      onUpdate(todo.id, { text: editText.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "group flex items-center justify-between py-1 px-1 hover:bg-slate-50 rounded-md transition-all duration-200 bg-white",
        isDragging && "shadow-lg scale-[1.02] border border-slate-200 ring-2 ring-blue-500/10"
      )}
    >
      <div className="flex items-center gap-1 flex-1">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners} 
          className={cn(
            "cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition-opacity",
            isEditing ? "opacity-0 pointer-events-none" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <button 
          onClick={() => onToggle(todo.id)}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded shrink-0 ml-1"
        >
          {todo.completed ? (
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
          )}
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0 ml-1">
          {isEditing ? (
            <input
              ref={editInputRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none focus:ring-0 text-base p-0"
            />
          ) : (
            <span 
              onClick={() => setIsEditing(true)}
              className={cn(
                "text-base transition-all duration-300 truncate cursor-text",
                todo.completed ? "text-slate-400 line-through" : "text-foreground"
              )}
            >
              {todo.text}
            </span>
          )}

          {/* Priority Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border leading-none tracking-tight flex items-center gap-1 transition-all",
                todo.priority ? priorityColors[todo.priority] : "opacity-0 group-hover:opacity-100 bg-white text-slate-400 border-slate-200"
              )}>
                {todo.priority || 'No Priority'}
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onUpdate(todo.id, { priority: 'high' })}>
                <span className="mr-2">🔴</span> High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(todo.id, { priority: 'medium' })}>
                <span className="mr-2">🟠</span> Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(todo.id, { priority: 'low' })}>
                <span className="mr-2">🔵</span> Low
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdate(todo.id, { priority: undefined })}>
                <span className="mr-2">⚪</span> None
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}


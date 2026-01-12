'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export function SortableTodoItem({ 
  todo, 
  onToggle, 
  onDelete 
}: { 
  todo: Todo, 
  onToggle: (id: string) => void,
  onDelete: (id: string) => void
}) {
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
        "group flex items-center justify-between py-1.5 px-1 hover:bg-slate-50 rounded-md transition-all duration-200 bg-white",
        isDragging && "shadow-lg scale-[1.02] border border-slate-200 ring-2 ring-blue-500/10"
      )}
    >
      <div className="flex items-center gap-1 flex-1">
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 transition-opacity"
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

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-base transition-all duration-300 truncate",
              todo.completed ? "text-slate-400 line-through" : "text-foreground"
            )}>
              {todo.text}
            </span>
            {todo.priority && (
              <span className={cn(
                "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border leading-none tracking-tight",
                priorityColors[todo.priority]
              )}>
                {todo.priority}
              </span>
            )}
          </div>
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


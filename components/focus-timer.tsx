'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function FocusTimer() {
  const [minutes, setMinutes] = React.useState(25);
  const [seconds, setSeconds] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [mode, setMode] = React.useState<'focus' | 'break'>('focus');

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsActive(false);
          // Auto-switch mode
          if (mode === 'focus') {
            setMode('break');
            setMinutes(5);
          } else {
            setMode('focus');
            setMinutes(25);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setMinutes(25);
    setSeconds(0);
  };

  const progress = mode === 'focus' 
    ? ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100
    : ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100;

  return (
    <Card className="p-8 border-none shadow-none bg-transparent flex flex-col items-center justify-center space-y-6">
      <div className="flex items-center space-x-2 text-slate-500 uppercase tracking-widest text-xs font-semibold">
        {mode === 'focus' ? (
          <><Target className="w-4 h-4" /> <span>Deep Work</span></>
        ) : (
          <><Coffee className="w-4 h-4" /> <span>Short Break</span></>
        )}
      </div>

      <div className="text-8xl font-black tracking-tighter text-black">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="w-full max-w-xs h-1 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex space-x-4 pt-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={resetTimer}
          className="rounded-full border-[#E5E5E5] hover:bg-slate-50"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button 
          variant="default" 
          size="lg" 
          onClick={toggleTimer}
          className="rounded-full px-8 bg-black hover:bg-zinc-800 text-white"
        >
          {isActive ? (
            <><Pause className="w-4 h-4 mr-2" /> Pause</>
          ) : (
            <><Play className="w-4 h-4 mr-2" /> Start Flow</>
          )}
        </Button>
      </div>
    </Card>
  );
}


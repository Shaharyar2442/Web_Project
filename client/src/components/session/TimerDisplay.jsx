import React, { useState, useEffect } from 'react';

const TimerDisplay = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    
    const start = new Date(startTime).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      setElapsed(Math.floor((now - start) / 1000));
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="font-mono text-xl font-bold tracking-widest text-primary drop-shadow-[0_0_5px_rgba(139,0,0,0.5)] bg-background px-3 py-1 rounded-sm border border-borderDark">
      {formatTime(elapsed)}
    </div>
  );
};

export default TimerDisplay;

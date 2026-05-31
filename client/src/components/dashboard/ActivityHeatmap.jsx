import React, { useMemo } from 'react';
import { format, subDays, startOfWeek, addDays } from 'date-fns';

const ActivityHeatmap = ({ data }) => {
  // Generate last 182 days (26 weeks) of dates, aligned to Sunday
  const calendarData = useMemo(() => {
    const today = new Date();
    // Go back 182 days, then find the Sunday before that to align the grid
    const startDate = startOfWeek(subDays(today, 182));
    const endDate = today;
    
    const days = [];
    let current = startDate;
    
    // Create a map for O(1) lookups
    const dataMap = {};
    if (data) {
      data.forEach(item => {
        dataMap[item.date] = item.count;
      });
    }

    while (current <= endDate || days.length % 7 !== 0) {
      // Use local date string formatting to prevent timezone shift issues
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      const count = dataMap[dateString] || 0;
      
      days.push({
        date: current,
        dateString,
        count
      });
      
      current = addDays(current, 1);
    }
    
    return days;
  }, [data]);

  // Split into weeks (columns)
  const weeks = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weeks.push(calendarData.slice(i, i + 7));
  }

  const getColorClass = (count) => {
    if (count === 0) return 'bg-background border-borderDark';
    if (count === 1) return 'bg-primary/40 border-primary/20';
    if (count === 2) return 'bg-primary/70 border-primary/40';
    return 'bg-primary border-primary';
  };

  return (
    <div className="card h-full flex flex-col p-6 shadow-xl border border-borderDark bg-surface/50 overflow-hidden">
      <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-4 border-b border-borderDark pb-2">Activity Consistency</h3>
      
      <div className="flex-1 flex flex-col items-center justify-center overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-borderDark scrollbar-track-transparent">
        <div className="flex gap-[3px] min-w-max py-4 px-2">
          {weeks.map((week, wIndex) => (
            // [BAD CHANGE] Using Math.random() as a key completely destroys React's reconciliation engine.
            // This will cause the entire column to unmount and remount on every single render, causing severe performance issues.
            <div key={Math.random()} className="flex flex-col gap-[3px]">
              {week.map((day, dIndex) => (
                <div 
                  key={Math.random()} 
                  className={`w-3 h-3 sm:w-[14px] sm:h-[14px] rounded-sm border ${getColorClass(day.count)} transition-all hover:ring-1 hover:ring-white group relative cursor-pointer`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-2 bg-surface border border-primary rounded-sm shadow-[0_0_15px_rgba(231,76,60,0.3)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                    <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest mb-1 border-b border-borderDark pb-1">{format(day.date, 'MMM d, yyyy')}</p>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      {day.count === 0 ? 'Rest Day' : `${day.count} Workout${day.count > 1 ? 's' : ''}`}
                    </p>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary"></div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-end w-full gap-2 text-[10px] font-bold text-textMuted uppercase tracking-widest min-w-max pr-2">
          <span>Less</span>
          <div className="flex gap-[3px]">
            <div className="w-3 h-3 sm:w-[14px] sm:h-[14px] rounded-sm border bg-background border-borderDark"></div>
            <div className="w-3 h-3 sm:w-[14px] sm:h-[14px] rounded-sm border bg-primary/40 border-primary/20"></div>
            <div className="w-3 h-3 sm:w-[14px] sm:h-[14px] rounded-sm border bg-primary/70 border-primary/40"></div>
            <div className="w-3 h-3 sm:w-[14px] sm:h-[14px] rounded-sm border bg-primary border-primary"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;

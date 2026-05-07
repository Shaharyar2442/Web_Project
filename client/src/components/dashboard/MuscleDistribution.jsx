import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useUnit } from '../../hooks/useUnit';

const COLORS = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71', '#e67e22', '#1abc9c', '#34495e'];

const CustomTooltip = ({ active, payload }) => {
  const { displayWeight } = useUnit();
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-borderDark p-3 rounded-sm shadow-xl z-50">
        <p className="text-white font-bold mb-2 uppercase tracking-widest text-xs border-b border-borderDark pb-1">{payload[0].name}</p>
        <p className="text-sm font-bold flex justify-between gap-4" style={{ color: payload[0].payload.fill }}>
          <span>Volume:</span>
          <span>{displayWeight(payload[0].value)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const MuscleDistribution = ({ data }) => {
  const { displayWeight } = useUnit();

  if (!data || data.length === 0) {
    return (
      <div className="card h-full flex flex-col p-6 shadow-xl border border-borderDark bg-surface/50">
        <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-6">Muscle Volume Distribution</h3>
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-borderDark rounded-sm">
          <p className="text-xs font-bold text-textMuted uppercase tracking-widest">No muscle data recorded yet.</p>
        </div>
      </div>
    );
  }

  // Calculate total for percentages
  const totalVolume = data.reduce((sum, item) => sum + item.value, 0);

  const dataWithPercentage = data.map((entry, index) => ({
    ...entry,
    percentage: ((entry.value / totalVolume) * 100).toFixed(1),
    fill: COLORS[index % COLORS.length]
  }));

  return (
    <div className="card h-full flex flex-col p-6 shadow-xl border border-borderDark bg-surface/50">
      <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-4 border-b border-borderDark pb-2">Muscle Volume Distribution</h3>
      
      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercentage}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {dataWithPercentage.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-[10px] text-textMuted font-bold uppercase tracking-widest">Total Volume</p>
            <p className="text-2xl font-bold text-white leading-none">{displayWeight(totalVolume)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-4">
        {dataWithPercentage.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: entry.fill }}></div>
            <div className="flex flex-col truncate">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-none truncate" title={entry.name}>{entry.name}</span>
              <span className="text-[9px] font-bold text-textMuted uppercase tracking-widest mt-1">{entry.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MuscleDistribution;

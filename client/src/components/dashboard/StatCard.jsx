import React from 'react';

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="card p-6 flex flex-col items-center justify-center text-center shadow-lg border-t-2 border-t-transparent hover:border-t-primary transition-all bg-surface">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
        <Icon size={24} />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-[10px] font-bold text-textMuted uppercase tracking-widest">{title}</p>
    </div>
  );
};

export default StatCard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Activity, Dumbbell, Layers, Play } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import HistoryRow from '../../components/dashboard/HistoryRow';
import ActivityHeatmap from '../../components/dashboard/ActivityHeatmap';
import MuscleDistribution from '../../components/dashboard/MuscleDistribution';
import { useAuth } from '../../context/AuthContext';
import { useUnit } from '../../hooks/useUnit';

const Dashboard = () => {
  const { user } = useAuth();
  const { displayWeight } = useUnit();
  const navigate = useNavigate();
  const [data, setData] = useState({ sessions: [], stats: { totalWorkouts: 0, totalVolume: 0, totalSets: 0 } });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/sessions/history');
      setData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const startFreestyle = () => {
    navigate('/session/start');
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="w-16 h-16 border-4 border-borderDark border-t-primary rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl text-white font-bold mb-2 tracking-wide">HQ DASHBOARD</h1>
          <p className="text-textMuted uppercase tracking-widest font-bold">Welcome back, <span className="text-primary">{user?.name}</span></p>
        </div>
        
        <button onClick={startFreestyle} className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center shadow-lg hover:shadow-primary/20 transition-all py-4 px-8 text-lg">
          <Play size={20} fill="currentColor" /> QUICK START
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard title="Total Workouts" value={data.stats.totalWorkouts.toLocaleString()} icon={Activity} />
        <StatCard title="Weekly Goal" value={`${data.stats.weeklySessions || 0} / ${user?.weeklyGoal || 3}`} icon={Play} />
        <StatCard title="Total Volume" value={displayWeight(data.stats.totalVolume)} icon={Dumbbell} />
        <StatCard title="Sets Completed" value={data.stats.totalSets.toLocaleString()} icon={Layers} />
      </div>

      {/* Analytics Overview */}
      {data.sessions.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6 border-b border-borderDark pb-2">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-2">Analytics Overview</h2>
            <span className="text-xs font-bold text-textMuted uppercase bg-surface px-2 py-1 rounded-sm">Data</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ActivityHeatmap data={data.stats.heatmapData} />
            </div>
            <div>
              <MuscleDistribution data={data.stats.muscleData} />
            </div>
          </div>
        </div>
      )}

      {/* History Feed */}
      <div>
        <div className="flex justify-between items-center mb-6 border-b border-borderDark pb-2">
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Recent Activity</h2>
          <span className="text-xs font-bold text-textMuted uppercase bg-surface px-2 py-1 rounded-sm">History</span>
        </div>

        {data.sessions.length === 0 ? (
          <div className="card py-20 text-center flex flex-col items-center justify-center text-textMuted border-dashed">
            <Dumbbell size={48} className="mb-4 opacity-50" />
            <p className="text-xl font-bold mb-2 text-white">NO HISTORY YET</p>
            <p className="text-sm">Start your first workout to begin tracking.</p>
            <button onClick={startFreestyle} className="btn-secondary mt-6 border-dashed">START FREESTYLE</button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.sessions.slice(0, 5).map((session) => (
              <HistoryRow key={session._id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, Award, Calendar } from 'lucide-react';

const ProgressDashboard = () => {
  const [prs, setPrs] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPRs();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      fetchChartData(selectedExercise, timeRange);
    }
  }, [selectedExercise, timeRange]);

  const fetchPRs = async () => {
    try {
      const { data } = await api.get('/progress/prs');
      setPrs(data);
      if (data.length > 0) {
        setSelectedExercise(data[0].exercise);
      }
    } catch (error) {
      toast.error('Failed to fetch personal records');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChartData = async (exerciseId, range) => {
    try {
      const { data } = await api.get(`/progress/charts/${exerciseId}?timeRange=${range}`);
      const formattedData = data.map(d => ({
        ...d,
        displayDate: format(new Date(d.date), 'MMM d')
      }));
      setChartData(formattedData);
    } catch (error) {
      toast.error('Failed to fetch chart data');
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-borderDark p-3 rounded-sm shadow-2xl">
          <p className="text-white font-bold mb-2 uppercase tracking-widest text-xs border-b border-borderDark pb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-bold uppercase tracking-wider flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span>{entry.value} {entry.name === 'Total Volume' ? 'kg' : 'kg'}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="flex h-[60vh] items-center justify-center"><div className="w-16 h-16 border-4 border-borderDark border-t-primary rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="pb-20 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl text-white font-bold mb-2 tracking-wide uppercase">Performance Lab</h1>
        <p className="text-textMuted uppercase tracking-widest font-bold">Track your all-time records and strength progression</p>
      </div>

      {/* PR Board */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6 border-b border-borderDark pb-2">
          <Award className="text-secondary" size={24} />
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest">PR Board</h2>
        </div>

        {prs.length === 0 ? (
          <div className="card py-16 text-center text-textMuted border-dashed">
            <Award size={48} className="mb-4 opacity-50 mx-auto text-secondary" />
            <p className="text-xl font-bold text-white mb-2 uppercase tracking-widest">NO RECORDS YET</p>
            <p className="text-sm uppercase font-bold tracking-wider">Complete a workout to log your first personal record.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {prs.map(pr => (
              <div 
                key={pr._id}
                onClick={() => setSelectedExercise(pr.exercise)}
                className={`card p-4 cursor-pointer transition-all border-l-4 shadow-md group ${selectedExercise === pr.exercise ? 'border-l-secondary bg-surface/80' : 'border-l-transparent hover:border-l-primary hover:bg-surface/50'}`}
              >
                <h3 className="text-lg font-bold text-white uppercase truncate group-hover:text-primary transition-colors">{pr.exerciseName}</h3>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-secondary leading-none mb-1">{pr.weight} <span className="text-sm text-textMuted">kg</span></p>
                    <p className="text-[10px] font-bold text-textMuted uppercase tracking-wider">x {pr.reps} reps</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-textMuted uppercase tracking-widest mb-1">Est 1RM</p>
                    <p className="text-xl font-bold text-white leading-none">{Math.round(pr.estimatedOneRM * 10) / 10} <span className="text-xs text-textMuted">kg</span></p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-[9px] font-bold text-textLight uppercase tracking-widest bg-background border border-borderDark px-2 py-1.5 rounded-sm w-fit">
                  <Calendar size={10} className="text-primary" />
                  {format(new Date(pr.date), 'MMM d, yyyy')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strength Charts */}
      {prs.length > 0 && selectedExercise && (
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-borderDark pb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Strength Analytics</h2>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <select 
                className="input-field py-2.5 px-3 text-xs font-bold uppercase tracking-wider w-full sm:w-56 bg-surface border-borderDark focus:border-primary"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
              >
                {prs.map(pr => (
                  <option key={pr.exercise} value={pr.exercise}>{pr.exerciseName}</option>
                ))}
              </select>

              <select 
                className="input-field py-2.5 px-3 text-xs font-bold uppercase tracking-wider w-full sm:w-40 bg-surface border-borderDark focus:border-primary"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="180">Last 6 Months</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="card py-16 text-center text-textMuted border-dashed">
              <p className="uppercase tracking-widest font-bold text-sm">No historical data found for this exercise in the selected time range.</p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Max Weight Line Chart */}
              <div className="card p-4 sm:p-6 shadow-xl border border-borderDark bg-surface/50">
                <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-6 border-b border-borderDark pb-2">Max Weight Over Time</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                      <XAxis dataKey="displayDate" stroke="#888" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} tickMargin={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#888" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2a2a2a', strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="maxWeight" name="Max Weight" stroke="#e74c3c" strokeWidth={3} dot={{ r: 4, fill: '#1a1a1a', stroke: '#e74c3c', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#e74c3c', stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Estimated 1RM Line Chart */}
              <div className="card p-4 sm:p-6 shadow-xl border border-borderDark bg-surface/50">
                <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-6 border-b border-borderDark pb-2">Estimated 1RM Progression</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                      <XAxis dataKey="displayDate" stroke="#888" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} tickMargin={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#888" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2a2a2a', strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="estimated1RM" name="Estimated 1RM" stroke="#f1c40f" strokeWidth={3} dot={{ r: 4, fill: '#1a1a1a', stroke: '#f1c40f', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#f1c40f', stroke: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Total Volume Bar Chart */}
              <div className="card p-4 sm:p-6 shadow-xl border border-borderDark bg-surface/50">
                <h3 className="text-xs font-bold text-textMuted uppercase tracking-widest mb-6 border-b border-borderDark pb-2">Total Session Volume</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                      <XAxis dataKey="displayDate" stroke="#888" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} tickMargin={10} axisLine={false} tickLine={false} />
                      <YAxis stroke="#888" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1a1a1a', opacity: 0.5 }} />
                      <Bar dataKey="totalVolume" name="Total Volume" fill="#3498db" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;

import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Dumbbell, Search, UserCheck, UserX, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const StatCardAdmin = ({ title, value, icon: Icon }) => (
  <div className="card p-6 flex items-center justify-between border-b-2 border-b-primary shadow-lg bg-surface">
    <div>
      <p className="text-xs text-textMuted font-bold uppercase tracking-widest mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className="w-12 h-12 rounded-full bg-background border border-borderDark flex items-center justify-center text-primary shadow-inner">
      <Icon size={24} />
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New Global Exercise Form
  const [exForm, setExForm] = useState({
    name: '',
    muscleGroup: 'Chest',
    category: 'Barbell',
    defaultUnit: 'kg'
  });

  const muscleGroups = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Full Body', 'Cardio'];
  const categories = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Cardio'];

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'overview') {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } else if (activeTab === 'users') {
        const { data } = await api.get('/admin/users');
        setUsers(data);
      }
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: data.isActive } : u));
      toast.success(data.isActive ? 'User activated' : 'User deactivated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: data.role } : u));
      toast.success(`User role updated to ${data.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleCreateGlobalExercise = async (e) => {
    e.preventDefault();
    try {
      await api.post('/exercises/global', exForm);
      toast.success('Global exercise created successfully');
      setExForm({ ...exForm, name: '' }); // reset name only
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create global exercise');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-secondary/10 rounded-sm flex items-center justify-center border border-secondary text-secondary">
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Admin Control</h1>
          <p className="text-xs text-textMuted font-bold uppercase tracking-widest mt-1">Platform Management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-borderDark overflow-x-auto pb-2">
        {['overview', 'users', 'exercises'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-t-sm whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-primary text-white border-b-2 border-primary' 
                : 'text-textMuted hover:text-white hover:bg-surface/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-borderDark border-t-primary rounded-full animate-spin"></div></div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in">
              <StatCardAdmin title="Total Users" value={stats.totalUsers} icon={Users} />
              <StatCardAdmin title="Global Exercises" value={stats.totalGlobalExercises} icon={Dumbbell} />
              <StatCardAdmin title="Sessions Logged" value={stats.totalCompletedSessions.toLocaleString()} icon={Activity} />
              <StatCardAdmin title="Platform Volume" value={`${(stats.totalVolume / 1000).toFixed(1)}k kg`} icon={Shield} />
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-widest">User Management</h2>
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface border border-borderDark rounded-sm py-2 pl-10 pr-4 text-sm text-textLight focus:border-primary outline-none"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-textMuted" />
                </div>
              </div>

              <div className="bg-surface border border-borderDark rounded-sm overflow-hidden overflow-x-auto shadow-xl">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-background border-b border-borderDark">
                      <th className="p-4 text-xs font-bold text-textMuted uppercase tracking-widest">User</th>
                      <th className="p-4 text-xs font-bold text-textMuted uppercase tracking-widest">Role</th>
                      <th className="p-4 text-xs font-bold text-textMuted uppercase tracking-widest">Status</th>
                      <th className="p-4 text-xs font-bold text-textMuted uppercase tracking-widest">Joined</th>
                      <th className="p-4 text-xs font-bold text-textMuted uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id} className="border-b border-borderDark/50 hover:bg-background/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-white">{u.name} {u._id === currentUser._id && <span className="text-[10px] text-primary ml-2 border border-primary px-1 rounded-sm">(You)</span>}</p>
                          <p className="text-xs text-textMuted">{u.email}</p>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${u.role === 'admin' ? 'bg-secondary/10 text-secondary border border-secondary/30' : 'bg-background border border-borderDark text-textMuted'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${u.isActive ? 'text-primary' : 'text-error'}`}>
                            {u.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {u.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-textLight">
                          {format(new Date(u.createdAt), 'MMM d, yyyy')}
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleToggleRole(u._id, u.role)}
                            disabled={u._id === currentUser._id}
                            className="p-2 bg-background border border-borderDark rounded-sm text-textMuted hover:text-white hover:border-textMuted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Toggle Role"
                          >
                            <ShieldAlert size={16} />
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(u._id, u.isActive)}
                            disabled={u._id === currentUser._id || u.role === 'admin'}
                            className={`p-2 bg-background border border-borderDark rounded-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${u.isActive ? 'text-error hover:border-error' : 'text-primary hover:border-primary'}`}
                            title={u.isActive ? "Deactivate User" : "Activate User"}
                          >
                            {u.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-textMuted">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Exercises Tab */}
          {activeTab === 'exercises' && (
            <div className="animate-in fade-in max-w-2xl">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6">Add Global Exercise</h2>
              <form onSubmit={handleCreateGlobalExercise} className="card p-6 sm:p-8 shadow-xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Exercise Name</label>
                    <input
                      type="text"
                      required
                      value={exForm.name}
                      onChange={(e) => setExForm({...exForm, name: e.target.value})}
                      className="input-field"
                      placeholder="e.g., Barbell Bench Press"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Target Muscle Group</label>
                      <select
                        value={exForm.muscleGroup}
                        onChange={(e) => setExForm({...exForm, muscleGroup: e.target.value})}
                        className="input-field"
                      >
                        {muscleGroups.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Equipment Category</label>
                      <select
                        value={exForm.category}
                        onChange={(e) => setExForm({...exForm, category: e.target.value})}
                        className="input-field"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Default Unit</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="defaultUnit" 
                          value="kg" 
                          checked={exForm.defaultUnit === 'kg'} 
                          onChange={(e) => setExForm({...exForm, defaultUnit: e.target.value})}
                          className="accent-primary w-4 h-4"
                        />
                        <span className="text-sm font-bold text-white">Kilograms (kg)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="defaultUnit" 
                          value="lbs" 
                          checked={exForm.defaultUnit === 'lbs'} 
                          onChange={(e) => setExForm({...exForm, defaultUnit: e.target.value})}
                          className="accent-primary w-4 h-4"
                        />
                        <span className="text-sm font-bold text-white">Pounds (lbs)</span>
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full mt-4">
                    CREATE GLOBAL EXERCISE
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;

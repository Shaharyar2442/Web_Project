import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Settings, Shield, AlertTriangle, Upload, LogOut } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forms State
  const [generalForm, setGeneralForm] = useState({
    name: user?.name || '',
    unitPreference: user?.unitPreference || 'kg',
    weeklyGoal: user?.weeklyGoal || 3,
    profilePhoto: user?.profilePhoto || ''
  });

  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Handle Image Upload (convert to base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Image must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGeneralForm({ ...generalForm, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateGeneral = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.put('/users/profile', generalForm);
      setUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.put('/users/email', emailForm);
      setUser(data);
      setEmailForm({ newEmail: '', password: '' });
      toast.success('Email updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("New passwords don't match");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.put('/users/password', passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setIsSubmitting(true);
    try {
      await api.delete('/users/account');
      toast.success('Account deleted successfully');
      await logout();
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to delete account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center border border-primary text-primary">
          <Settings size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Account Settings</h1>
          <p className="text-xs text-textMuted font-bold uppercase tracking-widest mt-1">
            Joined {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'Unknown'}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`text-left px-4 py-3 font-bold text-sm uppercase tracking-widest rounded-sm transition-colors ${activeTab === 'general' ? 'bg-surface border-l-4 border-primary text-white' : 'text-textMuted hover:bg-surface hover:text-white border-l-4 border-transparent'}`}
          >
            General Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`text-left px-4 py-3 font-bold text-sm uppercase tracking-widest rounded-sm transition-colors ${activeTab === 'security' ? 'bg-surface border-l-4 border-secondary text-white' : 'text-textMuted hover:bg-surface hover:text-white border-l-4 border-transparent'}`}
          >
            Security
          </button>
          <button 
            onClick={() => setActiveTab('danger')}
            className={`text-left px-4 py-3 font-bold text-sm uppercase tracking-widest rounded-sm transition-colors ${activeTab === 'danger' ? 'bg-surface border-l-4 border-error text-white' : 'text-textMuted hover:bg-surface hover:text-white border-l-4 border-transparent'}`}
          >
            Danger Zone
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="card p-6 sm:p-8 shadow-xl animate-in fade-in slide-in-from-right-4">
              <h2 className="text-2xl font-bold text-white uppercase tracking-widest border-b border-borderDark pb-4 mb-6">Profile Information</h2>
              
              <form onSubmit={handleUpdateGeneral} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-borderDark/50">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-borderDark bg-background flex items-center justify-center">
                      {generalForm.profilePhoto ? (
                        <img src={generalForm.profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-textMuted uppercase">{generalForm.name?.charAt(0)}</span>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                      <Upload size={20} className="text-white mb-1" />
                      <span className="text-[10px] text-white uppercase font-bold tracking-widest">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest mb-1">Avatar Image</p>
                    <p className="text-xs text-textMuted">Max size 2MB. 1:1 aspect ratio recommended.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={generalForm.name}
                    onChange={(e) => setGeneralForm({...generalForm, name: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Unit Preference</label>
                    <div className="flex gap-4 p-3 bg-background border border-borderDark rounded-sm">
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input 
                          type="radio" 
                          name="unitPref" 
                          value="kg" 
                          checked={generalForm.unitPreference === 'kg'} 
                          onChange={(e) => setGeneralForm({...generalForm, unitPreference: e.target.value})}
                          className="accent-primary w-4 h-4"
                        />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Kilograms (kg)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input 
                          type="radio" 
                          name="unitPref" 
                          value="lbs" 
                          checked={generalForm.unitPreference === 'lbs'} 
                          onChange={(e) => setGeneralForm({...generalForm, unitPreference: e.target.value})}
                          className="accent-primary w-4 h-4"
                        />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Pounds (lbs)</span>
                      </label>
                    </div>
                    <p className="text-[10px] text-textMuted mt-2 uppercase tracking-widest">Changes display values immediately site-wide.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Weekly Goal (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      required
                      value={generalForm.weeklyGoal}
                      onChange={(e) => setGeneralForm({...generalForm, weeklyGoal: parseInt(e.target.value)})}
                      className="input-field"
                    />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-4">
                  {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="card p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 border-b border-borderDark pb-4 mb-6">
                  <Shield className="text-secondary" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Email Address</h2>
                </div>
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Current Email</label>
                    <input type="email" disabled value={user?.email || ''} className="input-field opacity-50 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">New Email Address</label>
                    <input type="email" required value={emailForm.newEmail} onChange={(e) => setEmailForm({...emailForm, newEmail: e.target.value})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Verify Current Password</label>
                    <input type="password" required value={emailForm.password} onChange={(e) => setEmailForm({...emailForm, password: e.target.value})} className="input-field" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-secondary w-full">UPDATE EMAIL</button>
                </form>
              </div>

              <div className="card p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-3 border-b border-borderDark pb-4 mb-6">
                  <Shield className="text-secondary" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-widest">Change Password</h2>
                </div>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Current Password</label>
                    <input type="password" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">New Password</label>
                    <input type="password" required value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">Confirm New Password</label>
                    <input type="password" required value={passwordForm.confirmNewPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmNewPassword: e.target.value})} className="input-field" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-secondary w-full">UPDATE PASSWORD</button>
                </form>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="card p-6 sm:p-8 shadow-xl border border-error/30 bg-error/5 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-3 border-b border-error/20 pb-4 mb-6">
                <AlertTriangle className="text-error" />
                <h2 className="text-2xl font-bold text-error uppercase tracking-widest">Danger Zone</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-textLight">
                  Deleting your account is permanent. Your email address will be anonymized, your profile will be erased, and you will lose all access to your routines and workout history.
                </p>
                <p className="text-sm text-textLight font-bold">
                  For platform integrity, your past workout data will remain in global statistics, but it will no longer be associated with you.
                </p>

                <div className="bg-background border border-borderDark p-4 rounded-sm mt-6">
                  <label className="block text-xs font-bold text-textMuted uppercase tracking-widest mb-2">
                    Type <span className="text-error">DELETE</span> to confirm
                  </label>
                  <input 
                    type="text" 
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="DELETE"
                    className="w-full bg-surface border border-borderDark rounded-sm p-3 text-white focus:outline-none focus:border-error transition-colors"
                  />
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== 'DELETE' || isSubmitting}
                    className="w-full mt-4 py-3 px-6 bg-error/10 text-error border border-error rounded-sm font-bold tracking-widest uppercase hover:bg-error hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    <LogOut size={18} /> PERMANENTLY DELETE MY ACCOUNT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

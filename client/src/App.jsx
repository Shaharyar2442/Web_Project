import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ExerciseLibrary from './pages/exercises/ExerciseLibrary';
import RoutineList from './pages/routines/RoutineList';
import RoutineBuilder from './pages/routines/RoutineBuilder';
import LiveSession from './pages/session/LiveSession';
import Dashboard from './pages/dashboard/Dashboard';
import SessionDetail from './pages/dashboard/SessionDetail';
import ProgressDashboard from './pages/progress/ProgressDashboard';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-6xl md:text-8xl text-primary mb-6 drop-shadow-[0_0_10px_rgba(139,0,0,0.3)]">
      LOG IT. LIFT IT. BREAK IT.
    </h1>
    <p className="text-xl text-textMuted max-w-2xl">
      Phase 3: Authentication Frontend integrated.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Toaster position="top-center" toastOptions={{
            style: { background: '#1a1a1a', color: '#e8e8e8', border: '1px solid #2a2a2a' },
            success: { iconTheme: { primary: '#2d6a2d', secondary: '#e8e8e8' } },
            error: { iconTheme: { primary: '#e74c3c', secondary: '#e8e8e8' } }
          }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/exercises" element={<ExerciseLibrary />} />
              <Route path="/routines" element={<RoutineList />} />
              <Route path="/routines/create" element={<RoutineBuilder />} />
              <Route path="/routines/edit/:id" element={<RoutineBuilder />} />
              <Route path="/session/start" element={<LiveSession />} />
              <Route path="/history/:id" element={<SessionDetail />} />
              <Route path="/progress" element={<ProgressDashboard />} />
              {/* More protected routes will go here in future phases */}
            </Route>
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Placeholder Home component for Phase 1
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-6xl md:text-8xl text-primary mb-6 drop-shadow-[0_0_10px_rgba(139,0,0,0.3)]">
      LOG IT. LIFT IT. BREAK IT.
    </h1>
    <p className="text-xl text-textMuted max-w-2xl">
      Phase 1 scaffolding complete. Dashboard coming in future phases.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

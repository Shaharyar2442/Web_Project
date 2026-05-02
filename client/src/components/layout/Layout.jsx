import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-8 z-10 relative">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

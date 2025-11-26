
import React from 'react';
import Sidebar from './Sidebar';

const XGenAIDashboard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
};

export default XGenAIDashboard;


import React from 'react';
import Header from './Header';
import Footer from './Footer';

const CompanyLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-[#050B14] flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CompanyLayout;

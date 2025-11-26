
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ChemIcon } from '../icons/ChemIcon';

// Mobile Menu Icon
const MenuIcon: React.FC<{ isOpen: boolean; onClick: () => void }> = ({ isOpen, onClick }) => (
  <button onClick={onClick} className="md:hidden text-white focus:outline-none">
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
);

const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavLinkClass = (path: string, exact = false) => {
    const isActive = exact 
        ? location.pathname === path 
        : location.pathname.startsWith(path);
        
    return `text-sm font-medium transition-colors hover:text-molecular-teal ${
      isActive ? 'text-molecular-teal' : 'text-gray-300'
    }`;
  };

  const getMobileNavLinkClass = (path: string, exact = false) => {
      const isActive = exact 
          ? location.pathname === path 
          : location.pathname.startsWith(path);
          
      return `block px-4 py-2 text-base font-medium transition-colors ${
        isActive ? 'text-molecular-teal bg-white/5 border-l-4 border-molecular-teal' : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`;
  };

  return (
    <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled || mobileMenuOpen ? 'bg-[#050B14]/90 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-6'
        }`}
    >
      <nav className="container mx-auto px-6">
        <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-molecular-teal to-brand-blue p-1.5 rounded-lg group-hover:shadow-[0_0_15px_rgba(0,196,154,0.5)] transition-all">
                <ChemIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white tracking-wide">ChemXGen</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getNavLinkClass('/', true)}>Home</Link>
            <Link to="/product" className={getNavLinkClass('/product')}>Technology</Link>
            <Link to="/projects" className={getNavLinkClass('/projects')}>Projects</Link>
            <Link to="/pricing" className={getNavLinkClass('/pricing')}>Pricing</Link>
            <Link to="/about" className={getNavLinkClass('/about')}>About</Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
            {loading ? (
                <div className="w-32 h-9 bg-white/10 rounded-lg animate-pulse"></div>
            ) : user ? (
                <Link
                to="/app"
                className="bg-white/10 border border-white/10 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-molecular-teal hover:text-deep-blue hover:border-molecular-teal transition-all"
                >
                Dashboard
                </Link>
            ) : (
                <>
                <Link
                    to="/login"
                    className="hidden sm:inline-block text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                    Sign In
                </Link>
                <Link
                    to="/login"
                    className="bg-molecular-teal text-deep-blue px-5 py-2 rounded-lg text-sm font-bold hover:shadow-[0_0_20px_rgba(0,196,154,0.4)] transition-all"
                >
                    Get Started
                </Link>
                </>
            )}
            </div>

            {/* Mobile Menu Button */}
            <MenuIcon isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 animate-fade-in">
                <div className="flex flex-col space-y-2">
                    <Link to="/" className={getMobileNavLinkClass('/', true)} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link to="/product" className={getMobileNavLinkClass('/product')} onClick={() => setMobileMenuOpen(false)}>Technology</Link>
                    <Link to="/projects" className={getMobileNavLinkClass('/projects')} onClick={() => setMobileMenuOpen(false)}>Projects</Link>
                    <Link to="/pricing" className={getMobileNavLinkClass('/pricing')} onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <Link to="/about" className={getMobileNavLinkClass('/about')} onClick={() => setMobileMenuOpen(false)}>About</Link>
                    
                    <div className="border-t border-white/10 pt-4 mt-2">
                        {user ? (
                            <Link to="/app" className="block w-full text-center bg-molecular-teal text-deep-blue px-5 py-3 rounded-lg font-bold" onClick={() => setMobileMenuOpen(false)}>
                                Go to Dashboard
                            </Link>
                        ) : (
                            <div className="flex flex-col space-y-3 px-4">
                                <Link to="/login" className="block w-full text-center text-white border border-white/20 py-2 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                <Link to="/login" className="block w-full text-center bg-molecular-teal text-deep-blue py-2 rounded-lg font-bold" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </nav>
    </header>
  );
};

export default Header;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ChemIcon } from '../icons/ChemIcon';
import { DashboardIcon } from '../icons/DashboardIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { LogoutIcon } from '../icons/LogoutIcon';
import { ListIcon } from '../icons/ListIcon';
import { DnaIcon } from '../icons/DnaIcon';

const Sidebar: React.FC = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();

    const getLinkClass = (path: string, exact = false) => {
        const isActive = exact 
            ? location.pathname === path 
            : location.pathname.startsWith(path);
            
        return `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
        isActive
            ? 'bg-accent-cyan/10 text-accent-cyan font-semibold'
            : 'text-dark-text-secondary hover:bg-dark-card hover:text-white'
        }`;
    };

  return (
    <aside className="w-64 bg-dark-bg border-r border-dark-border flex flex-col p-4">
      <div className="flex items-center space-x-2 mb-8 p-2">
        <ChemIcon className="w-8 h-8 text-accent-cyan" />
        <div>
           <h1 className="font-display font-bold text-xl text-white">XGen AI</h1>
           <p className="text-xs text-dark-text-secondary">Powered by ChemXGen</p>
        </div>
      </div>
      <nav className="flex-1 flex flex-col space-y-2">
        <Link to="/app" className={getLinkClass('/app', true)}>
          <DashboardIcon className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link to="/app/tasks" className={getLinkClass('/app/tasks')}>
            <ListIcon className="w-5 h-5" />
            <span>Tasks & Results</span>
        </Link>
         <Link to="/app/training" className={getLinkClass('/app/training')}>
            <DnaIcon className="w-5 h-5" />
            <span>AI Model Training</span>
        </Link>
        <Link to="/app/billing" className={getLinkClass('/app/billing')}>
            <SettingsIcon className="w-5 h-5" />
            <span>Billing & Plan</span>
        </Link>
      </nav>
      <div className="mt-auto">
        <div className="border-t border-dark-border my-4"></div>
        <Link to="/" className="text-center text-sm text-dark-text-secondary hover:text-white block py-2">
            &larr; Back to Company Site
        </Link>
        <div className="flex items-center space-x-3 p-2 mt-2">
          {user?.photo_url && <img src={user.photo_url} alt={user.display_name || 'User'} className="w-10 h-10 rounded-full" />}
          <div>
            <p className="text-white font-semibold">{user?.display_name}</p>
            <p className="text-xs text-dark-text-secondary">{user?.email}</p>
          </div>
          <button onClick={signOut} className="ml-auto text-dark-text-secondary hover:text-white" title="Logout">
              <LogoutIcon className="w-5 h-5"/>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

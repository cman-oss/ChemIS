
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import CompanyLayout from './components/company/CompanyLayout';
import HomePage from './components/company/HomePage';
import AboutPage from './components/company/AboutPage';
import ProductPage from './components/company/ProductPage';
import ProjectsPage from './components/company/ProjectsPage';
import ProjectDetailPage from './components/company/ProjectDetailPage';
import ContactPage from './components/company/ContactPage';
import PrivacyPage from './components/company/PrivacyPage';
import TermsPage from './components/company/TermsPage';
import XGenAIDashboard from './components/dashboard/XGenAIDashboard';
import DashboardHome from './components/dashboard/DashboardHome';
import Workspace from './components/dashboard/Workspace';
import Billing from './components/dashboard/Billing';
import AuthPage from './components/auth/AuthPage';
import PricingPage from './components/company/PricingPage';
import TasksPage from './components/dashboard/TasksPage';
import ModelTrainingPage from './components/dashboard/ModelTrainingPage';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-dark-bg min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl font-display animate-pulse">
          Initializing ChemXGen Platform...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen font-sans">
      <HashRouter>
        <Routes>
            {/* Auth Route */}
            <Route path="/login" element={user ? <Navigate to="/app" replace /> : <AuthPage />} />

            {/* XGen AI Product Routes (Authenticated) */}
            <Route path="/app/*" element={
                user ? (
                    <XGenAIDashboard>
                        <Routes>
                            <Route index element={<DashboardHome />} />
                            <Route path="tasks" element={<TasksPage />} />
                            <Route path="training" element={<ModelTrainingPage />} />
                            <Route path="workspace/:projectId" element={<Workspace />} />
                            <Route path="billing" element={<Billing />} />
                            <Route path="*" element={<Navigate to="/app" replace />} />
                        </Routes>
                    </XGenAIDashboard>
                ) : (
                    <Navigate to="/login" replace />
                )
            } />

            {/* Company Website Routes */}
            <Route path="/*" element={
                <CompanyLayout>
                    <Routes>
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="product" element={<ProductPage />} />
                        <Route path="pricing" element={<PricingPage />} />
                        <Route path="projects" element={<ProjectsPage />} />
                        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="privacy" element={<PrivacyPage />} />
                        <Route path="terms" element={<TermsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </CompanyLayout>
            } />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;

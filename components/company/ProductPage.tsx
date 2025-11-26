
import React from 'react';
import PageHeader from '../common/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { DnaIcon } from '../icons/DnaIcon';
import { FlaskIcon } from '../icons/FlaskIcon';
import { GridIcon } from '../icons/GridIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

const features = [
  {
    icon: DnaIcon,
    name: 'Molecular Structure Generation',
    description: 'Design novel molecules from scratch or optimize existing ones based on desired property profiles.',
    color: 'text-molecular-teal',
    bg: 'bg-molecular-teal/10',
    border: 'border-molecular-teal/20'
  },
  {
    icon: FlaskIcon,
    name: 'Property Prediction',
    description: 'Accurately predict ADMET, physicochemical, and quantum mechanical properties with our fine-tuned models.',
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10',
    border: 'border-brand-blue/20'
  },
  {
    icon: GridIcon,
    name: 'Toxicity Prediction',
    description: 'De-risk your candidates early by identifying potential toxicological liabilities with high accuracy.',
    color: 'text-accent-magenta',
    bg: 'bg-accent-magenta/10',
    border: 'border-accent-magenta/20'
  },
  {
    icon: SearchIcon,
    name: 'Chemical Similarity Search',
    description: 'Search vast chemical spaces for structurally or functionally similar compounds in seconds.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20'
  }
];

const ProductPage: React.FC = () => {
  const { signInWithGoogle, user } = useAuth();

  return (
    <div className="animate-fade-in bg-[#050B14] min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-molecular-teal/10 rounded-full blur-[100px] animate-pulse"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
         </div>

         <div className="container mx-auto px-6 relative z-10 text-center">
             <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
                <SparklesIcon className="w-4 h-4 text-molecular-teal" />
                <span className="text-sm font-medium text-gray-300 tracking-wide">Next Gen Intelligence</span>
             </div>
             
             <h1 className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
                 What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-molecular-teal to-brand-blue">XGen AI?</span>
             </h1>
             
             <p className="mt-6 text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
                 XGen AI is more than just a tool; it's a collaborative research partner. It combines the predictive power of deep learning with a sophisticated understanding of chemical principles, providing an intuitive workspace where you can design, analyze, and strategize your next breakthrough.
             </p>

             <div className="mt-10">
                 <button 
                    onClick={user ? () => window.location.hash = '#/app' : signInWithGoogle}
                    className="px-8 py-4 bg-molecular-teal text-deep-blue rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(0,196,154,0.4)] transition-all transform hover:-translate-y-1"
                 >
                    {user ? 'Launch Workspace' : 'Start Designing Now'}
                 </button>
             </div>
         </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={feature.name} 
                className={`bg-[#0D1117] p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 group hover:-translate-y-2 relative overflow-hidden`}
              >
                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-xl ${feature.bg} ${feature.border} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-2xl text-white mb-3 group-hover:text-molecular-teal transition-colors">
                            {feature.name}
                        </h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {feature.description}
                        </p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-[#0A0F16] border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-molecular-teal to-brand-blue rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                 <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    <img src="https://picsum.photos/seed/workspace_dark/800/600" alt="XGen AI Workspace" className="w-full h-auto opacity-90 group-hover:scale-105 transition-transform duration-700"/>
                    
                    {/* UI Overlay Mockup */}
                    <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 flex items-center justify-between">
                         <div className="flex items-center space-x-3">
                             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-sm font-mono text-molecular-teal">Analysis Complete</span>
                         </div>
                         <span className="text-xs text-gray-400">98.5% Accuracy</span>
                    </div>
                 </div>
            </div>
            
            <div className="md:w-1/2">
                <h2 className="text-4xl font-display font-bold text-white mb-6">A Unified Workspace for <br/>Modern R&D</h2>
                <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    Stop switching between dozens of disconnected software tools. XGen AI integrates every stage of the lifecycle into a single, seamless environment designed for speed.
                </p>
                <ul className="space-y-4">
                    {[
                        'Interactive chemical editor and 3D viewer',
                        'Real-time AI predictions and analysis',
                        'Automated synthesis pathway planning',
                        'Secure project management and collaboration'
                    ].map((item, i) => (
                        <li key={i} className="flex items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-molecular-teal/30 transition-colors">
                            <CheckIcon className="w-5 h-5 text-molecular-teal mr-3 flex-shrink-0" />
                            <span className="text-gray-200">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

    </div>
  );
};

export default ProductPage;

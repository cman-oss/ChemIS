import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { DnaIcon } from '../icons/DnaIcon';
import { FlaskIcon } from '../icons/FlaskIcon';
import { GridIcon } from '../icons/GridIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { CheckIcon } from '../icons/CheckIcon';
import MoleculeHeroAnimation from './MoleculeHeroAnimation';

const Hero: React.FC = () => {
    const { user, signInWithGoogle, loading } = useAuth();
    const navigate = useNavigate();

    const handleExplore = () => {
        if (user) {
            navigate('/app');
        } else {
            signInWithGoogle();
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050B14]">
            {/* High Quality Background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                 <div className="absolute inset-0 bg-gradient-to-b from-[#050B14] via-[#0A121F] to-[#050B14]"></div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-molecular-teal/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 pt-24 pb-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="text-left animate-slide-in-up">
                         <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-molecular-teal opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-molecular-teal"></span>
                            </span>
                            <span className="text-sm font-medium text-gray-300 tracking-wide">XGen Ultra Model Live</span>
                        </div>

                        <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight text-white tracking-tight mb-6">
                            Synthesize the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-molecular-teal to-brand-blue">
                                Impossible
                            </span>
                        </h1>

                        <p className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
                            Accelerate discovery with the world's most advanced Generative Molecular AI. From hypothesis to validated synthesis in days, not years.
                        </p>

                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <button
                                onClick={handleExplore}
                                disabled={loading}
                                className="group px-8 py-4 bg-molecular-teal text-deep-blue rounded-xl font-bold text-lg transition-all hover:bg-white hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] flex items-center"
                            >
                                {loading ? 'Loading...' : (user ? 'Launch Dashboard' : 'Start Researching')}
                                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <Link to="/product" className="px-8 py-4 text-gray-300 font-medium hover:text-white transition-colors flex items-center">
                                View Documentation
                            </Link>
                        </div>
                        
                        <div className="mt-12 flex items-center gap-6 text-sm text-gray-500 font-mono">
                             <div className="flex items-center gap-2">
                                 <CheckIcon className="w-4 h-4 text-green-500" /> 99.9% Uptime
                             </div>
                             <div className="flex items-center gap-2">
                                 <CheckIcon className="w-4 h-4 text-green-500" /> SOC2 Compliant
                             </div>
                        </div>
                    </div>

                    {/* 3D Visual */}
                    <div className="relative h-[500px] lg:h-[700px] w-full animate-fade-in flex items-center justify-center">
                         <div className="absolute inset-0 bg-gradient-to-tr from-molecular-teal/10 to-transparent rounded-full blur-3xl opacity-30"></div>
                         <MoleculeHeroAnimation scale={1.2} rotateSpeed={0.3} primaryColor="#00C49A" secondaryColor="#1F2937" />
                         
                         {/* Floating Cards */}
                         <div className="absolute top-1/4 right-0 bg-[#0D1117]/80 backdrop-blur border border-white/10 p-4 rounded-xl shadow-2xl animate-bounce" style={{ animationDuration: '4s' }}>
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-molecular-teal/20 flex items-center justify-center text-molecular-teal">
                                     <SparklesIcon className="w-5 h-5" />
                                 </div>
                                 <div>
                                     <div className="text-xs text-gray-400 font-mono">Yield Prediction</div>
                                     <div className="text-white font-bold">94.2% ± 1.2%</div>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const BentoGrid: React.FC = () => {
    return (
        <section className="py-24 bg-[#050B14] relative border-t border-white/5">
            <div className="container mx-auto px-6 relative z-10">
                 <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Engineered for <span className="text-molecular-teal">Breakthroughs</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">Integrated intelligent workflows for the modern computational chemist.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Generative Design */}
                    <div className="md:col-span-2 row-span-1 bg-[#0D1117] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-molecular-teal/30 transition-colors">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-molecular-teal/10 rounded-xl flex items-center justify-center text-molecular-teal mb-4">
                                <DnaIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Generative Molecular Design</h3>
                            <p className="text-gray-400 max-w-md">Input a target profile and let AI hallucinate valid candidates.</p>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none">
                             <MoleculeHeroAnimation scale={0.6} rotateSpeed={0.6} primaryColor="#33D3E7" />
                        </div>
                    </div>

                    {/* Retrosynthesis */}
                    <div className="md:col-span-1 row-span-2 bg-[#0D1117] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                                <GridIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Retrosynthesis</h3>
                            <p className="text-gray-400 text-sm mb-8">Optimal routes with cost & safety weighting.</p>
                            
                            <div className="flex-1 flex flex-col gap-2">
                                {[1,2,3].map(i => (
                                    <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full border border-purple-500/30 flex items-center justify-center text-[10px] text-purple-400">{i}</div>
                                        <div className="h-2 bg-white/10 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Property Prediction */}
                    <div className="bg-[#0D1117] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                         <div className="relative z-10">
                             <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                                <FlaskIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">ADMET Prediction</h3>
                            <p className="text-sm text-gray-400">Instant physicochemical profiling.</p>
                        </div>
                    </div>

                    {/* Live Collaboration */}
                     <div className="bg-[#0D1117] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-yellow-400/30 transition-colors">
                         <div className="relative z-10">
                             <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400 mb-4">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Live Collaboration</h3>
                            <p className="text-sm text-gray-400">Real-time team workspaces.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const HomePage: React.FC = () => {
  return (
    <div className="bg-[#050B14] text-white font-sans selection:bg-molecular-teal selection:text-deep-blue">
      <Hero />
      <BentoGrid />
      <section className="py-24 border-t border-white/5">
           <div className="container mx-auto px-6 text-center">
               <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Ready to break the boundaries?</h2>
               <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                   Join the scientific revolution. Experience the power of ChemXGen today.
               </p>
               <Link to="/login" className="inline-block bg-white text-deep-blue px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors">
                  Get Started Now
               </Link>
           </div>
      </section>
    </div>
  );
};

export default HomePage;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Project } from '../../types';
import ProjectCard from './ProjectCard';
import { SearchIcon } from '../icons/SearchIcon';
import { GridIcon } from '../icons/GridIcon';
import { ListIcon } from '../icons/ListIcon';
import { getUserProjects } from '../../services/projectService';
import ChemicalEditor, { ChemicalEditorRef } from './ChemicalEditor';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { UploadIcon } from '../icons/UploadIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { ClockIcon } from '../icons/ClockIcon';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const editorRef = useRef<ChemicalEditorRef>(null);
  
  // Dashboard State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [smilesInput, setSmilesInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sidebar Parameter State
  const [activeModel, setActiveModel] = useState('ultra'); 
  const [searchType, setSearchType] = useState<'route' | 'substructure' | 'optimization' | 'property' | 'toxicity'>('route');
  const [maxRoutes, setMaxRoutes] = useState(5); // Default to 5 to show at least 4-5 routes
  const [maxTime, setMaxTime] = useState(30);
  const [maxDepth, setMaxDepth] = useState(12);
  const [riskLevel, setRiskLevel] = useState('Low');
  const [database, setDatabase] = useState('all');
  const [strictMode, setStrictMode] = useState(true);
  
  // Mock Search History
  const [showHistory, setShowHistory] = useState(false);
  const searchHistory = [
      "c1ccccc1",
      "CC(=O)Oc1ccccc1C(=O)O",
      "CN1C=NC2=C1C(=O)N(C(=O)N2C)C"
  ];

  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        setLoading(true);
        try {
          const userProjects = await getUserProjects(user.id);
          setProjects(userProjects);
        } catch (error) {
          console.error("Failed to fetch user projects", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    }
  }, [user]);

  const handleSmilesInput = async (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
      if ((e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter') || e.type === 'blur') {
          if (smilesInput && editorRef.current) {
              await editorRef.current.setMolecule(smilesInput);
              setShowHistory(false);
          }
      }
  };

  const handleClearStructure = () => {
      if (editorRef.current) {
          editorRef.current.setMolecule(''); 
          setSmilesInput('');
      }
  };

  const handleSearch = async () => {
      let tool = 'synthesis';
      if (searchType === 'route') tool = 'synthesis';
      if (searchType === 'substructure') tool = 'similarity';
      if (searchType === 'optimization') tool = 'prediction';
      if (searchType === 'property') tool = 'property';
      if (searchType === 'toxicity') tool = 'toxicity';

      let molecule = '';
      if (editorRef.current) {
          try {
              molecule = await editorRef.current.getSmiles();
          } catch (e) {
              console.warn("Failed to get SMILES, falling back to Molfile", e);
          }
          if (!molecule || molecule.trim() === '') {
              molecule = await editorRef.current.getMolfile();
          }
      }

      const isEditorEmpty = !molecule || molecule.trim() === '' || (molecule.includes('0  0  0  0  0  0') && molecule.includes('V2000'));
      if (isEditorEmpty && smilesInput && smilesInput.trim() !== '') {
          molecule = smilesInput;
      }

      navigate(`/app/tasks`, { 
          state: { 
              newSearch: {
                  id: `task-${Date.now()}`,
                  tool, 
                  molecule, 
                  settings: {
                      model: activeModel,
                      maxRoutes,
                      maxTime,
                      maxDepth,
                      riskLevel,
                      database,
                      strictMode,
                      searchType
                  },
                  timestamp: new Date().toISOString()
              }
          }
      });
  };

  return (
    <div className="animate-fade-in flex flex-col h-full bg-[#0D1117] p-2 gap-4">
      {/* Top Bar Area */}
      <div className="flex gap-4">
           {/* Smart Search Bar */}
          <div className="flex-1 relative z-20">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-molecular-teal" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-10 py-3 border border-dark-border rounded-xl leading-5 bg-dark-card text-white placeholder-dark-text-secondary focus:outline-none focus:bg-[#1C2128] focus:ring-1 focus:ring-molecular-teal focus:border-molecular-teal shadow-lg transition-all font-mono text-sm"
                    placeholder="Enter SMILES, CAS, or Name to analyze..."
                    value={smilesInput}
                    onChange={(e) => setSmilesInput(e.target.value)}
                    onKeyDown={handleSmilesInput}
                    onFocus={() => setShowHistory(true)}
                    onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                />
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                    <button 
                        onClick={() => {
                            if (smilesInput && editorRef.current) {
                                 editorRef.current.setMolecule(smilesInput);
                            }
                        }}
                        className="text-xs bg-molecular-teal/10 text-molecular-teal px-2 py-1 rounded hover:bg-molecular-teal/20 transition-colors font-semibold"
                    >
                        Render
                    </button>
                </div>
                
                {/* Search History Dropdown */}
                {showHistory && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden animate-slide-in-up">
                        <div className="px-3 py-2 text-xs font-bold text-dark-text-secondary uppercase tracking-wider bg-dark-bg/50">Recent Searches</div>
                        {searchHistory.map((hist, i) => (
                            <button 
                                key={i}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-molecular-teal flex items-center gap-3 transition-colors font-mono"
                                onClick={() => {
                                    setSmilesInput(hist);
                                    if(editorRef.current) editorRef.current.setMolecule(hist);
                                }}
                            >
                                <ClockIcon className="w-4 h-4 text-gray-500" />
                                {hist}
                            </button>
                        ))}
                    </div>
                )}
          </div>
          
          <div className="flex items-center gap-2">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-3 rounded-xl border border-dark-border transition-all ${sidebarOpen ? 'bg-molecular-teal text-deep-blue shadow-[0_0_15px_rgba(0,196,154,0.3)]' : 'bg-dark-card text-gray-400 hover:text-white'}`}
              >
                  <SparklesIcon className="w-5 h-5" />
              </button>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-4 min-h-0">
          
          {/* Left: Editor Canvas */}
          <div className="flex-1 bg-[#161B22] border border-dark-border rounded-2xl overflow-hidden flex flex-col shadow-xl relative group">
             {/* Glow effect on border */}
             <div className="absolute inset-0 border-2 border-transparent group-hover:border-molecular-teal/20 rounded-2xl pointer-events-none transition-colors duration-500"></div>
             
             <div className="p-3 bg-[#0D1117] border-b border-dark-border flex justify-between items-center">
                 <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500"></div>
                     <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                     <div className="w-2 h-2 rounded-full bg-green-500"></div>
                     <h3 className="text-sm font-semibold text-gray-400 ml-2">Molecular Editor</h3>
                 </div>
                 <button onClick={() => handleClearStructure()} className="text-xs text-red-400 hover:bg-red-400/10 px-2 py-1 rounded transition-colors">Clear Canvas</button>
             </div>
             <div className="flex-1 relative bg-white">
                 <ChemicalEditor ref={editorRef} onMoleculeChange={() => {}} initialMoleculeMol={null} />
             </div>
          </div>

          {/* Right: Collapsible Parameter Sidebar */}
          <div className={`${sidebarOpen ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-10 pointer-events-none'} transition-all duration-300 flex-shrink-0 bg-dark-card border border-dark-border rounded-2xl flex flex-col overflow-hidden shadow-2xl`}>
              <div className="p-4 bg-gradient-to-r from-molecular-teal/10 to-transparent border-b border-dark-border flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-molecular-teal" />
                  <h2 className="font-bold text-white">Analysis Config</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin scrollbar-thumb-dark-border">
                  
                  {/* Model Selection */}
                  <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Engine</label>
                      <select 
                        value={activeModel} 
                        onChange={(e) => setActiveModel(e.target.value)}
                        className="w-full bg-[#0D1117] border border-dark-border rounded px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-molecular-teal outline-none transition-shadow"
                      >
                          <option value="standard">Standard (Speed)</option>
                          <option value="ultra">ChemXGen-Ultra (99.9% Acc)</option>
                          <option value="custom">Custom Trained Model V1</option>
                      </select>
                  </div>

                  {/* Search Types */}
                  <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Task Type</label>
                      <div className="space-y-1">
                          {[
                              { id: 'route', label: 'Retrosynthesis Route' },
                              { id: 'substructure', label: 'Similarity Search' },
                              { id: 'property', label: 'ADMET Profiling' },
                              { id: 'toxicity', label: 'Toxicity Check' },
                              { id: 'optimization', label: 'Condition Opt.' },
                          ].map((type) => (
                               <label key={type.id} className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${searchType === type.id ? 'bg-molecular-teal/10 border border-molecular-teal/30' : 'hover:bg-white/5 border border-transparent'}`}>
                                  <input 
                                    type="radio" 
                                    name="searchType" 
                                    checked={searchType === type.id} 
                                    onChange={() => setSearchType(type.id as any)} 
                                    className="hidden" 
                                  />
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${searchType === type.id ? 'border-molecular-teal' : 'border-gray-600'}`}>
                                      {searchType === type.id && <div className="w-2 h-2 rounded-full bg-molecular-teal"></div>}
                                  </div>
                                  <span className={`text-sm ${searchType === type.id ? 'text-white font-medium' : 'text-gray-400'}`}>{type.label}</span>
                               </label>
                          ))}
                      </div>
                  </div>

                  {/* Parameters Grid */}
                  <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parameters</label>
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="text-[10px] text-gray-500 mb-1 block">Max Routes</label>
                              <input type="number" value={maxRoutes} onChange={(e) => setMaxRoutes(Number(e.target.value))} className="w-full bg-[#0D1117] border border-dark-border rounded px-2 py-1.5 text-sm text-white text-center" />
                          </div>
                          <div>
                              <label className="text-[10px] text-gray-500 mb-1 block">Depth</label>
                              <input type="number" value={maxDepth} onChange={(e) => setMaxDepth(Number(e.target.value))} className="w-full bg-[#0D1117] border border-dark-border rounded px-2 py-1.5 text-sm text-white text-center" />
                          </div>
                      </div>
                       <div>
                            <label className="text-[10px] text-gray-500 mb-1 block">Risk Tolerance</label>
                            <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)} className="w-full bg-[#0D1117] border border-dark-border rounded px-2 py-1.5 text-sm text-white">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                  </div>

              </div>
              
              <div className="p-5 border-t border-dark-border bg-[#0D1117]">
                  <button onClick={handleSearch} className="w-full py-3 bg-gradient-to-r from-molecular-teal to-brand-blue rounded-xl text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(0,196,154,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                      <SparklesIcon className="w-4 h-4" /> Run Analysis
                  </button>
              </div>
          </div>
      </div>
      
      {/* Recent Projects Strip (Compact) */}
      <div className="h-16 flex items-center border-t border-dark-border pt-2 overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-dark-border pb-2">
          <span className="text-xs font-bold text-gray-500 uppercase flex-shrink-0">Recent:</span>
          {loading ? (
             <div className="w-32 h-8 bg-white/5 animate-pulse rounded"></div>
          ) : projects.length === 0 ? (
             <span className="text-xs text-gray-600 italic">No recent projects</span>
          ) : (
             projects.slice(0, 5).map(p => (
                 <div key={p.id} className="flex-shrink-0 bg-dark-card border border-dark-border hover:border-molecular-teal rounded px-3 py-1.5 cursor-pointer flex items-center gap-2 group transition-colors" onClick={() => navigate(`/app/workspace/${p.id}`)}>
                     <div className="w-2 h-2 rounded-full bg-molecular-teal group-hover:animate-pulse"></div>
                     <span className="text-xs text-gray-300 font-medium">{p.name}</span>
                 </div>
             ))
          )}
      </div>

    </div>
  );
};

export default DashboardHome;

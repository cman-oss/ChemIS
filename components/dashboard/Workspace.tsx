import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Molecule2DViewer from './Molecule2DViewer';
import { DownloadIcon } from '../icons/DownloadIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { ListIcon } from '../icons/ListIcon';
import { GridIcon } from '../icons/GridIcon';
import { LoadingSpinner } from '../icons/LoadingSpinner';
import { SynthesisPlan, ToxicityReport, PropertyReport } from '../../types';

// Make RDKit global type available
declare const window: any;

// --- Inline Icons & Components ---
const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className, filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const RadarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    const size = 200;
    const center = size / 2;
    const radius = 80;
    const angleSlice = (Math.PI * 2) / data.length;

    const points = data.map((d, i) => {
        const value = d.value / 100;
        const x = center + radius * value * Math.cos(angleSlice * i - Math.PI / 2);
        const y = center + radius * value * Math.sin(angleSlice * i - Math.PI / 2);
        return `${x},${y}`;
    }).join(' ');

    const axisLines = data.map((_, i) => {
        const x = center + radius * Math.cos(angleSlice * i - Math.PI / 2);
        const y = center + radius * Math.sin(angleSlice * i - Math.PI / 2);
        return (
            <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#30363D" strokeWidth="1" />
        );
    });

    const labels = data.map((d, i) => {
        const x = center + (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2);
        const y = center + (radius + 15) * Math.sin(angleSlice * i - Math.PI / 2);
        return (
            <text key={i} x={x} y={y} textAnchor="middle" fontSize="10" fill="#8B949E" className="uppercase font-mono">{d.label}</text>
        );
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
            <circle cx={center} cy={center} r={radius} fill="none" stroke="#30363D" strokeDasharray="4 4" />
            <circle cx={center} cy={center} r={radius * 0.66} fill="none" stroke="#30363D" strokeDasharray="4 4" />
            <circle cx={center} cy={center} r={radius * 0.33} fill="none" stroke="#30363D" strokeDasharray="4 4" />
            {axisLines}
            <polygon points={points} fill="rgba(0, 196, 154, 0.2)" stroke="#00C49A" strokeWidth="2" filter="url(#glow)" />
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            {labels}
        </svg>
    );
};

const MOCK_TARGET_MOL = "c1ccccc1"; 

const isEmptyMol = (mol: string | null | undefined): boolean => {
    if (!mol) return true;
    if (mol.trim() === '') return true;
    if (mol.includes('0  0  0  0  0  0') && (mol.includes('V2000') || mol.includes('M  END'))) return true;
    return false;
};

// --- Views Components ---

interface SynthesisViewProps {
    moleculeData: string;
    result?: SynthesisPlan;
}

const SynthesisView: React.FC<SynthesisViewProps> = ({ moleculeData, result }) => {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    
    const routes = result && result.routes ? result.routes.map(r => ({
        id: r.routeId,
        totalSteps: r.steps.length,
        predictionSteps: r.steps.length,
        difficulty: r.difficulty,
        cost: r.cost,
        creationTime: new Date().toLocaleDateString(),
        isFavorite: false,
        steps: r.steps.map((s, idx) => ({
            id: s.step,
            mol: s.product_smiles,
            type: idx === r.steps.length - 1 ? 'target' : 'intermediate',
            description: s.description
        }))
    })) : [];

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="bg-dark-card border-b border-dark-border p-3 flex items-center justify-between gap-4 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-dark-text-secondary uppercase tracking-wider mr-2">Filters:</span>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border hover:border-molecular-teal transition-colors rounded text-xs text-white">
                        Supplier <ChevronDownIcon className="w-3 h-3"/>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border hover:border-molecular-teal transition-colors rounded text-xs text-white">
                        Max Steps <ChevronDownIcon className="w-3 h-3"/>
                    </button>
                </div>
                <div className="bg-dark-bg p-1 rounded-lg border border-dark-border flex">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-dark-card text-molecular-teal shadow-sm' : 'text-dark-text-secondary hover:text-white'}`}
                    >
                        <ListIcon className="w-4 h-4" /> List
                    </button>
                    <button 
                        onClick={() => setViewMode('map')}
                        className={`px-3 py-1.5 text-xs font-bold rounded flex items-center gap-2 transition-all ${viewMode === 'map' ? 'bg-dark-card text-molecular-teal shadow-sm' : 'text-dark-text-secondary hover:text-white'}`}
                    >
                        <GridIcon className="w-4 h-4" /> Tree
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-dark-bg relative p-4 scrollbar-thin scrollbar-thumb-dark-border">
                {routes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-dark-text-secondary">
                        <LoadingSpinner className="w-8 h-8 mb-4 text-molecular-teal"/>
                        <p>Generating routes...</p>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="space-y-4">
                        {routes.map((route, idx) => (
                            <div key={idx} className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-molecular-teal/30 transition-all animate-slide-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="flex flex-wrap items-center justify-between mb-6 border-b border-dark-border pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-molecular-teal/10 flex items-center justify-center text-molecular-teal font-bold text-sm">
                                            {route.id.split(' ')[1] || idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-sm">{route.id}</h3>
                                            <p className="text-xs text-dark-text-secondary">AI Confidence: {(98 - idx * 5)}%</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-6 text-xs">
                                         <div>
                                            <span className="block text-dark-text-secondary mb-1">Steps</span>
                                            <span className="text-white font-mono text-lg">{route.totalSteps}</span>
                                         </div>
                                         <div>
                                            <span className="block text-dark-text-secondary mb-1">Difficulty</span>
                                            <span className="text-white font-mono text-lg">{route.difficulty}</span>
                                         </div>
                                          <div>
                                            <span className="block text-dark-text-secondary mb-1">Cost</span>
                                            <span className="text-white font-mono text-lg">{route.cost}</span>
                                         </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                         <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-dark-text-secondary hover:text-white"><StarIcon className="w-4 h-4" /></button>
                                         <button className="px-3 py-1.5 bg-molecular-teal/10 text-molecular-teal text-xs font-bold rounded hover:bg-molecular-teal/20 transition-colors">Select Route</button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-dark-border">
                                    {route.steps.slice().reverse().map((step, index) => {
                                        const displayMol = step.type === 'target' ? moleculeData : step.mol;
                                        return (
                                            <React.Fragment key={step.id}>
                                                {index > 0 && (
                                                    <div className="flex-shrink-0 text-dark-text-secondary">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                    </div>
                                                )}
                                                <div className="flex-shrink-0 flex flex-col items-center gap-2 group">
                                                    <div className={`w-48 h-40 bg-white rounded-lg border-2 ${step.type === 'target' ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-gray-200 group-hover:border-molecular-teal'} transition-all overflow-hidden relative`}>
                                                        {step.type === 'target' && <div className="absolute top-0 right-0 bg-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded-bl font-bold z-10">Target</div>}
                                                        <Molecule2DViewer molString={displayMol} />
                                                        <div className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[10px] p-2 text-center transform translate-y-full group-hover:translate-y-0 transition-transform">
                                                            {step.description}
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-dark-text-secondary bg-dark-bg px-2 py-0.5 rounded border border-dark-border">
                                                        {step.type === 'target' ? 'Product' : `Int-${step.id}`}
                                                    </span>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full h-full min-h-[600px] bg-dark-bg p-8 overflow-auto animate-fade-in flex items-center">
                        <div className="flex gap-12 items-center mx-auto">
                            {/* Tree Layout: Target on Right, Routes branching Left */}
                            <div className="flex flex-col gap-12">
                                {routes.map((route, rIdx) => (
                                    <div key={rIdx} className="flex items-center gap-4 animate-slide-in-up" style={{ animationDelay: `${rIdx * 0.1}s`}}>
                                        
                                        {/* Steps Container */}
                                        <div className="flex items-center gap-4 flex-row-reverse">
                                            {route.steps.slice(0, -1).map((step, sIdx) => ( // Exclude target from steps list here
                                                <React.Fragment key={sIdx}>
                                                    <div className="relative group">
                                                        <div className="w-32 h-32 bg-white rounded border border-gray-600 group-hover:border-molecular-teal transition-colors overflow-hidden">
                                                            <Molecule2DViewer molString={step.mol} />
                                                        </div>
                                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-dark-text-secondary whitespace-nowrap bg-dark-card px-2 py-1 rounded border border-dark-border">
                                                            {step.description.substring(0, 15)}...
                                                        </div>
                                                    </div>
                                                    {/* Arrow pointing right */}
                                                    <div className="text-dark-text-secondary">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </div>

                                        {/* Connector to main Target */}
                                        <div className="w-16 h-px bg-molecular-teal/50 relative">
                                            <div className="absolute -top-3 left-1/2 text-[10px] text-molecular-teal bg-dark-bg px-1">
                                                {route.id}
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>

                            {/* Main Target Node */}
                            <div className="relative z-10">
                                <div className="w-48 h-48 bg-white rounded-xl border-4 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.3)] overflow-hidden">
                                    <Molecule2DViewer molString={moleculeData} />
                                </div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    Target Molecule
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface PropertyViewProps {
    moleculeData: string;
    result?: PropertyReport;
}

const PropertyView: React.FC<PropertyViewProps> = ({ moleculeData, result }) => {
    // Default fallback values if no result
    const data = result || {
        molecularWeight: 'N/A',
        logP: 0,
        tpsa: 0,
        hBondDonors: 0,
        hBondAcceptors: 0,
        rotatableBonds: 0,
        bioavailabilityScore: 0.5,
        solubility: 'Unknown',
        absorption: [],
        radar: [
            { label: 'Lipo', value: 80 },
            { label: 'Size', value: 60 },
            { label: 'Pol', value: 40 },
            { label: 'Insol', value: 30 },
            { label: 'Unsat', value: 20 },
            { label: 'Flex', value: 50 },
        ]
    };

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-dark-bg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Radar */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-8 flex flex-col items-center justify-center shadow-lg">
                    <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider self-start flex items-center gap-2">
                        <SparklesIcon className="w-4 h-4 text-molecular-teal" /> Bioavailability Radar
                    </h3>
                    <RadarChart data={data.radar} />
                    <p className="text-xs text-center text-dark-text-secondary mt-6 max-w-xs">
                        The pink area represents the optimal range for oral bioavailability based on Lipinski's Rule of 5.
                    </p>
                </div>

                {/* Properties Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-lg">
                        <div className="px-6 py-4 border-b border-dark-border bg-white/5">
                            <h3 className="text-sm font-bold text-white">Physicochemical Properties</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Molecular Weight', value: data.molecularWeight, unit: 'g/mol' },
                                    { label: 'LogP', value: data.logP.toString(), unit: '' },
                                    { label: 'TPSA', value: data.tpsa.toString(), unit: 'Å²' },
                                    { label: 'H-Bond Donors', value: data.hBondDonors.toString(), unit: '' },
                                    { label: 'H-Bond Acceptors', value: data.hBondAcceptors.toString(), unit: '' },
                                    { label: 'Rotatable Bonds', value: data.rotatableBonds.toString(), unit: '' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-dark-bg p-4 rounded-lg border border-dark-border">
                                        <div className="text-xs text-dark-text-secondary uppercase mb-1">{item.label}</div>
                                        <div className="text-lg font-mono font-bold text-white">
                                            {item.value} <span className="text-xs text-gray-500 font-sans">{item.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Absorption Gauges */}
                    <div className="bg-dark-card border border-dark-border rounded-xl p-6 shadow-lg">
                        <h3 className="text-sm font-bold text-white mb-6">Absorption & Permeability</h3>
                        <div className="space-y-6">
                            {data.absorption && data.absorption.length > 0 ? data.absorption.map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm text-gray-300">{item.title}</span>
                                        <span className="text-sm font-bold text-molecular-teal">{item.value}</span>
                                    </div>
                                    <div className="h-2 w-full bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                                        <div 
                                            className="h-full bg-gradient-to-r from-molecular-teal to-brand-blue rounded-full transition-all duration-1000" 
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-gray-500 text-sm">No absorption data generated.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ToxicityViewProps {
    moleculeData: string;
    result?: ToxicityReport;
}

const ToxicityView: React.FC<ToxicityViewProps> = ({ moleculeData, result }) => {
    // Fallback if no result
    const report = result || {
        moleculeName: 'Unknown',
        summary: 'No data available.',
        riskScore: 0,
        endpoints: []
    };

    const isSafe = (report.riskScore || 0) > 70;
    const isRisky = (report.riskScore || 0) < 40;
    const statusColor = isSafe ? 'text-green-400' : isRisky ? 'text-red-400' : 'text-yellow-400';
    const ringColor = isSafe ? '#4ADE80' : isRisky ? '#F87171' : '#FACC15';
    const statusText = isSafe ? 'Acceptable' : isRisky ? 'High Risk' : 'Moderate Concern';

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-dark-bg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Summary Card */}
                <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-8 shadow-lg">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                             <h3 className="text-xl font-bold text-white mb-1">Overall Safety Profile</h3>
                             <p className={`text-lg font-mono font-bold ${statusColor}`}>{statusText}</p>
                        </div>
                         <div className={`p-3 rounded-full bg-white/5 border border-white/10 ${statusColor}`}>
                             {isSafe ? <CheckIcon className="w-8 h-8" /> : <div className="w-8 h-8 font-bold text-center text-2xl">!</div>}
                        </div>
                    </div>
                    
                    <div className="bg-dark-bg/50 p-6 rounded-lg border border-dark-border">
                        <p className="text-gray-300 leading-relaxed">
                            {report.summary}
                        </p>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-bold uppercase">Mutagenicity Check</div>
                        <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-xs font-bold uppercase">PAINS Filter</div>
                    </div>
                </div>

                {/* Risk Score */}
                <div className="bg-dark-card border border-dark-border rounded-xl p-8 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
                     <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                         <svg className="w-full h-full transform -rotate-90">
                             <circle cx="80" cy="80" r="70" stroke="#30363D" strokeWidth="12" fill="none" />
                             <circle cx="80" cy="80" r="70" stroke={ringColor} strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * (report.riskScore || 0)) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                         </svg>
                         <div className="absolute text-center">
                             <span className="text-4xl font-bold text-white block">{report.riskScore || 0}</span>
                             <span className="text-xs text-gray-500 uppercase tracking-widest">Score</span>
                         </div>
                     </div>
                     <p className="text-center text-dark-text-secondary text-sm">
                         A higher score indicates a safer profile with fewer structural alerts.
                     </p>
                </div>

                {/* Detailed Endpoints */}
                <div className="lg:col-span-3 bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 border-b border-dark-border text-dark-text-secondary uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Endpoint</th>
                                <th className="px-6 py-4">Prediction</th>
                                <th className="px-6 py-4">Probability</th>
                                <th className="px-6 py-4">Structural Alerts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border text-gray-300">
                            {report.endpoints && report.endpoints.map((row, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{row.name}</td>
                                    <td className={`px-6 py-4 font-bold ${row.pred === 'Active' ? 'text-red-400' : 'text-green-400'}`}>
                                        <span className={`px-2 py-1 rounded ${row.pred === 'Active' ? 'bg-red-400/10' : 'bg-green-400/10'}`}>{row.pred}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-molecular-teal">{row.prob}</td>
                                    <td className={`px-6 py-4 ${row.alert.includes('High') || row.alert.includes('Risk') ? 'text-yellow-400' : 'text-gray-500'}`}>{row.alert}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SimilarityView: React.FC<{ moleculeData: string }> = ({ moleculeData }) => {
    return (
        <div className="flex-1 overflow-y-auto p-8 bg-dark-bg">
            <h2 className="text-xl font-bold text-white mb-6">Similar Compounds (ChEMBL / PubChem)</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                     <div key={i} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden group hover:border-molecular-teal transition-all hover:-translate-y-1 duration-300 shadow-lg">
                        <div className="h-48 bg-white p-4 relative">
                             <Molecule2DViewer molString={moleculeData} />
                             <div className="absolute top-2 right-2 bg-molecular-teal text-deep-blue text-xs font-bold px-2 py-1 rounded shadow-sm">
                                 {(0.99 - (i * 0.03)).toFixed(2)} Sim
                             </div>
                        </div>
                        <div className="p-4 bg-dark-card">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-bold text-sm">CHEMBL{10420+i}</span>
                                <span className="text-xs text-dark-text-secondary">Kinase Inhibitor</span>
                            </div>
                            <div className="w-full bg-dark-bg rounded-full h-1.5 mt-2">
                                <div className="bg-molecular-teal h-1.5 rounded-full" style={{ width: `${99 - i*3}%`}}></div>
                            </div>
                        </div>
                     </div>
                ))}
            </div>
        </div>
    );
};


const Workspace: React.FC = () => {
    const { projectId } = useParams<any>();
    const location = useLocation<any>();
    const [exporting, setExporting] = useState(false);
    
    // Sanitize input
    const rawMolecule = location.state?.molecule;
    const tool = location.state?.tool || 'synthesis';
    const settings = location.state?.settings || {};
    const taskResult = location.state?.taskResult; 
    
    const moleculeData = !isEmptyMol(rawMolecule) ? rawMolecule : MOCK_TARGET_MOL;
    
    const [molProps, setMolProps] = useState({ formula: 'Calculated...', mw: '...' });
    // Active Tab State for quick switching
    const [activeTab, setActiveTab] = useState(tool);

    useEffect(() => {
        let isMounted = true;
        const calcProps = async () => {
             const seed = moleculeData.length;
             const mw = (150 + (seed % 300)).toFixed(2);
             const c = 6 + (seed % 10);
             const h = 6 + (seed % 12);
             if (isMounted) {
                 setMolProps({ formula: `C${c}H${h}N2O`, mw: `${mw}` });
             }
        };
        calcProps();
        return () => { isMounted = false; };
    }, [moleculeData]);

    const handleExport = () => {
        setExporting(true);
        setTimeout(() => setExporting(false), 2000);
    };

    const tabs = [
        { id: 'synthesis', label: 'Retrosynthesis' },
        { id: 'property', label: 'ADMET Props' },
        { id: 'toxicity', label: 'Toxicity' },
        { id: 'similarity', label: 'Similarity' },
    ];

    return (
        <div className="animate-fade-in h-full flex flex-col text-dark-text bg-[#0D1117] overflow-hidden">
            {/* Top Navigation Bar */}
            <div className="h-16 border-b border-dark-border bg-dark-card flex justify-between items-center px-6 flex-shrink-0">
                <div className="flex items-center space-x-4">
                     <nav className="text-sm font-medium text-dark-text-secondary flex items-center">
                        <Link to="/app" className="hover:text-white transition-colors">Home</Link> 
                        <span className="mx-2 text-dark-border">/</span>
                        <Link to="/app/tasks" className="hover:text-white transition-colors">Tasks</Link>
                        <span className="mx-2 text-dark-border">/</span>
                        <span className="text-white font-bold">{projectId || 'Result View'}</span>
                    </nav>
                </div>
                
                {/* Center Tabs */}
                <div className="hidden md:flex bg-dark-bg p-1 rounded-lg border border-dark-border">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === t.id ? 'bg-dark-card text-molecular-teal shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="flex space-x-3">
                     <button 
                        onClick={handleExport}
                        className="px-4 py-2 rounded border border-dark-border text-sm hover:bg-white/5 transition-colors text-white flex items-center gap-2"
                        disabled={exporting}
                    >
                        {exporting ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</>
                        ) : (
                            <><DownloadIcon className="w-4 h-4" /> Export Report</>
                        )}
                    </button>
                    <button onClick={() => window.history.back()} className="px-4 py-2 rounded bg-molecular-teal text-deep-blue font-bold text-sm hover:opacity-90 transition-colors shadow-lg shadow-molecular-teal/20">
                        New Search
                    </button>
                </div>
            </div>

            <div className="flex flex-1 min-h-0">
                {/* Left Sidebar: Target Molecule Info */}
                <div className="w-72 flex-shrink-0 bg-dark-card border-r border-dark-border flex flex-col overflow-y-auto">
                    <div className="p-6">
                        <div className="w-full aspect-square bg-white rounded-xl border-4 border-dark-border overflow-hidden mb-6 p-2 relative shadow-inner group">
                            <Molecule2DViewer key={moleculeData} molString={moleculeData} />
                            <div className="absolute inset-0 border-4 border-transparent group-hover:border-molecular-teal/30 rounded-lg pointer-events-none transition-colors"></div>
                        </div>
                        
                        <div className="mb-6">
                             <h3 className="text-white font-bold text-lg mb-1">Target Structure</h3>
                             <p className="text-xs text-dark-text-secondary font-mono truncate">{moleculeData.length > 30 ? moleculeData.substring(0, 30) + '...' : moleculeData}</p>
                        </div>
                        
                        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border space-y-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-dark-text-secondary uppercase">Formula</span>
                                <span className="text-sm text-white font-mono">{molProps.formula}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-dark-text-secondary uppercase">Mol Weight</span>
                                <span className="text-sm text-white font-mono">{molProps.mw}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-xs text-dark-text-secondary uppercase">Charge</span>
                                <span className="text-sm text-white font-mono">0</span>
                            </div>
                        </div>

                        {settings && Object.keys(settings).length > 0 && (
                             <div className="border-t border-dark-border pt-6">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-wider">Run Configuration</h4>
                                <div className="space-y-2">
                                    {settings.maxRoutes && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="w-1.5 h-1.5 rounded-full bg-molecular-teal"></div>
                                            <span className="text-gray-400">Routes:</span>
                                            <span className="text-white ml-auto">{settings.maxRoutes}</span>
                                        </div>
                                    )}
                                    {settings.riskLevel && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                                            <span className="text-gray-400">Risk Tol:</span>
                                            <span className="text-white ml-auto">{settings.riskLevel}</span>
                                        </div>
                                    )}
                                    {settings.model && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                            <span className="text-gray-400">Model:</span>
                                            <span className="text-white ml-auto capitalize">{settings.model}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col bg-[#0D1117] relative">
                    {/* Render specific view based on active tab */}
                    {activeTab === 'synthesis' && <SynthesisView moleculeData={moleculeData} result={taskResult} />}
                    {activeTab === 'property' && <PropertyView moleculeData={moleculeData} result={taskResult} />}
                    {activeTab === 'toxicity' && <ToxicityView moleculeData={moleculeData} result={taskResult} />}
                    {activeTab === 'similarity' && <SimilarityView moleculeData={moleculeData} />}
                    {activeTab === 'prediction' && (
                         <div className="flex-1 flex items-center justify-center bg-dark-bg text-dark-text-secondary">
                             <div className="text-center">
                                 <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                                 <h2 className="text-xl text-white font-bold">Optimization Complete</h2>
                                 <p>Reaction condition tables would appear here.</p>
                             </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Workspace;
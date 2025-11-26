
import React from 'react';
import { Task, SynthesisPlan, ToxicityReport, PropertyReport } from '../../types';
import Molecule2DViewer from './Molecule2DViewer';
import { DownloadIcon } from '../icons/DownloadIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface TaskDetailModalProps {
    task: Task;
    onClose: () => void;
    onOpenWorkspace: (task: Task) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onOpenWorkspace }) => {
    // Helper to render result summaries based on type
    const renderResultSummary = () => {
        if (!task.result) return <p className="text-gray-500 italic">No result data available.</p>;

        switch (task.type) {
            case 'synthesis':
                const plan = task.result as SynthesisPlan;
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-dark-bg p-3 rounded border border-dark-border">
                            <span className="text-sm text-dark-text-secondary">Routes Found:</span>
                            <span className="text-white font-bold">{plan.routes ? plan.routes.length : 0}</span>
                        </div>
                        <div className="space-y-2">
                             {plan.routes && plan.routes.map((route, idx) => (
                                 <div key={idx} className="bg-dark-bg p-3 rounded border border-dark-border flex justify-between items-center">
                                     <div>
                                         <div className="text-white font-semibold text-sm">{route.routeId}</div>
                                         <div className="text-xs text-dark-text-secondary">{route.steps.length} Steps • {route.difficulty} Difficulty</div>
                                     </div>
                                     <div className="text-xs font-mono text-molecular-teal">{route.cost}</div>
                                 </div>
                             ))}
                        </div>
                    </div>
                );
            case 'toxicity':
                const tox = task.result as ToxicityReport;
                const isSafe = (tox.riskScore || 0) > 70;
                return (
                    <div className="bg-dark-bg p-4 rounded border border-dark-border text-center">
                         <div className={`text-3xl font-bold mb-1 ${isSafe ? 'text-green-500' : 'text-red-500'}`}>{tox.riskScore}</div>
                         <div className="text-xs text-dark-text-secondary uppercase tracking-wider mb-4">Safety Score</div>
                         <p className="text-sm text-gray-300">{tox.summary}</p>
                    </div>
                );
            case 'property':
                const prop = task.result as PropertyReport;
                return (
                     <div className="grid grid-cols-2 gap-2">
                        <div className="bg-dark-bg p-2 rounded border border-dark-border">
                            <div className="text-xs text-dark-text-secondary">Mol Weight</div>
                            <div className="text-white font-mono">{prop.molecularWeight}</div>
                        </div>
                         <div className="bg-dark-bg p-2 rounded border border-dark-border">
                            <div className="text-xs text-dark-text-secondary">LogP</div>
                            <div className="text-white font-mono">{prop.logP}</div>
                        </div>
                        <div className="bg-dark-bg p-2 rounded border border-dark-border">
                            <div className="text-xs text-dark-text-secondary">TPSA</div>
                            <div className="text-white font-mono">{prop.tpsa}</div>
                        </div>
                        <div className="bg-dark-bg p-2 rounded border border-dark-border">
                            <div className="text-xs text-dark-text-secondary">Solubility</div>
                            <div className="text-white font-mono">{prop.solubility}</div>
                        </div>
                     </div>
                );
            default:
                return <pre className="text-xs text-gray-400 overflow-auto max-h-40">{JSON.stringify(task.result, null, 2)}</pre>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-card border border-dark-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="p-4 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
                    <div>
                        <h3 className="text-lg font-bold text-white capitalize">{task.type} Analysis Result</h3>
                        <p className="text-xs text-dark-text-secondary font-mono">ID: {task.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Top Section: Molecule & Meta */}
                    <div className="flex gap-6">
                        <div className="w-40 h-40 bg-white rounded-lg border border-gray-200 p-2 flex-shrink-0">
                             <Molecule2DViewer molString={task.molecule} />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <SparklesIcon className="w-4 h-4 text-molecular-teal" /> AI Configuration
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                     <div className="bg-dark-bg p-2 rounded border border-dark-border">
                                         <span className="text-dark-text-secondary block">Model</span>
                                         <span className="text-white capitalize">{task.settings?.model || 'Standard'}</span>
                                     </div>
                                     <div className="bg-dark-bg p-2 rounded border border-dark-border">
                                         <span className="text-dark-text-secondary block">Strict Mode</span>
                                         <span className="text-white">{task.settings?.strictMode ? 'Enabled' : 'Disabled'}</span>
                                     </div>
                                      <div className="bg-dark-bg p-2 rounded border border-dark-border">
                                         <span className="text-dark-text-secondary block">Database</span>
                                         <span className="text-white uppercase">{task.settings?.database || 'All'}</span>
                                     </div>
                                      <div className="bg-dark-bg p-2 rounded border border-dark-border">
                                         <span className="text-dark-text-secondary block">Time Taken</span>
                                         <span className="text-white">~1.2s</span>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Preview */}
                    <div>
                        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-green-500" /> Analysis Summary
                        </h4>
                        {renderResultSummary()}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-dark-border bg-dark-bg/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-border transition-colors">
                        Close
                    </button>
                    <button 
                        onClick={() => onOpenWorkspace(task)}
                        className="px-6 py-2 bg-molecular-teal text-deep-blue rounded text-sm font-bold hover:shadow-[0_0_15px_rgba(0,196,154,0.4)] transition-all flex items-center gap-2"
                    >
                        Open Full Workspace
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;

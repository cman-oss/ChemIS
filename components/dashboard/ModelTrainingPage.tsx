
import React, { useState, useEffect } from 'react';
import { UploadIcon } from '../icons/UploadIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { SparklesIcon } from '../icons/SparklesIcon';
import { LoadingSpinner } from '../icons/LoadingSpinner';

const ModelTrainingPage: React.FC = () => {
    const [trainingState, setTrainingState] = useState<'idle' | 'uploading' | 'training' | 'completed'>('idle');
    const [progress, setProgress] = useState(0);
    const [accuracy, setAccuracy] = useState(92.5);
    const [loss, setLoss] = useState(0.45);
    const [epoch, setEpoch] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    
    // Dataset stats
    const [datasets, setDatasets] = useState([
        { name: 'ChEMBL_v33_Bioactivity.sdf', size: '4.2 GB', records: '2.4M', status: 'Ready' },
        { name: 'PubChem_Compound_QC.csv', size: '12.8 GB', records: '110M', status: 'Ready' },
        { name: 'Internal_ELN_2024.json', size: '150 MB', records: '15k', status: 'Ready' },
    ]);

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 8));

    const startTraining = () => {
        setTrainingState('training');
        addLog("Initializing ChemXGen-Ultra architecture...");
        addLog("Allocating TPU v5 pods...");
        
        let currentEpoch = 0;
        let currentAcc = 92.5;
        let currentLoss = 0.45;

        const interval = setInterval(() => {
            currentEpoch += 1;
            setEpoch(currentEpoch);
            
            // Simulate convergence
            currentAcc = Math.min(99.999, currentAcc + (Math.random() * 0.5));
            currentLoss = Math.max(0.001, currentLoss * 0.9);
            
            setAccuracy(currentAcc);
            setLoss(currentLoss);
            
            const p = (currentEpoch / 100) * 100;
            setProgress(p);

            if (currentEpoch % 10 === 0) {
                addLog(`Epoch ${currentEpoch}/100 - Loss: ${currentLoss.toFixed(4)} - Acc: ${currentAcc.toFixed(4)}%`);
            }

            if (currentEpoch >= 100) {
                clearInterval(interval);
                setTrainingState('completed');
                addLog("Training Complete. Model serialized and deployed.");
                setAccuracy(99.999);
            }
        }, 100); // Fast simulation
    };

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">AI Model Training Center</h1>
                    <p className="text-dark-text-secondary">Train, Fine-tune, and Deploy custom molecular models.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-mono text-green-400">GPU CLUSTER ONLINE</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Dataset Management */}
                    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <UploadIcon className="w-5 h-5 text-molecular-teal" /> Datasets
                        </h2>
                        <div className="space-y-3 mb-6">
                            {datasets.map((ds, i) => (
                                <div key={i} className="flex justify-between items-center bg-dark-bg p-3 rounded border border-dark-border">
                                    <div>
                                        <div className="text-sm text-white font-medium">{ds.name}</div>
                                        <div className="text-xs text-dark-text-secondary">{ds.records} Records • {ds.size}</div>
                                    </div>
                                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">{ds.status}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full border-2 border-dashed border-dark-border hover:border-molecular-teal rounded-lg p-4 text-center text-sm text-dark-text-secondary transition-colors">
                            + Drag & Drop new datasets (.sdf, .smi, .csv)
                        </button>
                    </div>

                    {/* Hyperparameters */}
                    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Hyperparameters</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-dark-text-secondary">Model Architecture</label>
                                <select className="w-full mt-1 bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm">
                                    <option>ChemXGen-Transformer-7B</option>
                                    <option>GNN-MessagePassing-V4</option>
                                    <option>Hybrid-LSTM-Attention</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-dark-text-secondary">Epochs</label>
                                    <input type="number" defaultValue="100" className="w-full mt-1 bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-dark-text-secondary">Batch Size</label>
                                    <input type="number" defaultValue="512" className="w-full mt-1 bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-dark-text-secondary">Learning Rate</label>
                                    <input type="text" defaultValue="0.0003" className="w-full mt-1 bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-dark-text-secondary">Dropout</label>
                                    <input type="text" defaultValue="0.1" className="w-full mt-1 bg-dark-bg border border-dark-border rounded px-3 py-2 text-white text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visualization */}
                <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-lg p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                         <div>
                            <h2 className="text-xl font-bold text-white">Live Training Monitor</h2>
                            <p className="text-sm text-dark-text-secondary">Target Accuracy: 99.999%</p>
                        </div>
                        {trainingState === 'idle' && (
                            <button onClick={startTraining} className="bg-molecular-teal text-deep-blue px-6 py-2 rounded font-bold hover:shadow-[0_0_20px_rgba(0,196,154,0.4)] transition-all">
                                Start Training
                            </button>
                        )}
                        {trainingState === 'training' && (
                             <button disabled className="bg-dark-bg border border-molecular-teal text-molecular-teal px-6 py-2 rounded font-bold flex items-center gap-2">
                                <LoadingSpinner /> Training...
                            </button>
                        )}
                         {trainingState === 'completed' && (
                             <button className="bg-green-500 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                                <CheckIcon className="w-5 h-5" /> Deployed
                            </button>
                        )}
                    </div>

                    {/* Chart Visualization Area */}
                    <div className="flex-1 bg-dark-bg border border-dark-border rounded-lg relative overflow-hidden mb-6 p-4">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#30363D 1px, transparent 1px), linear-gradient(90deg, #30363D 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        {/* Simulated Graph Lines */}
                        <svg className="w-full h-full" preserveAspectRatio="none">
                             {/* Accuracy Line */}
                             <polyline 
                                fill="none" 
                                stroke="#00C49A" 
                                strokeWidth="3" 
                                points={trainingState === 'idle' ? "0,100 100,100" : `0,100 ${progress},${100 - ((accuracy - 90) * 10)}`}
                                className="transition-all duration-100"
                             />
                              {/* Loss Line */}
                             <polyline 
                                fill="none" 
                                stroke="#E733D3" 
                                strokeWidth="3" 
                                points={trainingState === 'idle' ? "0,50 100,50" : `0,50 ${progress},${100 - (100 - (loss * 100))}`}
                                className="transition-all duration-100"
                             />
                        </svg>
                        
                        {/* Metrics Overlay */}
                        <div className="absolute top-4 right-4 text-right bg-dark-card/80 p-3 rounded backdrop-blur">
                            <div className="text-xs text-dark-text-secondary">Validation Accuracy</div>
                            <div className="text-2xl font-mono font-bold text-molecular-teal">{accuracy.toFixed(5)}%</div>
                            <div className="text-xs text-dark-text-secondary mt-2">Loss Function</div>
                            <div className="text-xl font-mono font-bold text-accent-magenta">{loss.toFixed(6)}</div>
                        </div>
                    </div>

                    {/* Terminal Logs */}
                    <div className="h-48 bg-black rounded border border-dark-border p-4 font-mono text-xs overflow-y-auto">
                        <div className="text-green-500 mb-2">$ tail -f /var/log/training_job_xgen_ultra.log</div>
                        {logs.map((log, i) => (
                            <div key={i} className="text-gray-400 border-l-2 border-gray-800 pl-2 mb-1">
                                <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
                            </div>
                        ))}
                        {trainingState === 'idle' && <div className="text-gray-500">System ready. Waiting for user input...</div>}
                         {trainingState === 'training' && <div className="animate-pulse text-molecular-teal">_</div>}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ModelTrainingPage;

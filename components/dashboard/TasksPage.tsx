
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Project, Task } from '../../types';
import { getUserProjects } from '../../services/projectService';
import { ClockIcon } from '../icons/ClockIcon';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import Molecule2DViewer from './Molecule2DViewer';
import { CheckIcon } from '../icons/CheckIcon';
import { LoadingSpinner } from '../icons/LoadingSpinner';
import { planSynthesis, analyzeToxicity, analyzeProperties } from '../../services/geminiService';
import TaskDetailModal from './TaskDetailModal';

const TASKS_STORAGE_KEY = 'chemxgen_running_tasks';

const TasksPage: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
    const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'completed' | 'failed'>('all');
    
    // Modal State
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const processingRef = useRef<Set<string>>(new Set());

    // Load tasks from LocalStorage on mount
    useEffect(() => {
        const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
        if (storedTasks) {
            try {
                const parsed = JSON.parse(storedTasks);
                setPendingTasks(parsed);
            } catch (e) {
                console.error("Failed to parse stored tasks", e);
            }
        }
    }, []);

    // Handle incoming search from DashboardHome
    useEffect(() => {
        const state = location.state as any;
        if (state?.newSearch) {
            const newSearch = state.newSearch;
            
            setPendingTasks(prev => {
                if (prev.some(t => t.id === newSearch.id)) return prev;

                const newTask: Task = {
                    id: newSearch.id,
                    molecule: newSearch.molecule,
                    status: 'running',
                    type: newSearch.tool,
                    startTime: newSearch.timestamp,
                    settings: newSearch.settings,
                    progress: 0
                };
                
                const updated = [newTask, ...prev];
                localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
            const cleanState = { ...state };
            delete cleanState.newSearch;
            navigate(location.pathname, { replace: true, state: cleanState });
        }
    }, [location.state, navigate, location.pathname]);

    // Task Processing Engine
    useEffect(() => {
        const processTasks = async () => {
            const tasksToProcess = pendingTasks.filter(t => t.status === 'running' && !processingRef.current.has(t.id));
            if (tasksToProcess.length === 0) return;
            tasksToProcess.forEach(t => processingRef.current.add(t.id));

            for (const task of tasksToProcess) {
                try {
                    let result;
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Cinematic delay

                    switch (task.type) {
                        case 'synthesis': result = await planSynthesis(task.molecule, task.settings?.maxRoutes || 5); break;
                        case 'toxicity': result = await analyzeToxicity(task.molecule); break;
                        case 'property': result = await analyzeProperties(task.molecule); break;
                        case 'similarity': result = { summary: "Similarity search completed" }; break;
                        default: result = await planSynthesis(task.molecule, task.settings?.maxRoutes || 5);
                    }

                    setPendingTasks(prev => {
                        const updated = prev.map(t => {
                            if (t.id === task.id) {
                                return { ...t, status: 'completed' as const, progress: 100, result };
                            }
                            return t;
                        });
                        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
                        return updated;
                    });
                } catch (error) {
                    setPendingTasks(prev => {
                        const updated = prev.map(t => {
                            if (t.id === task.id) return { ...t, status: 'failed' as const, progress: 0 };
                            return t;
                        });
                        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
                        return updated;
                    });
                } finally {
                    processingRef.current.delete(task.id);
                }
            }
        };

        processTasks();

        const interval = setInterval(() => {
             setPendingTasks(prev => {
                let changed = false;
                const updated = prev.map(task => {
                    if (task.status === 'running' && (task.progress || 0) < 95) {
                        changed = true;
                        // Logarithmic progress feel
                        const increment = Math.max(0.5, (100 - (task.progress || 0)) / 20);
                        return { ...task, progress: (task.progress || 0) + increment };
                    }
                    return task;
                });
                return updated;
            });
        }, 300);

        return () => clearInterval(interval);
    }, [pendingTasks]);

    useEffect(() => {
        if (user) {
            const fetchProjects = async () => {
                setLoadingProjects(true);
                try {
                    const userProjects = await getUserProjects(user.id);
                    setCompletedProjects(userProjects);
                } catch (error) {
                    console.error("Failed to fetch tasks", error);
                } finally {
                    setLoadingProjects(false);
                }
            };
            fetchProjects();
        }
    }, [user]);

    const handleOpenWorkspace = (task: Task) => {
        navigate(`/app/workspace/${task.id}`, {
            state: {
                molecule: task.molecule,
                tool: task.type,
                settings: task.settings,
                taskResult: task.result 
            }
        });
    };

    const handleTaskClick = (task: Task) => {
        if (task.status === 'completed') {
            setSelectedTask(task);
        }
    };

    const clearHistory = () => {
        setPendingTasks([]);
        localStorage.removeItem(TASKS_STORAGE_KEY);
    }

    const filteredTasks = pendingTasks.filter(t => filterStatus === 'all' ? true : t.status === filterStatus);

    return (
        <div className="flex flex-col h-full animate-fade-in relative bg-[#0D1117] p-4">
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Task Queue</h1>
                    <nav className="text-sm font-medium text-dark-text-secondary">
                        <Link to="/app" className="hover:text-white transition-colors">Dashboard</Link> 
                        <span className="mx-2">&gt;</span>
                        <span className="text-molecular-teal">Tasks & Results</span>
                    </nav>
                </div>
                <div className="flex gap-3">
                     <select 
                        className="bg-dark-card border border-dark-border rounded-lg text-xs text-white px-3 py-2 outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                     >
                         <option value="all">All Status</option>
                         <option value="running">Processing</option>
                         <option value="completed">Completed</option>
                         <option value="failed">Failed</option>
                     </select>
                    <button onClick={clearHistory} className="px-3 py-2 border border-red-900/50 text-red-400 bg-red-900/10 rounded-lg text-xs hover:bg-red-900/20 transition-colors">
                        Clear History
                    </button>
                </div>
            </div>

            {/* Task Grid */}
            <div className="flex-1 overflow-y-auto pr-2 pb-20">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-20 bg-dark-card/30 rounded-2xl border border-dashed border-dark-border">
                        <ClockIcon className="w-12 h-12 text-dark-text-secondary mx-auto mb-4 opacity-50"/>
                        <p className="text-dark-text-secondary">No tasks found matching your filter.</p>
                        <Link to="/app" className="text-molecular-teal text-sm font-bold mt-2 inline-block hover:underline">Start a new analysis</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTasks.map(task => (
                            <div 
                                key={task.id} 
                                className={`bg-dark-card rounded-xl overflow-hidden border transition-all duration-300 relative group
                                    ${task.status === 'completed' 
                                        ? 'border-dark-border hover:border-molecular-teal hover:shadow-[0_0_20px_rgba(0,196,154,0.15)] cursor-pointer' 
                                        : task.status === 'failed' 
                                        ? 'border-red-900/50 opacity-80' 
                                        : 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                    }
                                `}
                                onClick={() => handleTaskClick(task)}
                            >
                                {/* Status Badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm backdrop-blur-md
                                        ${task.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                          task.status === 'failed' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                                          'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'}
                                    `}>
                                        {task.status === 'running' ? <LoadingSpinner className="w-3 h-3"/> : task.status === 'failed' ? 'Error' : <CheckIcon className="w-3 h-3"/>}
                                        {task.status === 'running' ? 'Processing' : task.status}
                                    </span>
                                </div>

                                <div className="h-40 bg-white p-4 flex items-center justify-center relative">
                                     <Molecule2DViewer molString={task.molecule} className="w-full h-full" />
                                     {task.status === 'completed' && (
                                         <div className="absolute inset-0 bg-molecular-teal/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                             <span className="bg-molecular-teal text-deep-blue font-bold px-3 py-1 rounded shadow-lg text-xs transform translate-y-2 group-hover:translate-y-0 transition-transform">View Result</span>
                                         </div>
                                     )}
                                </div>
                                
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-white text-sm capitalize">{task.type} Analysis</p>
                                            <p className="text-[10px] text-dark-text-secondary font-mono mt-0.5">{task.id}</p>
                                        </div>
                                    </div>
                                    
                                    {task.status === 'running' ? (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-[10px] text-blue-400 mb-1">
                                                <span>Analyzing structure...</span>
                                                <span>{Math.round(task.progress || 0)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-dark-bg rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${task.progress}%` }}></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-dark-border">
                                            <span className="text-[10px] text-dark-text-secondary">{new Date(task.startTime).toLocaleTimeString()}</span>
                                            <div className="flex gap-2 text-xs font-mono text-molecular-teal">
                                                {task.settings?.model === 'ultra' && <span>ULTRA</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detailed Task Modal */}
            {selectedTask && (
                <TaskDetailModal 
                    task={selectedTask} 
                    onClose={() => setSelectedTask(null)} 
                    onOpenWorkspace={handleOpenWorkspace} 
                />
            )}
        </div>
    );
};

export default TasksPage;

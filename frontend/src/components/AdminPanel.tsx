import React, { useState, useEffect } from 'react';
import {
    Save, Plus, Trash2, Edit2, Check, X, Server, Database, Code,
    ShieldCheck, Cpu, Users, Key, LogOut, Globe, Layout,
    Download, AlertCircle, FileText, ChevronRight
} from 'lucide-react';
import Login from './Login';

interface Settings {
    provider: string;
    model_name: string;
    api_key: string;
    base_url?: string;
    temperature: number;
}

// Configuraciones predefinidas por proveedor
const PROVIDER_CONFIGS = {
    gemini: {
        displayName: "Google Gemini",
        baseUrl: "",
        models: [
            "gemini-2.0-flash-exp",
            "gemini-2.5-flash",
            "gemini-2.5-flash-lite",
            "gemini-1.5-pro",
            "gemini-1.5-flash"
        ],
        defaultModel: "gemini-2.5-flash",
        color: "indigo"
    },
    openai: {
        displayName: "OpenAI GPT",
        baseUrl: "https://api.openai.com/v1",
        models: [
            "gpt-4o",
            "gpt-4o-mini",
            "gpt-4-turbo",
            "gpt-3.5-turbo"
        ],
        defaultModel: "gpt-4o-mini",
        color: "green"
    },
    groq: {
        displayName: "Groq",
        baseUrl: "https://api.groq.com/openai/v1",
        models: [
            "llama-3.1-8b-instant",
            "llama-3.3-70b-versatile",
            "mixtral-8x7b-32768",
            "gemma2-9b-it",
            "llama-guard-3-8b"
        ],
        defaultModel: "llama-3.3-70b-versatile",
        color: "orange"
    },
    custom: {
        displayName: "Custom Provider",
        baseUrl: "",
        models: [],
        defaultModel: "",
        color: "purple"
    }
};

const AdminPanel: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [settings, setSettings] = useState<Settings>({
        provider: 'gemini',
        model_name: 'gemini-2.5-flash',
        api_key: '',
        base_url: '',
        temperature: 0.7
    });
    const [stats, setStats] = useState({
        total_messages: 0,
        active_sessions: 0,
        system_status: 'Checking...',
        current_provider: 'Unknown'
    });
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    // Bilingual Data States
    const [fullPortfolioData, setFullPortfolioData] = useState<any>({});
    const [activeTab, setActiveTab] = useState<'es' | 'en'>('es');
    const [dataEs, setDataEs] = useState('');
    const [dataEn, setDataEn] = useState('');
    const [jsonError, setJsonError] = useState('');

    // Leads State
    interface Lead {
        id: number;
        name: string;
        contact_info: string;
        interest: string;
        status: string;
        created_at: string;
    }
    const [leads, setLeads] = useState<Lead[]>([]);

    // Navigation State
    const [mainTab, setMainTab] = useState<'dashboard' | 'config' | 'portfolio' | 'leads'>('dashboard');

    // Change Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passMsg, setPassMsg] = useState('');
    const [passLoading, setPassLoading] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            setIsAuthenticated(true);
        }
        setCheckingAuth(false);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            try {
                const [settingsRes, statsRes, portfolioRes, leadsRes] = await Promise.all([
                    fetch('/api/settings/', {
                        cache: 'no-store',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
                    }),
                    fetch('/api/stats', {
                        cache: 'no-store',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
                    }),
                    fetch('/api/portfolio', { cache: 'no-store' }),
                    fetch('/api/leads/', {
                        cache: 'no-store',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
                    })
                ]);

                // Check for 401 Unauthorized for all responses
                if (settingsRes.status === 401 || statsRes.status === 401 || portfolioRes.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                const settingsData = await settingsRes.json();
                const statsData = await statsRes.json();
                const portfolioJson = await portfolioRes.json();
                const leadsData = await leadsRes.ok ? await leadsRes.json() : [];

                setSettings({
                    ...settingsData,
                    api_key: settingsData.api_key || ''
                });
                setStats(statsData);
                setLeads(leadsData);

                // Handle Bilingual Data Split
                setFullPortfolioData(portfolioJson);
                if (portfolioJson.es || portfolioJson.en) {
                    setDataEs(JSON.stringify(portfolioJson.es || {}, null, 2));
                    setDataEn(JSON.stringify(portfolioJson.en || {}, null, 2));
                } else {
                    // Legacy Flat Data -> Default to ES, copy to EN
                    setDataEs(JSON.stringify(portfolioJson, null, 2));
                    setDataEn(JSON.stringify(portfolioJson, null, 2));
                }

            } catch (error) {
                console.error("Failed to load admin data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    // Helper to switch provider and defaults
    const switchProvider = (provider: string) => {
        const config = PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS];
        if (!config) return;

        setSettings({
            ...settings,
            provider,
            model_name: config.defaultModel,
            base_url: config.baseUrl
        });
    };

    const handleGlobalSave = async () => {
        setJsonError('');
        setLoading(true);
        setMsg('');

        try {
            const promises: Promise<Response>[] = [];

            // Always save settings if we're on config or portfolio tab
            if (mainTab === 'config' || mainTab === 'portfolio') {
                promises.push(
                    fetch('/api/settings/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                        },
                        body: JSON.stringify(settings)
                    })
                );
            }

            // Only save portfolio if we're on the portfolio tab AND JSON is valid
            if (mainTab === 'portfolio') {
                try {
                    const parsedEs = JSON.parse(dataEs);
                    const parsedEn = JSON.parse(dataEn);
                    const finalPayload = { es: parsedEs, en: parsedEn };

                    promises.push(
                        fetch('/api/portfolio', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                            },
                            body: JSON.stringify(finalPayload)
                        })
                    );
                } catch (e) {
                    setJsonError('Invalid JSON Format in one of the tabs - Portfolio NOT saved');
                    // Don't return - still save settings if we're on config tab
                    if (mainTab === 'portfolio') {
                        setLoading(false);
                        return;
                    }
                }
            }

            const responses = await Promise.all(promises);

            // Check for 401 Unauthorized
            if (responses.some(r => r.status === 401)) {
                window.location.href = '/login';
                return;
            }

            const allOk = responses.every(r => r.ok);

            if (allOk) {
                setMsg('Changes saved successfully! 🚀');
                setTimeout(() => setMsg(''), 4000);
            } else {
                setMsg('Error saving some changes. Please try again.');
            }

        } catch (err) {
            setMsg('Network error while saving.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ es: JSON.parse(dataEs), en: JSON.parse(dataEn) }, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "portfolio_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        window.location.href = '/login';
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassLoading(true);
        setPassMsg('');

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            const data = await response.json();
            if (response.ok) {
                setPassMsg('Password updated successfully!');
                setCurrentPassword('');
                setNewPassword('');
            } else {
                setPassMsg(`Error: ${data.detail || 'Failed to change password'}`);
            }
        } catch (err) {
            setPassMsg('Network error.');
        } finally {
            setPassLoading(false);
        }
    };

    // Show login if not authenticated
    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    // Main Admin Panel (existing code continues...)
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
                            <ShieldCheck className="text-indigo-400" size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Hub</h1>
                            <p className="text-slate-400 text-sm">Control center for AI & Portfolio Content</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all font-medium flex items-center gap-2"
                        >
                            <Layout size={18} /> View Site
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 hover:bg-red-500/20 transition-all font-medium flex items-center gap-2"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex overflow-x-auto gap-2 p-1 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm no-scrollbar">
                    <button
                        onClick={() => setMainTab('dashboard')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${mainTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                    >
                        <Server size={18} /> Insights
                    </button>
                    <button
                        onClick={() => setMainTab('config')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${mainTab === 'config' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                    >
                        <Cpu size={18} /> AI Brain
                    </button>
                    <button
                        onClick={() => setMainTab('portfolio')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${mainTab === 'portfolio' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                    >
                        <FileText size={18} /> Content Editor
                    </button>
                    <button
                        onClick={() => setMainTab('leads')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${mainTab === 'leads' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                    >
                        <Users size={18} /> Leads Hub
                    </button>
                    <button
                        onClick={() => setMainTab('security')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${mainTab === 'security' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                    >
                        <Key size={18} /> Security
                    </button>
                </div>

            </div>

            {/* Main Content Modules */}
            <div className="space-y-8 animate-in fade-in duration-500">

                {/* DASHBOARD TAB */}
                {mainTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-lg hover:border-slate-600 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Messages</h3>
                                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                                        <FileText size={18} />
                                    </div>
                                </div>
                                <p className="text-4xl font-extrabold text-white">{stats.total_messages}</p>
                                <p className="text-xs text-slate-500 mt-2">Cumulative since system start</p>
                            </div>
                            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-lg hover:border-slate-600 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Sessions</h3>
                                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 border border-pink-500/20">
                                        <Users size={18} />
                                    </div>
                                </div>
                                <p className="text-4xl font-extrabold text-white">{stats.active_sessions}</p>
                                <p className="text-xs text-slate-500 mt-2">Unique chat threads detected</p>
                            </div>
                            <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-lg hover:border-slate-600 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">System Status</h3>
                                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400 border border-green-500/20">
                                        <ShieldCheck size={18} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full animate-pulse ${stats.system_status === 'Operational' || stats.system_status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <p className="text-2xl font-bold text-white">{stats.system_status}</p>
                                </div>
                                <p className="text-sm text-slate-400 mt-3 flex items-center gap-2">
                                    <Cpu size={14} className="text-indigo-400" />
                                    <span className="font-mono">{stats.current_provider}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-2xl">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <ShieldCheck className="text-indigo-400" /> Welcome to Admin Control
                            </h3>
                            <p className="text-slate-400 leading-relaxed">
                                Use the tabs above to manage your AI assistant's brain, edit the multilingual portfolio content, or view the leads captured by the agent during user interactions.
                            </p>
                        </div>
                    </div>
                )}

                {/* CONFIGURATION TAB */}
                {mainTab === 'config' && (
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                                <Cpu size={24} className="text-indigo-400" /> AI Brain Engine
                            </h2>

                            {/* Provider Selection Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Gemini Provider */}
                                <div
                                    onClick={() => switchProvider('gemini')}
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${settings.provider === 'gemini'
                                        ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-600/20'
                                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-lg ${settings.provider === 'gemini' ? 'bg-indigo-500' : 'bg-slate-800'}`}>
                                            <Cpu size={24} className={settings.provider === 'gemini' ? 'text-white' : 'text-slate-400'} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${settings.provider === 'gemini' ? 'text-white' : 'text-slate-400'}`}>
                                                Google Gemini
                                            </h3>
                                            <p className="text-xs text-slate-500">Advanced multimodal AI</p>
                                        </div>
                                    </div>
                                    {settings.provider === 'gemini' && (
                                        <select
                                            value={settings.model_name}
                                            onChange={e => setSettings({ ...settings, model_name: e.target.value })}
                                            onClick={e => e.stopPropagation()}
                                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        >
                                            {PROVIDER_CONFIGS.gemini.models.map(model => (
                                                <option key={model} value={model}>{model}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* OpenAI Provider */}
                                <div
                                    onClick={() => switchProvider('openai')}
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${settings.provider === 'openai'
                                        ? 'bg-green-600/20 border-green-500 shadow-lg shadow-green-600/20'
                                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-lg ${settings.provider === 'openai' ? 'bg-green-500' : 'bg-slate-800'}`}>
                                            <Cpu size={24} className={settings.provider === 'openai' ? 'text-white' : 'text-slate-400'} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${settings.provider === 'openai' ? 'text-white' : 'text-slate-400'}`}>
                                                OpenAI GPT
                                            </h3>
                                            <p className="text-xs text-slate-500">Industry-leading models</p>
                                        </div>
                                    </div>
                                    {settings.provider === 'openai' && (
                                        <select
                                            value={settings.model_name}
                                            onChange={e => setSettings({ ...settings, model_name: e.target.value })}
                                            onClick={e => e.stopPropagation()}
                                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        >
                                            {PROVIDER_CONFIGS.openai.models.map(model => (
                                                <option key={model} value={model}>{model}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Groq Provider */}
                                <div
                                    onClick={() => switchProvider('groq')}
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${settings.provider === 'groq'
                                        ? 'bg-orange-600/20 border-orange-500 shadow-lg shadow-orange-600/20'
                                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-lg ${settings.provider === 'groq' ? 'bg-orange-500' : 'bg-slate-800'}`}>
                                            <Cpu size={24} className={settings.provider === 'groq' ? 'text-white' : 'text-slate-400'} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${settings.provider === 'groq' ? 'text-white' : 'text-slate-400'}`}>
                                                Groq
                                            </h3>
                                            <p className="text-xs text-slate-500">Ultra-fast inference</p>
                                        </div>
                                    </div>
                                    {settings.provider === 'groq' && (
                                        <select
                                            value={settings.model_name}
                                            onChange={e => setSettings({ ...settings, model_name: e.target.value })}
                                            onClick={e => e.stopPropagation()}
                                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                        >
                                            {PROVIDER_CONFIGS.groq.models.map(model => (
                                                <option key={model} value={model}>{model}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>

                                {/* Custom Provider */}
                                <div
                                    onClick={() => switchProvider('custom')}
                                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${settings.provider === 'custom'
                                        ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-600/20'
                                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-lg ${settings.provider === 'custom' ? 'bg-purple-500' : 'bg-slate-800'}`}>
                                            <Globe size={24} className={settings.provider === 'custom' ? 'text-white' : 'text-slate-400'} />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${settings.provider === 'custom' ? 'text-white' : 'text-slate-400'}`}>
                                                Custom Provider
                                            </h3>
                                            <p className="text-xs text-slate-500">OpenRouter, etc.</p>
                                        </div>
                                    </div>
                                    {settings.provider === 'custom' && (
                                        <div className="space-y-3" onClick={e => e.stopPropagation()}>
                                            <input
                                                type="text"
                                                value={settings.base_url || ''}
                                                onChange={e => setSettings({ ...settings, base_url: e.target.value })}
                                                placeholder="https://api.provider.com/v1"
                                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500 outline-none font-mono"
                                            />
                                            <input
                                                type="text"
                                                value={settings.model_name}
                                                onChange={e => setSettings({ ...settings, model_name: e.target.value })}
                                                placeholder="model-name"
                                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500 outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* API Key Section */}
                            <div className="border-t border-slate-700 pt-6">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                                    API Key
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-4 text-slate-500" size={18} />
                                    <input
                                        type="password"
                                        value={settings.api_key}
                                        onChange={e => setSettings({ ...settings, api_key: e.target.value })}
                                        placeholder="••••••••••••••••••••••••••••••••"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 pl-12 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    {settings.provider === 'gemini' && 'Get your API key from https://aistudio.google.com/apikey'}
                                    {settings.provider === 'openai' && 'Get your API key from https://platform.openai.com/api-keys'}
                                    {settings.provider === 'groq' && 'Get your API key from https://console.groq.com/keys'}
                                    {settings.provider === 'custom' && 'Enter your API key for the custom provider'}
                                </p>
                            </div>

                            {/* Temperature Control */}
                            <div className="border-t border-slate-700 pt-6 mb-24">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        Temperature
                                    </label>
                                    <span className="text-lg font-bold text-indigo-400">{settings.temperature}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={settings.temperature}
                                    onChange={e => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <div className="flex justify-between text-xs text-slate-600 mt-2">
                                    <span>Precise (0.0)</span>
                                    <span>Creative (1.0)</span>
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleGlobalSave}
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={22} />
                                {loading ? 'SAVING...' : 'UPDATE SYSTEM CORE'}
                            </button>
                        </div>
                    </div>
                )}

                {/* PORTFOLIO EDITOR TAB */}
                {mainTab === 'portfolio' && (
                    <div className="space-y-6 bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <FileText size={24} className="text-green-400" /> Portfolio Content
                            </h2>
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300 transition-colors flex items-center gap-2 font-medium"
                            >
                                <Download size={18} /> Export Backup
                            </button>
                        </div>

                        <div className="flex gap-2 mb-4 p-1 bg-slate-900 rounded-xl w-fit border border-slate-800">
                            <button
                                onClick={() => setActiveTab('es')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'es' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                🇪🇸 ESPAÑOL
                            </button>
                            <button
                                onClick={() => setActiveTab('en')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                🇺🇸 ENGLISH
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            <textarea
                                value={activeTab === 'es' ? dataEs : dataEn}
                                onChange={e => activeTab === 'es' ? setDataEs(e.target.value) : setDataEn(e.target.value)}
                                className="w-full h-[400px] bg-slate-900 border border-slate-700 rounded-2xl p-6 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                                spellCheck="false"
                            />
                            {jsonError && (
                                <div className="absolute top-4 right-4 bg-red-500/90 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-2xl backdrop-blur-md">
                                    <AlertCircle size={18} />
                                    {jsonError}
                                </div>
                            )}
                        </div>

                        {/* Added Save Button for Portfolio */}
                        <div className="pt-4 border-t border-slate-700">
                            <button
                                onClick={handleGlobalSave}
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={22} />
                                {loading ? 'SAVING CONTENT...' : 'SAVE PORTFOLIO CHANGES'}
                            </button>
                        </div>
                    </div>
                )}

                {/* LEADS HUB TAB */}
                {mainTab === 'leads' && (
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Users size={24} className="text-pink-400" /> Potential Leads
                            </h2>
                            <span className="px-3 py-1 bg-pink-500/10 text-pink-400 rounded-full text-xs font-bold border border-pink-500/20 uppercase tracking-tighter">
                                {leads.length} Captured
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-900/50 text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4">Received</th>
                                        <th className="px-6 py-4">Contact Detail</th>
                                        <th className="px-6 py-4">Name / Info</th>
                                        <th className="px-6 py-4 text-center">Context</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {leads.length > 0 ? (
                                        leads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-slate-800/40 transition-all text-slate-300">
                                                <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                                                    {new Date(lead.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-white font-semibold">{lead.contact_info}</td>
                                                <td className="px-6 py-4">{lead.name || 'Visitor'}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20 uppercase">
                                                        {lead.interest || 'General'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-16 text-center text-slate-500 italic">
                                                Monitoring conversations... No leads found yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* SECURITY TAB */}
                {mainTab === 'security' && (
                    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
                        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 shadow-xl">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-8">
                                <Key size={24} className="text-amber-400" /> Administrative Security
                            </h2>

                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Current Password</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-4 text-slate-600" size={18} />
                                        <input
                                            type="password"
                                            required
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 pl-12 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="Verification required"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">New System Password</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-4 text-slate-600" size={18} />
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 pl-12 text-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="Minimum 8 characters"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {passLoading ? <Check className="animate-spin" /> : <Save size={20} />}
                                    {passLoading ? 'Updating Access...' : 'Commit Password Change'}
                                </button>
                                {passMsg && (
                                    <p className={`text-center text-sm font-medium p-3 rounded-lg ${passMsg.includes('Error') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                        {passMsg}
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Action Button for Editing */}
            {(mainTab === 'config' || mainTab === 'portfolio') && (
                <div className="fixed bottom-0 left-0 right-0 bg-slate-900/50 backdrop-blur-xl border-t border-slate-800 p-6 flex justify-center z-40">
                    <button
                        type="button"
                        onClick={handleGlobalSave}
                        disabled={loading}
                        className="w-full max-w-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-lg font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-4 transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                        {loading ? <Check className="animate-pulse" /> : <Save size={24} />}
                        {loading ? 'SYNCHRONIZING...' : 'UPDATE SYSTEM CORE'}
                    </button>
                </div>
            )}

            {/* Toast Notification */}
            {msg && (
                <div className={`fixed bottom-28 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl ${msg.includes('Error') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} z-50 animate-bounce font-bold border border-white/20 transition-all`}>
                    {msg}
                </div>
            )}
        </div>
    );
};

export default AdminPanel;

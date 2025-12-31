import React, { useState, useEffect } from 'react';
import { Save, Lock, Cpu, Server, FileText, Download, AlertCircle } from 'lucide-react';

interface Settings {
    provider: string;
    model_name: string;
    api_key: string;
    base_url?: string;
    temperature: number;
}

const AdminPanel: React.FC = () => {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, statsRes, portfolioRes] = await Promise.all([
                    fetch('/api/settings/'),
                    fetch('/api/stats'),
                    fetch('/api/portfolio')
                ]);

                const settingsData = await settingsRes.json();
                const statsData = await statsRes.json();
                const portfolioJson = await portfolioRes.json();

                setSettings({
                    ...settingsData,
                    api_key: settingsData.api_key || ''
                });
                setStats(statsData);

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
    }, []);

    // Helper to switch provider and defaults
    const switchProvider = (provider: string) => {
        let defaultModel = '';
        if (provider === 'gemini') defaultModel = 'gemini-2.5-flash';
        if (provider === 'openai') defaultModel = 'gpt-3.5-turbo';

        setSettings({
            ...settings,
            provider,
            model_name: defaultModel
        });
    };

    const handleGlobalSave = async () => {
        setJsonError('');
        setLoading(true);
        setMsg('');

        try {
            // 1. Validate JSONs
            let parsedEs, parsedEn;
            try {
                parsedEs = JSON.parse(dataEs);
                parsedEn = JSON.parse(dataEn);
            } catch (e) {
                setJsonError('Invalid JSON Format in one of the tabs - Data NOT saved');
                setLoading(false);
                return;
            }

            // Construct Bilingual Payload
            const finalPayload = {
                es: parsedEs,
                en: parsedEn
            };

            // 2. Perform Parallel Saves
            const [settingsRes, portfolioRes] = await Promise.all([
                fetch('/api/settings/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settings)
                }),
                fetch('/api/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(finalPayload)
                })
            ]);

            const settingsOk = settingsRes.ok;
            const portfolioOk = portfolioRes.ok;

            if (settingsOk && portfolioOk) {
                setMsg('All changes saved successfully! 🚀');
                setTimeout(() => setMsg(''), 4000);
            } else {
                let errorMsg = 'Error saving: ';
                if (!settingsOk) errorMsg += 'Settings ';
                if (!portfolioOk) errorMsg += 'Portfolio Data';
                setMsg(errorMsg);
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

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8 md:p-12 pb-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-700">
                    <div className="p-3 bg-indigo-600 rounded-lg">
                        <Server size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">System Administration</h1>
                        <p className="text-slate-400">Manage AI Agent Configuration and Portfolio Data</p>
                    </div>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Total Messages</h3>
                        <p className="text-3xl font-bold text-white">{stats.total_messages}</p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-slate-400 text-sm font-medium mb-1">Active Sessions</h3>
                        <p className="text-3xl font-bold text-indigo-400">{stats.active_sessions}</p>
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-slate-400 text-sm font-medium mb-1">System Status</h3>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${stats.system_status === 'Operational' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <p className="text-xl font-bold text-white">{stats.system_status}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Left Column: AI Config */}
                    <div className="space-y-6 bg-slate-800/50 p-8 rounded-xl border border-slate-700 h-fit">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                            <Cpu size={20} className="text-indigo-400" /> AI Brain Configuration
                        </h2>

                        {/* Provider Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-indigo-400">LLM Provider</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => switchProvider('gemini')}
                                    className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${settings.provider === 'gemini' ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
                                >
                                    <Cpu size={24} />
                                    <span className="font-bold">Google Gemini</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchProvider('openai')}
                                    className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${settings.provider === 'openai' ? 'bg-green-600 border-green-500' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
                                >
                                    <Cpu size={24} />
                                    <span className="font-bold">OpenAI GPT</span>
                                </button>
                            </div>
                        </div>

                        {/* Model Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Model Name</label>
                            <input
                                type="text"
                                value={settings.model_name}
                                onChange={e => setSettings({ ...settings, model_name: e.target.value })}
                                placeholder={settings.provider === 'openai' ? "gpt-4o" : "gemini-2.5-flash"}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        {/* API Key */}
                        <div>
                            <label className="block text-sm font-medium mb-2">API Key</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={settings.api_key}
                                    onChange={e => setSettings({ ...settings, api_key: e.target.value })}
                                    placeholder="sk-..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                                />
                            </div>
                        </div>

                        {/* Base URL (Conditional for OpenAI) */}
                        {settings.provider === 'openai' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Base URL (Optional)</label>
                                <input
                                    type="text"
                                    value={settings.base_url || ''}
                                    onChange={e => setSettings({ ...settings, base_url: e.target.value })}
                                    placeholder="https://api.openai.com/v1"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                                />
                                <p className="text-xs text-slate-500 mt-1">Useful for compatible APIs (e.g. Ollama, LM Studio)</p>
                            </div>
                        )}

                        {/* Temperature */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Temperature: {settings.temperature}</label>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={settings.temperature}
                                onChange={e => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Right Column: Portfolio Data Editor */}
                    <div className="space-y-6 bg-slate-800/50 p-8 rounded-xl border border-slate-700 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText size={20} className="text-green-400" /> Portfolio Data (JSON)
                            </h2>
                            <button
                                onClick={handleDownload}
                                className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-slate-300 transition-colors flex items-center gap-1"
                            >
                                <Download size={14} /> Backup
                            </button>
                        </div>

                        {/* Language Tabs */}
                        <div className="flex gap-2 mb-2 p-1 bg-slate-900/50 rounded-lg w-fit">
                            <button
                                onClick={() => setActiveTab('es')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'es' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                🇪🇸 Español
                            </button>
                            <button
                                onClick={() => setActiveTab('en')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                🇺🇸 English
                            </button>
                        </div>

                        <div className="flex-1 relative">
                            <textarea
                                value={activeTab === 'es' ? dataEs : dataEn}
                                onChange={e => activeTab === 'es' ? setDataEs(e.target.value) : setDataEn(e.target.value)}
                                className="w-full h-96 bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                spellCheck="false"
                            />
                            {jsonError && (
                                <div className="absolute bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm">
                                    <AlertCircle size={16} />
                                    {jsonError}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Editing: {activeTab === 'es' ? 'Spanish' : 'English'} Version. Both versions are saved together.
                        </p>
                    </div>
                </div>
            </div>

            {/* Global Save Button - Floating or Fixed at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700 p-4 flex justify-center z-40">
                <button
                    type="button"
                    onClick={handleGlobalSave}
                    disabled={loading}
                    className="w-full max-w-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 transform hover:scale-[1.01]"
                >
                    {loading ? 'Saving Changes...' : <><Save size={24} /> SAVE ALL CHANGES</>}
                </button>
            </div>

            {/* Global Message Toast */}
            {msg && (
                <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl ${msg.includes('Error') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} transition-all z-50 animate-bounce`}>
                    {msg}
                </div>
            )}
        </div>

    );
};

export default AdminPanel;

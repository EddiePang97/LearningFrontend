import { useState } from 'react';
import { Shield, Globe, Lock, Code, Image as ImageIcon, AlertOctagon } from 'lucide-react';

type CSPDirective = 'self' | 'trusted.com' | 'evil.com' | '*';

export const CSPLab = () => {
    // CSP Configuration
    const [scriptSrc, setScriptSrc] = useState<CSPDirective[]>(['self']);
    const [imgSrc, setImgSrc] = useState<CSPDirective[]>(['self']);
    const [status, setStatus] = useState<Record<string, 'allowed' | 'blocked' | 'idle'>>({
        script1: 'idle', // Internal script
        script2: 'idle', // External malicious script
        img1: 'idle',    // Internal image
        img2: 'idle',    // Trusted external image
    });

    const toggleDirective = (type: 'script' | 'img', val: CSPDirective) => {
        const current = type === 'script' ? scriptSrc : imgSrc;
        const setter = type === 'script' ? setScriptSrc : setImgSrc;

        if (current.includes(val)) {
            setter(current.filter(d => d !== val));
        } else {
            setter([...current, val]);
        }
    };

    const runCheck = () => {
        const newStatus = { ...status };

        // 1. Script Check (self)
        newStatus.script1 = scriptSrc.includes('self') || scriptSrc.includes('*') ? 'allowed' : 'blocked';

        // 2. Script Check (evil.com)
        newStatus.script2 = scriptSrc.includes('evil.com') || scriptSrc.includes('*') ? 'allowed' : 'blocked';

        // 3. Image Check (self)
        newStatus.img1 = imgSrc.includes('self') || imgSrc.includes('*') ? 'allowed' : 'blocked';

        // 4. Image Check (trusted.com)
        newStatus.img2 = imgSrc.includes('trusted.com') || imgSrc.includes('*') ? 'allowed' : 'blocked';

        setStatus(newStatus);
    };

    const getStatusColor = (s: string) => {
        if (s === 'allowed') return 'text-green-400';
        if (s === 'blocked') return 'text-red-400';
        return 'text-gray-500';
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Shield className="text-blue-400" />
                    Content Security Policy (CSP) Builder
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                    Define which resources the browser is allowed to load. Block XSS by default!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">

                {/* 1. Policy Configurator */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-white/5 flex flex-col gap-6">
                    <div className="uppercase text-xs font-bold text-gray-400 flex items-center gap-2">
                        <Lock size={14} /> Server Response Header
                    </div>

                    <div className="space-y-4">
                        {/* script-src */}
                        <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                            <h4 className="text-blue-300 text-xs font-bold mb-3">script-src</h4>
                            <div className="flex flex-wrap gap-2">
                                {['self', 'trusted.com', 'evil.com', '*'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => toggleDirective('script', opt as CSPDirective)}
                                        className={`px-3 py-1.5 rounded text-[10px] border transition-all ${scriptSrc.includes(opt as CSPDirective)
                                            ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                                            : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500'
                                            }`}
                                    >
                                        '{opt}'
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* img-src */}
                        <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                            <h4 className="text-purple-300 text-xs font-bold mb-3">img-src</h4>
                            <div className="flex flex-wrap gap-2">
                                {['self', 'trusted.com', 'evil.com', '*'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => toggleDirective('img', opt as CSPDirective)}
                                        className={`px-3 py-1.5 rounded text-[10px] border transition-all ${imgSrc.includes(opt as CSPDirective)
                                            ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                                            : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500'
                                            }`}
                                    >
                                        '{opt}'
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto bg-gray-800 p-3 rounded text-[10px] font-mono text-gray-300 break-all border border-gray-700">
                        <span className="text-gray-500">Content-Security-Policy: </span>
                        {`script-src ${scriptSrc.map(s => `'${s}'`).join(' ')}; `}
                        {`img-src ${imgSrc.map(s => `'${s}'`).join(' ')};`}
                    </div>

                    <button
                        onClick={runCheck}
                        className="w-full py-3 bg-white text-black font-bold rounded-lg shadow hover:bg-gray-200 transition-colors"
                    >
                        Apply Policy & Reload Page
                    </button>
                </div>

                {/* 2. Simulation Result */}
                <div className="bg-white rounded-xl overflow-hidden flex flex-col relative">
                    <div className="bg-gray-100 border-b p-2 flex items-center gap-2">
                        <div className="flex gap-1.5 ml-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white mx-4 rounded-md text-[10px] text-gray-400 text-center py-1">
                            my-secure-app.com
                        </div>
                    </div>

                    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
                        <h4 className="text-lg font-bold text-gray-800 mb-6">Resource Loader</h4>

                        <div className="space-y-4">
                            {/* Resource 1: Local Script */}
                            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 z-10">
                                    <Code className="text-blue-500" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">app.js</div>
                                        <div className="text-[10px] text-gray-400">Origin: Self (Local)</div>
                                    </div>
                                </div>
                                <div className={`text-xs font-bold uppercase ${getStatusColor(status.script1)}`}>
                                    {status.script1}
                                </div>
                            </div>

                            {/* Resource 2: Evil Script */}
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-100 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 z-10">
                                    <AlertOctagon className="text-red-500" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">xss-attack.js</div>
                                        <div className="text-[10px] text-red-400">Origin: evil.com</div>
                                    </div>
                                </div>
                                <div className={`text-xs font-bold uppercase ${getStatusColor(status.script2)}`}>
                                    {status.script2}
                                </div>
                            </div>

                            <div className="h-px bg-gray-200 my-2" />

                            {/* Resource 3: Local Image */}
                            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 z-10">
                                    <ImageIcon className="text-purple-500" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">logo.png</div>
                                        <div className="text-[10px] text-gray-400">Origin: Self (Local)</div>
                                    </div>
                                </div>
                                <div className={`text-xs font-bold uppercase ${getStatusColor(status.img1)}`}>
                                    {status.img1}
                                </div>
                            </div>

                            {/* Resource 4: Remote Image */}
                            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 z-10">
                                    <Globe className="text-gray-500" size={18} />
                                    <div>
                                        <div className="text-xs font-bold text-gray-700">chart.jpg</div>
                                        <div className="text-[10px] text-gray-400">Origin: trusted.com</div>
                                    </div>
                                </div>
                                <div className={`text-xs font-bold uppercase ${getStatusColor(status.img2)}`}>
                                    {status.img2}
                                </div>
                            </div>

                        </div>

                        {/* Simulation Console */}
                        <div className="mt-8 bg-black text-gray-300 p-3 rounded font-mono text-[10px]">
                            <div className="text-gray-500 mb-1 border-b border-gray-800 pb-1">Console Output</div>
                            {Object.entries(status).map(([key, val]) => (
                                val === 'blocked' && (
                                    <div key={key} className="text-red-400 mb-1">
                                        Refused to load {key.includes('script') ? 'script' : 'image'} because it violates the following Content Security Policy directive: ...
                                    </div>
                                )
                            ))}
                            {Object.values(status).every(s => s === 'idle') && <span className="text-gray-600">Waiting for reload...</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

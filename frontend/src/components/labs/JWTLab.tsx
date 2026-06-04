import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, Lock, User, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
// Mock secret for educational purpose
const SECRET_KEY = "super-secret-key-123";

// Simple HS256 simulation (educational approximation)
const sign = (data: string) => {
    // In a real app, this would be a proper HMAC-SHA256
    // Here we just simple hashing simulation for visual purpose
    let hash = 0;
    const input = data + SECRET_KEY;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    // Make it look like a signature
    return Math.abs(hash).toString(16).padStart(32, '0') + "simulatedsignature";
};

// Basic Base64Url encode implementation for browser
const base64UrlEncode = (obj: Record<string, string | number>) => {
    const stringified = JSON.stringify(obj);
    const base64 = btoa(stringified);
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

export const JWTLab = () => {
    const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
    const createToken = (role: 'user' | 'admin') => {
        const header = { alg: "HS256", typ: "JWT" };
        const payload = { sub: "1234567890", name: "John Doe", role, iat: 1516239022 };

        const part1 = base64UrlEncode(header);
        const part2 = base64UrlEncode(payload);
        const signature = sign(`${part1}.${part2}`);

        return `${part1}.${part2}.${signature}`;
    };

    const [tamperedToken, setTamperedToken] = useState<string>(() => createToken('user'));
    const [isTampered, setIsTampered] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

    const changeRole = (role: 'user' | 'admin') => {
        setUserRole(role);
        setIsTampered(false);
        setVerificationStatus('idle');
        setTamperedToken(createToken(role));
    };

    // Verification Logic
    const verifyToken = () => {
        setVerificationStatus('idle');

        // Brief simulation delay
        setTimeout(() => {
            const parts = tamperedToken.split('.');
            if (parts.length !== 3) {
                setVerificationStatus('invalid');
                return;
            }

            const [h, p, s] = parts;
            const expectedSignature = sign(`${h}.${p}`);

            if (s === expectedSignature) {
                setVerificationStatus('valid');
            } else {
                setVerificationStatus('invalid');
            }
        }, 600);
    };

    // Decode Payload for Display
    const getDecodedPayload = (tokenStr: string) => {
        try {
            const parts = tokenStr.split('.');
            if (parts.length < 2) return '{}';
            // Simple base64 decode
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            return atob(base64);
        } catch {
            return 'Invalid Payload';
        }
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <Key className="text-yellow-500" />
                    JWT Debugger
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                    Understanding the <span className="text-red-400">Header</span>.<span className="text-purple-400">Payload</span>.<span className="text-blue-400">Signature</span> structure.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                {/* Left: Token Generator & Input */}
                <div className="flex flex-col gap-6">
                    {/* Role Switcher */}
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-400 uppercase mb-2 font-bold flex items-center gap-2">
                            <User size={14} /> 1. Generate Token (Server)
                        </div>
                        <div className="flex gap-2 mb-2">
                            <button
                                onClick={() => changeRole('user')}
                                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${userRole === 'user' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-gray-800 border-transparent text-gray-500'}`}
                            >
                                Role: User
                            </button>
                            <button
                                onClick={() => changeRole('admin')}
                                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${userRole === 'admin' ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-gray-800 border-transparent text-gray-500'}`}
                            >
                                Role: Admin
                            </button>
                        </div>
                    </div>

                    {/* Encoded Token View */}
                    <div className="flex-1 bg-gray-900 rounded-xl p-4 border border-white/5 flex flex-col">
                        <div className="text-xs text-gray-400 uppercase mb-2 font-bold flex justify-between items-center">
                            <span>2. Encoded Token</span>
                            {isTampered && <span className="text-red-400 text-[10px] animate-pulse">MODIFIED BY HACKER</span>}
                        </div>
                        <textarea
                            value={tamperedToken}
                            onChange={(e) => {
                                setTamperedToken(e.target.value);
                                setIsTampered(true);
                                setVerificationStatus('idle');
                            }}
                            className="w-full h-full bg-black/50 p-4 rounded-lg font-mono text-xs break-all focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                            style={{ color: '#aaa' }}
                        />
                        <div className="text-[10px] text-gray-600 mt-2">
                            Try changing a character in the "Payload" (middle part) above!
                        </div>
                    </div>
                </div>

                {/* Right: Decoded View & Verification */}
                <div className="flex flex-col gap-6">
                    {/* Visualizer */}
                    <div className="flex-1 bg-white rounded-xl p-6 border border-white/10 text-gray-800 font-sans shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Lock size={120} />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 mb-1">HEADER (Algorithm & Type)</h4>
                                <div className="p-3 bg-red-50 rounded-lg border border-red-100 font-mono text-xs text-red-600">
                                    {'{ "alg": "HS256", "typ": "JWT" }'}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 mb-1">PAYLOAD (Data)</h4>
                                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 font-mono text-xs text-purple-700 whitespace-pre-wrap">
                                    {getDecodedPayload(tamperedToken)}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 mb-1">SIGNATURE (Verification)</h4>
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 font-mono text-xs text-blue-600 break-all">
                                    HMACSHA256(
                                    base64UrlEncode(header) + "." +
                                    base64UrlEncode(payload),
                                    <span className="font-bold bg-yellow-200 px-1 rounded">secret</span>
                                    )
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verification Action */}
                    <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${verificationStatus === 'idle' ? 'bg-gray-500' : verificationStatus === 'valid' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className="text-sm font-bold text-white">
                                {verificationStatus === 'idle' ? 'Ready to Verify' : verificationStatus === 'valid' ? 'Signature Valid' : 'Invalid Signature'}
                            </span>
                        </div>
                        <button
                            onClick={verifyToken}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs transition-colors"
                        >
                            <RefreshCw size={14} className={verificationStatus === 'idle' ? '' : 'animate-spin-once'} />
                            Verify Signature
                        </button>
                    </div>

                    {/* Explanation Feedback */}
                    <AnimatePresence>
                        {verificationStatus === 'valid' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-900/30 border border-green-500/30 p-4 rounded-xl flex gap-3 text-green-300 text-xs">
                                <CheckCircle className="shrink-0" />
                                <div>
                                    Token is authentic. The signature matches the content, meaning no one has tampered with the payload.
                                </div>
                            </motion.div>
                        )}
                        {verificationStatus === 'invalid' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-900/30 border border-red-500/30 p-4 rounded-xl flex gap-3 text-red-300 text-xs">
                                <AlertTriangle className="shrink-0" />
                                <div>
                                    <strong>Tamper Detected!</strong><br />
                                    The signature computed from your modified payload DOES NOT match the signature in the token. Server rejects this request.
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

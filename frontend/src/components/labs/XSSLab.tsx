import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Code, AlertTriangle, Send, Terminal } from 'lucide-react';

export const XSSLab = () => {
    const [input, setInput] = useState('<script>alert("XSS")</script>');
    const [isSecure, setIsSecure] = useState(false);
    const [comments, setComments] = useState<{ id: number; content: string; author: string }[]>([]);
    const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null);

    const handlePost = () => {
        if (!input.trim()) return;

        // Simulate XSS Attack Check
        if (!isSecure) {
            // Simple heuristic to detect script tags or event handlers for educational purpose
            if (input.toLowerCase().includes('<script>') || input.toLowerCase().includes('onerror') || input.toLowerCase().includes('onload')) {
                setSimulatedAlert('XSS Attack Successful! \nAllows attackers to execute arbitrary JavaScript.');
            }
        }
        const newComment = {
            id: Date.now(),
            content: input,
            author: 'User123'
        };
        setComments([newComment, ...comments]);
    };

    const clearAlert = () => setSimulatedAlert(null);

    // Auto-clear alert
    useEffect(() => {
        if (simulatedAlert) {
            const timer = setTimeout(clearAlert, 3000);
            return () => clearTimeout(timer);
        }
    }, [simulatedAlert]);

    // Sanitize function for visual display
    const escapeHtml = (unsafe: string) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    return (
        <div className="flex flex-col min-h-[480px] md:min-h-[600px] w-full bg-[#0f0f11] rounded-3xl border border-white/10 p-4 md:p-6 font-mono text-sm shadow-2xl overflow-hidden relative">
            {/* Alert Overlay */}
            <AnimatePresence>
                {simulatedAlert && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                        onClick={clearAlert}
                    >
                        <div className="bg-red-900/40 border border-red-500 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl shadow-red-500/20">
                            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4 animate-bounce" />
                            <h3 className="text-2xl font-bold text-white mb-2">Browser Alert</h3>
                            <div className="bg-white text-black p-4 rounded-lg font-sans text-lg">
                                {simulatedAlert}
                            </div>
                            <p className="text-xs text-red-300 mt-4 animate-pulse">
                                (In a real attack, this could send cookies to a hacker's server)
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        {isSecure ? <Shield className="text-green-500" /> : <ShieldAlert className="text-red-500" />}
                        XSS Vulnerability Lab
                    </h3>
                    <p className="text-xs text-gray-500 mt-2">
                        Try injecting: <code className="bg-gray-800 px-1 py-0.5 rounded text-blue-300">{'<img src=x onerror=alert(1)>'}</code>. Notice how Secure Mode treats it as Data, not Code.
                    </p>
                </div>

                {/* Security Toggle */}
                <button
                    onClick={() => setIsSecure(!isSecure)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${isSecure
                        ? 'bg-green-900/20 border-green-500/50 text-green-400 hover:bg-green-900/40'
                        : 'bg-red-900/20 border-red-500/50 text-red-400 hover:bg-red-900/40'
                        }`}
                >
                    {isSecure ? 'Shields UP (Escaped)' : 'Shields DOWN (Vulnerable)'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Input Section (Attacker) */}
                <div className="flex flex-col gap-4">
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-white/5 relative">
                        <label className="text-xs text-gray-500 font-bold uppercase mb-2 block flex items-center gap-2">
                            <Terminal size={14} /> Attacker Input
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full bg-black/50 text-green-300 font-mono p-4 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none min-h-[120px] resize-none"
                            placeholder="Enter comment..."
                        />
                        <button
                            onClick={handlePost}
                            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>

                    {/* Code Visualizer */}
                    <div className="flex-1 bg-gray-900 rounded-xl p-4 border border-white/5 overflow-hidden flex flex-col">
                        <div className="text-xs text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
                            <Code size={14} /> How Browser Sees It (DOM)
                        </div>
                        <div className="flex-1 overflow-auto font-mono text-xs">
                            {comments.length === 0 ? (
                                <span className="text-gray-600 italic">// No comments yet</span>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="mb-2">
                                        <span className="text-blue-400">&lt;div class="comment"&gt;</span>
                                        <div className="pl-4 border-l border-gray-800 ml-1">
                                            {isSecure ? (
                                                // Secure Mode: Shown as text content (escaped)
                                                <span className="text-green-300">{escapeHtml(comment.content)}</span>
                                            ) : (
                                                // Vulnerable Mode: Highlight dangerous tags
                                                <span dangerouslySetInnerHTML={{
                                                    __html: comment.content
                                                        .replace(/</g, '&lt;')
                                                        .replace(/>/g, '&gt;')
                                                        .replace(/&lt;script&gt;/gi, '<span class="text-red-500 font-bold bg-red-900/20">&lt;script&gt;</span>')
                                                        .replace(/&lt;\/script&gt;/gi, '<span class="text-red-500 font-bold bg-red-900/20">&lt;/script&gt;</span>')
                                                        .replace(/onerror/gi, '<span class="text-red-500 font-bold bg-red-900/20">onerror</span>')
                                                }} />
                                            )}
                                        </div>
                                        <span className="text-blue-400">&lt;/div&gt;</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Rendered View (Victim) */}
                <div className="bg-white rounded-xl overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                    <div className="bg-gray-100 border-b border-gray-200 p-3 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-center text-gray-500 border border-gray-200 shadow-sm ml-2">
                            awesome-blog.com/post/1
                        </div>
                    </div>

                    <div className="flex-1 p-6 relative">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4 font-sans">Comments Section</h1>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {comments.length === 0 && (
                                <div className="text-center text-gray-400 py-10 font-sans">
                                    No comments yet. Be the first to post!
                                </div>
                            )}
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gray-50 p-4 rounded-lg border border-gray-100 font-sans"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                                        <span className="font-bold text-gray-700 text-sm">{comment.author}</span>
                                        <span className="text-xs text-gray-400">{new Date(comment.id).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="text-gray-800">
                                        {isSecure ? (
                                            /* Secure: Render as plain text */
                                            comment.content
                                        ) : (
                                            /* Vulnerable: Dangerous Render */
                                            <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Explanation Badge */}
                    <div className={`absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transition-colors ${isSecure ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {isSecure ? 'Secure: Browser treats input as Data (Text)' : 'Vulnerable: Browser executes input as Code'}
                    </div>
                </div>
            </div>
        </div>
    );
};

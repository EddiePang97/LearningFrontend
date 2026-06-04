import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUp } from 'lucide-react';

export const PrototypeLab = () => {
    const [lookupProp, setLookupProp] = useState('');
    const [foundAt, setFoundAt] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState('');
    const isMountedRef = useRef(true);
    const searchRunRef = useRef(0);

    const suggestedProps = ['name', 'sayHello', 'toString', 'missingProp'];

    // Initial Object Structure
    const objects = {
        instance: {
            name: "Instance (me)",
            props: { name: "'Eddie'", age: 25 },
            proto: "Person.prototype"
        },
        prototype: {
            name: "Person.prototype",
            props: { sayHello: "Function", species: "'Human'" },
            proto: "Object.prototype"
        },
        objectProto: {
            name: "Object.prototype",
            props: { toString: "Function", hasOwnProperty: "Function" },
            proto: "null"
        }
    };

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            searchRunRef.current += 1;
        };
    }, []);

    const wait = async (ms: number, runId: number) => {
        await new Promise(r => setTimeout(r, ms));
        return isMountedRef.current && searchRunRef.current === runId;
    };

    const handleSearch = async (propRaw?: string) => {
        const prop = propRaw || lookupProp;
        if (!prop) return;
        const runId = searchRunRef.current + 1;
        searchRunRef.current = runId;

        // If triggered via button, update input
        if (propRaw) setLookupProp(propRaw);

        setIsSearching(true);
        setFoundAt(null);
        setSearchStatus('Starting lookup...');

        // Simulate lookup delay
        if (!await wait(600, runId)) return;

        // Check Instance
        setSearchStatus(`Checking 'Instance'...`);
        if (prop in objects.instance.props) {
            if (!await wait(400, runId)) return;
            setFoundAt('instance');
            setIsSearching(false);
            setSearchStatus(`Found '${prop}' in Instance!`);
            return;
        }

        if (!await wait(800, runId)) return;

        // Check Prototype
        setSearchStatus(`Not found. Checking 'Person.prototype'...`);
        if (prop in objects.prototype.props) {
            if (!await wait(400, runId)) return;
            setFoundAt('prototype');
            setIsSearching(false);
            setSearchStatus(`Found '${prop}' in Person.prototype!`);
            return;
        }

        if (!await wait(800, runId)) return;

        // Check Object Prototype
        setSearchStatus(`Not found. Checking 'Object.prototype'...`);
        if (prop in objects.objectProto.props) {
            if (!await wait(400, runId)) return;
            setFoundAt('objectProto');
            setIsSearching(false);
            setSearchStatus(`Found '${prop}' in Object.prototype!`);
            return;
        }

        if (!await wait(600, runId)) return;
        setFoundAt('undefined');
        setIsSearching(false);
        setSearchStatus(`Property '${prop}' is undefined.`);
    };

    return (
        <div className="relative flex w-full flex-col rounded-3xl border border-white/10 bg-[#0f0f11] p-4 font-mono text-sm shadow-2xl md:min-h-[700px] md:p-8">
            {/* Header / Controls */}
            <div className="flex flex-col items-center gap-6 mb-8 md:mb-12">
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Prototype Chain Lookup</h3>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            value={lookupProp}
                            onChange={(e) => setLookupProp(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-accent-purple focus:outline-none transition-colors"
                            placeholder="Lookup property (e.g., name, toString)..."
                        />
                    </div>
                    <button
                        onClick={() => handleSearch()}
                        disabled={isSearching || !lookupProp}
                        className="px-6 py-3 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-xl font-bold disabled:opacity-50 transition-colors"
                    >
                        {isSearching ? 'Searching...' : 'Find'}
                    </button>
                </div>

                {/* Quick Try Buttons */}
                <div className="flex gap-2 flex-wrap justify-center -mt-4 mb-4">
                    <span className="text-xs text-gray-500 self-center mr-2">Quick Try:</span>
                    {suggestedProps.map(p => (
                        <button
                            key={p}
                            onClick={() => handleSearch(p)}
                            disabled={isSearching}
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-gray-300 transition-colors"
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <div className="flex min-h-8 items-center justify-center text-center">
                    {(isSearching || foundAt) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={searchStatus}
                            className={`text-sm font-bold ${foundAt === 'undefined' ? 'text-red-400' : foundAt ? 'text-emerald-400' : 'text-accent-purple'}`}
                        >
                            {searchStatus}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Visualization Graph */}
            <div className="relative flex flex-1 flex-col items-center justify-center gap-8 md:gap-14">
                {/* Object Prototype */}
                <PrototypeNode
                    data={objects.objectProto}
                    isActive={isSearching && !foundAt} // Searching deep
                    isFound={foundAt === 'objectProto'}
                />

                <ChainLink isActive={isSearching && !foundAt} />

                {/* Person Prototype */}
                <PrototypeNode
                    data={objects.prototype}
                    isActive={isSearching && foundAt !== 'instance'} // Searching middle
                    isFound={foundAt === 'prototype'}
                />

                <ChainLink isActive={isSearching && foundAt !== 'instance'} />

                {/* Instance */}
                <PrototypeNode
                    data={objects.instance}
                    isActive={isSearching} // Always starts here
                    isFound={foundAt === 'instance'}
                />
            </div>
        </div>
    );
};

interface PrototypeNodeData {
    name: string;
    props: Record<string, string | number | (() => void)>;
    proto: string;
}

const PrototypeNode = ({ data, isActive, isFound }: { data: PrototypeNodeData, isActive: boolean, isFound: boolean }) => (
    <motion.div
        animate={{
            borderColor: isFound ? '#10b981' : isActive ? '#a855f7' : 'rgba(255,255,255,0.1)',
            scale: isFound ? 1.05 : 1,
            boxShadow: isFound ? '0 0 30px rgba(16,185,129,0.2)' : isActive ? '0 0 20px rgba(168,85,247,0.1)' : 'none'
        }}
        className="relative z-10 flex w-full max-w-2xl flex-col gap-3 rounded-2xl border bg-black/40 p-4 backdrop-blur-sm md:flex-row md:items-center md:justify-between"
    >
        <div className="flex flex-col gap-1">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{data.name}</div>
            <div className="text-[10px] text-gray-500">__proto__: {data.proto}</div>
        </div>

        <div className="flex flex-wrap gap-2">
            {Object.entries(data.props).map(([k, v]) => (
                <div key={k} className="px-3 py-1 bg-white/5 rounded border border-white/5 text-xs text-gray-300">
                    {k}: <span className="text-orange-300">{String(v)}</span>
                </div>
            ))}
        </div>
    </motion.div>
);

const ChainLink = ({ isActive }: { isActive: boolean }) => (
    <div className="h-16 w-px bg-white/10 relative -my-4 z-0 overflow-hidden">
        {isActive && (
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: '-100%' }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-t from-transparent via-accent-purple to-transparent opacity-50"
            />
        )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f0f11] p-1.5 rounded-full border border-white/5">
            <ArrowUp size={12} className={`transition-colors ${isActive ? 'text-accent-purple' : 'text-gray-500'}`} />
        </div>
    </div>
);

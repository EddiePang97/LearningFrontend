import { useMemo, useState } from 'react';
import { Database, Search, Timer, Zap } from 'lucide-react';
import { LabFrame } from './LabFrame';

type QueryMode = 'scan' | 'index';

export const IndexQueryLab = () => {
    const [datasetSize, setDatasetSize] = useState(50000);
    const [mode, setMode] = useState<QueryMode>('scan');

    const analysis = useMemo(() => {
        const scannedRows = mode === 'scan' ? datasetSize : Math.max(12, Math.round(Math.log2(datasetSize) * 3));
        const latency = mode === 'scan'
            ? Math.max(24, Math.round(datasetSize / 1300))
            : Math.max(3, Math.round(Math.log2(datasetSize)));
        const writeCost = mode === 'scan' ? 'Low write cost' : 'Higher write cost due to index maintenance';
        const planner = mode === 'scan'
            ? 'Planner falls back to sequential scan because no supporting index exists.'
            : 'Planner can jump directly to the lookup path because the filter matches the index.';

        return {
            scannedRows,
            latency,
            writeCost,
            planner,
        };
    }, [datasetSize, mode]);

    return (
        <LabFrame className="relative min-h-[480px] md:min-h-[600px] w-full" icon={Database} title="Index Query Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Database className="text-sky-400" />
                        Index Query Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Compare sequential scans versus indexed lookups as the table grows.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Query Strategy</p>
                        <div className="mt-4 grid gap-3">
                            <button
                                type="button"
                                onClick={() => setMode('scan')}
                                className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                    mode === 'scan' ? 'border-amber-400/40 bg-amber-500/10' : 'border-white/8 bg-black/20'
                                }`}
                            >
                                <p className="text-xs font-bold text-white">Sequential Scan</p>
                                <p className="mt-1 text-[11px] text-gray-400">Read rows one by one until the match appears.</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode('index')}
                                className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                                    mode === 'index' ? 'border-sky-400/40 bg-sky-500/10' : 'border-white/8 bg-black/20'
                                }`}
                            >
                                <p className="text-xs font-bold text-white">Indexed Lookup</p>
                                <p className="mt-1 text-[11px] text-gray-400">Use a B-Tree path to narrow the search quickly.</p>
                            </button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Table Size</p>
                            <span className="text-xs font-bold text-white">{datasetSize.toLocaleString()} rows</span>
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max="200000"
                            step="1000"
                            value={datasetSize}
                            onChange={(event) => setDatasetSize(Number(event.target.value))}
                            className="mt-4 w-full accent-sky-500"
                        />
                        <p className="mt-4 text-[11px] leading-5 text-gray-400">{analysis.writeCost}</p>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <MetricCard icon={Search} label="Rows Examined" value={analysis.scannedRows.toLocaleString()} accent="text-sky-300" />
                        <MetricCard icon={Timer} label="Estimated Latency" value={`${analysis.latency} ms`} accent="text-amber-300" />
                        <MetricCard icon={Zap} label="Planner Choice" value={mode === 'scan' ? 'Seq Scan' : 'Index Scan'} accent="text-green-300" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">Execution Story</p>
                        <p className="mt-3 text-sm font-semibold leading-7 text-gray-200">{analysis.planner}</p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Trade-off Reminder</p>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Indexes help specific lookup paths. They do not make every query cheap.</li>
                            <li>As row count grows, sequential scans become increasingly painful on selective filters.</li>
                            <li>Every extra index speeds some reads while making writes and storage a bit heavier.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

const MetricCard = ({
    icon: Icon,
    label,
    value,
    accent,
}: {
    icon: typeof Search;
    label: string;
    value: string;
    accent: string;
}) => (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <Icon size={14} />
            <span>{label}</span>
        </div>
        <p className={`mt-3 text-2xl font-black ${accent}`}>{value}</p>
    </div>
);

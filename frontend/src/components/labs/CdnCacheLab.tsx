import { useMemo, useState } from 'react';
import { Cloud, DatabaseZap, HardDriveDownload, RefreshCcw } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type AssetType = 'hashed' | 'mutable';
type CachePolicy = 'immutable' | 'revalidate' | 'short-ttl';

const ASSET_OPTIONS: Array<{ id: AssetType; label: string; note: string }> = [
    { id: 'hashed', label: 'Hashed Asset', note: 'Filename changes on every deploy, so stale files can be safely cached for a long time.' },
    { id: 'mutable', label: 'Mutable URL', note: 'The URL stays the same, so caches need explicit revalidation or invalidation.' },
];

const POLICY_OPTIONS: Array<{ id: CachePolicy; label: string; header: string }> = [
    { id: 'immutable', label: 'Long Immutable', header: 'public, max-age=31536000, immutable' },
    { id: 'revalidate', label: 'ETag Revalidate', header: 'public, max-age=0, must-revalidate' },
    { id: 'short-ttl', label: 'Short Shared TTL', header: 'public, s-maxage=120, max-age=30' },
];

export const CdnCacheLab = () => {
    const [assetType, setAssetType] = useState<AssetType>('hashed');
    const [policy, setPolicy] = useState<CachePolicy>('immutable');

    const simulation = useMemo(() => {
        if (assetType === 'hashed' && policy === 'immutable') {
            return {
                browser: 'HIT AFTER FIRST LOAD',
                edge: 'HIT AFTER FIRST REGION REQUEST',
                origin: 'ONLY ON COLD MISS',
                note: 'Best case for static assets: URL versioning makes long-lived browser and CDN cache safe.',
            };
        }

        if (assetType === 'mutable' && policy === 'immutable') {
            return {
                browser: 'OLD FILE STICKS',
                edge: 'OLD FILE STICKS',
                origin: 'BYPASSED UNTIL PURGE',
                note: 'Danger zone: immutable caching on a mutable URL means users can keep seeing stale content long after deploy.',
            };
        }

        if (policy === 'revalidate') {
            return {
                browser: 'CHECKS WITH ETAG',
                edge: 'CHECKS ORIGIN ON EXPIRE',
                origin: 'VALIDATION TRAFFIC CONTINUES',
                note: 'Revalidation keeps one URL stable, but you pay extra round trips whenever caches need to confirm freshness.',
            };
        }

        return {
            browser: 'SHORT LOCAL HIT',
            edge: 'SHORT EDGE HIT',
            origin: 'RETURNS SOONER',
            note: 'Short TTL reduces stale risk, but it also causes more origin traffic because caches expire quickly.',
        };
    }, [assetType, policy]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[600px]" icon={Cloud} title="CDN Cache Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Cloud className="text-sky-400" />
                        CDN Cache Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Compare versioned assets, mutable URLs, and Cache-Control choices to see which layer serves traffic and where stale content risk appears.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Asset Shape</p>
                        <div className="mt-4 space-y-3">
                            {ASSET_OPTIONS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setAssetType(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        assetType === option.id ? 'border-sky-400/40 bg-sky-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Cache-Control Policy</p>
                        <div className="mt-4 space-y-3">
                            {POLICY_OPTIONS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setPolicy(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        policy === option.id ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.header}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Browser Cache" value={simulation.browser} tone="cyan" />
                        <LabMetricCard label="CDN Edge" value={simulation.edge} tone="emerald" />
                        <LabMetricCard label="Origin Load" value={simulation.origin} tone="amber" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
                            <RefreshCcw size={14} />
                            <span>Cache Outcome</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{simulation.note}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <LabMiniCard
                            title="Browser vs Edge"
                            tone="sky"
                            body="Browser cache helps one returning user; CDN edge cache helps many users in the same region. They are complementary, not interchangeable."
                        />
                        <LabMiniCard
                            title="Purge Risk"
                            tone="amber"
                            body={
                                assetType === 'mutable'
                                    ? 'When URLs stay the same, deploy safety depends on revalidation or purge discipline. Otherwise stale assets can survive past release.'
                                    : 'Hashed URLs reduce purge pressure because each deploy naturally points clients to a new asset identity.'
                            }
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <DatabaseZap size={14} />
                            <span>Strategy Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Long immutable caching is ideal for versioned static assets, not for mutable URLs that change in place.</li>
                            <li>Revalidation preserves a stable URL, but every freshness check adds network work that cache hits would otherwise avoid.</li>
                            <li>CDN strategy should always be discussed together with invalidation and release mechanics, not as a header-only decision.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <HardDriveDownload size={14} />
                            <span>Selected Header</span>
                        </div>
                        <pre className="mt-4 overflow-x-auto rounded-2xl border border-white/8 bg-white/4 p-4 text-[11px] leading-6 text-gray-200">
{`Cache-Control: ${POLICY_OPTIONS.find(item => item.id === policy)!.header}`}
                        </pre>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

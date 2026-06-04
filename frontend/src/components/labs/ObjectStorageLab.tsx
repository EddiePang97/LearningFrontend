import { useMemo, useState } from 'react';
import { HardDriveUpload, PackageOpen, ShieldCheck, TriangleAlert } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';
import { LabStoryCard } from './LabStoryCard';

type FileType = 'avatar' | 'course-video' | 'invoice-export' | 'private-attachment';
type DeliveryModel = 'app-disk' | 'app-proxy' | 'direct-object-storage' | 'storage-plus-metadata';

const FILE_TYPES: Array<{ id: FileType; label: string; note: string }> = [
    { id: 'avatar', label: 'User avatar', note: 'Small asset with frequent reads and simple metadata.' },
    { id: 'course-video', label: 'Course video', note: 'Large binary payload with heavy bandwidth and CDN pressure.' },
    { id: 'invoice-export', label: 'Invoice export', note: 'Generated artifact that may need lifecycle cleanup and secure delivery.' },
    { id: 'private-attachment', label: 'Private attachment', note: 'Sensitive file whose access should stay permissioned and auditable.' },
];

const MODELS: Array<{ id: DeliveryModel; label: string; note: string }> = [
    { id: 'app-disk', label: 'Store on app server disk', note: 'Business service owns file bytes and local filesystem lifecycle directly.' },
    { id: 'app-proxy', label: 'Serve through app process', note: 'Backend stays in the middle of upload/download traffic for every request.' },
    { id: 'direct-object-storage', label: 'Push everything to object storage', note: 'Let storage layer own bytes and scaling concerns.' },
    { id: 'storage-plus-metadata', label: 'Storage for bytes, app for metadata', note: 'Business service keeps permission rules and records while storage handles file delivery.' },
];

const RESULT_MAP: Record<FileType, Record<DeliveryModel, {
    verdict: string;
    scaling: string;
    ownership: string;
    takeaway: string;
    tone: 'emerald' | 'amber' | 'violet';
}>> = {
    avatar: {
        'app-disk': {
            verdict: 'WORKS EARLY, AGES POORLY',
            scaling: 'easy at tiny scale, painful across multiple instances',
            ownership: 'app owns bytes, backups, and rollout coupling',
            takeaway: 'Local disk can feel simple for prototypes, but it quickly becomes awkward once multiple app instances or CDN delivery enter the picture.',
            tone: 'amber',
        },
        'app-proxy': {
            verdict: 'EXTRA LOAD',
            scaling: 'app bandwidth rises with every read',
            ownership: 'app stays responsible for file transport on each request',
            takeaway: 'Proxying every image through the business service wastes compute on a job storage and CDN layers handle more naturally.',
            tone: 'amber',
        },
        'direct-object-storage': {
            verdict: 'GOOD DELIVERY',
            scaling: 'storage + CDN absorb reads well',
            ownership: 'bytes move out of app, but metadata story may be thin',
            takeaway: 'For simple public-ish assets, object storage is already a much better home for the bytes themselves.',
            tone: 'violet',
        },
        'storage-plus-metadata': {
            verdict: 'BEST DEFAULT',
            scaling: 'object storage handles file load, app keeps product truth',
            ownership: 'storage owns bytes; app owns permissions, filenames, and references',
            takeaway: 'This is the durable backend pattern: separate binary delivery from business meaning.',
            tone: 'emerald',
        },
    },
    'course-video': {
        'app-disk': {
            verdict: 'BAD FIT',
            scaling: 'disk, deploy, and bandwidth pain arrive fast',
            ownership: 'app becomes an accidental media server',
            takeaway: 'Large media is exactly the workload object storage and CDN pipelines are built for. Keeping it on app disks ties scale to the wrong layer.',
            tone: 'amber',
        },
        'app-proxy': {
            verdict: 'TOO EXPENSIVE',
            scaling: 'application bandwidth and memory pressure stay in the hot path',
            ownership: 'business process pays for transport instead of policy only',
            takeaway: 'Even if it works technically, letting the app proxy every large video is usually an architectural tax, not a product advantage.',
            tone: 'amber',
        },
        'direct-object-storage': {
            verdict: 'STRONG DELIVERY',
            scaling: 'excellent for byte serving and CDN fanout',
            ownership: 'storage does the heavy lifting',
            takeaway: 'For large video, the backend should focus on entitlements and catalog metadata, not raw byte transport.',
            tone: 'violet',
        },
        'storage-plus-metadata': {
            verdict: 'BEST DEFAULT',
            scaling: 'storage scales bytes, app protects who can see what',
            ownership: 'app records ownership and access rules while storage serves efficiently',
            takeaway: 'This is the clean split: object storage serves the payload, the backend remains the authority for identity and viewing rights.',
            tone: 'emerald',
        },
    },
    'invoice-export': {
        'app-disk': {
            verdict: 'OPS BURDEN',
            scaling: 'cleanup, persistence, and failover all stay manual',
            ownership: 'app now owns retention and artifact durability',
            takeaway: 'Generated exports often outlive the request that created them, which makes local app storage a fragile place to keep them.',
            tone: 'amber',
        },
        'app-proxy': {
            verdict: 'USEFUL ONLY BRIEFLY',
            scaling: 'okay for immediate one-off downloads, weak for repeated access',
            ownership: 'app remains the transport bottleneck',
            takeaway: 'Short-term proxy download can work, but repeated artifact access usually wants a storage-backed handoff instead.',
            tone: 'violet',
        },
        'direct-object-storage': {
            verdict: 'GOOD STORAGE',
            scaling: 'durable and cheap for artifact retention',
            ownership: 'storage keeps bytes safely',
            takeaway: 'Exports benefit from durable object storage, especially when users may retrieve them later.',
            tone: 'violet',
        },
        'storage-plus-metadata': {
            verdict: 'BEST DEFAULT',
            scaling: 'durable storage plus explicit ownership and expiry records',
            ownership: 'backend tracks which artifact belongs to whom and when it should expire',
            takeaway: 'Artifacts are not just files. They are business records with owners, retention windows, and permissions.',
            tone: 'emerald',
        },
    },
    'private-attachment': {
        'app-disk': {
            verdict: 'RISKY',
            scaling: 'hard to secure consistently across hosts',
            ownership: 'app owns both bytes and access discipline',
            takeaway: 'Sensitive private files need stronger, more centralized policy and storage guarantees than scattered app disks usually provide.',
            tone: 'amber',
        },
        'app-proxy': {
            verdict: 'CAN WORK, COSTLY',
            scaling: 'backend stays in the hot path for every access',
            ownership: 'access control is clear, but transport cost stays high',
            takeaway: 'Proxying private reads can be justified in some systems, but it should be a conscious security trade, not the accidental default.',
            tone: 'violet',
        },
        'direct-object-storage': {
            verdict: 'INCOMPLETE',
            scaling: 'storage scales, but access policy can drift without app metadata',
            ownership: 'bytes are fine, business context may go missing',
            takeaway: 'Private files need more than a bucket. They need durable business records describing who owns them and who may fetch them.',
            tone: 'amber',
        },
        'storage-plus-metadata': {
            verdict: 'BEST DEFAULT',
            scaling: 'storage serves bytes while backend gates access and auditability',
            ownership: 'backend controls identity, metadata, and access; storage holds the binary payload',
            takeaway: 'For secure attachments, the cleanest backend design is clear separation: object storage for bytes, app logic for trust boundaries.',
            tone: 'emerald',
        },
    },
};

export const ObjectStorageLab = () => {
    const [fileType, setFileType] = useState<FileType>('course-video');
    const [model, setModel] = useState<DeliveryModel>('storage-plus-metadata');

    const result = useMemo(() => RESULT_MAP[fileType][model], [fileType, model]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={PackageOpen} title="Object Storage Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <PackageOpen className="text-cyan-400" />
                        Object Storage Boundary Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Pair different file types with storage models to see when the backend should carry bytes itself and when it should only own metadata, permissions, and links.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">File Type</p>
                        <div className="mt-4 space-y-3">
                            {FILE_TYPES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setFileType(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        fileType === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Storage Model</p>
                        <div className="mt-4 space-y-3">
                            {MODELS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setModel(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        model === option.id ? 'border-violet-400/40 bg-violet-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Verdict" value={result.verdict} tone={result.tone} />
                        <LabMetricCard label="Scaling Shape" value={result.scaling} tone="amber" />
                        <LabMetricCard label="Ownership Split" value={result.ownership} tone="cyan" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.06fr_0.94fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <HardDriveUpload size={14} />
                                <span>Boundary Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">real question</div>
                                    <div className="mt-2 text-sm font-semibold text-white">who should own the bytes?</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">backend responsibility</div>
                                    <div className="mt-2 text-sm font-semibold text-white">identity, metadata, access, lifecycle</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Bytes And Meaning Differ"
                                tone="sky"
                                body="A file's raw bytes and its business meaning are not the same concern. Object storage scales the bytes; the backend protects who the file belongs to and how it should be used."
                            />
                            <LabMiniCard
                                title="Proxy Only With Intent"
                                tone="violet"
                                body="Keeping the app in the middle of every upload or download can be right for some security paths, but it should be an explicit product decision, not a default architecture habit."
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabStoryCard
                            icon={ShieldCheck}
                            title="Healthy Split"
                            tone="emerald"
                            items={[
                                'Object storage should absorb the heavy binary workload and storage lifecycle.',
                                'The backend should stay authoritative for metadata, ownership, access policy, and signed-link issuance.',
                            ]}
                        />
                        <LabStoryCard
                            icon={TriangleAlert}
                            title="Common Trap"
                            tone="amber"
                            items={[
                                'Teams often let the app server become an accidental file server, then discover too late that deploys, failover, and bandwidth all got tangled with binary storage.',
                                'If the same process is trying to be API gateway, auth layer, and media CDN at once, the boundary is probably wrong.',
                            ]}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <LabMetricCard label="Storage Layer" value="durable bytes" tone="emerald" />
                        <LabMetricCard label="App Layer" value="policy and records" tone="violet" />
                        <LabMetricCard label="CDN Layer" value="cheap repeated reads" tone="cyan" />
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

import { useMemo, useState } from 'react';
import { FileUp, ShieldCheck, TriangleAlert, UploadCloud } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';
import { LabStoryCard } from './LabStoryCard';

type UploadCase = 'small-avatar' | 'large-video' | 'spoofed-image' | 'private-report';
type PipelineModel = 'app-buffer' | 'app-stream-relay' | 'presigned-direct-upload' | 'upload-then-metadata-confirm';

const UPLOAD_CASES: Array<{ id: UploadCase; label: string; note: string }> = [
    { id: 'small-avatar', label: 'Small avatar', note: 'Tiny file with simple image validation and a user profile record behind it.' },
    { id: 'large-video', label: 'Large video upload', note: 'Heavy payload that punishes naive buffering and long-lived app connections.' },
    { id: 'spoofed-image', label: 'Spoofed image upload', note: 'Looks like an image from the client side, but content trust is uncertain.' },
    { id: 'private-report', label: 'Private report export', note: 'Sensitive artifact that needs ownership, retention, and access controls after upload.' },
];

const PIPELINES: Array<{ id: PipelineModel; label: string; note: string }> = [
    { id: 'app-buffer', label: 'Buffer in app memory', note: 'Read the full upload into app memory before deciding what to do next.' },
    { id: 'app-stream-relay', label: 'Stream through app', note: 'App validates and relays chunks onward without holding the whole file at once.' },
    { id: 'presigned-direct-upload', label: 'Client uploads direct to storage', note: 'Backend authorizes the upload, then the client sends bytes to object storage.' },
    { id: 'upload-then-metadata-confirm', label: 'Direct upload plus metadata confirmation', note: 'Client uploads first, then backend records trusted metadata and ownership.' },
];

const RESULT_MAP: Record<UploadCase, Record<PipelineModel, {
    verdict: string;
    pressurePoint: string;
    backendRole: string;
    takeaway: string;
    tone: 'emerald' | 'amber' | 'violet';
}>> = {
    'small-avatar': {
        'app-buffer': {
            verdict: 'TOLERABLE AT SMALL SCALE',
            pressurePoint: 'memory cost is low, but pattern does not scale elegantly',
            backendRole: 'app receives bytes and performs validation itself',
            takeaway: 'For tiny files this can work, but the pattern teaches the backend to own bytes too eagerly even when storage-backed flows would age better.',
            tone: 'violet',
        },
        'app-stream-relay': {
            verdict: 'GOOD TRANSITION',
            pressurePoint: 'network still crosses app, but memory stays safer',
            backendRole: 'stream validator and transport relay',
            takeaway: 'Streaming is already safer than buffering because the app avoids turning one upload into a full in-memory object.',
            tone: 'emerald',
        },
        'presigned-direct-upload': {
            verdict: 'GOOD DELIVERY',
            pressurePoint: 'backend must still control who is allowed to upload',
            backendRole: 'authorization only',
            takeaway: 'Even small files benefit when the app authorizes the flow without becoming the byte-hauler.',
            tone: 'violet',
        },
        'upload-then-metadata-confirm': {
            verdict: 'BEST DEFAULT',
            pressurePoint: 'requires a second confirmation step',
            backendRole: 'authorize upload, then confirm ownership and metadata',
            takeaway: 'This pattern keeps the backend authoritative for product truth while letting storage handle the file transfer cleanly.',
            tone: 'emerald',
        },
    },
    'large-video': {
        'app-buffer': {
            verdict: 'BAD FIT',
            pressurePoint: 'memory spikes and timeout risk grow quickly',
            backendRole: 'accidental file transporter',
            takeaway: 'Large uploads punish any design that asks the app to hold the entire payload before progressing.',
            tone: 'amber',
        },
        'app-stream-relay': {
            verdict: 'BETTER, STILL HEAVY',
            pressurePoint: 'app stays on the hot path for long transfers',
            backendRole: 'stream gatekeeper and transport relay',
            takeaway: 'Streaming avoids the worst memory issue, but the app still pays connection, bandwidth, and operational cost for every large upload.',
            tone: 'violet',
        },
        'presigned-direct-upload': {
            verdict: 'STRONG FIT',
            pressurePoint: 'client needs a secure upload grant and resumable strategy',
            backendRole: 'permission broker',
            takeaway: 'For large video, direct upload is usually the right default because storage is built to absorb the binary weight.',
            tone: 'emerald',
        },
        'upload-then-metadata-confirm': {
            verdict: 'BEST DEFAULT',
            pressurePoint: 'requires the backend to validate the post-upload record before publishing',
            backendRole: 'upload grant, metadata registration, and publish control',
            takeaway: 'This gives you both scale and control: the client uploads directly, but the backend still decides when the file becomes part of real product state.',
            tone: 'emerald',
        },
    },
    'spoofed-image': {
        'app-buffer': {
            verdict: 'RISKY',
            pressurePoint: 'validation happens late and memory cost is unnecessary',
            backendRole: 'trust boundary and byte holder at once',
            takeaway: 'If the app buffers first and validates second, the suspicious payload has already consumed the expensive path.',
            tone: 'amber',
        },
        'app-stream-relay': {
            verdict: 'GOOD WHEN INSPECTION IS NEEDED',
            pressurePoint: 'backend must inspect early without keeping the whole file',
            backendRole: 'content verification in the stream path',
            takeaway: 'Streaming lets the backend enforce type and signature checks earlier, before blindly committing bytes anywhere permanent.',
            tone: 'emerald',
        },
        'presigned-direct-upload': {
            verdict: 'INCOMPLETE BY ITSELF',
            pressurePoint: 'bytes arrive in storage before trusted validation finishes',
            backendRole: 'authorization only, with weak content trust',
            takeaway: 'Direct upload is not enough on its own when content trust matters. You still need a validation or quarantine story after bytes arrive.',
            tone: 'amber',
        },
        'upload-then-metadata-confirm': {
            verdict: 'BEST DEFAULT',
            pressurePoint: 'requires validation before metadata is accepted as trusted',
            backendRole: 'authorize, inspect, then confirm record creation',
            takeaway: 'This pattern keeps storage scalable while preserving the backend’s right to say “uploaded is not the same as accepted.”',
            tone: 'emerald',
        },
    },
    'private-report': {
        'app-buffer': {
            verdict: 'OPS RISK',
            pressurePoint: 'app now owns sensitive bytes and retention behavior directly',
            backendRole: 'storage and policy collapsed together',
            takeaway: 'Sensitive files become harder to manage when the same service owns transport, storage, cleanup, and permission policy at once.',
            tone: 'amber',
        },
        'app-stream-relay': {
            verdict: 'WORKABLE, COSTLY',
            pressurePoint: 'backend stays in the hot path but can enforce strong checks',
            backendRole: 'policy guard and transport relay',
            takeaway: 'You may choose this for strict control, but it should be justified by the security model, not by convenience alone.',
            tone: 'violet',
        },
        'presigned-direct-upload': {
            verdict: 'GOOD TRANSPORT, WEAK RECORD STORY',
            pressurePoint: 'who owns the uploaded file is still ambiguous until metadata is recorded',
            backendRole: 'upload grant issuer',
            takeaway: 'The bytes can land safely, but the backend still needs a trustworthy follow-up step to attach ownership and lifecycle rules.',
            tone: 'violet',
        },
        'upload-then-metadata-confirm': {
            verdict: 'BEST DEFAULT',
            pressurePoint: 'more moving parts, but the boundary is clean',
            backendRole: 'authorize upload, validate post-upload state, store ownership and retention metadata',
            takeaway: 'For sensitive artifacts, the backend should stay authoritative for trust and records, while storage handles the byte logistics.',
            tone: 'emerald',
        },
    },
};

export const UploadPipelineLab = () => {
    const [uploadCase, setUploadCase] = useState<UploadCase>('large-video');
    const [pipeline, setPipeline] = useState<PipelineModel>('upload-then-metadata-confirm');

    const result = useMemo(() => RESULT_MAP[uploadCase][pipeline], [uploadCase, pipeline]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={UploadCloud} title="Upload Pipeline Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <UploadCloud className="text-cyan-400" />
                        Upload Pipeline Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Compare different upload cases with buffering, streaming, and direct-storage flows to see how a backend should validate, authorize, and finalize file ownership.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Upload Case</p>
                        <div className="mt-4 space-y-3">
                            {UPLOAD_CASES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setUploadCase(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        uploadCase === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Pipeline Model</p>
                        <div className="mt-4 space-y-3">
                            {PIPELINES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setPipeline(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        pipeline === option.id ? 'border-violet-400/40 bg-violet-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Pressure Point" value={result.pressurePoint} tone="amber" />
                        <LabMetricCard label="Backend Role" value={result.backendRole} tone="cyan" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.06fr_0.94fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <FileUp size={14} />
                                <span>Pipeline Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">real question</div>
                                    <div className="mt-2 text-sm font-semibold text-white">when is upload accepted?</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">backend duty</div>
                                    <div className="mt-2 text-sm font-semibold text-white">authorize, validate, confirm metadata</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Uploaded Is Not Accepted"
                                tone="sky"
                                body="A file reaching storage is only one milestone. The backend still needs to decide whether the upload is trusted, who owns it, and whether it should become part of product state."
                            />
                            <LabMiniCard
                                title="Bytes Should Avoid App Memory"
                                tone="violet"
                                body="Large uploads are where buffering hurts most. Good backend design minimizes time spent holding raw bytes in app RAM or app connections unless validation truly requires it."
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabStoryCard
                            icon={ShieldCheck}
                            title="Healthy Upload Flow"
                            tone="emerald"
                            items={[
                                'Backend decides who may upload and under what rules.',
                                'Storage handles the heavy byte transfer whenever possible.',
                                'Backend records trusted metadata only after validation or confirmation is complete.',
                            ]}
                        />
                        <LabStoryCard
                            icon={TriangleAlert}
                            title="Common Failure"
                            tone="amber"
                            items={[
                                'Teams treat “file arrived somewhere” as the same thing as “business upload succeeded,” which blurs trust boundaries.',
                                'The more the app buffers or proxies unnecessarily, the more upload throughput and failure recovery get tied to the wrong layer.',
                            ]}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <LabMetricCard label="Authorize" value="before bytes move" tone="violet" />
                        <LabMetricCard label="Validate" value="before metadata trust" tone="emerald" />
                        <LabMetricCard label="Finalize" value="ownership + lifecycle" tone="cyan" />
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, FileWarning, FormInput, RefreshCcw } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Scenario = 'clean' | 'missing-title' | 'duplicate-slug' | 'permission-denied' | 'save-failed';
type Draft = {
    title: string;
    slug: string;
    visibility: 'draft' | 'public';
};

const SCENARIOS: Array<{ id: Scenario; label: string; note: string }> = [
    { id: 'clean', label: 'Valid Submit', note: 'All required fields are present and the backend accepts the payload.' },
    { id: 'missing-title', label: 'Missing Title', note: 'Client-side required validation should stop the request before it leaves the browser.' },
    { id: 'duplicate-slug', label: 'Duplicate Slug', note: 'Backend rejects a value that only server truth can verify.' },
    { id: 'permission-denied', label: 'Permission Denied', note: 'Submission is structurally valid, but the user lacks permission to publish it.' },
    { id: 'save-failed', label: 'Transient Save Failure', note: 'The form is valid, but infrastructure fails and the user should be able to retry.' },
];

const scenarioDrafts: Record<Scenario, Draft> = {
    clean: { title: 'Release Notes Hub', slug: 'release-notes-hub', visibility: 'public' },
    'missing-title': { title: '', slug: 'release-notes-hub', visibility: 'draft' },
    'duplicate-slug': { title: 'Release Notes Hub', slug: 'backend-fundamentals', visibility: 'public' },
    'permission-denied': { title: 'Ops Status Board', slug: 'ops-status-board', visibility: 'public' },
    'save-failed': { title: 'Partner Import Queue', slug: 'partner-import-queue', visibility: 'draft' },
};

export const FormValidationLab = () => {
    const [scenario, setScenario] = useState<Scenario>('clean');

    const result = useMemo(() => {
        const draft = scenarioDrafts[scenario];

        switch (scenario) {
            case 'missing-title':
                return {
                    draft,
                    stage: 'CLIENT VALIDATION',
                    requestSent: 'NO',
                    fieldErrors: [{ field: 'title', message: 'title is required before publish' }],
                    globalError: 'none',
                    recovery: 'Keep all other inputs intact and focus the missing field immediately.',
                    takeaway: 'A missing required field should be caught locally near the input so recovery feels like editing, not waiting.',
                };
            case 'duplicate-slug':
                return {
                    draft,
                    stage: 'SERVER FIELD ERROR',
                    requestSent: 'YES',
                    fieldErrors: [{ field: 'slug', message: 'slug already exists in production' }],
                    globalError: 'none',
                    recovery: 'Map server feedback back onto the exact field the user can change.',
                    takeaway: 'Some truth only exists on the server. The UI still needs to route that truth back into field-level guidance.',
                };
            case 'permission-denied':
                return {
                    draft,
                    stage: 'AUTHORIZATION FAILURE',
                    requestSent: 'YES',
                    fieldErrors: [],
                    globalError: 'You do not have permission to publish this item.',
                    recovery: 'Preserve the form, explain the policy issue, and offer a lower-privilege path like save draft.',
                    takeaway: 'Permission failures are not field mistakes. They belong in global feedback because no single input can fix them.',
                };
            case 'save-failed':
                return {
                    draft,
                    stage: 'SYSTEM FAILURE',
                    requestSent: 'YES',
                    fieldErrors: [],
                    globalError: 'Save failed because the service timed out. Your draft is still in memory.',
                    recovery: 'Do not wipe the form. Keep the payload, show retry, and make the failure explainable.',
                    takeaway: 'When infrastructure fails, the best UX is preserving user effort and exposing a safe retry path.',
                };
            default:
                return {
                    draft,
                    stage: 'SUBMIT SUCCEEDED',
                    requestSent: 'YES',
                    fieldErrors: [],
                    globalError: 'none',
                    recovery: 'Clear stale errors and transition into success state or the next workflow step.',
                    takeaway: 'Successful validation should retire previous errors cleanly and confirm the action without ambiguity.',
                };
        }
    }, [scenario]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={FormInput} title="Form Validation Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <FormInput className="text-cyan-400" />
                        Form Validation Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between local validation, server validation, permission failure, and retryable system errors to see where form feedback should actually live.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Scenario</p>
                        <div className="mt-4 space-y-3">
                            {SCENARIOS.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setScenario(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        scenario === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-white">{option.label}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{option.note}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Draft Snapshot</p>
                        <div className="mt-4 space-y-3 text-xs text-gray-300">
                            <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">title</div>
                                <div className="mt-2 font-semibold text-white">{result.draft.title || '<empty>'}</div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">slug</div>
                                <div className="mt-2 font-semibold text-white">{result.draft.slug}</div>
                            </div>
                            <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">visibility</div>
                                <div className="mt-2 font-semibold text-white">{result.draft.visibility}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Validation Stage" value={result.stage} tone="cyan" />
                        <LabMetricCard label="Field Errors" value={result.fieldErrors.length ? `${result.fieldErrors.length}` : '0'} tone="amber" />
                        <LabMetricCard label="Request Sent" value={result.requestSent} tone="emerald" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <FormInput size={14} />
                                <span>Form Surface</span>
                            </div>
                            <div className="mt-4 space-y-4">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">title</span>
                                        {result.fieldErrors.some(error => error.field === 'title') && (
                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">field error</span>
                                        )}
                                    </div>
                                    <div className="mt-2 font-semibold text-white">{result.draft.title || '<empty>'}</div>
                                    {result.fieldErrors
                                        .filter(error => error.field === 'title')
                                        .map(error => (
                                            <p key={error.field} className="mt-2 text-[11px] font-semibold text-amber-200">
                                                {error.message}
                                            </p>
                                        ))}
                                </div>

                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">slug</span>
                                        {result.fieldErrors.some(error => error.field === 'slug') && (
                                            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300">field error</span>
                                        )}
                                    </div>
                                    <div className="mt-2 font-semibold text-white">{result.draft.slug}</div>
                                    {result.fieldErrors
                                        .filter(error => error.field === 'slug')
                                        .map(error => (
                                            <p key={error.field} className="mt-2 text-[11px] font-semibold text-amber-200">
                                                {error.message}
                                            </p>
                                        ))}
                                </div>

                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">global feedback zone</span>
                                    <p className="mt-2 text-sm leading-6 text-gray-200">
                                        {result.globalError === 'none'
                                            ? 'No page-level error is needed here; the main feedback belongs in field-level cues or a success state.'
                                            : result.globalError}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                                    {result.globalError === 'none' && result.fieldErrors.length === 0 ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                    <span>Recovery Signal</span>
                                </div>
                                <p className="mt-4 text-sm leading-7 text-gray-200">{result.recovery}</p>
                            </div>

                            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                                    <RefreshCcw size={14} />
                                    <span>Takeaway</span>
                                </div>
                                <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <LabMiniCard
                            title="Field-Level Rule"
                            tone="sky"
                            body="Use field errors when the user can fix one specific input directly. Required fields, invalid formats, and duplicate identifiers should point to the exact control."
                        />
                        <LabMiniCard
                            title="Global Rule"
                            tone="violet"
                            body="Use global errors when the problem belongs to the whole submission context: permission, session expiry, or infrastructure trouble outside any single field."
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <FileWarning size={14} />
                            <span>Recovery Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Client validation should block obviously invalid payloads before wasting a round trip.</li>
                            <li>Server validation must still guard canonical truth like uniqueness, ownership, and workflow state.</li>
                            <li>Permission and system failures should preserve input so recovery feels like fixing, not restarting.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

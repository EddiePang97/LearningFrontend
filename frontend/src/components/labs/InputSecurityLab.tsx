import { useMemo, useState } from 'react';
import { FileWarning, Filter, ShieldAlert, TextCursorInput } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type InputCase = 'oversized-text' | 'sql-like-string' | 'mime-spoof' | 'valid-payload';

const INPUT_CASES: Array<{ id: InputCase; label: string; note: string }> = [
    { id: 'oversized-text', label: 'Oversized text payload', note: 'Looks structurally valid, but length and cost boundaries are exceeded.' },
    { id: 'sql-like-string', label: 'Suspicious query string', note: 'Untrusted string tries to reach a downstream query path.' },
    { id: 'mime-spoof', label: 'Fake image upload', note: 'Filename says .png, but the actual file signature does not match.' },
    { id: 'valid-payload', label: 'Valid request', note: 'The payload fits type, boundary, and content expectations.' },
];

export const InputSecurityLab = () => {
    const [inputCase, setInputCase] = useState<InputCase>('valid-payload');

    const result = useMemo(() => {
        switch (inputCase) {
            case 'oversized-text':
                return {
                    verdict: 'REJECT EARLY',
                    primaryCheck: 'length / boundary validation',
                    userMessage: 'Body exceeds allowed size or field length budget.',
                    takeaway: 'Input security is not only about “malicious-looking strings.” Cost and size limits are a core defense against abuse and accidental overload.',
                };
            case 'sql-like-string':
                return {
                    verdict: 'TREAT AS UNTRUSTED INPUT',
                    primaryCheck: 'parameterized query + strict parsing',
                    userMessage: 'Payload contains unexpected characters and must never be interpolated directly downstream.',
                    takeaway: 'The goal is not to blacklist funny characters. The real defense is keeping untrusted input out of executable query structure.',
                };
            case 'mime-spoof':
                return {
                    verdict: 'BLOCK UPLOAD',
                    primaryCheck: 'content signature + MIME verification',
                    userMessage: 'Declared file type does not match actual content.',
                    takeaway: 'Filename and client-declared MIME are hints, not truth. Upload security depends on what the bytes really are.',
                };
            default:
                return {
                    verdict: 'ACCEPT',
                    primaryCheck: 'schema + boundary checks pass',
                    userMessage: 'Payload fits the expected shape and content rules.',
                    takeaway: 'Safe input handling should feel invisible on the happy path because validation rules are explicit, predictable, and cheap to enforce.',
                };
        }
    }, [inputCase]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={TextCursorInput} title="Input Security Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <TextCursorInput className="text-cyan-400" />
                        Input Security Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Compare different request payloads to see why backend input security must enforce type, boundary, and content rules before untrusted data reaches expensive or dangerous paths.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Payload Case</p>
                        <div className="mt-4 space-y-3">
                            {INPUT_CASES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setInputCase(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        inputCase === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Verdict" value={result.verdict} tone="amber" />
                        <LabMetricCard label="Primary Check" value={result.primaryCheck} tone="violet" />
                        <LabMetricCard label="Backend Message" value={result.userMessage} tone="emerald" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <Filter size={14} />
                                <span>Validation Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">trusted by default?</div>
                                    <div className="mt-2 text-sm font-semibold text-white">never</div>
                                </div>
                                <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                    <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">validate before</div>
                                    <div className="mt-2 text-sm font-semibold text-white">DB, parser, storage, queue</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Boundary Checks First"
                                tone="sky"
                                body="Types, lengths, enum ranges, and file size limits are the cheapest defenses. They stop waste and abuse before deeper logic runs."
                            />
                            <LabMiniCard
                                title="Content Checks Matter Too"
                                tone="violet"
                                body="Some inputs pass schema shape but still fail safety checks, such as spoofed uploads or strings that must never be embedded into executable query structure."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <ShieldAlert size={14} />
                            <span>Input Security Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Validate type and size before the payload reaches expensive or privileged downstream paths.</li>
                            <li>Use parameterization, parser isolation, and content verification instead of relying on string blacklists or client claims.</li>
                            <li>Backends should treat every user input, upload, and callback as untrusted until proven safe enough for its next boundary.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">
                            <FileWarning size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Input safety is how the backend stops user-controlled bytes from becoming system-controlled behavior. If validation happens too late, the expensive or dangerous path has already started.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

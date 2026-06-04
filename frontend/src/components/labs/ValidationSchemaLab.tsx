import { useMemo, useState } from 'react';
import { BadgeAlert, CheckCheck, FileJson2, ListChecks } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type ValidationCase = 'valid-course' | 'missing-title' | 'invalid-level' | 'negative-price';

const VALIDATION_CASES: Array<{ id: ValidationCase; label: string; note: string }> = [
    { id: 'valid-course', label: 'Valid course draft', note: 'All required fields are present and every value falls within the expected range.' },
    { id: 'missing-title', label: 'Missing title', note: 'Payload shape exists, but a required field is absent.' },
    { id: 'invalid-level', label: 'Invalid level enum', note: 'Field type is correct, but the value is outside the allowed domain set.' },
    { id: 'negative-price', label: 'Negative price', note: 'Number parses correctly, yet it violates business-safe boundary rules.' },
];

const RESULT_MAP: Record<ValidationCase, {
    verdict: string;
    schemaSignal: string;
    errorShape: string;
    takeaway: string;
    fieldDetail: string;
    tone: 'emerald' | 'amber' | 'violet';
}> = {
    'valid-course': {
        verdict: 'ACCEPT',
        schemaSignal: 'schema + bounds pass',
        errorShape: 'no error body needed',
        takeaway: 'A good validation layer should disappear on the happy path. It lets valid requests move on without forcing downstream code to second-guess field shape or range safety.',
        fieldDetail: 'title, level, and price all satisfy the contract',
        tone: 'emerald',
    },
    'missing-title': {
        verdict: 'REJECT',
        schemaSignal: 'required field missing',
        errorShape: 'details[{ field: "title", reason: "required" }]',
        takeaway: 'Required-field failures should be explicit and local. Clients need to know exactly which field is absent so the request can be repaired deterministically.',
        fieldDetail: 'title must exist before any create flow continues',
        tone: 'amber',
    },
    'invalid-level': {
        verdict: 'REJECT',
        schemaSignal: 'enum value outside allowlist',
        errorShape: 'details[{ field: "level", reason: "invalid_enum" }]',
        takeaway: 'Validation is more than type checking. A string can still be invalid if the backend only accepts a small, named set of domain values.',
        fieldDetail: 'level must be one of beginner, intermediate, advanced',
        tone: 'violet',
    },
    'negative-price': {
        verdict: 'REJECT',
        schemaSignal: 'numeric boundary violated',
        errorShape: 'details[{ field: "price", reason: "min_value" }]',
        takeaway: 'Even correctly parsed numbers can be dangerous or meaningless if boundary rules are skipped. Validation protects the system from bad state before persistence begins.',
        fieldDetail: 'price cannot be below zero for this resource contract',
        tone: 'amber',
    },
};

export const ValidationSchemaLab = () => {
    const [validationCase, setValidationCase] = useState<ValidationCase>('valid-course');
    const result = useMemo(() => RESULT_MAP[validationCase], [validationCase]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={ListChecks} title="Validation Schema Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <ListChecks className="text-cyan-400" />
                        Validation Schema Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between common request payload mistakes to see how a backend contract checks required fields, enum allowlists, and numeric bounds before the request reaches business logic.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Payload Case</p>
                        <div className="mt-4 space-y-3">
                            {VALIDATION_CASES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setValidationCase(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        validationCase === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Schema Signal" value={result.schemaSignal} tone="violet" />
                        <LabMetricCard label="Error Shape" value={result.errorShape} tone="cyan" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <FileJson2 size={14} />
                                <span>Validation Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">field-level contract</div>
                                <div className="mt-2 text-sm font-semibold text-white">{result.fieldDetail}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Validate Before Persistence"
                                tone="sky"
                                body="Schema checks should run before writes, queues, or domain services so downstream code can trust basic shape and boundary assumptions."
                            />
                            <LabMiniCard
                                title="Errors Should Be Repairable"
                                tone="violet"
                                body="Field-level details turn validation failures into actionable feedback. The client should know what to fix without reverse-engineering a vague message string."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <BadgeAlert size={14} />
                            <span>Validation Contract Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Check required fields and type shape before any route handler assumes business meaning.</li>
                            <li>Use allowlists and numeric boundaries, not just “it parses,” when a field has a narrower domain contract.</li>
                            <li>Return consistent field-level error details so clients can repair bad input without guessing.</li>
                        </ul>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabMiniCard
                            title="Happy Path Should Stay Quiet"
                            tone="emerald"
                            body="When validation succeeds, it should simply unlock the rest of the request flow. Strong contracts reduce defensive duplication deeper in the stack."
                        />
                        <LabMiniCard
                            title="Different From Security Filtering"
                            tone="amber"
                            body="This layer is about request correctness and predictable API contracts. Security checks may add more defenses later, but schema validation is the first contract gate."
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            {validationCase === 'valid-course' ? <CheckCheck size={14} /> : <BadgeAlert size={14} />}
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Input validation is how the backend turns “user sent some JSON” into “the system can safely reason about this request.” Without that contract gate, every later layer has to keep doubting the payload.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

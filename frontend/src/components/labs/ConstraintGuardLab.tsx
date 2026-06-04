import { useMemo, useState } from 'react';
import { BadgeAlert, KeyRound, Link2, ShieldCheck } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type ConstraintCase = 'primary-key' | 'foreign-key' | 'unique' | 'not-null';

const CONSTRAINT_CASES: Array<{ id: ConstraintCase; label: string; note: string }> = [
    { id: 'primary-key', label: 'Duplicate row identity', note: 'Two records try to claim the same row identifier.' },
    { id: 'foreign-key', label: 'Broken reference', note: 'A child row points to a parent record that does not exist.' },
    { id: 'unique', label: 'Duplicate business slug', note: 'A value that should be unique across the table is submitted twice.' },
    { id: 'not-null', label: 'Missing required field', note: 'A core column is left empty even though the table contract requires it.' },
];

const RESULT_MAP: Record<ConstraintCase, {
    guardType: string;
    protects: string;
    backendResult: string;
    takeaway: string;
    contractLine: string;
    tone: 'emerald' | 'violet' | 'amber';
}> = {
    'primary-key': {
        guardType: 'PRIMARY KEY',
        protects: 'row identity stays unique',
        backendResult: 'reject duplicate id insert',
        takeaway: 'A primary key is the table’s identity anchor. Without it, the database cannot reliably say which row is which.',
        contractLine: 'one row, one stable identity',
        tone: 'emerald',
    },
    'foreign-key': {
        guardType: 'FOREIGN KEY',
        protects: 'reference points to real parent data',
        backendResult: 'block orphan child row',
        takeaway: 'Foreign keys stop the app from creating references to missing parents, which is how many invisible integrity bugs begin.',
        contractLine: 'child rows should not float without parents',
        tone: 'violet',
    },
    'unique': {
        guardType: 'UNIQUE',
        protects: 'business value is not duplicated',
        backendResult: 'reject conflicting slug or email',
        takeaway: 'Some values are not row identity, but still must stay globally distinct for the business to behave correctly.',
        contractLine: 'business uniqueness belongs in the database too',
        tone: 'amber',
    },
    'not-null': {
        guardType: 'NOT NULL',
        protects: 'required column cannot disappear',
        backendResult: 'reject incomplete write',
        takeaway: 'If a field is essential to meaning, the database should refuse to store a row that pretends the field is optional.',
        contractLine: 'missing core data should fail early',
        tone: 'amber',
    },
};

export const ConstraintGuardLab = () => {
    const [constraintCase, setConstraintCase] = useState<ConstraintCase>('primary-key');
    const result = useMemo(() => RESULT_MAP[constraintCase], [constraintCase]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={ShieldCheck} title="Constraint Guard Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <ShieldCheck className="text-cyan-400" />
                        Constraint Guard Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between common database mistakes to see which constraint stops them and what kind of integrity boundary it is actually protecting.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Constraint Case</p>
                        <div className="mt-4 space-y-3">
                            {CONSTRAINT_CASES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setConstraintCase(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        constraintCase === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Guard Type" value={result.guardType} tone="emerald" />
                        <LabMetricCard label="Protects" value={result.protects} tone="violet" />
                        <LabMetricCard label="Backend Result" value={result.backendResult} tone={result.tone} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                {constraintCase === 'primary-key' ? <KeyRound size={14} /> : constraintCase === 'foreign-key' ? <Link2 size={14} /> : <BadgeAlert size={14} />}
                                <span>Constraint Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">contract line</div>
                                <div className="mt-2 text-sm font-semibold text-white">{result.contractLine}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Database Guards Real Business State"
                                tone="sky"
                                body="Constraints are not just SQL ceremony. They stop entire classes of invalid rows from entering the system in the first place."
                            />
                            <LabMiniCard
                                title="App Validation Is Not Enough"
                                tone="violet"
                                body="Even if the backend validates requests, race conditions and alternate write paths still exist. Database constraints provide the final line of truth."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <ShieldCheck size={14} />
                            <span>Constraint Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Use primary keys for stable row identity instead of relying on “probably unique” application logic.</li>
                            <li>Use foreign keys when child data should never exist without a valid parent relationship.</li>
                            <li>Use unique and not-null constraints to push important business guarantees into the storage layer itself.</li>
                        </ul>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabMiniCard
                            title="Constraints Reduce Debugging Debt"
                            tone="emerald"
                            body="When the database refuses impossible state early, fewer mysterious bugs leak upward into APIs, support workflows, and reporting jobs."
                        />
                        <LabMiniCard
                            title="Constraints Complement Transactions"
                            tone="amber"
                            body="Transactions keep multi-step writes atomic, while constraints keep each row and relationship valid. You need both for reliable data systems."
                        />
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

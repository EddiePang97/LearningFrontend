import { useMemo, useState } from 'react';
import { Boxes, Database, GitBranch, TableProperties } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type ModelingCase = 'courses' | 'marketplace' | 'progress' | 'support';

const MODELING_CASES: Array<{ id: ModelingCase; label: string; note: string }> = [
    { id: 'courses', label: 'Course catalog', note: 'Separate reusable course identity from lesson rows and publishing metadata.' },
    { id: 'marketplace', label: 'Marketplace checkout', note: 'Orders, order items, and payment attempts should not collapse into one giant table.' },
    { id: 'progress', label: 'Learning progress', note: 'Users, enrollments, and lesson checkpoints evolve at different speeds and deserve different boundaries.' },
    { id: 'support', label: 'Support tickets', note: 'Ticket state, messages, and assignee changes have different cardinality and change patterns.' },
];

const RESULT_MAP: Record<ModelingCase, {
    tableSplit: string;
    relationShape: string;
    antiPattern: string;
    takeaway: string;
    boundaryNotes: string[];
}> = {
    courses: {
        tableSplit: 'courses + lessons + course_publish_state',
        relationShape: '1 course -> many lessons',
        antiPattern: 'one wide table with repeated lesson columns',
        takeaway: 'When child rows repeat, they usually want their own table. A course is not the same entity as each lesson inside it.',
        boundaryNotes: ['course identity changes slowly', 'lesson rows scale separately', 'publish state may evolve independently'],
    },
    marketplace: {
        tableSplit: 'orders + order_items + payment_attempts',
        relationShape: '1 order -> many items and payment attempts',
        antiPattern: 'single order row with embedded product and payment columns',
        takeaway: 'Checkout flows create related but distinct records. Keeping order summary, line items, and payment history separate makes corrections and audits much safer.',
        boundaryNotes: ['order summary is one business object', 'line items vary per purchase', 'payments may retry multiple times'],
    },
    progress: {
        tableSplit: 'users + enrollments + progress_checkpoints',
        relationShape: '1 enrollment -> many checkpoints',
        antiPattern: 'put every lesson completion flag directly on user row',
        takeaway: 'Progress data grows with activity, not with the user identity row. That is a strong signal that it should live in related tables instead of expanding the user table forever.',
        boundaryNotes: ['user identity is stable', 'enrollment links user to course', 'checkpoint data grows over time'],
    },
    support: {
        tableSplit: 'tickets + ticket_messages + ticket_assignments',
        relationShape: '1 ticket -> many messages and handoffs',
        antiPattern: 'store latest message and assignee history in a single mutable blob',
        takeaway: 'If a concept has its own timeline, it often deserves its own table. Message history and assignment history are not just columns on the ticket root row.',
        boundaryNotes: ['ticket root tracks current state', 'messages form append-only history', 'assignment changes need their own audit trail'],
    },
};

export const DataSchemaLab = () => {
    const [modelingCase, setModelingCase] = useState<ModelingCase>('courses');
    const result = useMemo(() => RESULT_MAP[modelingCase], [modelingCase]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Database} title="Data Schema Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Database className="text-cyan-400" />
                        Data Schema Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between backend domains to see how table boundaries become clearer when you model entities and relationships before thinking about individual columns.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Business Slice</p>
                        <div className="mt-4 space-y-3">
                            {MODELING_CASES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setModelingCase(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        modelingCase === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Table Split" value={result.tableSplit} tone="emerald" />
                        <LabMetricCard label="Relation Shape" value={result.relationShape} tone="violet" />
                        <LabMetricCard label="Avoid" value={result.antiPattern} tone="amber" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <GitBranch size={14} />
                                <span>Schema Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">boundary notes</div>
                                <ul className="mt-2 space-y-2 text-sm font-semibold text-white">
                                    {result.boundaryNotes.map(item => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Rows Grow At Different Speeds"
                                tone="sky"
                                body="A useful split often appears when one concept changes rarely while another grows or mutates constantly. Those are usually different tables."
                            />
                            <LabMiniCard
                                title="Relationships Come Before Columns"
                                tone="violet"
                                body="Primary keys, foreign keys, and constraints make more sense once you know which entities are distinct and how many of each can relate."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <TableProperties size={14} />
                            <span>Modeling Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Identify the core entities first, then map one-to-one, one-to-many, or many-to-many relationships between them.</li>
                            <li>Split tables when two concepts change at different frequencies, cardinalities, or ownership boundaries.</li>
                            <li>Avoid stuffing repeated child data into one wide root row just because it feels faster at first.</li>
                        </ul>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabMiniCard
                            title="Good Modeling Helps Queries"
                            tone="emerald"
                            body="Once table boundaries are clean, joins, indexes, and constraints become much easier to reason about. Performance work starts with shape, not magic SQL."
                        />
                        <LabMiniCard
                            title="Good Modeling Helps Permissions"
                            tone="amber"
                            body="Entity boundaries also help backend permission rules. It is much easier to express who may update a lesson versus who may publish a course when those are distinct records."
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <Boxes size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Data modeling is where backend teams decide whether the database will clarify the business or blur it. If entities and relationships are clean, later work on constraints, indexes, and transactions becomes much more predictable.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

import { useMemo, useState } from 'react';
import { Blocks, FolderTree, Route, Shapes } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type DomainCase = 'courses' | 'tasks' | 'orders' | 'progress';

const DOMAIN_CASES: Array<{ id: DomainCase; label: string; note: string }> = [
    { id: 'courses', label: 'Course platform', note: 'Core objects include courses, lessons, and instructor-managed edits.' },
    { id: 'tasks', label: 'Task tracker', note: 'Focus on tasks, lists, and completion state rather than action-named endpoints.' },
    { id: 'orders', label: 'Simple commerce', note: 'Orders, items, and payment status should read like business objects, not controller verbs.' },
    { id: 'progress', label: 'Learning progress', note: 'Users, enrollments, and progress checkpoints reveal resource relationships clearly.' },
];

const RESULT_MAP: Record<DomainCase, {
    coreResource: string;
    pathShape: string;
    antiPattern: string;
    takeaway: string;
    resourceMap: string[];
}> = {
    courses: {
        coreResource: 'courses',
        pathShape: 'GET /courses, GET /courses/:id, PATCH /courses/:id',
        antiPattern: '/getCourseList, /editCourseInfo',
        takeaway: 'When the resource is “course,” the path should talk about courses. Methods already describe whether you are reading, creating, or editing.',
        resourceMap: ['courses -> lessons', 'courses -> instructors', 'courses -> publish status'],
    },
    tasks: {
        coreResource: 'tasks',
        pathShape: 'GET /tasks, POST /tasks, PATCH /tasks/:id',
        antiPattern: '/createTask, /markTaskDone',
        takeaway: 'Verb-heavy endpoints hide the shared object model. Resource paths stay easier to extend when new actions arrive later.',
        resourceMap: ['lists -> tasks', 'tasks -> assignee', 'tasks -> completion state'],
    },
    orders: {
        coreResource: 'orders',
        pathShape: 'GET /orders/:id, POST /orders, PATCH /orders/:id/status',
        antiPattern: '/submitOrderNow, /updatePaymentForOrder',
        takeaway: 'Even workflows with many state changes still benefit from clear resource nouns. The noun grounds every later status and validation decision.',
        resourceMap: ['orders -> line items', 'orders -> payment status', 'orders -> fulfillment state'],
    },
    progress: {
        coreResource: 'progress',
        pathShape: 'GET /users/:id/progress, PATCH /progress/:id',
        antiPattern: '/saveLessonDone, /fetchUserLearningInfo',
        takeaway: 'Nested relationships are fine when they express ownership clearly. The trick is to expose stable nouns instead of UI button language.',
        resourceMap: ['users -> enrollments', 'enrollments -> progress', 'progress -> lesson checkpoints'],
    },
};

export const ResourceModelLab = () => {
    const [domainCase, setDomainCase] = useState<DomainCase>('courses');
    const result = useMemo(() => RESULT_MAP[domainCase], [domainCase]);

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={Shapes} title="Resource Model Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <Shapes className="text-cyan-400" />
                        Resource Model Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between product domains to see how backend API paths become clearer when you name stable resources first and let HTTP methods describe the action.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-500">Domain</p>
                        <div className="mt-4 space-y-3">
                            {DOMAIN_CASES.map(option => (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => setDomainCase(option.id)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        domainCase === option.id ? 'border-cyan-400/40 bg-cyan-500/10' : 'border-white/8 bg-black/20'
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
                        <LabMetricCard label="Core Resource" value={result.coreResource} tone="emerald" />
                        <LabMetricCard label="REST Shape" value={result.pathShape} tone="violet" />
                        <LabMetricCard label="Avoid" value={result.antiPattern} tone="amber" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                                <Route size={14} />
                                <span>Modeling Readout</span>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>

                            <div className="mt-5 rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">resource relationships</div>
                                <ul className="mt-2 space-y-2 text-sm font-semibold text-white">
                                    {result.resourceMap.map(item => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LabMiniCard
                                title="Methods Carry The Verb"
                                tone="sky"
                                body="You usually do not need verbs inside the path. GET, POST, PATCH, and DELETE already explain the operation once the resource noun is stable."
                            />
                            <LabMiniCard
                                title="Resource Shape Scales Better"
                                tone="violet"
                                body="When the noun model is clean, validation rules, status codes, and error payloads become easier to keep consistent across the whole API surface."
                            />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <FolderTree size={14} />
                            <span>Resource Modeling Checklist</span>
                        </div>
                        <ul className="mt-4 space-y-3 text-xs leading-6 text-gray-300">
                            <li>Name the core business objects before you name endpoints or controller functions.</li>
                            <li>Use nested paths only when the ownership relationship is genuinely useful and stable.</li>
                            <li>Prefer resource nouns over UI verbs so the API can evolve without path sprawl.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-emerald-300">
                            <Blocks size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Resource modeling is the layer that makes the rest of a REST API teachable. Once the nouns are clear, methods, status codes, validation, and error contracts all have a stable shape to attach to.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};

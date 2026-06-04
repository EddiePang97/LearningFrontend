import { useMemo, useState } from 'react';
import { BadgeCheck, Ban, CircleHelp, FileJson, SearchX, ShieldAlert } from 'lucide-react';
import { LabFrame } from './LabFrame';
import { LabMetricCard } from './LabMetricCard';
import { LabMiniCard } from './LabMiniCard';

type Scenario = 'list-success' | 'create-success' | 'delete-success' | 'bad-input' | 'missing-resource' | 'duplicate-slug';

const SCENARIOS: Array<{ id: Scenario; label: string; note: string }> = [
    { id: 'list-success', label: 'Fetch course list', note: 'Client reads an existing collection successfully.' },
    { id: 'create-success', label: 'Create new course', note: 'Server accepts a valid payload and creates a fresh resource.' },
    { id: 'delete-success', label: 'Archive course', note: 'Operation succeeds but the client does not need a response body.' },
    { id: 'bad-input', label: 'Malformed input', note: 'Payload shape or required fields are invalid before business logic proceeds.' },
    { id: 'missing-resource', label: 'Course not found', note: 'Client asks for a resource ID that is not present.' },
    { id: 'duplicate-slug', label: 'Slug already exists', note: 'Request is valid, but current system state makes it conflict.' },
];

const RESULT_MAP: Record<Scenario, {
    status: string;
    bodyShape: string;
    clientMeaning: string;
    takeaway: string;
    tone: 'emerald' | 'violet' | 'amber';
}> = {
    'list-success': {
        status: '200 OK',
        bodyShape: 'JSON body with data payload',
        clientMeaning: 'Request worked and here is the result you asked for.',
        takeaway: '200 is the ordinary success signal when the response body contains useful data the client needs to render or continue.',
        tone: 'emerald',
    },
    'create-success': {
        status: '201 Created',
        bodyShape: 'new resource or location metadata',
        clientMeaning: 'Server created something new, not just returned an existing value.',
        takeaway: '201 communicates more than “success.” It tells the client that a new resource now exists because of this request.',
        tone: 'violet',
    },
    'delete-success': {
        status: '204 No Content',
        bodyShape: 'empty body',
        clientMeaning: 'Operation succeeded and there is nothing else to parse.',
        takeaway: '204 is useful when the action worked but an empty body is cleaner than inventing a dummy JSON payload.',
        tone: 'violet',
    },
    'bad-input': {
        status: '400 Bad Request',
        bodyShape: 'error object explaining validation or parse failure',
        clientMeaning: 'The request itself is malformed or unacceptable before domain state is even considered.',
        takeaway: '400 is about the request being wrong in shape or content, not about the server failing internally.',
        tone: 'amber',
    },
    'missing-resource': {
        status: '404 Not Found',
        bodyShape: 'error object naming missing resource',
        clientMeaning: 'The path and method are fine, but the target resource does not exist here.',
        takeaway: '404 is distinct from 400. The client sent a syntactically valid request, but the thing it wanted is absent.',
        tone: 'amber',
    },
    'duplicate-slug': {
        status: '409 Conflict',
        bodyShape: 'error object describing state collision',
        clientMeaning: 'Request is valid on its face, but current backend state prevents it from succeeding cleanly.',
        takeaway: '409 is the right signal when the issue is not malformed input but a clash with existing system state.',
        tone: 'amber',
    },
};

const ICON_MAP = {
    'list-success': FileJson,
    'create-success': BadgeCheck,
    'delete-success': Ban,
    'bad-input': ShieldAlert,
    'missing-resource': SearchX,
    'duplicate-slug': CircleHelp,
} satisfies Record<Scenario, typeof FileJson>;

export const StatusCodeLab = () => {
    const [scenario, setScenario] = useState<Scenario>('list-success');
    const result = useMemo(() => RESULT_MAP[scenario], [scenario]);
    const ScenarioIcon = ICON_MAP[scenario];

    return (
        <LabFrame className="relative min-h-[480px] w-full md:min-h-[640px]" icon={BadgeCheck} title="Status Code Lab">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                        <BadgeCheck className="text-cyan-400" />
                        HTTP Status Code Lab
                    </h3>
                    <p className="mt-2 text-xs text-gray-500">
                        Switch between common API outcomes to see why different status codes communicate different contracts, even before a client reads the JSON body.
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
                </div>

                <div className="space-y-4 lg:col-span-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <LabMetricCard label="Status" value={result.status} tone={result.tone} />
                        <LabMetricCard label="Body Shape" value={result.bodyShape} tone="violet" />
                        <LabMetricCard label="Client Meaning" value={result.clientMeaning} tone="cyan" />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                            <ScenarioIcon size={14} />
                            <span>Status Readout</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">{result.takeaway}</p>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <LabMiniCard
                            title="Status Before JSON"
                            tone="sky"
                            body="Clients often branch on the status code first. A useful API lets callers distinguish success, malformed input, missing resources, and state conflicts without reading a vague message string."
                        />
                        <LabMiniCard
                            title="Different Success Codes Matter"
                            tone="violet"
                            body="200, 201, and 204 are all successful outcomes, but they tell different stories about whether data is being returned, a resource was created, or the response body should be empty."
                        />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">
                            <ShieldAlert size={14} />
                            <span>Why This Matters</span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-gray-200">
                            Status codes are the first machine-readable contract the backend gives every caller. If they are muddy, every client has to guess whether the problem was the request, the resource, the current state, or the server itself.
                        </p>
                    </div>
                </div>
            </div>
        </LabFrame>
    );
};
